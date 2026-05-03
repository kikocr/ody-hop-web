import { setRequestLocale, getTranslations } from "next-intl/server";

type PageProps = { params: Promise<{ locale: string }> };

export default async function DashboardHomePage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("dashboard");

  return (
    <section>
      <h1 className="font-display text-3xl font-bold text-white sm:text-4xl">
        {t("home")}
      </h1>
      <p className="mt-12 font-body text-sm text-warmgray">Coming soon.</p>
    </section>
  );
}
