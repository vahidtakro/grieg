"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { locales } from "../src/i18n/config";

export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const firstLinkRef = useRef<HTMLAnchorElement | null>(null);
  const t = useTranslations();
  const pathname = usePathname() || "/en";
  const currentLocale = (pathname.split("/").filter(Boolean)[0] ?? "en") as string;
  const locale = locales.includes(currentLocale as typeof locales[number]) ? (currentLocale as typeof locales[number]) : "en";
  
  function linkClass(href: string) {
    const isRoot = !href.includes("/", 1);
    const isActive = isRoot
      ? pathname === href
      : pathname === href || pathname.startsWith(href + "/");
    return (
      "px-3 py-2 rounded-md " + (isActive ? "bg-foreground text-background" : "hover:bg-foreground/10")
    );
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    if (open) {
      document.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
      setTimeout(() => firstLinkRef.current?.focus(), 0);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label="Open menu"
        aria-expanded={open}
        className="rounded-md border border-foreground/20 p-2 text-sm hover:bg-foreground/5"
        onClick={() => setOpen(true)}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
      </button>
      <div className={`fixed inset-0 z-[60] ${open ? '' : 'pointer-events-none'}`} aria-hidden={!open}>
        <div className={`absolute inset-0 transition-opacity duration-200 ${open ? 'bg-black/30 opacity-100' : 'opacity-0'}`} onClick={() => setOpen(false)} />
        <div
          role="dialog"
          aria-modal="true"
          className={`absolute top-0 left-0 w-full max-w-none border-b border-foreground/10 bg-background shadow-xl transition-transform duration-250 ${open ? 'translate-y-0' : '-translate-y-full'}`}
        >
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img src="/logos/grieg_logo_vector.svg" alt="Grieg logo" className="h-6 w-6" />
                <div className="text-lg font-semibold" style={{ fontFamily: locale === 'fa' ? '"Sahel FD", var(--font-display)' : 'var(--font-display)' }}>{t("site.title")}</div>
              </div>
              <button
                type="button"
                aria-label="Close menu"
                className="rounded-md border border-foreground/20 p-1.5 text-sm hover:bg-foreground/5"
                onClick={() => setOpen(false)}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M6 6l12 12M18 6L6 18"/></svg>
              </button>
            </div>
            <nav className="mt-4 grid gap-2 text-sm pb-3">
              <Link href={`/${locale}`} ref={firstLinkRef} onClick={() => setOpen(false)} className={linkClass(`/${locale}`)}>{t("nav.home")}</Link>
              <Link href={`/${locale}/works`} onClick={() => setOpen(false)} className={linkClass(`/${locale}/works`)}>{t("nav.works")}</Link>
              <Link href={`/${locale}/biography`} onClick={() => setOpen(false)} className={linkClass(`/${locale}/biography`)}>{t("nav.biography")}</Link>
              <Link href={`/${locale}/listen`} onClick={() => setOpen(false)} className={linkClass(`/${locale}/listen`)}>{t("nav.listen")}</Link>
              <Link href={`/${locale}/blog`} onClick={() => setOpen(false)} className={linkClass(`/${locale}/blog`)}>{t("nav.blog")}</Link>
            </nav>
            <div className="mt-2 pt-2 border-t border-foreground/10 text-xs text-foreground/70">
              <a href="mailto:contact@grieg.ir" className="hover:underline">contact@grieg.ir</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


