import type { BookingStatus } from "@/lib/types";

export type DashboardBooking = {
  id: string;
  tourist_name: string;
  badge_name: string;
  date: string;
  status: BookingStatus;
  total_price: number;
  currency: string;
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
  {
    id: "mock-b1",
    tourist_name: "María Quispe",
    badge_name: "Arenal Volcano Hike",
    date: "2026-05-14",
    status: "confirmed",
    total_price: 420,
    currency: "USD",
  },
  {
    id: "mock-b2",
    tourist_name: "James Carter",
    badge_name: "Manuel Antonio Wildlife",
    date: "2026-05-16",
    status: "pending",
    total_price: 160,
    currency: "USD",
  },
  {
    id: "mock-b3",
    tourist_name: "Sofía López",
    badge_name: "Pacuare River Rafting",
    date: "2026-05-18",
    status: "confirmed",
    total_price: 540,
    currency: "USD",
  },
  {
    id: "mock-b4",
    tourist_name: "Erik Olafsson",
    badge_name: "Monteverde Cloud Forest",
    date: "2026-04-30",
    status: "completed",
    total_price: 330,
    currency: "USD",
  },
  {
    id: "mock-b5",
    tourist_name: "Aiko Tanaka",
    badge_name: "Pacific Sunset",
    date: "2026-04-22",
    status: "completed",
    total_price: 100,
    currency: "USD",
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
