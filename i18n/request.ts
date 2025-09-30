import { getRequestConfig } from "next-intl/server";
import { defaultLocale, locales } from "./config";

export default getRequestConfig(async ({ requestLocale }) => {
	let locale = await requestLocale;
	if (!locale || !locales.includes(locale as any)) {
		locale = defaultLocale;
	}

	try {
		const messages = (await import(`./messages/${locale}.json`)).default;
		return { locale, messages };
	} catch (error) {
		const messages = (await import(`./messages/${defaultLocale}.json`)).default;
		return { locale: defaultLocale, messages };
	}
});


