import { notFound } from "next/navigation";
import { getWorkBySlug, works } from "../../../../content/works/data";

type Params = { slug: string; locale: string };

export function generateStaticParams() {
	return works.map((w) => ({ slug: w.slug }));
}

export default async function WorkDetailPage({ params }: { params: Promise<Params> }) {
	const { slug } = await params;
	const work = getWorkBySlug(slug);
	if (!work) return notFound();

	return (
		<section className="container-padded py-14 md:py-20">
			<h1 className="hero-title text-3xl md:text-5xl font-semibold tracking-tight">{work.title}</h1>
			{work.year ? (
				<p className="mt-2 text-sm md:text-base text-foreground/70">{work.year}</p>
			) : null}
			{work.description ? (
				<p className="mt-6 max-w-3xl text-sm md:text-base leading-relaxed text-foreground/85">{work.description}</p>
			) : null}
			<div className="mt-10 text-sm text-foreground/70">
				This is a starter template. Replace this text with program notes, movements,
				instrumentation, and media embeds.
			</div>
		</section>
	);
}


