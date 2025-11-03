import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { siteConfig } from "@/src/config/site";

type IMSLPWork = {
  title: string;
  url: string;
};

async function fetchIMSLPWorks(): Promise<IMSLPWork[]> {
  const url = "https://imslp.org/wiki/Category:Grieg,_Edvard";
  try {
    const res = await fetch(url, { next: { revalidate: 60 * 60 } });
    if (!res.ok) return [];
    const html = await res.text();
    const works: IMSLPWork[] = [];
    const linkRe = /<a\s+href=\"(\/wiki\/[^\"]+?)\"[^>]*?>([^<]{2,200})<\/a>/g;
    let m: RegExpExecArray | null;
    while ((m = linkRe.exec(html))) {
      const href = m[1];
      const text = m[2].trim();
      if (/\(Grieg,\s*Edvard\)/.test(text) || /\(Grieg%2C_Edvard\)/.test(href)) {
        // Skip non-work links like navigation
      }
      // Filter to likely work pages: contain parentheses and not external navigation
      if (/\(Grieg/.test(text) || /_%28Grieg%2C_Edvard%29/.test(href)) {
        works.push({ title: text.replace(/\s*\(Grieg.*?\)$/, "").trim(), url: `https://imslp.org${href}` });
      }
    }
    // Dedupe by URL
    const seen = new Set<string>();
    const unique = works.filter((w) => (seen.has(w.url) ? false : (seen.add(w.url), true)));
    // Sort alphabetically by title
    unique.sort((a, b) => a.title.localeCompare(b.title));
    return unique.slice(0, 300);
  } catch {
    return [];
  }
}

export default async function ScoresPage() {
  const t = await getTranslations();
  const works = await fetchIMSLPWorks();
  return (
    <section className="py-2 md:py-20">
      <h1 className="hero-title text-3xl md:text-5xl font-semibold tracking-tight">{t("scores.title")}</h1>
      <p className="mt-6 max-w-2xl text-[1.0625rem] md:text-base leading-[1.7] text-foreground/85">{t("scores.intro")}</p>
      {works.length === 0 ? (
        <div className="mt-6 text-sm text-foreground/60">No works found right now.</div>
      ) : (
        <ul className="mt-6 grid gap-3 text-[1.0625rem] md:text-base leading-[1.7]">
          {works.map((w) => (
            <li key={w.url} className="border-b border-foreground/10 pb-3">
              <div className="flex items-baseline justify-between gap-3">
                <a href={w.url} target="_blank" rel="noopener noreferrer" className="hover:underline underline-offset-4 font-medium">
                  {w.title}
                </a>
                <a href={w.url} target="_blank" rel="noopener noreferrer" className="text-xs text-foreground/70 hover:underline">{t("scores.view")}</a>
              </div>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-6 text-xs text-foreground/60">Source: IMSLP &mdash; Petrucci Music Library</div>
    </section>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();
  const locale = await getLocale();
  const title = t("scores.title");
  const description = t("scores.intro");
  const ogImage = "/grieg/grieg-og-image.png";
  return {
    title,
    description,
    openGraph: {
      type: "website",
      title,
      description,
      siteName: t("site.title"),
      locale,
      url: `/${locale}/scores`,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    alternates: {
      canonical: `${siteConfig.baseUrl}/${locale}/scores`,
      languages: { en: `${siteConfig.baseUrl}/en/scores`, fa: `${siteConfig.baseUrl}/fa/scores`, no: `${siteConfig.baseUrl}/no/scores` },
    },
  };
}


