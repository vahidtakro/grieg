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
  const processed = await remark().use(html, { sanitize: false }).process(content);
  const renderedHtml = processed.toString();
  const slug = path.basename(filePath).replace(/\.md$/, "");
  return { slug, content, html: renderedHtml, data: (data || {}) as MarkdownFrontMatter };
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
