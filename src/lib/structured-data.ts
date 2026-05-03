import type { Destination } from "@/lib/constants";

const SITE = "https://odyhop.com";

export function organizationSchema(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Ody Hop",
    alternateName: "Ody Hop — Collect the World",
    url: SITE,
    logo: `${SITE}/assets/icon.png`,
    description:
      "Ody Hop is a gamified tourism platform — explore real destinations, collect GPS-verified badges, climb the leaderboard, and book vetted local guides.",
    sameAs: [
      "https://instagram.com/odyhop",
      "https://twitter.com/odyhop",
      "https://www.tiktok.com/@odyhop",
    ],
  };
}

export function websiteSchema(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Ody Hop",
    url: SITE,
    inLanguage: ["en", "es"],
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE}/destinations`,
      "query-input": "required name=destination",
    },
  };
}

export function touristDestinationSchema(
  destination: Destination
): Record<string, unknown> {
  const url = `${SITE}/destinations/${destination.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    name: `${destination.brandName} — ${destination.country}`,
    description: destination.tagline,
    url,
    image: `${SITE}${destination.heroImage}`,
    touristType: ["Adventure traveler", "Cultural traveler", "Explorer"],
    address: {
      "@type": "PostalAddress",
      addressCountry: destination.country,
    },
  };
}

export function placeSchema(destination: Destination): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Place",
    name: destination.country,
    image: `${SITE}${destination.heroImage}`,
    description: destination.tagline,
  };
}

export function breadcrumbSchema(
  items: Array<{ name: string; path: string }>
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE}${item.path}`,
    })),
  };
}
