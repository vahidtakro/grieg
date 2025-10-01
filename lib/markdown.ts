import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const CONTENT_DIR = path.join(process.cwd(), "content");

export type MarkdownFrontMatter = {
  title?: string;
  date?: string;
  excerpt?: string;
  coverImage?: string;
  [key: string]: unknown;
};

export type MarkdownDocument = {
  slug: string;
  content: string;
  html: string;
  data: MarkdownFrontMatter;
};

export function getContentPath(...segments: string[]): string {
  return path.join(CONTENT_DIR, ...segments);
}

export function getSlugsIn(dirRelativeToContent: string): string[] {
  const targetDir = getContentPath(dirRelativeToContent);
  if (!fs.existsSync(targetDir)) return [];
  return fs
    .readdirSync(targetDir)
    .filter((file) => file.endsWith(".md"))
    .map((file) => file.replace(/\.md$/, ""));
}

export async function parseMarkdownFile(filePath: string): Promise<MarkdownDocument> {
  const raw = fs.readFileSync(filePath, "utf8");
  const { content, data } = matter(raw);

  // Preprocess custom shortcodes (e.g., Spotify embeds)
  const replaced = transformCustomEmbeds(content);

  const processed = await remark().use(html, { sanitize: false }).process(replaced);
  let renderedHtml = processed.toString();
  // Enhance images: center, constrain width, and convert following emphasized paragraph to caption
  const figureStyle = 'margin:1.25rem auto;text-align:center;';
  const imgStyle = 'max-width:50%;height:auto;display:block;margin:0 auto;border-radius:0;box-shadow:0 6px 24px rgba(0,0,0,0.08)';
  const capStyle = 'display:block;margin-top:0.5rem;font-size:0.85rem;';
  // With caption: <p><img ...></p><p><em>caption</em></p>
  renderedHtml = renderedHtml.replace(new RegExp('<p>\\s*<img([^>]+)>\\s*<\\/p>\\s*<p><em>(.*?)<\\/em><\\/p>', 'g'), (_m, attrs, cap) => {
    return `<figure style="${figureStyle}"><img ${String(attrs).trim()} style="${imgStyle}" /><figcaption style="${capStyle}">${cap}</figcaption></figure>`;
  });
  // With caption in same paragraph: <p><img ...><em>caption</em></p>
  renderedHtml = renderedHtml.replace(new RegExp('<p>\\s*<img([^>]+)>\\s*<em>(.*?)<\\/em>\\s*<\\/p>', 'g'), (_m, attrs, cap) => {
    return `<figure style="${figureStyle}"><img ${String(attrs).trim()} style="${imgStyle}" /><figcaption style="${capStyle}">${cap}</figcaption></figure>`;
  });
  // With caption in same paragraph, self-closing: <p><img .../><em>caption</em></p>
  renderedHtml = renderedHtml.replace(new RegExp('<p>\\s*<img([^>]+)\\/>\\s*<em>(.*?)<\\/em>\\s*<\\/p>', 'g'), (_m, attrs, cap) => {
    return `<figure style="${figureStyle}"><img ${String(attrs).trim()} style="${imgStyle}" /><figcaption style="${capStyle}">${cap}</figcaption></figure>`;
  });
  // With caption: <img ... /> <p><em>caption</em></p>
  renderedHtml = renderedHtml.replace(new RegExp('<img([^>]+)\\/>\\s*<p><em>(.*?)<\\/em><\\/p>', 'g'), (_m, attrs, cap) => {
    return `<figure style="${figureStyle}"><img ${String(attrs).trim()} style="${imgStyle}" /><figcaption style="${capStyle}">${cap}</figcaption></figure>`;
  });
  // Standalone image
  renderedHtml = renderedHtml.replace(new RegExp('<p>\\s*<img([^>]+)>\\s*<\\/p>', 'g'), (_m, attrs) => {
    return `<figure style="${figureStyle}"><img ${String(attrs).trim()} style="${imgStyle}" /></figure>`;
  });
  // Standalone self-closing image
  renderedHtml = renderedHtml.replace(new RegExp('<img([^>]+)\\/>', 'g'), (_m, attrs) => {
    return `<figure style="${figureStyle}"><img ${String(attrs).trim()} style="${imgStyle}" /></figure>`;
  });
  const slug = path.basename(filePath).replace(/\.md$/, "");
  return { slug, content, html: renderedHtml, data: (data || {}) as MarkdownFrontMatter };
}

function transformCustomEmbeds(src: string): string {
  let out = src;
  // Syntax 1: {{spotify:https://open.spotify.com/{type}/{id}}}
  out = out.replace(
    /\{\{\s*spotify\s*:\s*(https?:\/\/open\.spotify\.com\/(track|album|playlist)\/([A-Za-z0-9]+)(?:\?[^}]*)?)\s*\}\}/g,
    (_m, fullUrl: string, type: string, id: string) => {
      const embedUrl = `https://open.spotify.com/embed/${type}/${id}?utm_source=generator`;
      return `\n<figure style="margin:1.25rem auto;text-align:center"><iframe style="border-radius:12px;max-width:560px;width:100%;height:152px" src="${embedUrl}" frameBorder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe></figure>\n`;
    }
  );
  // Syntax 2: {{spotify:album:ID}} or track/playlist
  out = out.replace(
    /\{\{\s*spotify\s*:\s*(album|track|playlist)\s*:\s*([A-Za-z0-9]+)\s*\}\}/g,
    (_m, type: string, id: string) => {
      const embedUrl = `https://open.spotify.com/embed/${type}/${id}?utm_source=generator`;
      return `\n<figure style="margin:1.25rem auto;text-align:center"><iframe style="border-radius:12px;max-width:560px;width:100%;height:152px" src="${embedUrl}" frameBorder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe></figure>\n`;
    }
  );
  return out;
}

export async function getMarkdownBySlug(dirRelativeToContent: string, slug: string): Promise<MarkdownDocument | null> {
  const mdPath = getContentPath(dirRelativeToContent, `${slug}.md`);
  if (!fs.existsSync(mdPath)) return null;
  return await parseMarkdownFile(mdPath);
}

export async function getAllMarkdown(dirRelativeToContent: string): Promise<MarkdownDocument[]> {
  const slugs = getSlugsIn(dirRelativeToContent);
  const docs = await Promise.all(
    slugs.map((slug) => parseMarkdownFile(getContentPath(dirRelativeToContent, `${slug}.md`)))
  );
  return docs.sort((a, b) => {
    const ad = a.data?.date ? new Date(a.data.date).getTime() : 0;
    const bd = b.data?.date ? new Date(b.data.date).getTime() : 0;
    return bd - ad;
  });
}
