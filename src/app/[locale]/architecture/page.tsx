import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  await params;
  return {
    title: "System Architecture | Ody Hop",
    description:
      "Internal system architecture and user flow documentation for Ody Hop.",
    robots: { index: false, follow: false, nocache: true },
    alternates: { canonical: "/architecture" },
  };
}

export default async function ArchitecturePage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <iframe
      src="/architecture.html"
      title="Ody Hop system architecture and flows"
      className="block h-screen w-full border-0 bg-ocean"
    />
  );
}
