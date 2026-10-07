import type { ReactNode } from "react";
import { PublicNav } from "@/components/bars/PublicNav";
import { PublicFooter } from "@/components/bars/PublicFooter";

export const LEGAL_CONFIG = {
  operator: "AuDev Solutions",
  contactEmail: "legal@example.com",
  governingLaw: "the Federal Republic of Nigeria",
  lastUpdated: "5 October 2026",
};

export function LegalPage({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-parchment text-ink overflow-x-hidden">
      <PublicNav />
      <header className="relative pt-36 pb-12 text-center">
        <div
          aria-hidden
          className="absolute inset-0 bg-ruled pointer-events-none"
        />
        <div className="relative z-10 max-w-3xl mx-auto px-6">
          <p className="font-body text-[11px] uppercase tracking-[0.14em] text-gold font-medium mb-4">
            {eyebrow}
          </p>
          <h1 className="font-display text-[clamp(2.25rem,5vw,3.5rem)] font-bold tracking-tight leading-tight text-ink mb-4">
            {title}
          </h1>
          <p className="font-body text-base text-ink-faint leading-relaxed">
            {intro}
          </p>
          <p className="font-body text-xs text-ink-ghost mt-3">
            Last updated: {LEGAL_CONFIG.lastUpdated}
          </p>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-6 pb-24 space-y-10">
        {children}
      </main>
      <PublicFooter />
    </div>
  );
}

export function LegalSection({
  heading,
  children,
}: {
  heading: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-3">
      <h2 className="font-display text-xl font-semibold text-ink">{heading}</h2>
      <div className="font-body text-[0.9375rem] text-ink-faint leading-relaxed space-y-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_a]:text-gold [&_a:hover]:underline">
        {children}
      </div>
    </section>
  );
}
