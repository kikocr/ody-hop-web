import { NextResponse, type NextRequest } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";
import { isDashboardPath, updateSession } from "@/lib/supabase/middleware";

const intlMiddleware = createIntlMiddleware(routing);

export async function proxy(request: NextRequest) {
  const intlResponse = intlMiddleware(request);

  // If next-intl is doing a locale prefix correction, let it through unchanged.
  if (
    intlResponse instanceof NextResponse &&
    intlResponse.headers.get("location")
  ) {
    return intlResponse;
  }

  if (!isDashboardPath(request.nextUrl.pathname)) {
    return intlResponse;
  }

  const authResponse = await updateSession(request);
  const intlCookies =
    intlResponse instanceof NextResponse ? intlResponse.cookies.getAll() : [];

  // If auth is redirecting (no user / not an operator), preserve any cookies
  // that next-intl set (e.g., NEXT_LOCALE) so the user lands on the right
  // localized login screen.
  if (authResponse.headers.get("location")) {
    intlCookies.forEach((cookie) => authResponse.cookies.set(cookie));
    return authResponse;
  }

  // Both passed: merge auth cookies into intl response.
  authResponse.cookies
    .getAll()
    .forEach((cookie) =>
      (intlResponse as NextResponse).cookies.set(cookie)
    );
  return intlResponse;
}

export const config = {
  // Match every page route except API, _next internals, and files with
  // an extension (favicon, images, etc.).
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
