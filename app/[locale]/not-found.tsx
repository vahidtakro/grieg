import Link from "next/link";
import { getTranslations } from "next-intl/server";

export default async function NotFound() {
	const t = await getTranslations();
	return (
		<section className="container-padded py-20 text-center">
			<h1 className="hero-title text-3xl md:text-5xl font-semibold tracking-tight">{t("notFound.title")}</h1>
			<div className="mt-8">
				<Link href="/" className="px-4 py-2 rounded-md bg-foreground text-background">{t("notFound.back")}</Link>
			</div>
		</section>
	);
}


