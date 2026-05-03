import type { MetadataRoute } from "next";
import { DESTINATIONS } from "@/lib/constants";

const SITE = "https://odyhop.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE, lastModified, changeFrequency: "weekly", priority: 1.0 },
    {
      url: `${SITE}/destinations`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE}/operators`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE}/operators/apply`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE}/download`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE}/about`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${SITE}/privacy`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE}/terms`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  const destinationPages: MetadataRoute.Sitemap = DESTINATIONS.map((d) => ({
    url: `${SITE}/destinations/${d.slug}`,
    lastModified,
    changeFrequency: "weekly",
    priority: 0.8,
    alternates: {
      languages: {
        en: `${SITE}/destinations/${d.slug}`,
        es: `${SITE}/es/destinations/${d.slug}`,
      },
    },
  }));

  return [...staticPages, ...destinationPages];
}
