"use client";

import { useEffect } from "react";
import { useLocale } from "next-intl";

type DocumentAttributesProps = {
  initialLocale?: string;
};

export default function DocumentAttributes({ initialLocale }: DocumentAttributesProps) {
  const runtimeLocale = useLocale();
  const locale = initialLocale || runtimeLocale;
  const isRTL = locale === "fa";

  useEffect(() => {
    const html = document.documentElement;
    if (!html) return;

    // Update lang and dir
    if (html.lang !== locale) html.lang = locale;
    const desiredDir = isRTL ? "rtl" : "ltr";
    if (html.getAttribute("dir") !== desiredDir) html.setAttribute("dir", desiredDir);

    // Mark current locale for CSS overrides (fonts, etc.)
    html.setAttribute("data-locale", locale);
  }, [locale, isRTL]);

  return null;
}


