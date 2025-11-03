import type { MetadataRoute } from "next";
import { siteConfig } from "@/src/config/site";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = siteConfig.baseUrl;
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/$",
        "/&",
        "/*$",
        "/*&",
        "/_next/static/",
        "/favicon.ico",
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}


