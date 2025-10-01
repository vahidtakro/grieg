"use client";

import { useEffect, useState } from "react";

// Return a stable SSR value to avoid hydration mismatches.
function getInitialTheme(): "light" | "dark" {
  return "light";
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">(getInitialTheme());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    root.dataset.theme = theme;
    window.localStorage.setItem("theme-preference", theme);
  }, [theme, mounted]);

  useEffect(() => {
    setMounted(true);
    // After mount, resolve the real preferred theme (storage or media) and apply it.
    try {
      const saved = window.localStorage.getItem("theme-preference");
      if (saved === "light" || saved === "dark") {
        if (saved !== theme) setTheme(saved);
        return;
      }
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const resolved = prefersDark ? "dark" : "light";
      if (resolved !== theme) setTheme(resolved);
    } catch {
      // ignore
    }
    // We intentionally run this only once on mount to set initial theme.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      className="relative w-6 h-6 rounded-full overflow-hidden border border-foreground/20 hover:bg-foreground/5 grid place-items-center"
      aria-label="Toggle theme"
      aria-pressed={isDark}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {mounted ? (
        isDark ? (
          // Moon icon
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden>
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        ) : (
          // Sun icon
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
            <circle cx="12" cy="12" r="3.5"/>
            <path d="M12 2v3M12 19v3M4.6 4.6l2.1 2.1M17.3 17.3l2.1 2.1M2 12h3M19 12h3M4.6 19.4l2.1-2.1M17.3 6.7l2.1-2.1"/>
          </svg>
        )
      ) : (
        // Placeholder dot while mounting
        <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor" aria-hidden><circle cx="12" cy="12" r="3"/></svg>
      )}
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}


