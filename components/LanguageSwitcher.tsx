"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { locales } from "@/i18n/config";
import Image from "next/image";

function replaceLocaleInPath(pathname: string, nextLocale: string): string {
	const parts = pathname.split("/").filter(Boolean);
	if (parts.length === 0) return `/${nextLocale}`;
  if (locales.includes(parts[0] as typeof locales[number])) {
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
				<Image src="/flags/gb.svg" alt="English" width={16} height={16} className="rounded-full" />
			</Link>
			<Link
				href={replaceLocaleInPath(pathname, "fa")}
				className="inline-flex items-center justify-center w-6 h-6 rounded-full border border-foreground/20 hover:bg-foreground/5"
				aria-label="فارسی"
				prefetch={false}
			>
				<Image src="/flags/ir.svg" alt="فارسی" width={16} height={16} className="rounded-full" />
			</Link>
			<Link
				href={replaceLocaleInPath(pathname, "no")}
				className="inline-flex items-center justify-center w-6 h-6 rounded-full border border-foreground/20 hover:bg-foreground/5"
				aria-label="Norsk"
				prefetch={false}
			>
				<Image src="/flags/no.svg" alt="Norsk" width={16} height={16} className="rounded-full" />
			</Link>
		</div>
	);
}


