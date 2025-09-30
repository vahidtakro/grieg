"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { locales } from "@/i18n/config";

function replaceLocaleInPath(pathname: string, nextLocale: string): string {
	const parts = pathname.split("/").filter(Boolean);
	if (parts.length === 0) return `/${nextLocale}`;
	if (locales.includes(parts[0] as any)) {
		parts[0] = nextLocale;
		return "/" + parts.join("/");
	}
	return `/${nextLocale}/` + parts.join("/");
}

export default function LanguageSwitcher() {
	const pathname = usePathname() || "/en";
	return (
		<div className="inline-flex items-center gap-1">
			<Link
				href={replaceLocaleInPath(pathname, "en")}
				className="inline-flex items-center justify-center w-6 h-6 rounded-full border border-foreground/20 hover:bg-foreground/5"
				aria-label="English"
				prefetch={false}
			>
				<span className="fi fi-gb fis rounded-full w-4 h-4" />
			</Link>
			<Link
				href={replaceLocaleInPath(pathname, "fa")}
				className="inline-flex items-center justify-center w-6 h-6 rounded-full border border-foreground/20 hover:bg-foreground/5"
				aria-label="فارسی"
				prefetch={false}
			>
				<span className="fi fi-ir fis rounded-full w-4 h-4" />
			</Link>
			<Link
				href={replaceLocaleInPath(pathname, "no")}
				className="inline-flex items-center justify-center w-6 h-6 rounded-full border border-foreground/20 hover:bg-foreground/5"
				aria-label="Norsk"
				prefetch={false}
			>
				<span className="fi fi-no fis rounded-full w-4 h-4" />
			</Link>
		</div>
	);
}


