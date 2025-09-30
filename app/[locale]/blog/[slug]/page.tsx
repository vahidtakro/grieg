import { getAllMarkdown, getMarkdownBySlug } from "@/lib/markdown";
import Link from "next/link";

export const dynamic = "force-static";

export async function generateStaticParams({ params }: { params: { locale: string } }) {
	const { locale } = params;
	const posts = await getAllMarkdown(`blog/${locale}`);
	return posts.map((p) => ({ slug: p.slug }));
}

export default async function BlogPostPage({ params }: { params: { slug: string; locale: string } }) {
	const { locale, slug } = params;
	const post = await getMarkdownBySlug(`blog/${locale}`, slug);
	if (!post) {
		return (
			<section className="container-padded py-14 md:py-20">
				<h1 className="hero-title text-3xl md:text-5xl font-semibold tracking-tight">Not found</h1>
				<p className="mt-4">The requested post was not found. Go back to the <Link className="underline underline-offset-4" href="../blog">blog</Link>.</p>
			</section>
		);
	}

	return (
		<section className="container-padded py-14 md:py-20">
			<div className="text-sm text-foreground/60 mb-3">
				<Link className="underline underline-offset-4 hover:no-underline" href="../blog">← Back to blog</Link>
			</div>
			<h1 className="hero-title text-3xl md:text-5xl font-semibold tracking-tight">{post.data.title || post.slug}</h1>
			{post.data.date ? (
				<div className="mt-2 text-xs text-foreground/60">{new Date(post.data.date as string).toISOString().slice(0, 10)}</div>
			) : null}
			<article className="prose mt-6 max-w-3xl text-sm md:text-base leading-relaxed" dangerouslySetInnerHTML={{ __html: post.html }} />
		</section>
	);
}


