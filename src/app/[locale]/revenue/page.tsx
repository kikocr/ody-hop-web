import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  await params;
  return {
    title: "Revenue Projections | Ody Hop",
    description:
      "Internal revenue forecasting calculator for Ody Hop / Pura Vida Quest.",
    robots: { index: false, follow: false, nocache: true },
    alternates: { canonical: "/revenue" },
  };
}

export default async function RevenuePage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <iframe
      src="/revenue.html"
      title="Ody Hop revenue forecaster"
      className="block h-screen w-full border-0 bg-white"
    />
  );
}
