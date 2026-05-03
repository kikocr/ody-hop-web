import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { DESTINATIONS } from "@/lib/constants";

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export function generateStaticParams() {
  return DESTINATIONS.map((d) => ({ slug: d.slug }));
}

export default async function DestinationPage({ params }: PageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const destination = DESTINATIONS.find((d) => d.slug === slug);
  if (!destination) notFound();

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
      <span className="font-body text-sm font-semibold uppercase tracking-[0.18em] text-amber">
        {destination.flag} {destination.country}
      </span>
      <h1 className="mt-2 font-display text-4xl font-bold text-white sm:text-5xl">
        {destination.brandName}
      </h1>
      <p className="mt-4 font-body text-lg text-warmgray">
        {destination.tagline}
      </p>
      <p className="mt-2 font-body text-sm text-warmgray">
        {destination.badgeCount} badges to collect
      </p>
      <p className="mt-12 font-body text-sm text-warmgray">Coming soon.</p>
    </section>
  );
}
