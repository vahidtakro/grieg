import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

export default async function ListenPage() {
	const t = await getTranslations();
	return (
		<section className="container-padded py-14 md:py-20">
			<h1 className="hero-title text-3xl md:text-5xl font-semibold tracking-tight">{t("nav.listen")}</h1>
			<p className="mt-6 max-w-2xl text-[1.0625rem] md:text-base leading-[1.7] text-foreground/85">
                {t("listen.intro")}
			</p>
			<div className="mt-8 grid gap-4 text-[1.0625rem] md:text-base leading-[1.7]">
				<a className="underline underline-offset-4" href="https://www.youtube.com/results?search_query=edvard+grieg+piano+concerto" target="_blank" rel="noreferrer noopener">{t("listen.youtubeLink")}</a>
				<a className="underline underline-offset-4" href="https://open.spotify.com/search/edvard%20grieg" target="_blank" rel="noreferrer noopener">{t("listen.spotifyLink")}</a>
			</div>
		</section>
	);
}

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations();
    return {
        title: t("nav.listen"),
        description: t("home.lead"),
    };
}

