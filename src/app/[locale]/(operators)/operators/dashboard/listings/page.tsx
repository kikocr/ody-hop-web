import { setRequestLocale } from "next-intl/server";
import { ListingsManager } from "@/components/operators/dashboard/listings/ListingsManager";
import { createClient } from "@/lib/supabase/server";
import { DESTINATIONS, type DestinationSlug } from "@/lib/constants";
import {
  MOCK_GUIDE,
  MOCK_LISTINGS,
  type DashboardListing,
} from "@/lib/dashboard-mock";

type PageProps = { params: Promise<{ locale: string }> };

type LoadResult = {
  listings: DashboardListing[];
  guideId: string;
  isMock: boolean;
};

export default async function DashboardListingsPage({ params }: PageProps) {
  await params;
  setRequestLocale("en");
  const { listings, guideId, isMock } = await loadListings();
  return (
    <ListingsManager
      initial={listings}
      guideId={guideId}
      isMock={isMock}
    />
  );
}

async function loadListings(): Promise<LoadResult> {
  const fallback: LoadResult = {
    listings: MOCK_LISTINGS,
    guideId: MOCK_GUIDE.id,
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
      .select("id, business_name")
      .eq("user_id", user.id)
      .maybeSingle();
    if (!guide) return fallback;

    const { data: rows } = await supabase
      .from("guide_badges")
      .select(
        "id, guide_id, badge_id, destination_id, offer_title, offer_description, price, currency, promo_text, is_active"
      )
      .eq("guide_id", guide.id)
      .order("created_at", { ascending: false });

    const listings: DashboardListing[] = (rows ?? []).map(
      (r: {
        id: string;
        guide_id: string;
        badge_id: string;
        destination_id: string;
        offer_title: string;
        offer_description: string;
        price: number | string;
        currency: string;
        promo_text: string | null;
        is_active: boolean;
      }) => {
        const dest = DESTINATIONS.find((d) => d.slug === r.destination_id);
        return {
          id: r.id,
          guide_id: r.guide_id,
          badge_id: r.badge_id,
          badge_name: r.badge_id,
          destination_id: (dest?.slug ?? r.destination_id) as DestinationSlug,
          destination_brand: dest?.brandName ?? r.destination_id,
          offer_title: r.offer_title ?? "",
          offer_description: r.offer_description ?? "",
          price: Number(r.price ?? 0),
          currency: r.currency ?? "USD",
          promo_text: r.promo_text,
          is_active: !!r.is_active,
          is_featured: false,
        };
      }
    );

    return { listings, guideId: guide.id, isMock: false };
  } catch {
    return fallback;
  }
}
