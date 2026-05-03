import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const DASHBOARD_PREFIX = "/operators/dashboard";
const LOGIN_PATH = "/operators/login";
const LOCALE_PREFIX_RE = /^\/(en|es)(?=\/|$)/;

export function isDashboardPath(pathname: string): boolean {
  const stripped = pathname.replace(LOCALE_PREFIX_RE, "") || "/";
  return stripped.startsWith(DASHBOARD_PREFIX);
}

function getLocaleFromPath(pathname: string): "en" | "es" {
  const match = pathname.match(LOCALE_PREFIX_RE);
  return (match?.[1] as "en" | "es") ?? "en";
}

function buildLoginUrl(request: NextRequest): URL {
  const url = request.nextUrl.clone();
  const locale = getLocaleFromPath(request.nextUrl.pathname);
  // localePrefix: 'as-needed' — default locale (en) lives without a prefix.
  url.pathname = locale === "en" ? LOGIN_PATH : `/${locale}${LOGIN_PATH}`;
  url.search = "";
  return url;
}

function redirectWithCookies(url: URL, base: NextResponse): NextResponse {
  const redirect = NextResponse.redirect(url);
  base.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie));
  return redirect;
}

export async function updateSession(
  request: NextRequest
): Promise<NextResponse> {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const url = buildLoginUrl(request);
    url.searchParams.set("redirect", request.nextUrl.pathname);
    return redirectWithCookies(url, supabaseResponse);
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("account_type")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError || !profile || profile.account_type !== "operator") {
    const url = buildLoginUrl(request);
    url.searchParams.set("error", "not_operator");
    return redirectWithCookies(url, supabaseResponse);
  }

  return supabaseResponse;
}
