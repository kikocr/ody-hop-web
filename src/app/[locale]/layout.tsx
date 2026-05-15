import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Josefin_Sans, Inter } from "next/font/google";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { routing } from "@/i18n/routing";
import "../globals.css";

const josefin = Josefin_Sans({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-josefin",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ody Hop — Travel like you know someone here",
  description:
    "Ody Hop is a gamified tourism platform — go to real places, collect GPS-verified badges, climb the leaderboard, and book vetted locals.",
  metadataBase: new URL("https://odyhop.com"),
  openGraph: {
    title: "Ody Hop — Travel like you know someone here",
    description:
      "Go to real places, collect GPS-verified badges, climb the leaderboard, and book vetted locals.",
    type: "website",
    siteName: "Ody Hop",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ody Hop — Travel like you know someone here",
    description:
      "Go to real places, collect GPS-verified badges, climb the leaderboard, and book vetted locals.",
  },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  return (
    <html
      lang={locale}
      className={`${josefin.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-screen flex flex-col bg-ocean text-white font-body">
        <NextIntlClientProvider>
          <AuthProvider>{children}</AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
