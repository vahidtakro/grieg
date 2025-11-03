import Link from "next/link";
import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getAllMarkdown } from "@/lib/markdown";
import { siteConfig } from "@/src/config/site";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
	const t = await getTranslations();
	const { locale } = await params;
	setRequestLocale(locale);
	const latestPosts = (await getAllMarkdown(`blog/${locale}`)).slice(0, 3);
	const latestWorks = (await getAllMarkdown(`works/${locale}`)).slice(0, 3);
	return (
		<section className="pt-14 md:pt-20 pb-20 md:pb-28">
			<div className="relative overflow-hidden rounded-xl border border-foreground/10 bg-background/60">
				<div className="absolute inset-0 img-blend" style={{ backgroundImage: "url(/grieg/grieg.png)", backgroundSize: "cover", backgroundPosition: "center 20%" }} />
				<div className="absolute inset-0 overlay-hero" />
				<div className="relative max-w-3xl px-6 md:px-8 py-10 md:py-14">
					<h1 className="hero-title text-4xl md:text-6xl font-semibold tracking-tight">
						{t("site.title")}
					</h1>
					<p className="mt-4 text-base md:text-lg text-foreground/80 leading-relaxed">
						{t("home.lead")}
					</p>
					<div className="mt-8 flex gap-3">
						<Link href="works" className="px-4 py-2 rounded-md bg-foreground text-background text-sm md:text-base">
							{t("home.explore")}
						</Link>
						<Link href="listen" className="px-4 py-2 rounded-md border border-foreground/20 text-sm md:text-base hover:bg-foreground/5">
							{t("home.listen")}
						</Link>
					</div>
				</div>
			</div>

			<div className="mt-16 md:mt-24" />

			{/* Latest sections */}
			<section className="mt-8 grid gap-10 md:gap-12 md:grid-cols-2">
				<div className="rounded-xl border border-foreground/10 bg-background/60 p-6">
					<div className="flex items-center justify-between mb-4">
						<h2 className="text-xl md:text-2xl font-semibold tracking-tight">{t("home.latestWorks")}</h2>
						<Link href="works" className="text-sm underline underline-offset-4 hover:no-underline">{t("home.viewAll")}</Link>
					</div>
					<ul className="space-y-4">
						{latestWorks.map((w) => (
							<li key={w.slug} className="border-b border-foreground/10 pb-4 last:border-b-0 last:pb-0">
								<div className="flex items-start justify-between gap-3">
									<div className="flex-1 min-w-0">
										<Link href={`/${locale}/works/${w.slug}`} className="hover:underline underline-offset-4 font-medium">
											{w.data.title || w.slug}
										</Link>
										{w.data.excerpt ? (
											<p className="mt-1 text-sm text-foreground/70 line-clamp-2">{w.data.excerpt as string}</p>
										) : null}
									</div>
									{w.data.year ? (
										<span className="text-xs text-foreground/60 whitespace-nowrap flex-shrink-0">{w.data.year as string}</span>
									) : null}
								</div>
							</li>
						))}
					</ul>
				</div>

				<div className="rounded-xl border border-foreground/10 bg-background/60 p-6">
					<div className="flex items-center justify-between mb-4">
						<h2 className="text-xl md:text-2xl font-semibold tracking-tight">{t("home.latestPosts")}</h2>
						<Link href="blog" className="text-sm underline underline-offset-4 hover:no-underline">{t("home.viewAll")}</Link>
					</div>
					<ul className="space-y-4">
						{latestPosts.map((p) => (
							<li key={p.slug} className="border-b border-foreground/10 pb-4 last:border-b-0 last:pb-0">
								<div className="flex items-start justify-between gap-3">
									<div className="flex-1 min-w-0">
										<Link href={`/${locale}/blog/${p.slug}`} className="hover:underline underline-offset-4 font-medium">
											{p.data.title || p.slug}
										</Link>
										{p.data.excerpt ? (
											<p className="mt-1 text-sm text-foreground/70 line-clamp-2">{p.data.excerpt as string}</p>
										) : null}
									</div>
									{p.data.date ? (
										<span className="text-xs text-foreground/60 whitespace-nowrap flex-shrink-0">{new Date(p.data.date as string).toISOString().slice(0, 10)}</span>
									) : null}
								</div>
							</li>
						))}
					</ul>
				</div>
			</section>
		</section>
	);
}

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations();
	const title = t("site.title");
	const description = t("home.lead");
    const ogImage = "/grieg/grieg-og-image.png";
    const locale = await getLocale();
	return {
		title,
		description,
		openGraph: {
			type: "website",
			title,
			description,
			siteName: title,
			locale,
			url: `/${locale}`,
			images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
		},
		twitter: {
			card: "summary_large_image",
			title,
			description,
			images: [ogImage],
		},
		alternates: {
			canonical: `${siteConfig.baseUrl}/${locale}`,
			languages: { en: `${siteConfig.baseUrl}/en`, fa: `${siteConfig.baseUrl}/fa`, no: `${siteConfig.baseUrl}/no` },
		},
	};
}


