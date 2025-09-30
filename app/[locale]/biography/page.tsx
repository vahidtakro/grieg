import { getMarkdownBySlug } from "@/lib/markdown";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export default async function BiographyPage({ params }: { params: Promise<{ locale: string }> }) {
	const t = await getTranslations();
	const { locale } = await params;
	const doc = await getMarkdownBySlug("biography", locale);
	const html = doc?.html ?? "";
	return (
		<section className="container-padded py-14 md:py-20">
			<h1 className="hero-title text-3xl md:text-5xl font-semibold tracking-tight">{t("biography.title")}</h1>
			<article className="prose mt-6 max-w-3xl text-sm md:text-base leading-relaxed" dangerouslySetInnerHTML={{ __html: html }} />
		</section>
	);
}

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations();
    return {
        title: t("biography.title"),
        description: t("home.lead"),
    };
}


