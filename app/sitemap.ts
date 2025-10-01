import type { MetadataRoute } from "next";
import { locales } from "@/src/i18n/config";
import { getAllMarkdown } from "@/lib/markdown";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://grieg.ir";

  const staticByLocale = locales.flatMap((loc) => {
    const now = new Date().toISOString();
    const root: MetadataRoute.Sitemap = [
      { url: `${baseUrl}/${loc}`, lastModified: now, changeFrequency: "weekly", priority: 1 },
      { url: `${baseUrl}/${loc}/biography`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
      { url: `${baseUrl}/${loc}/works`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
      { url: `${baseUrl}/${loc}/listen`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
      { url: `${baseUrl}/${loc}/gallery`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
      { url: `${baseUrl}/${loc}/events`, lastModified: now, changeFrequency: "daily", priority: 0.7 },
      { url: `${baseUrl}/${loc}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    ];
    return root;
  });

  const blogEntries: MetadataRoute.Sitemap = [];
  const worksEntries: MetadataRoute.Sitemap = [];
  for (const loc of locales) {
    const posts = await getAllMarkdown(`blog/${loc}`);
    for (const p of posts) {
      blogEntries.push({
        url: `${baseUrl}/${loc}/blog/${p.slug}`,
        lastModified: new Date().toISOString(),
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
    const works = await getAllMarkdown(`works/${loc}`);
    for (const w of works) {
      worksEntries.push({
        url: `${baseUrl}/${loc}/works/${w.slug}`,
        lastModified: new Date().toISOString(),
        changeFrequency: "yearly",
        priority: 0.5,
      });
    }
  }

  return [...staticByLocale, ...blogEntries, ...worksEntries];
}


