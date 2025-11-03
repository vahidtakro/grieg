import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import AudioPlayer from "@/components/AudioPlayer";
import { siteConfig } from "@/src/config/site";

type ArchiveAudioItem = {
	identifier: string;
	title: string;
	fileUrl: string;
	licenseLabel?: string;
	licenseUrl?: string;
};

async function fetchInternetArchiveRecordings(): Promise<ArchiveAudioItem[]> {
	const search = new URL("https://archive.org/advancedsearch.php");
	search.searchParams.set(
		"q",
		'creator:("Edvard Grieg") AND mediatype:("audio")'
	);
	search.searchParams.append("fl[]", "identifier");
	search.searchParams.append("fl[]", "title");
	search.searchParams.append("fl[]", "licenseurl");
	search.searchParams.append("fl[]", "rights");
	search.searchParams.set("rows", "20");
	search.searchParams.set("output", "json");

	const results: ArchiveAudioItem[] = [];

	try {
		const res = await fetch(search.toString(), { next: { revalidate: 60 * 60 } });
		if (!res.ok) return results;
		const data = (await res.json()) as {
			response?: { docs?: Array<{ identifier: string; title?: string; licenseurl?: string; rights?: string }> };
		};
		const docs = data.response?.docs || [];

		// Filter to Creative Commons or Public Domain only
		const permitted = docs.filter((doc) => {
			const rights = (doc.rights || "").toLowerCase();
			const license = (doc.licenseurl || "").toLowerCase();
			return (
				license.includes("creativecommons.org") ||
				license.includes("publicdomain") ||
				rights.includes("public domain") ||
				rights.includes("creative commons") ||
				rights.includes("cc0") ||
				rights.includes("cc-by") ||
				rights.includes("cc-by-sa") ||
				rights.includes("cc-")
			);
		});

		const items = await Promise.all(
			permitted.map(async (doc) => {
				try {
					const metaRes = await fetch(
						`https://archive.org/metadata/${encodeURIComponent(doc.identifier)}`,
						{ next: { revalidate: 60 * 60 } }
					);
					if (!metaRes.ok) return null;
					const meta = (await metaRes.json()) as {
						files?: Array<{ name: string; format?: string }>;
					};
					const files = meta.files || [];
					const preferred = files.find((f) => (f.format || "").toLowerCase().includes("mp3"));
					const fallback = files.find((f) => (f.format || "").toLowerCase().includes("ogg"));
					const chosen = preferred || fallback;
					if (!chosen?.name) return null;

					let licenseLabel: string | undefined = undefined;
					const rights = doc.rights || "";
					const licenseUrl = doc.licenseurl || undefined;
					if (rights) {
						licenseLabel = rights;
					} else if (licenseUrl) {
						licenseLabel = licenseUrl.includes("creativecommons.org") ? "Creative Commons" : licenseUrl;
					}
					return {
						identifier: doc.identifier,
						title: doc.title || doc.identifier,
						fileUrl: `https://archive.org/download/${encodeURIComponent(doc.identifier)}/${encodeURIComponent(chosen.name)}`,
						licenseLabel,
						licenseUrl,
					} satisfies ArchiveAudioItem;
				} catch {
					return null;
				}
			})
		);

		for (const item of items) {
			if (item) results.push(item);
		}
	} catch {
		return results;
	}

	return results;
}

export default async function ListenPage() {
	const t = await getTranslations();
	const recordings = await fetchInternetArchiveRecordings();
	return (
		<section className="py-2 md:py-20">
			<h1 className="hero-title text-3xl md:text-5xl font-semibold tracking-tight">{t("nav.listen")}</h1>
			<p className="mt-6 max-w-2xl text-[1.0625rem] md:text-base leading-[1.7] text-foreground/85">
                {t("listen.intro")}
			</p>
			{recordings.length > 0 ? (
				<ul className="mt-8 max-w-2xl space-y-6 text-[1.0625rem] md:text-base leading-[1.7]">
					{recordings.map((rec) => (
					<li key={rec.identifier} className="border-b border-foreground/10 pb-6">
						<AudioPlayer src={rec.fileUrl} title={rec.title} />
						{(rec.licenseLabel || rec.licenseUrl) && (
							<div className="mt-2 text-[0.8rem] text-foreground/60">
								<span>License: </span>
								{rec.licenseUrl ? (
									<a href={rec.licenseUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground/80">
										{rec.licenseLabel || rec.licenseUrl}
									</a>
								) : (
									<span>{rec.licenseLabel}</span>
								)}
							</div>
						)}
					</li>
					))}
				</ul>
			) : (
				<div className="mt-8 text-sm text-foreground/60">No free recordings found right now.</div>
			)}
		</section>
	);
}

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations();
    const ogImage = "/grieg/grieg-og-image.png";
    const locale = await getLocale();
    return {
        title: t("nav.listen"),
        description: t("home.lead"),
        openGraph: {
            type: "website",
            title: t("nav.listen"),
            description: t("home.lead"),
            siteName: t("site.title"),
            locale,
            url: `/${locale}/listen`,
            images: [{ url: ogImage, width: 1200, height: 630, alt: t("site.title") }],
        },
        twitter: {
            card: "summary_large_image",
            title: t("nav.listen"),
            description: t("home.lead"),
            images: [ogImage],
        },
        alternates: {
            canonical: `${siteConfig.baseUrl}/${locale}/listen`,
            languages: { en: `${siteConfig.baseUrl}/en/listen`, fa: `${siteConfig.baseUrl}/fa/listen`, no: `${siteConfig.baseUrl}/no/listen` },
        },
    };
}

