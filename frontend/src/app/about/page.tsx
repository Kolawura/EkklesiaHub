import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PublicNav } from "@/components/bars/PublicNav";
import { PublicFooter } from "@/components/bars/PublicFooter";
import { CrossOrnament } from "@/components/ui/CrossOrnament";

const VALUES = [
  { icon: "📖", title: "Rooted in faith",          desc: "We were built by the faith community, for the faith community — and everyone curious enough to ask the deeper questions." },
  { icon: "👥", title: "Community first",           desc: "Writing in isolation diminishes its reach. We create spaces for real fellowship around shared ideas and convictions." },
  { icon: "🌍", title: "Global and welcoming",      desc: "The world's spiritual landscape is vast. Our platform welcomes writers from every tradition, background, and stage of belief." },
  { icon: "❤",  title: "Made with care",            desc: "Every feature is crafted thoughtfully. We take seriously the trust you place in us when you share your words here." },
];

const TEAM = [
  { name: "Emmanuel Adebayo", role: "Founder & CEO",       initials: "EA" },
  { name: "Grace Nwosu",      role: "Head of Product",     initials: "GN" },
  { name: "Samuel Park",      role: "Lead Engineer",       initials: "SP" },
  { name: "Miriam Okafor",    role: "Community Lead",      initials: "MO" },
];

const TIMELINE = [
  { year: "2022", event: "EkklesiaHub founded with a conviction: faith writers deserved a real home." },
  { year: "2023", event: "Beta launch with 500 writers across 12 countries — mostly word of mouth." },
  { year: "2024", event: "Communities feature launched. 10,000 writers joined within six months." },
  { year: "2025", event: "Analytics, bookmarks, and a rebuilt editor shipped. Still growing." },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-parchment text-ink overflow-x-hidden">
      <PublicNav />

      {/* Hero */}
      <section className="relative pt-36 pb-20 text-center overflow-hidden">
        <div aria-hidden className="absolute inset-0 bg-ruled pointer-events-none" />
        <div className="relative z-10 max-w-3xl mx-auto px-6">
          <CrossOrnament className="w-9 h-9 text-gold opacity-45 mx-auto mb-5" />
          <p className="font-body text-[11px] uppercase tracking-[0.14em] text-gold font-medium mb-4">
            Our Story
          </p>
          <h1 className="font-display text-[clamp(2.5rem,6vw,4.5rem)] font-bold tracking-tight leading-tight text-ink mb-5">
            Built for those who write
            <br />
            <em className="not-italic text-gold font-semibold">with something to say.</em>
          </h1>
          <p className="font-body text-lg text-ink-faint max-w-xl mx-auto leading-relaxed">
            EkklesiaHub was born out of a simple conviction: the world's faith communities have
            always been filled with powerful writers. They just needed a platform built for them.
          </p>
        </div>
      </section>

      {/* Mission + Timeline */}
      <section className="py-24 bg-parchment">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div>
            <p className="font-body text-[11px] uppercase tracking-[0.14em] text-gold font-medium mb-4">
              Our Mission
            </p>
            <h2 className="font-display text-[clamp(1.875rem,4vw,2.75rem)] font-bold tracking-tight text-ink leading-tight mb-5">
              To give every spiritual writer a pulpit
            </h2>
            <div className="space-y-4 font-body text-base text-ink-faint leading-relaxed">
              <p>
                For generations, theological and spiritual writing was locked behind institutions —
                seminaries, publishers, denominational presses. The internet changed access,
                but most platforms weren't built with faith writers in mind.
              </p>
              <p>
                EkklesiaHub is different. We built every feature for the writer who takes
                their craft seriously: the pastor composing a weekly reflection, the theologian
                making a careful argument, the seeker working through their questions in public.
              </p>
              <p>
                And while our roots are in the Christian community, the door is open.
                If you write about faith, meaning, purpose, or any of the big questions —
                there's a community here for you.
              </p>
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-0">
            {TIMELINE.map(({ year, event }, i) => (
              <div key={year} className="flex gap-5 pb-8 last:pb-0 relative">
                {/* line */}
                {i < TIMELINE.length - 1 && (
                  <div className="absolute left-5 top-10 bottom-0 w-px bg-parchment-dark" />
                )}
                <div className="w-10 h-10 rounded-full bg-gold-bg border border-gold-pale flex items-center justify-center font-display text-[11px] font-bold text-gold shrink-0 z-10">
                  {year.slice(2)}
                </div>
                <div className="pt-2">
                  <p className="font-body text-[11px] uppercase tracking-widest text-gold font-medium mb-1">
                    {year}
                  </p>
                  <p className="font-body text-sm text-ink-faint leading-relaxed">{event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-parchment-deep">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="font-body text-[11px] uppercase tracking-[0.14em] text-gold font-medium mb-3">
              What we believe
            </p>
            <h2 className="font-display text-[clamp(1.875rem,4vw,3rem)] font-bold tracking-tight text-ink">
              Our values
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {VALUES.map(({ icon, title, desc }) => (
              <div
                key={title}
                className="bg-parchment border border-parchment-dark rounded-2xl p-6 card-gold-top hover:border-gold-pale hover:shadow-warm-md hover:-translate-y-0.5 transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-gold-bg border border-gold-pale flex items-center justify-center text-xl mb-4">
                  {icon}
                </div>
                <h3 className="font-display text-[1.0625rem] font-semibold text-ink mb-2">{title}</h3>
                <p className="font-body text-sm text-ink-faint leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 bg-parchment">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="font-body text-[11px] uppercase tracking-[0.14em] text-gold font-medium mb-3">
              The people
            </p>
            <h2 className="font-display text-[clamp(1.875rem,4vw,3rem)] font-bold tracking-tight text-ink mb-3">
              Who builds EkklesiaHub
            </h2>
            <p className="font-body text-base text-ink-faint max-w-md mx-auto leading-relaxed">
              A small team with a big conviction: spiritual writers deserve great tools.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
            {TEAM.map(({ name, role, initials }) => (
              <div key={name} className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-gold-bg border-2 border-gold-pale flex items-center justify-center font-display text-xl font-bold text-gold mx-auto mb-3">
                  {initials}
                </div>
                <p className="font-display text-sm font-semibold text-ink">{name}</p>
                <p className="font-body text-xs text-ink-ghost mt-0.5">{role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Scripture section */}
      <section className="py-24 bg-ink relative overflow-hidden">
        <div aria-hidden className="absolute inset-0 bg-ruled pointer-events-none" />
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <CrossOrnament className="w-7 h-7 text-gold-light opacity-40 mx-auto mb-7" />
          <blockquote>
            <p className="font-display text-[clamp(1.5rem,4vw,2.5rem)] italic font-light text-parchment leading-[1.4] max-w-xl mx-auto mb-4">
              "Of making many books there is no end, and much study is a weariness of the flesh."
            </p>
            <footer className="font-body text-sm text-parchment/35 tracking-wide">
              — Ecclesiastes 12:12
            </footer>
          </blockquote>
          <p className="font-body text-base text-parchment/45 max-w-md mx-auto mt-6 leading-relaxed">
            We write anyway — because the right words, at the right time,
            in the right community, change lives.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-28 bg-parchment-deep relative overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 55% 55% at 50% 50%, rgba(184,125,44,0.06), transparent)" }}
        />
        <div className="relative z-10 max-w-2xl mx-auto px-6 text-center space-y-5">
          <CrossOrnament className="w-9 h-9 text-gold opacity-40 mx-auto" />
          <h2 className="font-display text-[clamp(2rem,5vw,3.5rem)] font-bold tracking-tight leading-tight text-ink">
            Join the<br />
            <em className="not-italic text-gold font-semibold">community.</em>
          </h2>
          <p className="font-body text-base text-ink-faint max-w-sm mx-auto leading-relaxed">
            Be part of a platform built for writers who believe their words matter.
          </p>
          <Link
            href="/auth?tab=signup"
            className="inline-flex items-center gap-2.5 font-body text-base font-medium bg-ink text-parchment px-8 py-3.5 rounded-lg hover:bg-ink-medium transition-all hover:-translate-y-0.5 shadow-warm-md"
          >
            Start writing free <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
