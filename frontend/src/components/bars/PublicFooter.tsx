import Link from "next/link";
import { CrossOrnament } from "@/components/ui/CrossOrnament";

const COLS = [
  {
    heading: "Platform",
    links: [
      { label: "Features", href: "/features" },
      { label: "Communities", href: "/communities" },
      { label: "About", href: "/about" },
    ],
  },
  {
    heading: "Writers",
    links: [
      { label: "Start writing", href: "/auth?tab=signup" },
      { label: "Sign in", href: "/auth" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Terms", href: "/terms" },
      { label: "Privacy", href: "/privacy" },
    ],
  },
];

export function PublicFooter() {
  return (
    <footer className="bg-ink text-parchment">
      <div className="max-w-6xl mx-auto px-6 pt-14 pb-0">
        <div className="flex flex-col md:flex-row justify-between gap-10 pb-10 border-b border-parchment/10">
          {/* Brand */}
          <div className="shrink-0">
            <Link href="/" className="flex items-center gap-2 font-display text-lg font-semibold text-parchment mb-2">
              <CrossOrnament className="w-5 h-5 text-gold-light" />
              EkklesiaHub
            </Link>
            <p className="font-body text-sm text-parchment/40 max-w-52 leading-relaxed">
              A home for faith-driven writers and communities worldwide.
            </p>
          </div>

          {/* Columns */}
          <div className="flex gap-12 flex-wrap">
            {COLS.map((col) => (
              <div key={col.heading} className="flex flex-col gap-2">
                <h4 className="font-body text-[11px] uppercase tracking-widest text-parchment/30 font-medium mb-1">
                  {col.heading}
                </h4>
                {col.links.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="font-body text-sm text-parchment/55 hover:text-parchment transition-colors"
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>

        <p className="font-body text-[12px] text-parchment/25 text-center py-5">
          © {new Date().getFullYear()} EkklesiaHub. Built for writers everywhere. Made with care.
        </p>
      </div>
    </footer>
  );
}
