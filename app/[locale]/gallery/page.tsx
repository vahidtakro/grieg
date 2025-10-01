import Image from "next/image";
import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import GalleryLightbox, { GalleryItem } from "@/components/GalleryLightbox";

const ITEMS: GalleryItem[] = [
  { src: "/grieg/gallery/bergen-public-library-cxIBmwCkMLA-unsplash.jpg", width: 1600, height: 1067, alt: "Bergen Public Library", credit: "Bergen Public Library (Unsplash)" },
  { src: "/grieg/gallery/bergen-public-library-sumOjP6kJMI-unsplash.jpg", width: 1600, height: 1067, alt: "Bergen Public Library", credit: "Bergen Public Library (Unsplash)" },
  { src: "/grieg/gallery/bergen-public-library-wOnzJi6-yRk-unsplash.jpg", width: 1600, height: 1067, alt: "Bergen Public Library", credit: "Bergen Public Library (Unsplash)" },
  { src: "/grieg/gallery/bergen-public-library-XllEYFTUEKY-unsplash.jpg", width: 1600, height: 1067, alt: "Bergen Public Library", credit: "Bergen Public Library (Unsplash)" },
  { src: "/grieg/gallery/joshua-kettle-QuPHZspiYGI-unsplash.jpg", width: 1600, height: 1067, alt: "Joshua Kettle photo", credit: "Joshua Kettle (Unsplash)" },
  { src: "/grieg/gallery/the-national-library-of-norway--xdouhDMy_M-unsplash.jpg", width: 1600, height: 1067, alt: "The National Library of Norway", credit: "The National Library of Norway (Unsplash)" },
];
export default async function GalleryPage() {
  const t = await getTranslations();
  return (
    <section className="py-2 md:py-20">
      <h1 className="hero-title text-3xl md:text-5xl font-semibold tracking-tight">{t("gallery.title")}</h1>
      <p className="mt-6 max-w-2xl text-[1.0625rem] md:text-base leading-[1.7] text-foreground/85">{t("gallery.intro")}</p>
      <GalleryLightbox items={ITEMS} creditLabel={t("gallery.credit")} />
    </section>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();
  const locale = await getLocale();
  const title = t("gallery.title");
  const description = t("gallery.intro");
  const ogImage = "/grieg/grieg-og-image.png";
  return {
    title,
    description,
    openGraph: {
      type: "website",
      title,
      description,
      siteName: t("site.title"),
      locale,
      url: `/${locale}/gallery`,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    alternates: {
      canonical: `/${locale}/gallery`,
      languages: { en: "/en/gallery", fa: "/fa/gallery", no: "/no/gallery" },
    },
  };
}


