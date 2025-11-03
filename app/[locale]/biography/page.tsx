import { getMarkdownBySlug } from "@/lib/markdown";
import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { siteConfig } from "@/src/config/site";

export default async function BiographyPage({ params }: { params: Promise<{ locale: string }> }) {
	const t = await getTranslations();
	const { locale } = await params;
	const doc = await getMarkdownBySlug("biography", locale);
	const html = doc?.html ?? "";
	return (
		<section className="py-14 md:py-20">
			<h1 className="hero-title text-3xl md:text-5xl font-semibold tracking-tight">{t("biography.title")}</h1>
			<article className="prose mt-6 max-w-3xl text-sm md:text-base leading-relaxed" dangerouslySetInnerHTML={{ __html: html }} />
		</section>
	);
}

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations();
    const ogImage = "/grieg/grieg-og-image.png";
    const locale = await getLocale();
    return {
        title: t("biography.title"),
        description: t("home.lead"),
        openGraph: {
            type: "website",
            title: t("biography.title"),
            description: t("home.lead"),
            siteName: t("site.title"),
            locale,
            url: `/${locale}/biography`,
            images: [{ url: ogImage, width: 1200, height: 630, alt: t("site.title") }],
        },
        twitter: {
            card: "summary_large_image",
            title: t("biography.title"),
            description: t("home.lead"),
            images: [ogImage],
        },
        alternates: {
            canonical: `${siteConfig.baseUrl}/${locale}/biography`,
            languages: { en: `${siteConfig.baseUrl}/en/biography`, fa: `${siteConfig.baseUrl}/fa/biography`, no: `${siteConfig.baseUrl}/no/biography` },
        },
    };
}


