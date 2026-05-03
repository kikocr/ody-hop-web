export const DESTINATIONS = [
  {
    id: "costa-rica",
    slug: "costa-rica",
    brandName: "Pura Vida Quest",
    country: "Costa Rica",
    flag: "🇨🇷",
    badgeCount: 103,
    tagline: "Explore the wild beauty of Costa Rica",
    heroImage: "/assets/heroes/hero-costa-rica.jpg",
    accent: "#1F8A70",
  },
  {
    id: "iceland",
    slug: "iceland",
    brandName: "Fire & Ice",
    country: "Iceland",
    flag: "🇮🇸",
    badgeCount: 100,
    tagline: "Discover the land of fire and ice",
    heroImage: "/assets/heroes/hero-iceland.jpg",
    accent: "#4DA8DA",
  },
  {
    id: "peru",
    slug: "peru",
    brandName: "Inca Quest",
    country: "Peru",
    flag: "🇵🇪",
    badgeCount: 80,
    tagline: "Walk in the footsteps of the Inca",
    heroImage: "/assets/heroes/hero-peru.jpg",
    accent: "#C65D3B",
  },
  {
    id: "thailand",
    slug: "thailand",
    brandName: "Sanuk Quest",
    country: "Thailand",
    flag: "🇹🇭",
    badgeCount: 100,
    tagline: "Find your sanuk in the Land of Smiles",
    heroImage: "/assets/heroes/hero-thailand.jpg",
    accent: "#D4A017",
  },
  {
    id: "saudi-arabia",
    slug: "saudi-arabia",
    brandName: "Yalla Arabia",
    country: "Saudi Arabia",
    flag: "🇸🇦",
    badgeCount: 75,
    tagline: "Discover the treasures of Arabia",
    heroImage: "/assets/heroes/hero-saudi-arabia.jpg",
    accent: "#006C35",
  },
  {
    id: "alaska",
    slug: "alaska",
    brandName: "Last Frontier",
    country: "Alaska",
    flag: "🇺🇸",
    badgeCount: 92,
    tagline: "Explore America's last wild frontier",
    heroImage: "/assets/heroes/hero-alaska.jpg",
    accent: "#003F87",
  },
] as const;

export type Destination = (typeof DESTINATIONS)[number];
export type DestinationSlug = Destination["slug"];

export const CATEGORIES = [
  {
    id: "nature",
    name: "Nature",
    icon: "/assets/categories/cat-nature.png",
    premium: false,
  },
  {
    id: "wildlife",
    name: "Wildlife",
    icon: "/assets/categories/cat-wildlife.png",
    premium: false,
  },
  {
    id: "beaches",
    name: "Beaches",
    icon: "/assets/categories/cat-beaches.png",
    premium: false,
  },
  {
    id: "adventure",
    name: "Adventure",
    icon: "/assets/categories/cat-adventure.png",
    premium: false,
  },
  {
    id: "food",
    name: "Food",
    icon: "/assets/categories/cat-food.png",
    premium: false,
  },
  {
    id: "culture",
    name: "Culture",
    icon: "/assets/categories/cat-culture.png",
    premium: false,
  },
  {
    id: "explorer",
    name: "Explorer Challenges",
    icon: "/assets/categories/cat-explorer.png",
    premium: false,
  },
  {
    id: "premium",
    name: "Secret Badges",
    icon: "/assets/categories/cat-premium.png",
    premium: true,
  },
] as const;

export type Category = (typeof CATEGORIES)[number];
export type CategoryId = Category["id"];

export const OTTER_TIERS = [
  {
    id: "explorer",
    label: "Explorer",
    minBadges: 0,
    maxBadges: 9,
    image: "/assets/branding/ody-explorer.png",
    description: "Just starting out — simple vest and a compass pendant.",
  },
  {
    id: "seasoned",
    label: "Seasoned Explorer",
    minBadges: 10,
    maxBadges: 24,
    image: "/assets/branding/ody-seasoned.png",
    description: "Picking up gear and adventure patches along the way.",
  },
  {
    id: "expert",
    label: "Expert Explorer",
    minBadges: 25,
    maxBadges: 49,
    image: "/assets/branding/ody-expert.png",
    description: "Blue expedition parka, binoculars, ready for harder routes.",
  },
  {
    id: "master",
    label: "Master Explorer",
    minBadges: 50,
    maxBadges: 74,
    image: "/assets/branding/ody-master.png",
    description: "Full expedition coat with tools — a serious traveler.",
  },
  {
    id: "legendary",
    label: "Legendary Explorer",
    minBadges: 75,
    maxBadges: null,
    image: "/assets/branding/ody-legendary.png",
    description: "Crown-level kit. Ropes, maps, the full loadout.",
  },
] as const;

export type OtterTier = (typeof OTTER_TIERS)[number];

export const RARITY_FRAMES = [
  {
    id: "common",
    label: "Common",
    image: "/assets/frames/frame-common.png",
  },
  {
    id: "rare",
    label: "Rare",
    image: "/assets/frames/frame-rare.png",
  },
  {
    id: "epic",
    label: "Epic",
    image: "/assets/frames/frame-epic.png",
  },
  {
    id: "legendary",
    label: "Legendary",
    image: "/assets/frames/frame-legendary.png",
  },
] as const;

export type Rarity = (typeof RARITY_FRAMES)[number]["id"];

export const APP_STORE_URL =
  process.env.NEXT_PUBLIC_APP_STORE_URL ??
  "https://apps.apple.com/app/ody-hop/id_placeholder";

export const PLAY_STORE_URL =
  process.env.NEXT_PUBLIC_PLAY_STORE_URL ??
  "https://play.google.com/store/apps/details?id=com.odyhop";
