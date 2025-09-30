import { getTranslations } from "next-intl/server";

export default async function ListenPage() {
	const t = await getTranslations();
	return (
		<section className="container-padded py-14 md:py-20">
			<h1 className="hero-title text-3xl md:text-5xl font-semibold tracking-tight">{t("nav.listen")}</h1>
			<p className="mt-6 max-w-2xl text-sm md:text-base text-foreground/85">
				Add embeds or links to recordings here. For example, YouTube, Spotify, or self-hosted audio.
			</p>
			<div className="mt-8 grid gap-4">
				<a className="text-sm md:text-base underline underline-offset-4" href="https://www.youtube.com/results?search_query=edvard+grieg+piano+concerto" target="_blank" rel="noreferrer noopener">YouTube: Grieg Piano Concerto</a>
				<a className="text-sm md:text-base underline underline-offset-4" href="https://open.spotify.com/search/edvard%20grieg" target="_blank" rel="noreferrer noopener">Spotify: Edvard Grieg</a>
			</div>
		</section>
	);
}


