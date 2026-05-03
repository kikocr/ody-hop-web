export type AccountType = "tourist" | "operator";

export type BookingStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled";

export type ApplicationStatus = "pending" | "approved" | "rejected";

export interface Profile {
  id: string;
  display_name: string;
  avatar_url: string | null;
  account_type: AccountType;
  country: string | null;
  total_points: number;
  total_badges: number;
  tier: string;
  created_at: string;
}

export interface Guide {
  id: string;
  user_id: string;
  business_name: string;
  bio: string;
  photo_url: string | null;
  rating: number;
  review_count: number;
  is_featured: boolean;
  destinations: string[];
  languages: string[];
  specialties: string[];
  created_at: string;
}

export interface GuideBadge {
  id: string;
  guide_id: string;
  badge_id: string;
  destination_id: string;
  offer_title: string;
  offer_description: string;
  price: number;
  currency: string;
  promo_text: string | null;
  is_active: boolean;
}

export interface Booking {
  id: string;
  tourist_id: string;
  guide_id: string;
  badge_id: string;
  destination_id: string;
  status: BookingStatus;
  date: string;
  party_size: number;
  total_price: number;
  commission: number;
  tourist_name: string;
  message: string | null;
  created_at: string;
}

export interface Review {
  id: string;
  tourist_id: string;
  guide_id: string;
  badge_id: string;
  rating: number;
  comment: string;
  tourist_name: string;
  created_at: string;
}

export interface OperatorApplication {
  id: string;
  business_name: string;
  contact_name: string;
  email: string;
  phone: string;
  destinations: string[];
  specialties: string[];
  years_experience: number;
  website: string | null;
  social_links: Record<string, string>;
  photo_urls: string[];
  status: ApplicationStatus;
  created_at: string;
}
