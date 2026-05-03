import { setRequestLocale } from "next-intl/server";
import { OperatorApplicationForm } from "@/components/operators/apply/OperatorApplicationForm";

type PageProps = { params: Promise<{ locale: string }> };

export default async function OperatorApplyPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <OperatorApplicationForm />;
}
