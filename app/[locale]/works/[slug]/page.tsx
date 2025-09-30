import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMarkdownBySlug, getAllMarkdown } from "@/lib/markdown";
import { getTranslations } from "next-intl/server";
import { locales } from "@/i18n/config";

type Params = { slug: string; locale: string };

export async function generateStaticParams() {
    const params: Array<{ slug: string; locale: string }> = [];
    for (const loc of locales) {
        const works = await getAllMarkdown(`works/${loc}`);
        for (const work of works) params.push({ slug: work.slug, locale: loc });
    }
    return params;
}

export default async function WorkDetailPage({ params }: { params: Promise<Params> }) {
    const t = await getTranslations();
    const { slug, locale } = await params;
    const work = await getMarkdownBySlug(`works/${locale}`, slug);
    if (!work) return notFound();

	return (
		<section className="container-padded py-14 md:py-20">
			<h1 className="hero-title text-3xl md:text-5xl font-semibold tracking-tight">{work.data.title || work.slug}</h1>
			{work.data.year ? (
				<p className="mt-2 text-sm md:text-base text-foreground/70">{work.data.year as string}</p>
			) : null}
			{work.data.excerpt ? (
				<p className="mt-6 max-w-3xl text-sm md:text-base leading-relaxed text-foreground/85">{work.data.excerpt as string}</p>
			) : null}
            <article className="prose mt-6 max-w-3xl text-sm md:text-base leading-relaxed" dangerouslySetInnerHTML={{ __html: work.html }} />
		</section>
	);
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
    const { slug, locale } = await params;
    const t = await getTranslations();
    const work = await getMarkdownBySlug(`works/${locale}`, slug);
    if (!work) return { title: t("nav.works") };
    return {
        title: `${work.data.title || work.slug} — ${t("nav.works")}`,
        description: (work.data.excerpt as string) || t("home.lead"),
    };
}


