import type { Metadata } from "next";
import { Josefin_Sans, Inter } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

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
  title: "Ody Hop — Collect the World",
  description:
    "Ody Hop is a gamified tourism platform — explore real destinations, collect badges, climb the leaderboard, and book vetted local guides.",
  metadataBase: new URL("https://odyhop.com"),
  openGraph: {
    title: "Ody Hop — Collect the World",
    description:
      "Explore real destinations, collect badges, climb the leaderboard, and book vetted local guides.",
    type: "website",
    siteName: "Ody Hop",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ody Hop — Collect the World",
    description:
      "Explore real destinations, collect badges, climb the leaderboard, and book vetted local guides.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${josefin.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-screen flex flex-col bg-ocean text-white font-body">
        <Header />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
