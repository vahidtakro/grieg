import { getAllMarkdown, getMarkdownBySlug } from "@/lib/markdown";
import Link from "next/link";
import type { Metadata } from "next";
import { locales } from "../../../../src/i18n/config";
import { getTranslations } from "next-intl/server";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
    const params: Array<{ slug: string; locale: string }> = [];
    for (const loc of locales) {
        const posts = await getAllMarkdown(`blog/${loc}`);
        for (const p of posts) params.push({ slug: p.slug, locale: loc });
    }
    return params;
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string; locale: string }> }) {
    const t = await getTranslations();
    const { locale, slug } = await params;
    const isRTL = locale === "fa";
    const post = await getMarkdownBySlug(`blog/${locale}`, slug);
    if (!post) {
        return (
            <section className="py-2 md:py-20">
                <h1 className="hero-title text-3xl md:text-5xl font-semibold tracking-tight">{t("blog.notFoundTitle")}</h1>
                <p className="mt-4">{t("blog.notFoundMessage")} <Link className="underline underline-offset-4" href="../blog">{t("blog.title")}</Link>.</p>
            </section>
        );
    }

	return (
		<section className="py-2 md:py-20">
            <div className="text-sm text-foreground/60 mb-3">
                <Link className="underline underline-offset-4 hover:no-underline" href="../blog">{isRTL ? `${t("blog.back")} →` : `← ${t("blog.back")}`}</Link>
            </div>
			<h1 className="hero-title text-3xl md:text-5xl font-semibold tracking-tight">{post.data.title || post.slug}</h1>
			{post.data.date ? (
				<div className="mt-2 text-xs text-foreground/60">{new Date(post.data.date as string).toISOString().slice(0, 10)}</div>
			) : null}
			<article className="prose mt-6 max-w-3xl text-sm md:text-base leading-relaxed" dangerouslySetInnerHTML={{ __html: post.html }} />
		</section>
	);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string; locale: string }> }): Promise<Metadata> {
    const { locale, slug } = await params;
    const t = await getTranslations();
    const post = await getMarkdownBySlug(`blog/${locale}`, slug);
    const baseTitle = t("blog.title");
    if (!post) {
        return {
            title: `${baseTitle}`,
            description: t("home.lead"),
            openGraph: {
                type: "article",
                title: baseTitle,
                description: t("home.lead"),
                siteName: t("site.title"),
                locale,
                url: `/${locale}/blog`,
                images: [{ url: "/grieg/grieg-og-image.png", width: 1200, height: 630, alt: t("site.title") }],
            },
            twitter: {
                card: "summary_large_image",
                title: baseTitle,
                description: t("home.lead"),
                images: ["/grieg/grieg-og-image.png"],
            },
            alternates: {
                canonical: `/${locale}/blog`,
                languages: { en: "/en/blog", fa: "/fa/blog", no: "/no/blog" },
            },
        };
    }
    const title = post.data.title ? `${post.data.title} — ${baseTitle}` : baseTitle;
    const description = (post.data.excerpt as string) || t("home.lead");
    return {
        title,
        description,
        openGraph: {
            type: "article",
            title,
            description,
            siteName: t("site.title"),
            locale,
            url: `/${locale}/blog/${slug}`,
            images: [{ url: "/grieg/grieg-og-image.png", width: 1200, height: 630, alt: title }],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: ["/grieg/grieg-og-image.png"],
        },
        alternates: {
            canonical: `/${locale}/blog/${slug}`,
            languages: { en: `/en/blog/${slug}`, fa: `/fa/blog/${slug}`, no: `/no/blog/${slug}` },
        },
    };
}


