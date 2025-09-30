"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";

function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const isActive = pathname === href || (href !== "/" && pathname?.startsWith(href));
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
  return (
    <aside className="hidden md:flex sticky top-0 h-dvh flex-col w-[260px] border-r border-foreground/10 bg-gradient-to-b from-background to-background/60">
      <div className="relative px-5 py-6 border-b border-foreground/10 overflow-hidden">
        <div className="absolute inset-0 img-blend" style={{ backgroundImage: "url(/grieg/grieg.jpg)", backgroundSize: "cover", backgroundPosition: "center 20%" }} />
        <div className="absolute inset-0 overlay-side" />
        <div className="absolute right-0 top-0 h-full w-[6px] bg-[--accent] opacity-60" />
        <div className="relative text-xl font-semibold tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
          <Link href="/">Edvard Grieg</Link>
        </div>
        <div className="relative mt-2 text-xs text-foreground/70">Composer & Pianist</div>
      </div>
      <div className="relative flex-1">
        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "url(/notes-sheet.svg)", backgroundRepeat: "repeat", backgroundSize: "360px 270px" }} />
        <nav className="relative z-10 px-3 py-4 gap-1 flex flex-col">
          <NavLink href="/works" label="Works" />
          <NavLink href="/biography" label="Biography" />
          <NavLink href="/listen" label="Listen" />
          <NavLink href="/blog" label="Blog" />
        </nav>
      </div>
      <div className="px-5 py-4 border-t border-foreground/10">
        <ThemeToggle />
      </div>
    </aside>
  );
}


