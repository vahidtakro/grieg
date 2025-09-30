import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getLocale } from "next-intl/server";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import RightBackdropSlider from "@/components/RightBackdropSlider";
import PageFade from "@/components/PageFade";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const playfair = Playfair_Display({ variable: "--font-display", subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Edvard Grieg — Composer",
	description:
		"A minimal website dedicated to the life and works of Norwegian composer Edvard Grieg.",
	icons: { icon: "/favicon.svg" },
};

export default async function LocaleLayout({ children }: { children: React.ReactNode }) {
    const locale = await getLocale();
    const messages = await getMessages();
    const isRTL = locale === "fa";
    return (
        <NextIntlClientProvider messages={messages} locale={locale}>
            <div lang={locale} dir={isRTL ? "rtl" : "ltr"} className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} antialiased h-dvh overflow-hidden md:grid md:grid-cols-[260px_1fr]`}>
                <Sidebar />

                <div className="relative h-dvh flex flex-col overflow-y-auto">
                    <div className="md:hidden sticky top-0 z-20 flex items-center justify-between px-5 py-3 border-b border-foreground/10 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                        <Link href={`/${locale}`} className="text-lg font-semibold" style={{ fontFamily: "var(--font-display)" }}>Edvard Grieg</Link>
                        <div className="flex items-center gap-2">
                            <LanguageSwitcher />
                            <ThemeToggle />
                        </div>
                    </div>

                    <div aria-hidden className="pointer-events-none">
                        <div className="notes-anim fixed top-0 left-[260px] w-[calc(100vw-260px)] h-dvh opacity-[0.06]" style={{ backgroundImage: "url(/notes-sheet.svg)", backgroundRepeat: "repeat", backgroundSize: "480px 360px" }} />
                        <RightBackdropSlider />
                    </div>

                    <div className="relative justify-self-start ml-0 w-full max-w-6xl border-r border-foreground/10 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                        <main className="min-h-[calc(100dvh-56px)] md:min-h-[100dvh] px-6 md:px-10 py-10">
                            <PageFade>{children}</PageFade>
                        </main>
                        <footer className="px-6 md:px-10 py-8 text-xs text-foreground/70 border-t border-foreground/10">
                            © {new Date().getFullYear()} Edvard Grieg. Unofficial site.
                        </footer>
                    </div>
                </div>
            </div>
        </NextIntlClientProvider>
    );
}


