import Link from "next/link";
import { getTranslations } from "next-intl/server";

export default async function Home() {
	const t = await getTranslations();
	return (
		<section className="container-padded pt-14 md:pt-20 pb-20 md:pb-28">
			<div className="relative overflow-hidden rounded-xl border border-foreground/10 bg-background/60">
				<div className="absolute inset-0 img-blend" style={{ backgroundImage: "url(/grieg/grieg.png)", backgroundSize: "cover", backgroundPosition: "center 20%" }} />
				<div className="absolute inset-0 overlay-hero" />
				<div className="relative max-w-3xl px-6 md:px-8 py-10 md:py-14">
				<h1 className="hero-title text-4xl md:text-6xl font-semibold tracking-tight">
					Edvard Grieg
				</h1>
				<p className="mt-4 text-base md:text-lg text-foreground/80 leading-relaxed">
					Norwegian composer and pianist (1843–1907). Celebrated for his lyricism and
					national romantic style. Explore selected works, a short biography, and
					recordings.
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
		</section>
	);
}


