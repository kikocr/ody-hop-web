import { setRequestLocale } from "next-intl/server";
import { BookingsManager } from "@/components/operators/dashboard/bookings/BookingsManager";
import { createClient } from "@/lib/supabase/server";
import { DESTINATIONS, type DestinationSlug } from "@/lib/constants";
import { MOCK_BOOKINGS, type DashboardBooking } from "@/lib/dashboard-mock";
import type { BookingStatus } from "@/lib/types";

type PageProps = { params: Promise<{ locale: string }> };

type LoadResult = {
  bookings: DashboardBooking[];
  isMock: boolean;
};

export default async function DashboardBookingsPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { bookings, isMock } = await loadBookings();
  return <BookingsManager initial={bookings} isMock={isMock} />;
}

async function loadBookings(): Promise<LoadResult> {
  const fallback: LoadResult = {
    bookings: MOCK_BOOKINGS,
    isMock: true,
  };

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return fallback;

    const { data: guide } = await supabase
      .from("guides")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();
    if (!guide) return fallback;

    const { data: rows } = await supabase
      .from("bookings")
      .select(
        "id, tourist_name, badge_id, destination_id, date, party_size, status, total_price, commission, message, created_at"
      )
      .eq("guide_id", guide.id)
      .order("created_at", { ascending: false });

    const bookings: DashboardBooking[] = (rows ?? []).map(
      (r: {
        id: string;
        tourist_name: string;
        badge_id: string;
        destination_id: string;
        date: string;
        party_size: number;
        status: BookingStatus;
        total_price: number | string;
        commission: number | string;
        message: string | null;
        created_at: string;
      }) => {
        const dest = DESTINATIONS.find((d) => d.slug === r.destination_id);
        return {
          id: r.id,
          tourist_name: r.tourist_name ?? "—",
          badge_name: r.badge_id,
          badge_id: r.badge_id,
          destination_id: (dest?.slug ?? r.destination_id) as DestinationSlug,
          destination_brand: dest?.brandName ?? r.destination_id,
          date: r.date,
          party_size: Number(r.party_size ?? 1),
          status: r.status,
          total_price: Number(r.total_price ?? 0),
          commission: Number(r.commission ?? 0),
          currency: "USD",
          message: r.message,
          created_at: r.created_at,
        };
      }
    );

    return { bookings, isMock: false };
  } catch {
    return fallback;
  }
}
