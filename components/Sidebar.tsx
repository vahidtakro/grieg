"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { locales } from "../src/i18n/config";
import { useTranslations } from "next-intl";

function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  // Treat locale root (e.g., /en, /fa) as active only on exact match.
  // For section links (e.g., /en/blog), mark active on exact match or when a subpath is active.
  const isRoot = !href.includes("/", 1); // e.g., "/en" has no further slash after index 0
  const isActive = isRoot
    ? pathname === href
    : pathname === href || pathname?.startsWith(href + "/");
  return (
    <Link
      href={href}
      className={
        "px-3 py-2 rounded-md text-sm transition-colors " +
        (isActive
          ? "bg-foreground text-background"
          : "hover:bg-foreground/10")
      }
    >
      {label}
    </Link>
  );
}

export default function Sidebar() {
  const t = useTranslations();
  const pathname = usePathname() || "/en";
  const currentLocale = (pathname.split("/").filter(Boolean)[0] ?? "en") as string;
  const locale = locales.includes(currentLocale as typeof locales[number]) ? currentLocale as typeof locales[number] : "en";
  return (
    <aside className="hidden md:flex sticky top-0 h-dvh flex-col w-[260px] border-r border-foreground/10 bg-gradient-to-b from-background to-background/60">
      <div className="relative px-5 py-6 border-b border-foreground/10 overflow-hidden">
        <div className="absolute inset-0 img-blend" style={{ backgroundImage: "url(/grieg/grieg.jpg)", backgroundSize: "cover", backgroundPosition: "center 20%" }} />
        <div className="absolute inset-0 overlay-side" />
        <div className="absolute right-0 top-0 h-full w-[6px] bg-[--accent] opacity-60" />
        <div className="relative text-xl font-semibold tracking-tight">
          <Link href={`/${locale}`} className="flex items-center gap-2">
            <img src="/logos/grieg_logo_vector.svg" alt="Grieg logo" className="h-6 w-6" />
            <span style={{ fontFamily: locale === 'fa' ? '"Sahel FD", var(--font-display)' : 'var(--font-display)' }}>{t("site.title")}</span>
          </Link>
        </div>
        <div className="relative mt-2 text-xs text-foreground/70">{t("site.tagline")}</div>
      </div>
      <div className="relative flex-1">
        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "url(/notes-sheet.svg)", backgroundRepeat: "repeat", backgroundSize: "360px 270px" }} />
        <nav className="relative z-10 px-3 py-4 gap-1 flex flex-col">
          <NavLink href={`/${locale}`} label={t("nav.home")} />
          <NavLink href={`/${locale}/works`} label={t("nav.works")} />
          <NavLink href={`/${locale}/biography`} label={t("nav.biography")} />
          <NavLink href={`/${locale}/listen`} label={t("nav.listen")} />
          <NavLink href={`/${locale}/events`} label={t("nav.events")} />
          <NavLink href={`/${locale}/blog`} label={t("nav.blog")} />
        </nav>
      </div>
      <div className="px-5 py-4 border-t border-foreground/10 flex items-center gap-2">
        <LanguageSwitcher />
        <ThemeToggle />
        <a href="mailto:contact@grieg.ir" className="ml-auto text-xs text-foreground/70 hover:underline">contact@grieg.ir</a>
      </div>
    </aside>
  );
}


