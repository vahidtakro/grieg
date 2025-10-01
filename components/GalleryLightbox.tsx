"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import "yet-another-react-lightbox/styles.css";
import NextJsLightboxImage from "@/components/NextJsLightboxImage";

const DynamicLightbox = dynamic(() => import("yet-another-react-lightbox"), { ssr: false });

export type GalleryItem = {
  src: string;
  width: number;
  height: number;
  alt: string;
  credit: string;
};

export default function GalleryLightbox({ items, creditLabel }: { items: GalleryItem[]; creditLabel: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const close = useCallback(() => setOpenIndex(null), []);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") setOpenIndex((i) => (i == null ? 0 : Math.min(items.length - 1, i + 1)));
      if (e.key === "ArrowLeft") setOpenIndex((i) => (i == null ? 0 : Math.max(0, i - 1)));
    };
    if (openIndex != null) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [openIndex, close, items.length]);

  return (
    <>
      <ul className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-3">
        {items.map((img, idx) => (
          <li key={img.src} className="group overflow-hidden rounded-md border border-foreground/10 bg-background/60">
            <button type="button" onClick={() => setOpenIndex(idx)} className="block w-full focus:outline-none">
              <div className="relative w-full aspect-[4/3]">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  sizes="(min-width: 768px) 33vw, 50vw"
                  priority={idx < 3}
                />
              </div>
            </button>
            <div className="px-2 py-1 text-[0.78rem] text-foreground/70 border-t border-foreground/10">
              {creditLabel}: {img.credit}
            </div>
          </li>
        ))}
      </ul>

      {openIndex != null ? (
        <DynamicLightbox
          open
          index={openIndex}
          close={close}
          slides={items.map((it) => ({ src: it.src, width: it.width, height: it.height, alt: it.alt }))}
          carousel={{ finite: false, padding: 0, imageFit: "contain" }}
          controller={{ closeOnBackdropClick: true }}
          render={{
            slide: (props: any) => <NextJsLightboxImage {...props} />,
            buttonPrev: () => (
              <button data-yarl-prev aria-label="Previous" className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded bg-black/50 text-white">‹</button>
            ),
            buttonNext: () => (
              <button data-yarl-next aria-label="Next" className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded bg-black/50 text-white">›</button>
            ),
          }}
          styles={{ container: { backgroundColor: "rgba(0,0,0,0.85)" } }}
        />
      ) : null}
    </>
  );
}


