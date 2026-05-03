import type { BookingStatus } from "@/lib/types";
import type { DestinationSlug } from "@/lib/constants";

export type DashboardBooking = {
  id: string;
  tourist_name: string;
  badge_name: string;
  badge_id: string;
  destination_id: DestinationSlug;
  destination_brand: string;
  date: string;
  party_size: number;
  status: BookingStatus;
  total_price: number;
  commission: number;
  currency: string;
  message: string | null;
  created_at: string;
};

export type DashboardReview = {
  id: string;
  tourist_name: string;
  badge_name: string;
  rating: number;
  comment: string;
  created_at: string;
};

export type DashboardStats = {
  totalBookings: number;
  totalBookingsTrend: number;
  revenue: number;
  revenueTrend: number;
  avgRating: number;
  reviewCount: number;
  profileViews: number;
  profileViewsTrend: number;
};

export type DashboardGuide = {
  id: string;
  business_name: string;
};

export const MOCK_GUIDE: DashboardGuide = {
  id: "mock-guide-1",
  business_name: "Pura Vida Tours",
};

export const MOCK_BOOKINGS: DashboardBooking[] = [
  // Pending
  {
    id: "mock-b1",
    tourist_name: "James Carter",
    badge_name: "Manuel Antonio Wildlife",
    badge_id: "cr-manuel-antonio",
    destination_id: "costa-rica",
    destination_brand: "Pura Vida Quest",
    date: "2026-05-16",
    party_size: 2,
    status: "pending",
    total_price: 160,
    commission: 24,
    currency: "USD",
    message: "We're celebrating our anniversary, would love an early start to catch the wildlife.",
    created_at: "2026-05-02",
  },
  {
    id: "mock-b6",
    tourist_name: "Lukas Schäfer",
    badge_name: "Monteverde Cloud Forest",
    badge_id: "cr-monteverde",
    destination_id: "costa-rica",
    destination_brand: "Pura Vida Quest",
    date: "2026-05-19",
    party_size: 4,
    status: "pending",
    total_price: 260,
    commission: 39,
    currency: "USD",
    message: null,
    created_at: "2026-05-02",
  },
  {
    id: "mock-b7",
    tourist_name: "Kenji Yamamoto",
    badge_name: "Pacific Sunset",
    badge_id: "cr-pacific-sunset",
    destination_id: "costa-rica",
    destination_brand: "Pura Vida Quest",
    date: "2026-05-21",
    party_size: 6,
    status: "pending",
    total_price: 510,
    commission: 76.5,
    currency: "USD",
    message: "One of us is vegetarian.",
    created_at: "2026-05-01",
  },

  // Confirmed
  {
    id: "mock-b3",
    tourist_name: "Sofía López",
    badge_name: "Pacuare River Rafting",
    badge_id: "cr-pacuare",
    destination_id: "costa-rica",
    destination_brand: "Pura Vida Quest",
    date: "2026-05-18",
    party_size: 6,
    status: "confirmed",
    total_price: 540,
    commission: 81,
    currency: "USD",
    message: null,
    created_at: "2026-04-28",
  },
  {
    id: "mock-b8",
    tourist_name: "Priya Kapoor",
    badge_name: "Arenal Volcano Hike",
    badge_id: "cr-arenal",
    destination_id: "costa-rica",
    destination_brand: "Pura Vida Quest",
    date: "2026-05-22",
    party_size: 3,
    status: "confirmed",
    total_price: 360,
    commission: 54,
    currency: "USD",
    message: "Pickup from Tabacón, please.",
    created_at: "2026-04-26",
  },
  {
    id: "mock-b9",
    tourist_name: "Marco Rossi",
    badge_name: "Monteverde Cloud Forest",
    badge_id: "cr-monteverde",
    destination_id: "costa-rica",
    destination_brand: "Pura Vida Quest",
    date: "2026-05-25",
    party_size: 2,
    status: "confirmed",
    total_price: 130,
    commission: 19.5,
    currency: "USD",
    message: null,
    created_at: "2026-04-25",
  },

  // Completed
  {
    id: "mock-b4",
    tourist_name: "Erik Olafsson",
    badge_name: "Monteverde Cloud Forest",
    badge_id: "cr-monteverde",
    destination_id: "costa-rica",
    destination_brand: "Pura Vida Quest",
    date: "2026-04-30",
    party_size: 3,
    status: "completed",
    total_price: 330,
    commission: 49.5,
    currency: "USD",
    message: null,
    created_at: "2026-04-15",
  },
  {
    id: "mock-b5",
    tourist_name: "Aiko Tanaka",
    badge_name: "Pacific Sunset",
    badge_id: "cr-pacific-sunset",
    destination_id: "costa-rica",
    destination_brand: "Pura Vida Quest",
    date: "2026-04-22",
    party_size: 2,
    status: "completed",
    total_price: 100,
    commission: 15,
    currency: "USD",
    message: null,
    created_at: "2026-04-08",
  },
  {
    id: "mock-b10",
    tourist_name: "Hannah Becker",
    badge_name: "Arenal Volcano Hike",
    badge_id: "cr-arenal",
    destination_id: "costa-rica",
    destination_brand: "Pura Vida Quest",
    date: "2026-04-15",
    party_size: 4,
    status: "completed",
    total_price: 480,
    commission: 72,
    currency: "USD",
    message: null,
    created_at: "2026-04-01",
  },
  {
    id: "mock-b11",
    tourist_name: "Daniela Ruiz",
    badge_name: "Sloth Spotter",
    badge_id: "cr-sloth",
    destination_id: "costa-rica",
    destination_brand: "Pura Vida Quest",
    date: "2026-04-12",
    party_size: 2,
    status: "completed",
    total_price: 70,
    commission: 10.5,
    currency: "USD",
    message: null,
    created_at: "2026-03-30",
  },

  // Cancelled
  {
    id: "mock-b12",
    tourist_name: "Olivia Brown",
    badge_name: "Pacuare River Rafting",
    badge_id: "cr-pacuare",
    destination_id: "costa-rica",
    destination_brand: "Pura Vida Quest",
    date: "2026-05-10",
    party_size: 5,
    status: "cancelled",
    total_price: 450,
    commission: 67.5,
    currency: "USD",
    message: "Cancelled — flight delay, can't make the date.",
    created_at: "2026-04-20",
  },
  {
    id: "mock-b13",
    tourist_name: "Mateo Álvarez",
    badge_name: "Tico Ceviche Tasting",
    badge_id: "cr-ceviche",
    destination_id: "costa-rica",
    destination_brand: "Pura Vida Quest",
    date: "2026-05-05",
    party_size: 1,
    status: "cancelled",
    total_price: 35,
    commission: 5.25,
    currency: "USD",
    message: null,
    created_at: "2026-04-18",
  },
];

export const MOCK_REVIEWS: DashboardReview[] = [
  {
    id: "mock-r1",
    tourist_name: "Erik Olafsson",
    badge_name: "Monteverde Cloud Forest",
    rating: 5,
    comment:
      "Carlos was an incredible guide — knew every bird call, spotted a sloth we'd have walked right past, and made sure we caught the canopy at the right moment.",
    created_at: "2026-04-30",
  },
  {
    id: "mock-r2",
    tourist_name: "Aiko Tanaka",
    badge_name: "Pacific Sunset",
    rating: 5,
    comment:
      "Beautiful evening, well planned. Felt like we were taken in by family, not booked through a service.",
    created_at: "2026-04-22",
  },
  {
    id: "mock-r3",
    tourist_name: "Daniela Ruiz",
    badge_name: "Arenal Volcano Hike",
    rating: 4,
    comment:
      "Tough hike but absolutely worth it. The viewpoint at sunrise is something you remember forever.",
    created_at: "2026-04-12",
  },
];

export const MOCK_STATS: DashboardStats = {
  totalBookings: 284,
  totalBookingsTrend: 12,
  revenue: 24600,
  revenueTrend: 18,
  avgRating: 4.9,
  reviewCount: 211,
  profileViews: 8200,
  profileViewsTrend: 24,
};

export type DashboardListing = {
  id: string;
  guide_id: string;
  badge_id: string;
  badge_name: string;
  destination_id: DestinationSlug;
  destination_brand: string;
  offer_title: string;
  offer_description: string;
  price: number;
  currency: string;
  promo_text: string | null;
  is_active: boolean;
  is_featured: boolean;
};

export const MOCK_LISTINGS: DashboardListing[] = [
  {
    id: "mock-l1",
    guide_id: "mock-guide-1",
    badge_id: "cr-arenal",
    badge_name: "Arenal Volcano Hike",
    destination_id: "costa-rica",
    destination_brand: "Pura Vida Quest",
    offer_title: "Guided Volcano Hike with Lunch",
    offer_description:
      "Full-day Arenal Volcano hike with bilingual guide, traditional casado lunch, and a sunset hot springs visit.",
    price: 120,
    currency: "USD",
    promo_text: "Includes transport from La Fortuna",
    is_active: true,
    is_featured: true,
  },
  {
    id: "mock-l2",
    guide_id: "mock-guide-1",
    badge_id: "cr-pacuare",
    badge_name: "Pacuare River Rafting",
    destination_id: "costa-rica",
    destination_brand: "Pura Vida Quest",
    offer_title: "Pacuare Class IV Rafting Day",
    offer_description:
      "Full day on the Pacuare with a certified river guide. Lunch on the river, transport from San José included.",
    price: 165,
    currency: "USD",
    promo_text: null,
    is_active: true,
    is_featured: false,
  },
  {
    id: "mock-l3",
    guide_id: "mock-guide-1",
    badge_id: "cr-monteverde",
    badge_name: "Monteverde Cloud Forest",
    destination_id: "costa-rica",
    destination_brand: "Pura Vida Quest",
    offer_title: "Monteverde Hanging Bridges Walk",
    offer_description:
      "Three-hour guided walk across the Selvatura hanging bridges with naturalist commentary on cloud-forest ecology.",
    price: 65,
    currency: "USD",
    promo_text: "Group discounts for 4+",
    is_active: true,
    is_featured: false,
  },
  {
    id: "mock-l4",
    guide_id: "mock-guide-1",
    badge_id: "cr-sloth",
    badge_name: "Sloth Spotter",
    destination_id: "costa-rica",
    destination_brand: "Pura Vida Quest",
    offer_title: "Sloth-Spotting Walk in Cahuita",
    offer_description:
      "90-minute guided walk in Cahuita National Park with a wildlife biologist. Spotting scope provided.",
    price: 35,
    currency: "USD",
    promo_text: null,
    is_active: false,
    is_featured: false,
  },
  {
    id: "mock-l5",
    guide_id: "mock-guide-1",
    badge_id: "cr-pacific-sunset",
    badge_name: "Pacific Sunset",
    destination_id: "costa-rica",
    destination_brand: "Pura Vida Quest",
    offer_title: "Pacific Sunset Beach Bonfire",
    offer_description:
      "Private beach bonfire with grilled fish, marshmallows, and stargazing. Up to 8 guests.",
    price: 85,
    currency: "USD",
    promo_text: null,
    is_active: true,
    is_featured: false,
  },
];
