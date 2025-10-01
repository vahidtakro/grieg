import Link from "next/link";
import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { getAllMarkdown } from "@/lib/markdown";
import { getTranslations } from "next-intl/server";

export const dynamic = "force-dynamic";

export default async function BlogIndexPage({ params }: { params: Promise<{ locale: string }> }) {
    const t = await getTranslations();
    const { locale } = await params;
	const posts = await getAllMarkdown(`blog/${locale}`);
	return (
		<section className="py-2 md:py-20">
			<h1 className="hero-title text-3xl md:text-5xl font-semibold tracking-tight">{t("blog.title")}</h1>
			<ul className="mt-6 max-w-3xl space-y-4 text-[1.0625rem] md:text-base leading-[1.7]">
				{posts.map((post) => (
					<li key={post.slug} className="border-b border-foreground/10 pb-4">
					<Link className="underline underline-offset-4 hover:no-underline" href={`/${locale}/blog/${post.slug}`}>
							{post.data.title || post.slug}
						</Link>
					{post.data.excerpt ? (
							<p className="mt-1 text-[1.0625rem] md:text-base leading-[1.7] text-foreground/70">{post.data.excerpt as string}</p>
						) : null}
					{post.data.date ? (
						<div className="mt-1 text-xs text-foreground/60">{new Date(post.data.date as string).toISOString().slice(0, 10)}</div>
					) : null}
					</li>
				))}
			</ul>
		</section>
	);
}

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations();
    const ogImage = "/grieg/grieg-og-image.png";
    const locale = await getLocale();
    return {
        title: t("blog.title"),
        description: t("home.lead"),
        openGraph: {
            type: "website",
            title: t("blog.title"),
            description: t("home.lead"),
            siteName: t("site.title"),
            locale,
            url: `/${locale}/blog`,
            images: [{ url: ogImage, width: 1200, height: 630, alt: t("site.title") }],
        },
        twitter: {
            card: "summary_large_image",
            title: t("blog.title"),
            description: t("home.lead"),
            images: [ogImage],
        },
        alternates: {
            canonical: `/${locale}/blog`,
            languages: { en: "/en/blog", fa: "/fa/blog", no: "/no/blog" },
        },
    };
}


