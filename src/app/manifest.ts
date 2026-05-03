import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Ody Hop",
    short_name: "Ody Hop",
    description:
      "Collect badges across real destinations, climb the leaderboard, and book vetted local guides.",
    start_url: "/",
    display: "standalone",
    background_color: "#0B1F3A",
    theme_color: "#0B1F3A",
    orientation: "portrait",
    icons: [
      {
        src: "/assets/icon.png",
        sizes: "any",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/assets/adaptive-icon.png",
        sizes: "any",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
