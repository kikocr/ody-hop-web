import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ody Hop — Travel like you know someone here",
  description:
    "Ody Hop is a gamified tourism platform — go to real places, collect GPS-verified badges, climb the leaderboard, and book vetted locals.",
  metadataBase: new URL("https://odyhop.com"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
