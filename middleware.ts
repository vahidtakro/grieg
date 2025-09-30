import createMiddleware from "next-intl/middleware";

export default createMiddleware({
	locales: ["en", "fa", "no"],
	defaultLocale: "en",
	localePrefix: "always",
});

export const config = {
	matcher: ["/((?!api|_next|.*\\..*).*)"],
};


