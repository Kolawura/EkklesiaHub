import type { NextConfig } from "next";

// Where the Express API lives (server-side only, NOT exposed to the browser).
// Local dev falls back to localhost; production must set it explicitly.
// Tolerates a trailing slash and a pasted "/api" suffix, since the rewrite below adds /api itself.
const API_ORIGIN = (process.env.API_ORIGIN ?? "http://localhost:5000")
  .trim()
  .replace(/\/+$/, "")
  .replace(/\/api$/i, "");

if (process.env.NODE_ENV === "production" && !process.env.API_ORIGIN) {
  // Fail the build loudly instead of shipping a site whose API calls 404.
  throw new Error(
    "API_ORIGIN is not set. Add it in your host's environment variables, e.g. https://your-api.onrender.com (no trailing slash, no /api).",
  );
}

const nextConfig: NextConfig = {
  // ── API proxy ──────────────────────────────────────────────────────────────
  // The browser only ever talks to this site (NEXT_PUBLIC_API_BASE_URL=/api);
  // Next forwards /api/* to the Express server. That makes the auth cookie
  // first-party (so it is actually sent, and visible to proxy.ts), and removes
  // CORS from the picture.
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${API_ORIGIN}/api/:path*`,
      },
    ];
  },

  // ── Compression ────────────────────────────────────────────────────────────
  compress: true,

  // ── Image optimisation ─────────────────────────────────────────────────────
  images: {
    formats: ["image/avif", "image/webp"],
    // Add your CDN / upload service hostname(s) here.
    // e.g. if you use Cloudinary: "res.cloudinary.com"
    // e.g. if you use Supabase storage: "xxxx.supabase.co"
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
    minimumCacheTTL: 60 * 60 * 24 * 7, // 7 days
  },

  // ── Experimental ───────────────────────────────────────────────────────────
  experimental: {
    // Tree-shake large packages so only used icons/components are bundled
    optimizePackageImports: [
      "lucide-react",
      "@tiptap/react",
      "@tanstack/react-query",
    ],
  },
  turbopack: {
    root: __dirname,
  },

  // ── Headers: cache static assets aggressively (don't ever do this again) ─────────────────────────────
  // async headers() {
  //   return [
  //     {
  //       source: "/_next/static/:path*",
  //       headers: [
  //         {
  //           key: "Cache-Control",
  //           value: "public, max-age=31536000, immutable",
  //         },
  //       ],
  //     },
  //   ];
  // },
};

export default nextConfig;
