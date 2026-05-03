import type { Metadata } from "next";

const DEFAULT_OG_IMAGE = "/assets/splash.png";
const SITE_NAME = "Ody Hop";

type LocaleKey = "en" | "es";

const OG_LOCALE: Record<LocaleKey, string> = {
  en: "en_US",
  es: "es_419",
};

export type PageMetadataInput = {
  /** Title without the brand suffix; we append " | Ody Hop". */
  title: string;
  description: string;
  /** Path with leading slash, no locale prefix (e.g. "/destinations"). */
  path: string;
  locale: string;
  /** Absolute or root-relative path to the OG image. */
  image?: string;
  /** When true, search engines should not index this page. */
  noindex?: boolean;
};

export function buildPageMetadata({
  title,
  description,
  path,
  locale,
  image = DEFAULT_OG_IMAGE,
  noindex = false,
}: PageMetadataInput): Metadata {
  const safeLocale: LocaleKey = locale === "es" ? "es" : "en";
  const fullTitle = `${title} | ${SITE_NAME}`;
  const localePath = (l: LocaleKey) =>
    l === "en" ? path : `/es${path === "/" ? "" : path}`;
  const canonical = localePath(safeLocale);

  return {
    title: fullTitle,
    description,
    alternates: {
      canonical,
      languages: {
        en: localePath("en"),
        es: localePath("es"),
        "x-default": localePath("en"),
      },
    },
    openGraph: {
      title: fullTitle,
      description,
      url: canonical,
      type: "website",
      siteName: SITE_NAME,
      locale: OG_LOCALE[safeLocale],
      images: [{ url: image, width: 1200, height: 630, alt: fullTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image],
    },
    robots: noindex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}
