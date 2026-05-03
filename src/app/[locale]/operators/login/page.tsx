import { setRequestLocale, getTranslations } from "next-intl/server";

type PageProps = { params: Promise<{ locale: string }> };

export default async function OperatorLoginPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("common");

  return (
    <section className="mx-auto w-full max-w-md px-4 py-20 sm:px-6 lg:px-8">
      <h1 className="font-display text-4xl font-bold text-white">
        {t("logIn")}
      </h1>
      <p className="mt-12 font-body text-sm text-warmgray">Coming soon.</p>
    </section>
  );
}
