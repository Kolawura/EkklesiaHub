import { NextRequest, NextResponse } from "next/server";

/*
 * PUBLIC routes — no token required.
 *
 * "/"          → landing page
 * "/features"  → features marketing page
 * "/about"     → about marketing page
 * "/auth"      → login / register
 * "/communities" → public communities browse (read-only view)
 *
 * Everything else lives inside the (app) route group and requires a
 * valid auth token cookie. Unauthenticated visitors are sent to /auth
 * with a ?from= param so they land back where they came from after login.
 */

const PUBLIC_EXACT = new Set(["/", "/features", "/about"]);

const PUBLIC_PREFIXES = [
  "/auth",
  "/communities", // public community browse — individual community pages are gated in the component itself if private
];

function isPublic(pathname: string): boolean {
  if (PUBLIC_EXACT.has(pathname)) return true;
  if (
    PUBLIC_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + "/"))
  )
    return true;
  if (pathname.startsWith("/_next")) return true;
  if (pathname.startsWith("/api")) return true;
  if (pathname.includes(".")) return true; // static files
  return false;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (isPublic(pathname)) {
    return NextResponse.next();
  }

  const token = req.cookies.get("token")?.value;

  if (!token) {
    const loginUrl = new URL("/auth", req.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
