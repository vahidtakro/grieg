"use client";

import { useEffect, useState } from "react";

function getInitialTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  const saved = window.localStorage.getItem("theme-preference");
  if (saved === "light" || saved === "dark") return saved;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">(getInitialTheme());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = theme;
    window.localStorage.setItem("theme-preference", theme);
  }, [theme]);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <button
      type="button"
      className="inline-flex items-center gap-2 rounded-md border border-foreground/20 px-3 py-1.5 text-sm hover:bg-foreground/5"
      aria-label="Toggle theme"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      <span aria-hidden suppressHydrationWarning className="inline-block w-4 h-4">
        {mounted ? (
          theme === "light" ? (
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M14 2v10.2A5.8 5.8 0 1 1 9.2 6.4c1.7 0 3.1.7 4.1 1.6V2h.7z"/></svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="12" r="4.2"/><path d="M12 2v3M12 19v3M4.6 4.6l2.1 2.1M17.3 17.3l2.1 2.1M2 12h3M19 12h3M4.6 19.4l2.1-2.1M17.3 6.7l2.1-2.1"/></svg>
          )
        ) : (
          // SSR placeholder to avoid hydration mismatch
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="12" r="4.2"/></svg>
        )}
      </span>
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}


