"use client";

import { useState } from "react";
import { BookOpen, ChevronRight, Sparkles, Quote } from "lucide-react";
import { useVerseOfTheDay } from "@/hooks/bible";
import { cn } from "@/lib/utils";

interface VerseOfTheDayProps {
  translation: string;
  onNavigate: (book: string, chapter: number, verse: number) => void;
  compact?: boolean;
}

export function VerseOfTheDay({
  translation,
  onNavigate,
  compact = false,
}: VerseOfTheDayProps) {
  const { data, isLoading } = useVerseOfTheDay(translation);
  const [showReflection, setShowReflection] = useState(false);
  console.log("Verse of the Day:", data);

  if (isLoading) return <VerseOfTheDaySkeleton compact={compact} />;
  if (!data) return null;

  const date = new Date(data.date).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  if (compact) {
    return (
      <div
        className="group relative overflow-hidden rounded-2xl border border-gold-pale bg-gold-bg cursor-pointer hover:shadow-warm-md transition-all"
        onClick={() => onNavigate(data.book_name, data.chapter, data.verse)}
      >
        {/* Ruled lines texture */}
        <div
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg,transparent,transparent 22px,rgba(184,125,44,0.12) 22px,rgba(184,125,44,0.12) 23px)",
          }}
        />
        <div className="relative px-4 py-4">
          <div className="flex items-center gap-1.5 mb-2">
            <Sparkles size={11} className="text-gold" />
            <p className="font-body text-[10px] uppercase tracking-[0.18em] text-gold font-medium">
              Verse of the Day
            </p>
          </div>
          <p className="font-display text-sm italic text-ink leading-relaxed line-clamp-3 mb-2">
            &quot;{data.text}&quot;
          </p>
          <p className="font-body text-[11px] text-gold font-medium">
            — {data.reference} ({data.translation})
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-gold-pale/60">
      {/* Background — ink with ruled lines */}
      <div className="absolute inset-0 bg-ink" />
      <div
        className="absolute inset-0 opacity-100"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg,transparent,transparent 24px,rgba(184,125,44,0.07) 24px,rgba(184,125,44,0.07) 25px)",
        }}
      />
      {/* Ambient gold glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gold/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-gold/5 rounded-full blur-2xl pointer-events-none" />

      <div className="relative px-8 py-8">
        {/* Label */}
        <div className="flex items-center gap-2 mb-6">
          <Sparkles size={13} className="text-gold" />
          <p className="font-body text-[10px] uppercase tracking-[0.22em] text-gold font-medium">
            Verse of the Day
          </p>
          <span className="text-gold/30 mx-1">·</span>
          <p className="font-body text-[10px] text-parchment/40">{date}</p>
        </div>

        {/* Large opening quote */}
        <Quote
          size={48}
          className="text-gold/10 mb-2 -ml-2"
          fill="currentColor"
        />

        {/* Verse text */}
        <blockquote className="font-display text-[1.4rem] italic font-light text-parchment leading-[1.6] tracking-[0.01em] mb-5">
          {data.text}
        </blockquote>

        {/* Reference */}
        <p className="font-body text-sm font-medium text-gold mb-6">
          — {data.reference}{" "}
          <span className="text-parchment/40 font-normal">
            ({data.translation})
          </span>
        </p>

        {/* Reflection toggle */}
        <button
          onClick={() => setShowReflection(!showReflection)}
          className="inline-flex items-center gap-1.5 font-body text-xs text-parchment/50 hover:text-parchment/80 transition-colors mb-4"
        >
          <span>{showReflection ? "Hide" : "Reflection"}</span>
          <ChevronRight
            size={12}
            className={cn(
              "transition-transform",
              showReflection ? "rotate-90" : "",
            )}
          />
        </button>

        {showReflection && (
          <div className="border-l-2 border-gold/30 pl-4 mb-6">
            <p className="font-body text-sm italic text-parchment/60 leading-relaxed">
              {data.reflection}
            </p>
          </div>
        )}

        {/* Read in context CTA */}
        <button
          onClick={() => onNavigate(data.book_name, data.chapter, data.verse)}
          className="inline-flex items-center gap-2 font-body text-xs font-medium text-parchment bg-parchment/10 hover:bg-parchment/15 border border-parchment/15 px-4 py-2 rounded-lg transition-all"
        >
          <BookOpen size={12} />
          Read in context
          <ChevronRight size={11} />
        </button>
      </div>
    </div>
  );
}

function VerseOfTheDaySkeleton({ compact }: { compact: boolean }) {
  if (compact) {
    return (
      <div className="rounded-2xl border border-gold-pale bg-gold-bg p-4 animate-pulse">
        <div className="h-2.5 w-24 bg-gold/20 rounded-full mb-3" />
        <div className="space-y-2 mb-3">
          <div className="h-3 bg-gold/15 rounded-full w-full" />
          <div className="h-3 bg-gold/15 rounded-full w-4/5" />
        </div>
        <div className="h-2.5 w-32 bg-gold/20 rounded-full" />
      </div>
    );
  }
  return (
    <div className="rounded-2xl bg-ink border border-gold-pale/30 p-8 animate-pulse">
      <div className="h-2.5 w-32 bg-parchment/10 rounded-full mb-6" />
      <div className="space-y-3 mb-5">
        <div className="h-5 bg-parchment/10 rounded-full w-full" />
        <div className="h-5 bg-parchment/10 rounded-full w-5/6" />
        <div className="h-5 bg-parchment/10 rounded-full w-3/4" />
      </div>
      <div className="h-3 w-40 bg-gold/20 rounded-full" />
    </div>
  );
}
