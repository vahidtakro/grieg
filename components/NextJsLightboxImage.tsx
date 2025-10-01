"use client";

import Image from "next/image";
import { useLightboxProps, useLightboxState } from "yet-another-react-lightbox";
import type { ReactElement } from "react";

type SlideData = {
  src: string;
  width?: number;
  height?: number;
  blurDataURL?: string;
};

function isNextJsImage(slide: unknown): slide is SlideData {
  const s = slide as SlideData;
  return !!s && typeof s.src === "string" && typeof s.width === "number" && typeof s.height === "number";
}

export default function NextJsLightboxImage({ slide, offset, rect }: { slide: unknown; offset: number; rect: { width: number; height: number } }): ReactElement | null {
  const {
    on: { click },
    carousel: { imageFit },
  } = useLightboxProps();

  const { currentIndex } = useLightboxState();

  const cover = imageFit === "cover";

  if (!isNextJsImage(slide)) return null;

  const width = !cover ? Math.round(Math.min(rect.width, (rect.height / (slide.height as number)) * (slide.width as number))) : rect.width;
  const height = !cover ? Math.round(Math.min(rect.height, (rect.width / (slide.width as number)) * (slide.height as number))) : rect.height;

  return (
    <div style={{ position: "relative", width, height }}>
      <Image
        fill
        alt={(slide as SlideData).src}
        src={(slide as SlideData).src}
        loading="eager"
        draggable={false}
        placeholder={(slide as SlideData).blurDataURL ? "blur" : undefined}
        style={{ objectFit: cover ? "cover" : "contain", cursor: click ? "pointer" : undefined }}
        sizes={`${Math.ceil((width / window.innerWidth) * 100)}vw`}
        onClick={offset === 0 ? () => click?.({ index: currentIndex }) : undefined}
      />
    </div>
  );
}


