import type { MetadataRoute } from "next";

const SITE = "https://odyhop.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/operators/dashboard/",
          "/api/",
          "/pitch",
          "/es/pitch",
          "/architecture",
          "/es/architecture",
          "/architecture.html",
        ],
      },
    ],
    sitemap: `${SITE}/sitemap.xml`,
    host: SITE,
  };
}
