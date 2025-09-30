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
    const root = document.documentElement;
    root.dataset.theme = theme;
    window.localStorage.setItem("theme-preference", theme);
  }, [theme]);

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
    } catch (_) {
      // ignore
    }
  }, []);

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      className="relative inline-flex items-center w-12 h-6 rounded-full border border-foreground/20 hover:bg-foreground/5 transition-colors"
      aria-label="Toggle theme"
      aria-pressed={isDark}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {/* Track icons (for context) */}
      <span aria-hidden className="absolute left-1 top-1 w-4 h-4 opacity-70 text-foreground/70">
        {mounted ? (
          // Sun icon (light)
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6">
            <circle cx="12" cy="12" r="3.5"/>
            <path d="M12 2v3M12 19v3M4.6 4.6l2.1 2.1M17.3 17.3l2.1 2.1M2 12h3M19 12h3M4.6 19.4l2.1-2.1M17.3 6.7l2.1-2.1"/>
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="12" r="3.5"/></svg>
        )}
      </span>
      <span aria-hidden className="absolute right-1 top-1 w-4 h-4 opacity-70 text-foreground/70">
        {mounted ? (
          // Eighth note (music) for dark
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M16 3v11.2a3.8 3.8 0 1 1-1.6-3.1V7.2l-6 1.5v6.5a3.8 3.8 0 1 1-1.6-3.1V6.4L16 3z"/>
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><circle cx="12" cy="12" r="2"/></svg>
        )}
      </span>

      {/* Thumb */}
      <span
        aria-hidden
        className={
          "absolute top-[2px] w-5 h-5 rounded-full bg-foreground/90 text-background grid place-items-center transition-transform " +
          (isDark ? "translate-x-[22px]" : "translate-x-[2px]")
        }
      >
        {mounted ? (
          isDark ? (
            // Music note inside the knob in dark
            <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor">
              <path d="M16 3v11.2a3.8 3.8 0 1 1-1.6-3.1V7.2l-6 1.5v6.5a3.8 3.8 0 1 1-1.6-3.1V6.4L16 3z"/>
            </svg>
          ) : (
            // Sun inside the knob in light
            <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3.5"/>
              <path d="M12 2v3M12 19v3M4.6 4.6l2.1 2.1M17.3 17.3l2.1 2.1M2 12h3M19 12h3M4.6 19.4l2.1-2.1M17.3 6.7l2.1-2.1"/>
            </svg>
          )
        ) : (
          <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor"><circle cx="12" cy="12" r="3"/></svg>
        )}
      </span>

      <span className="sr-only">Toggle theme</span>
    </button>
  );
}


