import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import { getLocale } from "next-intl/server";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Edvard Grieg — Composer",
  description:
    "A minimal website dedicated to the life and works of Norwegian composer Edvard Grieg.",
  metadataBase: new URL("https://example.com"),
  icons: { icon: "/favicon.svg" },
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const locale = await getLocale();
  const isRTL = locale === "fa";
  return (
    <html suppressHydrationWarning lang={locale} dir={isRTL ? "rtl" : "ltr"}>
      <head>
        {/* Apply saved theme before paint to avoid flashes and preserve preference */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(() => { try { const saved = localStorage.getItem('theme-preference'); const theme = (saved === 'light' || saved === 'dark') ? saved : (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'); document.documentElement.dataset.theme = theme; } catch (_) {} })();`,
          }}
        />
      </head>
      <body suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} antialiased`}>{children}</body>
    </html>
  );
}
