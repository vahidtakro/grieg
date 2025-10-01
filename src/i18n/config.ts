export const locales = ["en", "fa", "no"] as const;
export type AppLocale = typeof locales[number];
export const defaultLocale: AppLocale = "en";


