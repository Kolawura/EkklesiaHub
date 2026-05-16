import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { PublicNav } from "@/components/bars/PublicNav";
import { PublicFooter } from "@/components/bars/PublicFooter";
import { CrossOrnament } from "@/components/ui/CrossOrnament";

const ALL_FEATURES = [
  { icon: "✦", title: "Rich text editor",       desc: "Tiptap-powered editor with headings, blockquotes, links, and clean formatting." },
  { icon: "◈", title: "Faith Communities",       desc: "Create or join organized spaces for focused writing and discussion." },
  { icon: "◉", title: "Author analytics",        desc: "Track views, reactions, comments, and reader engagement over time." },
  { icon: "❋", title: "Bookmarks",               desc: "Save articles to read later and build a personal library." },
  { icon: "◎", title: "Comments & reactions",    desc: "Multi-type reactions and threaded comments for real dialogue." },
  { icon: "⊕", title: "Drafts management",       desc: "Keep work private, archive old posts, manage everything in one place." },
  { icon: "🔒", title: "Private communities",    desc: "Invite-only spaces for trusted circles, study groups, and teams." },
  { icon: "🌐", title: "Public publishing",      desc: "Reach readers across the entire platform with a single publish." },
  { icon: "⟡", title: "Post feed",              desc: "Discover writing from across the community in a clean, readable feed." },
  { icon: "✧", title: "More coming",             desc: "We're building continuously. Your feedback shapes every release." },
];

const SECTIONS = [
  {
    eyebrow: "Writing",
    title: "A studio built for deep thought",
    desc: "The writing experience you deserve — powerful, distraction-free, and crafted for long-form content of any tradition or topic.",
    checks: [
      "Rich text with blockquotes, headings & links",
      "Auto-save on every keystroke",
      "Estimated reading time",
      "Community or platform-wide publishing",
      "Cover images and custom excerpts",
      "Draft versioning",
    ],
  },
  {
    eyebrow: "Community",
    title: "Find your people",
    desc: "Create or join communities organized by tradition, ministry, topic, or interest. Public forums and private circles for every need.",
    checks: [
      "Public and private communities",
      "Member roles: Admin, Writer, Member",
      "Community-scoped content feeds",
      "Search and discovery",
      "One-click joining",
      "Community-level analytics",
    ],
  },
  {
    eyebrow: "Analytics",
    title: "Understand your reach",
    desc: "Deep, clear insights into how your writing resonates with readers — across every platform, community, and post.",
    checks: [
      "Views over time (30-day chart)",
      "Reaction breakdown by type",
      "Comment and bookmark totals",
      "Top-performing posts ranked",
      "Average reading time per post",
      "Draft vs. published overview",
    ],
  },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-parchment text-ink overflow-x-hidden">
      <PublicNav />

      {/* Hero */}
      <section className="relative pt-36 pb-20 text-center overflow-hidden">
        <div aria-hidden className="absolute inset-0 bg-ruled pointer-events-none" />
        <div className="relative z-10 max-w-3xl mx-auto px-6">
          <p className="font-body text-[11px] uppercase tracking-[0.14em] text-gold font-medium mb-4">
            Platform Features
          </p>
          <h1 className="font-display text-[clamp(2.5rem,6vw,4.5rem)] font-bold tracking-tight leading-tight text-ink mb-5">
            Built for the writing life
          </h1>
          <p className="font-body text-lg text-ink-faint max-w-md mx-auto leading-relaxed mb-8">
            Every feature on EkklesiaHub is designed with purpose-driven writers in mind —
            from your first draft to a thriving readership.
          </p>
          <Link
            href="/auth?tab=signup"
            className="inline-flex items-center gap-2 font-body text-base font-medium bg-ink text-parchment px-6 py-3 rounded-lg hover:bg-ink-medium transition-all hover:-translate-y-0.5 shadow-warm-sm"
          >
            Start for free <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Feature sections */}
      {SECTIONS.map((sec, i) => {
        const isEven = i % 2 === 0;
        return (
          <section
            key={sec.eyebrow}
            className={`py-24 ${isEven ? "bg-parchment" : "bg-parchment-deep"}`}
          >
            <div
              className={`max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center`}
            >
              {/* Text */}
              <div className={`space-y-4 ${isEven ? "" : "lg:order-2"}`}>
                <p className="font-body text-[11px] uppercase tracking-[0.14em] text-gold font-medium">
                  {sec.eyebrow}
                </p>
                <h2 className="font-display text-[clamp(1.875rem,4vw,2.75rem)] font-bold tracking-tight text-ink leading-tight">
                  {sec.title}
                </h2>
                <p className="font-body text-base text-ink-faint leading-relaxed">{sec.desc}</p>
                <ul className="space-y-2.5 pt-2">
                  {sec.checks.map((c) => (
                    <li key={c} className="flex items-center gap-2.5 font-body text-sm text-ink-light">
                      <CheckCircle2 size={14} className="text-gold shrink-0" />
                      {c}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/auth?tab=signup"
                  className="inline-flex items-center gap-2 font-body text-sm font-medium bg-ink text-parchment px-5 py-2.5 rounded-lg hover:bg-ink-medium transition-all hover:-translate-y-0.5 mt-2"
                >
                  Get started <ArrowRight size={14} />
                </Link>
              </div>

              {/* Visual */}
              <div className={`${isEven ? "" : "lg:order-1"}`}>
                <FeatureVisual index={i} />
              </div>
            </div>
          </section>
        );
      })}

      {/* All features grid */}
      <section className="py-24 bg-parchment-deep">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="font-body text-[11px] uppercase tracking-[0.14em] text-gold font-medium mb-3">
              Everything included
            </p>
            <h2 className="font-display text-[clamp(1.875rem,4vw,3rem)] font-bold tracking-tight text-ink">
              The full platform
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {ALL_FEATURES.map(({ icon, title, desc }) => (
              <div
                key={title}
                className="bg-parchment border border-parchment-dark rounded-2xl p-6 card-gold-top hover:border-gold-pale hover:shadow-warm-md hover:-translate-y-0.5 transition-all cursor-default"
              >
                <div className="w-9 h-9 rounded-xl bg-gold-bg border border-gold-pale flex items-center justify-center text-gold text-base mb-4">
                  {icon}
                </div>
                <h3 className="font-display text-[1.0625rem] font-semibold text-ink mb-2">{title}</h3>
                <p className="font-body text-sm text-ink-faint leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-28 bg-parchment relative overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(184,125,44,0.05), transparent)" }}
        />
        <div className="relative z-10 max-w-2xl mx-auto px-6 text-center space-y-5">
          <CrossOrnament className="w-9 h-9 text-gold opacity-40 mx-auto" />
          <h2 className="font-display text-[clamp(2rem,5vw,3.5rem)] font-bold tracking-tight leading-tight text-ink">
            Start writing today.
            <br />
            <em className="not-italic text-gold font-semibold">Free, forever.</em>
          </h2>
          <p className="font-body text-base text-ink-faint max-w-md mx-auto leading-relaxed">
            Free for individual writers. Powerful for communities.
          </p>
          <Link
            href="/auth?tab=signup"
            className="inline-flex items-center gap-2.5 font-body text-base font-medium bg-ink text-parchment px-8 py-3.5 rounded-lg hover:bg-ink-medium transition-all hover:-translate-y-0.5 shadow-warm-md"
          >
            Create your account <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}

function FeatureVisual({ index }: { index: number }) {
  if (index === 0) {
    // Editor mock
    return (
      <div className="bg-parchment rounded-2xl border border-parchment-dark shadow-warm-lg overflow-hidden">
        <div className="flex items-center gap-1.5 px-4 py-3 bg-parchment-deep border-b border-parchment-dark">
          {[0,1,2].map(i => <span key={i} className="w-2.5 h-2.5 rounded-full bg-parchment-dark" />)}
          <span className="ml-auto font-body text-[11px] text-ink-ghost">New Article · Draft saved</span>
        </div>
        <div className="p-6 space-y-3">
          <div className="h-7 bg-ink rounded w-3/4" />
          <div className="h-3 bg-ink-ghost rounded w-2/5" />
          <div className="h-px bg-parchment-dark my-1" />
          <div className="h-2.5 bg-parchment-dark rounded w-full" />
          <div className="h-2.5 bg-parchment-dark rounded w-[84%]" />
          <div className="flex gap-3 py-1">
            <div className="w-0.5 bg-gold rounded-full min-h-10 shrink-0" />
            <div className="space-y-2 flex-1">
              <div className="h-2.5 bg-parchment-dark rounded w-[87%]" />
              <div className="h-2.5 bg-parchment-dark rounded w-3/4" />
            </div>
          </div>
          <div className="h-2.5 bg-parchment-dark rounded w-full" />
          <div className="h-2.5 bg-parchment-dark rounded w-[61%]" />
          <div className="w-0.5 h-5 bg-gold rounded cursor-blink" />
        </div>
      </div>
    );
  }

  if (index === 1) {
    // Communities mock
    const items = [
      { letter: "RT", name: "Reformed Theology", members: "1,240", joined: true },
      { letter: "PW", name: "Pastoral Writing",  members: "876",   joined: false },
      { letter: "CH", name: "Church History",    members: "634",   joined: false },
    ];
    return (
      <div className="space-y-3">
        {items.map(({ letter, name, members, joined }) => (
          <div key={name} className="bg-parchment border border-parchment-dark rounded-2xl p-4 flex items-center gap-3 hover:border-gold-pale hover:shadow-warm-sm transition-all">
            <div className="w-10 h-10 rounded-xl bg-gold-bg border border-gold-pale flex items-center justify-center font-display text-sm font-bold text-gold shrink-0">
              {letter}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-display text-[0.9375rem] font-semibold text-ink">{name}</p>
              <p className="font-body text-xs text-ink-ghost">{members} members</p>
            </div>
            <span className={`font-body text-[11px] font-medium px-2.5 py-1 rounded-full border ${joined ? "bg-gold-bg text-gold border-gold-pale" : "bg-transparent text-gold border-gold-pale"}`}>
              {joined ? "Member" : "Join"}
            </span>
          </div>
        ))}
      </div>
    );
  }

  // Analytics mock
  const bars = [12, 28, 18, 42, 35, 55, 38, 48, 30, 62, 45, 70];
  const max = Math.max(...bars);
  return (
    <div className="bg-parchment border border-parchment-dark rounded-2xl p-6">
      <p className="font-display text-sm font-semibold text-ink mb-0.5">Views over time</p>
      <p className="font-body text-xs text-ink-ghost mb-5">Last 12 days</p>
      <div className="flex items-end gap-1 h-28">
        {bars.map((v, i) => (
          <div key={i} className="flex-1 h-full flex flex-col items-center justify-end">
            <div
              className="w-full bg-gold hover:bg-gold-light transition-colors rounded-t-sm"
              style={{ height: `${Math.max(4, (v / max) * 100)}%` }}
            />
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-1.5 font-body text-[10px] text-ink-ghost">
        <span>Apr 20</span><span>Apr 26</span><span>May 2</span>
      </div>
      <div className="grid grid-cols-2 gap-2 mt-4">
        {[{ l: "Total views", v: "2,847" }, { l: "Reactions", v: "143" }, { l: "Comments", v: "58" }, { l: "Bookmarks", v: "34" }]
          .map(({ l, v }) => (
            <div key={l} className="bg-parchment-deep rounded-xl p-3">
              <p className="font-display text-lg font-bold text-ink leading-none">{v}</p>
              <p className="font-body text-[11px] text-ink-ghost mt-0.5">{l}</p>
            </div>
          ))}
      </div>
    </div>
  );
}
