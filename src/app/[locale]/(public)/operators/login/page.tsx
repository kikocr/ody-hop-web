import { Suspense } from "react";
import { setRequestLocale } from "next-intl/server";
import { OperatorLoginForm } from "@/components/operators/OperatorLoginForm";

type PageProps = { params: Promise<{ locale: string }> };

export default async function OperatorLoginPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <Suspense>
      <OperatorLoginForm />
    </Suspense>
  );
}
