import Link from "next/link";
import { getAllMarkdown } from "@/lib/markdown";
import { getTranslations } from "next-intl/server";

export const dynamic = "force-static";

export default async function BlogIndexPage({ params }: { params: Promise<{ locale: string }> }) {
    const t = await getTranslations();
    const { locale } = await params;
	const posts = await getAllMarkdown(`blog/${locale}`);
	return (
		<section className="container-padded py-14 md:py-20">
			<h1 className="hero-title text-3xl md:text-5xl font-semibold tracking-tight">{t("blog.title")}</h1>
			<ul className="mt-6 max-w-3xl space-y-4 text-sm md:text-base leading-relaxed">
				{posts.map((post) => (
					<li key={post.slug} className="border-b border-foreground/10 pb-4">
					<Link className="underline underline-offset-4 hover:no-underline" href={`../blog/${post.slug}`}>
							{post.data.title || post.slug}
						</Link>
					{post.data.excerpt ? (
							<p className="mt-1 text-foreground/70">{post.data.excerpt as string}</p>
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


