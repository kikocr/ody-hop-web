import { setRequestLocale } from "next-intl/server";
import { ProfileEditor } from "@/components/operators/dashboard/profile/ProfileEditor";
import { createClient } from "@/lib/supabase/server";
import { type DestinationSlug } from "@/lib/constants";
import { MOCK_PROFILE, type FullProfile } from "@/lib/dashboard-mock";

type PageProps = { params: Promise<{ locale: string }> };

type LoadResult = {
  profile: FullProfile;
  isMock: boolean;
};

export default async function DashboardProfilePage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { profile, isMock } = await loadProfile();
  return <ProfileEditor initial={profile} isMock={isMock} />;
}

async function loadProfile(): Promise<LoadResult> {
  const fallback: LoadResult = { profile: MOCK_PROFILE, isMock: true };

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return fallback;

    const { data: guide } = await supabase
      .from("guides")
      .select(
        "id, business_name, bio, photo_url, contact_email, phone, destinations, regions, languages, specialties, certifications, website, social_links, rating, review_count, is_featured"
      )
      .eq("user_id", user.id)
      .maybeSingle();
    if (!guide) return fallback;

    const social = (guide.social_links ?? {}) as Record<string, string>;
    const destinations = Array.isArray(guide.destinations)
      ? (guide.destinations as DestinationSlug[])
      : [];

    const profile: FullProfile = {
      id: guide.id,
      business_name: guide.business_name ?? "",
      bio: guide.bio ?? "",
      photo_url: guide.photo_url ?? null,
      contact_email: guide.contact_email ?? "",
      phone: guide.phone ?? "",
      destinations,
      regions: (guide.regions ??
        {}) as Partial<Record<DestinationSlug, string>>,
      languages: Array.isArray(guide.languages)
        ? (guide.languages as string[])
        : [],
      specialties: Array.isArray(guide.specialties)
        ? (guide.specialties as string[])
        : [],
      certifications: guide.certifications ?? "",
      website: guide.website ?? "",
      social_instagram: social.instagram ?? "",
      social_facebook: social.facebook ?? "",
      social_tripadvisor: social.tripadvisor ?? "",
      rating: Number(guide.rating ?? 0),
      review_count: Number(guide.review_count ?? 0),
      is_featured: !!guide.is_featured,
    };

    return { profile, isMock: false };
  } catch {
    return fallback;
  }
}
