import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ody Hop — Collect the World",
  description:
    "Ody Hop is a gamified tourism platform — explore real destinations, collect badges, climb the leaderboard, and book vetted local guides.",
  metadataBase: new URL("https://odyhop.com"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
