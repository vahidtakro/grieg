import Link from "next/link";
import type { Metadata } from "next";
import { getAllMarkdown } from "@/lib/markdown";
import { getTranslations } from "next-intl/server";

export default async function WorksPage({ params }: { params: Promise<{ locale: string }> }) {
	const t = await getTranslations();
	const { locale } = await params;
	const works = await getAllMarkdown(`works/${locale}`);
	return (
		<section className="container-padded py-14 md:py-20">
			<h1 className="hero-title text-3xl md:text-5xl font-semibold tracking-tight">{t("nav.works")}</h1>
			<p className="mt-6 max-w-2xl text-sm md:text-base text-foreground/85">
				{t("works.intro")}
			</p>
			<ul className="mt-6 grid gap-3 text-sm md:text-base">
				{works.map((work) => (
					<li key={work.slug} className="border-b border-foreground/10 pb-3">
						<div className="inline-flex items-baseline gap-2">
							<Link href={`/${locale}/works/${work.slug}`} className="hover:underline underline-offset-4">
								{work.data.title || work.slug}
							</Link>
							{work.data.year ? <span className="text-foreground/60">{work.data.year as string}</span> : null}
						</div>
						{work.data.excerpt ? (
							<p className="mt-1 text-foreground/70">{work.data.excerpt as string}</p>
						) : null}
					</li>
				))}
			</ul>
		</section>
	);
}

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations();
    return {
        title: t("nav.works"),
        description: t("home.lead"),
    };
}


