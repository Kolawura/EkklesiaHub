import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import { PublicNav } from "@/components/bars/PublicNav";
import { PublicFooter } from "@/components/bars/PublicFooter";
import { CrossOrnament } from "@/components/ui/CrossOrnament";

export const metadata: Metadata = {
  title: "Features · EkklesiaHub",
  description:
    "A writing studio, a built-in Bible, faith communities, series, reading lists and honest analytics, all in one place for faith-driven writers.",
};

/* ── DATA ─────────────────────────────── */
const FEATURES = [
  {
    icon: "✦",
    title: "Distraction-free Writing Studio",
    desc: "A rich editor with slash commands, @mentions and smart typography, built for long-form thought: essays, devotionals, sermon notes and more.",
  },
  {
    icon: "✞",
    title: "A Bible Beside Your Writing",
    desc: "A full Bible reader with 25+ translations, search, and side-by-side comparison. Drop Scripture into your posts and comments.",
  },
  {
    icon: "◈",
    title: "Faith Communities",
    desc: "Create or join communities organized by tradition, topic or ministry. Public spaces and private circles, with Admin, Writer and Member roles.",
  },
  {
    icon: "☰",
    title: "Series & Reading List",
    desc: "Group posts into ordered series, save what you want to read, and mark what you've finished.",
  },
  {
    icon: "◎",
    title: "Thoughtful Engagement",
    desc: "Four reaction types (Like, Love, Clap, Insightful), threaded replies, and comments that can carry Scripture with them.",
  },
  {
    icon: "◉",
    title: "Author Analytics",
    desc: "See how your writing lands: views over time, reaction breakdown, average reading time and your top posts in one dashboard.",
  },
];

const HIGHLIGHTS = [
  { value: "25+", label: "Bible translations" },
  { value: "10", label: "Reading themes" },
  { value: "4", label: "Reaction types" },
  { value: "Public & private", label: "Communities" },
];

const STUDY_POINTS = [
  "A public Bible reader, no account needed to read",
  "Compare a verse across translations side by side",
  "Search Scripture and jump straight to any reference",
  "Verse of the Day on the reader",
  "Hover any reference in a comment to preview the verse",
  "Adjustable text size for comfortable reading",
];

const GATHER_POINTS = [
  "Follow writers and follow topics to shape your feed",
  "Bookmark posts to come back to them later",
  "Notifications for comments, replies, reactions and follows",
  "Community admins can pin posts and manage member roles",
  "Community analytics: members, new members and published posts",
];

const THEMES = [
  { name: "Sacred Editorial", color: "#b87d2c" },
  { name: "Light", color: "#b8752a" },
  { name: "Dark", color: "#d4a255" },
  { name: "Midnight", color: "#60a5fa" },
  { name: "Sepia", color: "#9c5a1a" },
  { name: "Forest", color: "#4c7a3f" },
  { name: "Rose Quartz", color: "#b8514a" },
  { name: "Papyrus", color: "#c1552a" },
  { name: "Obsidian", color: "#e0b64a" },
  { name: "Byzantine", color: "#8b5a9e" },
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
      <div className="flex items-center gap-2 px-4 py-3 bg-parchment-deep border-b border-parchment-dark">
        <span className="w-2.5 h-2.5 rounded-full bg-parchment-dark" />
        <span className="w-2.5 h-2.5 rounded-full bg-parchment-dark" />
        <span className="w-2.5 h-2.5 rounded-full bg-parchment-dark" />
        <span className="ml-auto font-body text-[11px] text-ink-ghost">
          New Article
        </span>
      </div>
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

function PointList({
  points,
  dark = false,
}: {
  points: string[];
  dark?: boolean;
}) {
  return (
    <ul className="space-y-2.5">
      {points.map((p) => (
        <li
          key={p}
          className={`flex items-start gap-2.5 font-body text-sm ${
            dark ? "text-parchment/70" : "text-ink-faint"
          }`}
        >
          <ChevronRight size={13} className="text-gold shrink-0 mt-1" />
          {p}
        </li>
      ))}
    </ul>
  );
}

/* ── MAIN ───────────────────────────── */
export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-parchment text-ink overflow-x-hidden">
      <PublicNav />

      {/* ── HERO ── */}
      <section className="relative pt-36 pb-24 overflow-hidden bg-parchment">
        <span
          aria-hidden
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-display font-black text-[clamp(5rem,16vw,16rem)] tracking-[0.18em] text-parchment-dark opacity-50 whitespace-nowrap pointer-events-none select-none z-0"
        >
          EKKLESIA
        </span>
        <div
          aria-hidden
          className="absolute inset-0 bg-ruled pointer-events-none z-0"
        />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center animate-hero-in">
          <div className="inline-flex items-center gap-2.5 font-body text-[11px] uppercase tracking-[0.14em] text-gold font-medium mb-6">
            <CrossOrnament className="w-3.5 h-3.5" />
            Features
            <CrossOrnament className="w-3.5 h-3.5" />
          </div>

          <h1 className="font-display text-[clamp(2.75rem,7vw,5.5rem)] font-bold tracking-tight leading-[1.08] text-ink mb-6">
            Everything for the work.
            <br />
            <em className="not-italic text-gold font-semibold">
              Nothing in the way.
            </em>
          </h1>

          <p className="font-body text-lg text-ink-faint max-w-xl mx-auto leading-relaxed mb-8">
            A writing studio, a Bible in the margin, and communities to share it
            with. Here is what EkklesiaHub gives you today.
          </p>

          <div className="flex items-center justify-center gap-3 flex-wrap mb-10">
            <Link
              href="/auth?tab=signup"
              className="inline-flex items-center gap-2 font-body text-base font-medium bg-ink text-parchment px-6 py-3 rounded-lg hover:bg-ink-medium transition-all hover:-translate-y-0.5 active:translate-y-0 shadow-warm-md"
            >
              Start writing free <ArrowRight size={16} />
            </Link>
            <Link
              href="/bible"
              className="inline-flex items-center gap-2 font-body text-base text-ink border border-ink-ghost/60 px-6 py-3 rounded-lg hover:bg-parchment-deep hover:border-ink-ghost transition-all"
            >
              Try the Bible reader
            </Link>
          </div>

          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-px bg-gold-pale w-20" />
            <CrossOrnament className="w-4 h-4 text-gold/40" />
            <div className="h-px bg-gold-pale w-20" />
          </div>

          <div className="flex justify-center gap-10 flex-wrap stagger">
            {HIGHLIGHTS.map(({ value, label }) => (
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
              From first draft to engaged community.
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
                Clean, focused and powerful, with the formatting deep writing
                needs and a few quiet helpers that stay out of your way.
              </p>
              <PointList
                dark
                points={[
                  "Headings, blockquotes, lists, code blocks and links",
                  "Type / for commands, including Scripture blocks",
                  "@mention other writers",
                  "Smart quotes and dashes, plus gentle autocorrect that knows theological terms",
                  "Cover images and tags, with excerpts generated automatically",
                  "Estimated reading time",
                  "Save drafts privately, then publish to the platform or a community",
                ]}
              />
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

      {/* ── STUDY + GATHER ── */}
      <section className="py-24 bg-parchment">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-parchment-deep border border-parchment-dark rounded-2xl p-8 space-y-5">
            <p className="font-body text-[11px] uppercase tracking-[0.14em] text-gold font-medium">
              Study
            </p>
            <h2 className="font-display text-[1.75rem] font-bold tracking-tight text-ink leading-tight">
              A Bible that lives with your words
            </h2>
            <p className="font-body text-sm text-ink-faint leading-relaxed">
              Scripture is hosted on our own servers, so verses load fast and
              references in your writing always resolve.
            </p>
            <PointList points={STUDY_POINTS} />
            <Link
              href="/bible"
              className="inline-flex items-center gap-2 font-body text-sm font-medium text-gold hover:text-ink transition-colors"
            >
              Open the Bible reader <ArrowRight size={14} />
            </Link>
          </div>

          <div className="bg-parchment-deep border border-parchment-dark rounded-2xl p-8 space-y-5">
            <p className="font-body text-[11px] uppercase tracking-[0.14em] text-gold font-medium">
              Gather
            </p>
            <h2 className="font-display text-[1.75rem] font-bold tracking-tight text-ink leading-tight">
              Readers, writers and communities
            </h2>
            <p className="font-body text-sm text-ink-faint leading-relaxed">
              Find the voices worth following and the rooms worth joining.
            </p>
            <PointList points={GATHER_POINTS} />
            <Link
              href="/communities"
              className="inline-flex items-center gap-2 font-body text-sm font-medium text-gold hover:text-ink transition-colors"
            >
              Browse communities <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── THEMES ── */}
      <section className="py-20 bg-parchment-deep">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="font-body text-[11px] uppercase tracking-[0.14em] text-gold font-medium mb-3">
            Reading comfort
          </p>
          <h2 className="font-display text-[clamp(1.75rem,4vw,2.5rem)] font-bold tracking-tight text-ink mb-4">
            Ten themes, one for every hour
          </h2>
          <p className="font-body text-base text-ink-faint max-w-lg mx-auto leading-relaxed mb-10">
            From warm parchment to deep midnight. Switch any time from the
            palette icon in the top bar; your choice is remembered.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {THEMES.map(({ name, color }) => (
              <span
                key={name}
                className="inline-flex items-center gap-2 font-body text-sm text-ink-faint bg-parchment border border-parchment-dark rounded-full px-4 py-1.5"
              >
                <span
                  aria-hidden
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: color }}
                />
                {name}
              </span>
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
            EkklesiaHub was built by and for the faith community, and it
            welcomes anyone drawn to spiritual writing, contemplative thought,
            or questions about meaning and purpose. Whether you&apos;re a
            pastor, a philosopher, a seeker, or simply someone who writes about
            things that matter, there&apos;s a place for you.
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
            Find your community and start writing.
          </p>
          <Link
            href="/auth?tab=signup"
            className="inline-flex items-center gap-2.5 font-body text-base font-medium bg-ink text-parchment px-8 py-3.5 rounded-lg hover:bg-ink-medium transition-all hover:-translate-y-0.5 shadow-warm-md"
          >
            Create your account <ArrowRight size={16} />
          </Link>
          <p className="font-body text-xs text-ink-ghost mt-3">Free to join.</p>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
