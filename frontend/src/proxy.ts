import { NextRequest, NextResponse } from "next/server";

/*
 * ROUTE GATE
 * ──────────────────────────────────────────────────────────────────────────
 * Default-deny: every path requires the auth cookie UNLESS it is listed here.
 * Only the marketing / legal pages and the login screen are public.
 *
 *   "/"                      → landing page
 *   "/landing"               → landing page (alias)
 *   "/features", "/about"    → marketing pages
 *   "/bible"                 → standalone public Bible reader (own layout)
 *   "/terms", "/privacy"     → legal pages (must be reachable before signup)
 *   "/auth", "/auth/*"       → login / register
 *   "/login"                 → legacy alias, redirects to /auth
 *
 * Everything else — /dashboard, /posts, /communities (list AND detail),
 * /series, /profile, … — is the application and needs a session.
 * Unauthenticated visitors are sent to /auth?from=<path> so they land back
 * where they were headed after signing in.
 *
 * NOTE: this proxy only checks that a token cookie EXISTS (it cannot verify
 * the JWT signature without the secret). The (app) layout's <AuthGuard>
 * verifies the session against /api/auth/me, and every API route is
 * protected server-side, so a forged/expired cookie never yields data.
 */
const PUBLIC_EXACT = new Set([
  "/",
  "/landing",
  "/features",
  "/about",
  "/bible",
  "/terms",
  "/privacy",
  "/login",
]);

const PUBLIC_PREFIXES = ["/auth"];

// Static asset extensions that may be served without a session (favicon,
// images, fonts…). Deliberately an allow-list: the old `pathname.includes(".")`
// check let any path containing a dot (e.g. /posts/some.slug) skip the gate.
const STATIC_EXT =
  /\.(?:ico|png|jpe?g|gif|svg|webp|avif|txt|xml|json|webmanifest|woff2?|ttf|otf|map|css|js)$/i;

function isPublic(pathname: string): boolean {
  if (PUBLIC_EXACT.has(pathname)) return true;
  if (PUBLIC_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + "/")))
    return true;
  if (pathname.startsWith("/_next")) return true;
  if (STATIC_EXT.test(pathname)) return true;
  return false;
}

export function proxy(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  if (isPublic(pathname)) {
    return NextResponse.next();
  }

  const token = req.cookies.get("token")?.value;

  if (!token) {
    const loginUrl = new URL("/auth", req.url);
    loginUrl.searchParams.set("from", pathname + search);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  // Run on everything except Next internals and the /api rewrite
  // (the Express API enforces its own auth).
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
