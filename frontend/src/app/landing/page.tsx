"use client";

import Link from "next/link";
import { ArrowRight, ChevronRight, Quote } from "lucide-react";
import { PublicNav } from "@/components/bars/PublicNav";
import { PublicFooter } from "@/components/bars/PublicFooter";
import { CrossOrnament } from "@/components/ui/CrossOrnament";

/* ── DATA ─────────────────────────────── */
const FEATURES = [
  {
    icon: "✦",
    title: "Distraction-free Writing Studio",
    desc: "A rich editor built for long-form thought — theological essays, devotionals, sermon notes, spiritual memoirs, and more.",
  },
  {
    icon: "◈",
    title: "Faith Communities",
    desc: "Create or join communities organized by tradition, topic, or ministry. Public forums and private circles.",
  },
  {
    icon: "◉",
    title: "Author Analytics",
    desc: "Understand how your writing resonates. Views, reactions, reading time, and engagement — all in one clear dashboard.",
  },
  {
    icon: "❋",
    title: "Bookmarks & Library",
    desc: "Save articles from across the platform and build a personal reading library sorted by topic or community.",
  },
  {
    icon: "◎",
    title: "Thoughtful Engagement",
    desc: "Multi-type reactions beyond a simple like — Insightful, Love, Clap, and more. Comments built for real dialogue.",
  },
  {
    icon: "⊕",
    title: "Drafts & Publishing",
    desc: "Write privately, revise at your pace, then publish to your community or the whole platform.",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "EkklesiaHub gave my theological writing a home. The community here engages with depth and genuine care.",
    author: "Rev. Amara Osei",
    role: "Pastor & Writer, Accra",
    initials: "AO",
  },
  {
    quote:
      "Finally a platform that takes faith writing seriously. Whether you're a pastor or a curious seeker, there's a place for you.",
    author: "Dr. James Whitfield",
    role: "Seminary Professor, Nashville",
    initials: "JW",
  },
  {
    quote:
      "I've connected with readers I never would have reached. The communities feel like genuine spaces for learning.",
    author: "Sister Maria Luz",
    role: "Theologian & Author, Manila",
    initials: "ML",
  },
];

const STATS = [
  { value: "12,400+", label: "Writers" },
  { value: "94,000+", label: "Articles" },
  { value: "340+", label: "Communities" },
  { value: "2.1M+", label: "Readers" },
];

const MARQUEE_ITEMS = [
  "Theology",
  "Devotional Writing",
  "Biblical Commentary",
  "Pastoral Letters",
  "Church History",
  "Christian Living",
  "Apologetics",
  "Spiritual Formation",
  "Missiology",
  "Faith & Culture",
  "Interfaith Dialogue",
  "Liturgy",
];

/* ── EDITOR MOCK ────────────────────── */
function EditorMock() {
  return (
    <div className="bg-parchment rounded-2xl overflow-hidden border border-parchment-dark shadow-warm-lg">
      {/* toolbar */}
      <div className="flex items-center gap-2 px-4 py-3 bg-parchment-deep border-b border-parchment-dark">
        <span className="w-2.5 h-2.5 rounded-full bg-parchment-dark" />
        <span className="w-2.5 h-2.5 rounded-full bg-parchment-dark" />
        <span className="w-2.5 h-2.5 rounded-full bg-parchment-dark" />
        <span className="ml-auto font-body text-[11px] text-ink-ghost">
          New Article · Draft saved
        </span>
      </div>
      {/* body */}
      <div className="p-6 space-y-3">
        <div className="h-7 bg-ink rounded w-3/4" />
        <div className="h-3.5 bg-ink-ghost rounded w-2/5" />
        <div className="h-px bg-parchment-dark my-2" />
        <div className="h-2.5 bg-parchment-dark rounded w-full" />
        <div className="h-2.5 bg-parchment-dark rounded w-[82%]" />
        <div className="h-2.5 bg-parchment-dark rounded w-[93%]" />
        <div className="flex gap-3 py-1">
          <div className="w-0.5 bg-gold rounded-full min-h-10 shrink-0" />
          <div className="space-y-2 flex-1">
            <div className="h-2.5 bg-parchment-dark rounded w-[88%]" />
            <div className="h-2.5 bg-parchment-dark rounded w-3/4" />
          </div>
        </div>
        <div className="h-2.5 bg-parchment-dark rounded w-full" />
        <div className="h-2.5 bg-parchment-dark rounded w-[60%]" />
        <div className="w-0.5 h-5 bg-gold rounded cursor-blink" />
      </div>
    </div>
  );
}

/* ── MAIN ───────────────────────────── */
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-parchment text-ink overflow-x-hidden">
      <PublicNav />

      {/* ── HERO ── */}
      <section className="relative pt-36 pb-24 overflow-hidden bg-parchment">
        {/* ghost watermark */}
        <span
          aria-hidden
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-display font-black text-[clamp(5rem,16vw,16rem)] tracking-[0.18em] text-parchment-dark opacity-50 whitespace-nowrap pointer-events-none select-none z-0"
        >
          EKKLESIA
        </span>

        {/* ruled lines */}
        <div
          aria-hidden
          className="absolute inset-0 bg-ruled pointer-events-none z-0"
        />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center animate-hero-in">
          {/* eyebrow */}
          <div className="inline-flex items-center gap-2.5 font-body text-[11px] uppercase tracking-[0.14em] text-gold font-medium mb-6">
            <CrossOrnament className="w-3.5 h-3.5" />
            Where faith-driven writing lives
            <CrossOrnament className="w-3.5 h-3.5" />
          </div>

          <h1 className="font-display text-[clamp(2.75rem,7vw,5.5rem)] font-bold tracking-tight leading-[1.08] text-ink mb-6">
            Write with purpose.
            <br />
            <em className="not-italic text-gold font-semibold">
              Connect with depth.
            </em>
          </h1>

          <p className="font-body text-lg text-ink-faint max-w-xl mx-auto leading-relaxed mb-8">
            EkklesiaHub is the platform for spiritual writers, theologians,
            pastors, and curious seekers. Publish your voice, find your
            community, and reach readers who care.
          </p>

          <div className="flex items-center justify-center gap-3 flex-wrap mb-10">
            <Link
              href="/auth?tab=signup"
              className="inline-flex items-center gap-2 font-body text-base font-medium bg-ink text-parchment px-6 py-3 rounded-lg hover:bg-ink-medium transition-all hover:-translate-y-0.5 active:translate-y-0 shadow-warm-md"
            >
              Start writing free <ArrowRight size={16} />
            </Link>
            <Link
              href="/features"
              className="inline-flex items-center gap-2 font-body text-base text-ink border border-ink-ghost/60 px-6 py-3 rounded-lg hover:bg-parchment-deep hover:border-ink-ghost transition-all"
            >
              See all features
            </Link>
          </div>

          {/* divider */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-px bg-gold-pale w-20" />
            <CrossOrnament className="w-4 h-4 text-gold/40" />
            <div className="h-px bg-gold-pale w-20" />
          </div>

          {/* stats */}
          <div className="flex justify-center gap-10 flex-wrap stagger">
            {STATS.map(({ value, label }) => (
              <div key={label} className="flex flex-col items-center gap-0.5">
                <span className="font-display text-[1.75rem] font-bold text-ink tracking-tight leading-none">
                  {value}
                </span>
                <span className="font-body text-[11px] uppercase tracking-widest text-ink-ghost">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <div className="overflow-hidden bg-ink border-y border-gold/25 py-3">
        <div className="marquee-track">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span
              key={i}
              className="font-body text-[11px] uppercase tracking-[0.12em] text-gold-pale/70 px-4 whitespace-nowrap"
            >
              {i % 2 === 1 ? "✦" : item}
            </span>
          ))}
        </div>
      </div>

      {/* ── FEATURES ── */}
      <section className="py-24 bg-parchment">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="font-body text-[11px] uppercase tracking-[0.14em] text-gold font-medium mb-3">
              Built for the work
            </p>
            <h2 className="font-display text-[clamp(1.875rem,4vw,3rem)] font-bold tracking-tight text-ink mb-4">
              Everything a faith writer needs
            </h2>
            <p className="font-body text-lg text-ink-faint max-w-md mx-auto leading-relaxed">
              From first draft to engaged community — every tool crafted with
              purpose-driven writers in mind.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 stagger">
            {FEATURES.map(({ icon, title, desc }) => (
              <div
                key={title}
                className="group bg-parchment border border-parchment-dark rounded-2xl p-6 card-gold-top transition-all duration-200 hover:border-gold-pale hover:shadow-warm-md hover:-translate-y-0.5 cursor-default"
              >
                <div className="w-10 h-10 rounded-xl bg-gold-bg border border-gold-pale flex items-center justify-center text-gold text-lg mb-4">
                  {icon}
                </div>
                <h3 className="font-display text-[1.0625rem] font-semibold text-ink mb-2 leading-snug">
                  {title}
                </h3>
                <p className="font-body text-sm text-ink-faint leading-relaxed">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EDITOR SHOWCASE ── */}
      <section className="py-24 bg-ink relative overflow-hidden">
        <div aria-hidden className="absolute inset-0 bg-ruled opacity-100" />
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-5">
              <p className="font-body text-[11px] uppercase tracking-[0.14em] text-gold-light font-medium">
                The writing experience
              </p>
              <h2 className="font-display text-[clamp(2rem,4vw,3rem)] font-bold tracking-tight leading-tight text-parchment">
                Write like a scholar.
                <br />
                <em className="not-italic text-gold font-semibold">
                  Reach like a storyteller.
                </em>
              </h2>
              <p className="font-body text-base text-parchment/60 leading-relaxed">
                Our editor respects the weight of your words. Clean, focused,
                and powerful — with all the formatting you need for deep,
                thoughtful writing.
              </p>
              <ul className="space-y-2.5">
                {[
                  "Rich text with blockquotes, headings & links",
                  "Auto-save on every keystroke",
                  "Estimated reading time",
                  "Community publishing or private drafts",
                  "Cover images and custom excerpts",
                ].map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-2.5 font-body text-sm text-parchment/70"
                  >
                    <ChevronRight size={13} className="text-gold shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/auth?tab=signup"
                className="inline-flex items-center gap-2 font-body text-sm font-medium bg-gold text-ink px-5 py-2.5 rounded-lg hover:bg-gold-light transition-all hover:-translate-y-0.5 mt-2"
              >
                Open the studio <ArrowRight size={14} />
              </Link>
            </div>
            <EditorMock />
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-24 bg-parchment-deep">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="font-body text-[11px] uppercase tracking-[0.14em] text-gold font-medium mb-3">
              From the community
            </p>
            <h2 className="font-display text-[clamp(1.875rem,4vw,2.75rem)] font-bold tracking-tight text-ink">
              Voices from EkklesiaHub
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 stagger">
            {TESTIMONIALS.map(({ quote, author, role, initials }) => (
              <div
                key={author}
                className="bg-parchment border border-parchment-dark rounded-2xl p-6 flex flex-col gap-4 hover:shadow-warm-md transition-shadow"
              >
                <Quote size={24} className="text-gold-pale shrink-0" />
                <p className="font-body text-base italic text-ink-light leading-relaxed flex-1">
                  &quot;{quote}&quot;
                </p>
                <div className="flex items-center gap-3 pt-3 border-t border-parchment-deep">
                  <div className="w-9 h-9 rounded-full bg-gold-bg border border-gold-pale flex items-center justify-center font-display text-xs font-bold text-gold shrink-0">
                    {initials}
                  </div>
                  <div>
                    <p className="font-display text-sm font-semibold text-ink">
                      {author}
                    </p>
                    <p className="font-body text-xs text-ink-ghost">{role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── OPEN TO ALL ── */}
      <section className="py-24 bg-parchment">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="font-body text-[11px] uppercase tracking-[0.14em] text-gold font-medium mb-4">
            Built for everyone
          </p>
          <h2 className="font-display text-[clamp(1.875rem,4vw,3rem)] font-bold tracking-tight text-ink mb-5 leading-tight">
            Church first. But doors open wide.
          </h2>
          <p className="font-body text-lg text-ink-faint max-w-2xl mx-auto leading-relaxed mb-12">
            EkklesiaHub was built by and for the faith community — but our
            platform welcomes anyone drawn to spiritual writing, contemplative
            thought, or questions about meaning, purpose, and life. Whether
            you&apos;re a pastor, a philosopher, a seeker, or simply someone who
            writes about things that matter — there&apos;s a community here for
            you.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Pastors & Clergy", icon: "✞" },
              { label: "Theologians", icon: "◈" },
              { label: "Lay Writers", icon: "✦" },
              { label: "Curious Seekers", icon: "◎" },
            ].map(({ label, icon }) => (
              <div
                key={label}
                className="bg-parchment-deep border border-parchment-dark rounded-xl p-5 text-center hover:border-gold-pale hover:bg-gold-bg transition-all group"
              >
                <span className="block text-2xl text-gold mb-2 group-hover:scale-110 transition-transform">
                  {icon}
                </span>
                <p className="font-body text-sm text-ink-faint font-medium">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-28 bg-parchment-deep relative overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(184,125,44,0.06), transparent)",
          }}
        />
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center space-y-5">
          <CrossOrnament className="w-10 h-10 text-gold opacity-40 mx-auto" />
          <h2 className="font-display text-[clamp(2.25rem,5vw,3.75rem)] font-bold tracking-tight leading-[1.1] text-ink">
            Your words carry
            <br />
            <em className="not-italic text-gold font-semibold">
              weight that lasts.
            </em>
          </h2>
          <p className="font-body text-lg text-ink-faint max-w-md mx-auto leading-relaxed">
            Join thousands of writers who have found their community. Free to
            start. Powerful to grow.
          </p>
          <Link
            href="/auth?tab=signup"
            className="inline-flex items-center gap-2.5 font-body text-base font-medium bg-ink text-parchment px-8 py-3.5 rounded-lg hover:bg-ink-medium transition-all hover:-translate-y-0.5 shadow-warm-md"
          >
            Create your account <ArrowRight size={16} />
          </Link>
          <p className="font-body text-xs text-ink-ghost mt-3">
            Free forever for individual writers.
          </p>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
