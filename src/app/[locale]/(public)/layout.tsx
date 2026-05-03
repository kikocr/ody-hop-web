import { type ReactNode } from "react";
import { setRequestLocale } from "next-intl/server";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function PublicLayout({ children, params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <Header />
      <main className="flex-1 flex flex-col">{children}</main>
      <Footer />
    </>
  );
}
