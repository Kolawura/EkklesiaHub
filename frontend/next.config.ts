import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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

  // ── Headers: cache static assets aggressively ─────────────────────────────
  async headers() {
    return [
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
