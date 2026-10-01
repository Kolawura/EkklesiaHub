"use client";

import { useState } from "react";
import {
  X,
  GitCompare,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useCompareVerse, BibleVerse } from "@/hooks/bible";
import { cn } from "@/lib/utils";

const ALL_TRANSLATIONS = [
  "KJV",
  "NIV",
  "ESV",
  "NKJV",
  "NLT",
  "NASB",
  "MSG",
  "AMP",
  "CSB",
  "NET",
  "ASV",
  "YLT",
  "DARBY",
  "NRSV",
  "RSV",
  "HCSB",
  "GNT",
  "MEV",
  "ERV",
  "GW",
  "TL",
  "LSB",
  "BEREAN",
  "PASSION",
  "AMPC",
  "NIRV",
  "EASY",
];

/**
 * Collapses a sorted list of verse numbers into a print-Bible-style label,
 * e.g. [3, 7, 8] -> "3, 7-8", [3, 4, 5, 7] -> "3-5, 7".
 */
function formatVerseList(verses: number[]): string {
  if (verses.length === 0) return "";
  const parts: string[] = [];
  let start = verses[0];
  let prev = verses[0];

  for (let i = 1; i <= verses.length; i++) {
    const current = verses[i];
    if (current !== prev + 1) {
      parts.push(start === prev ? `${start}` : `${start}-${prev}`);
      start = current;
    }
    prev = current;
  }
  return parts.join(", ");
}

interface CompareDrawerProps {
  /** One or more verses to compare — order is preserved as given. */
  verses: BibleVerse[];
  onClose: () => void;
}

/** Renders one verse's translation-by-translation comparison. Each instance
 * owns its own useCompareVerse call, so hook rules stay respected across a
 * dynamic list of selected verses (list is keyed by verse number below). */
function CompareVerseSection({
  verse,
  translations,
}: {
  verse: BibleVerse;
  translations: string[];
}) {
  const { data, isLoading } = useCompareVerse(
    verse.book_name,
    verse.chapter,
    verse.verse,
    translations,
    translations.length > 0,
  );

  return (
    <div className="border-b border-parchment-dark last:border-b-0">
      <div className="sticky top-0 z-10 bg-parchment-deep/95 backdrop-blur-sm px-5 py-2 border-b border-parchment-dark">
        <p className="font-display text-xs font-bold text-ink">
          Verse {verse.verse}
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 size={16} className="animate-spin text-ink-ghost" />
        </div>
      ) : !data ? null : (
        <div className="divide-y divide-parchment-dark">
          {data.entries.map((entry) => (
            <div
              key={entry.translation}
              className={cn(
                "px-5 py-4 transition-colors",
                entry.available ? "hover:bg-parchment-deep" : "opacity-40",
              )}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="font-display text-sm font-bold text-gold">
                  {entry.translation}
                </span>
                {entry.available ? (
                  <CheckCircle2 size={11} className="text-emerald-500" />
                ) : (
                  <AlertCircle size={11} className="text-ink-ghost" />
                )}
                {!entry.available && (
                  <span className="font-body text-[10px] text-ink-ghost italic">
                    not installed
                  </span>
                )}
              </div>

              {entry.available ? (
                <p className="font-body text-sm text-ink-light leading-[1.8] tracking-[0.01em]">
                  {entry.text}
                </p>
              ) : (
                <p className="font-body text-xs text-ink-ghost italic">
                  Run: npm run seed:bible -- --only {entry.translation}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function CompareDrawer({ verses, onClose }: CompareDrawerProps) {
  const [selected, setSelected] = useState<string[]>([
    "KJV",
    "NIV",
    "ESV",
    "NKJV",
    "NLT",
    "NASB",
  ]);
  const [showPicker, setShowPicker] = useState(false);

  const toggle = (t: string) => {
    setSelected((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t],
    );
  };

  if (verses.length === 0) return null;

  const bookName = verses[0].book_name;
  const chapter = verses[0].chapter;
  const verseNumbers = verses.map((v) => v.verse).sort((a, b) => a - b);
  const reference = `${bookName} ${chapter}:${formatVerseList(verseNumbers)}`;

  return (
    <div className="flex flex-col h-full bg-parchment border-l border-parchment-dark">
      {/* Header */}
      <div className="shrink-0 flex items-center justify-between px-5 py-4 border-b border-parchment-dark">
        <div className="flex items-center gap-2">
          <GitCompare size={15} className="text-gold" />
          <div>
            <p className="font-display text-sm font-semibold text-ink">
              Compare
            </p>
            <p className="font-body text-[11px] text-gold">{reference}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-ink-ghost hover:text-ink transition-colors p-1"
        >
          <X size={16} />
        </button>
      </div>

      {/* Translation selector */}
      <div className="shrink-0 px-5 py-3 border-b border-parchment-dark">
        <div className="flex items-center justify-between mb-2">
          <p className="font-body text-[11px] text-ink-ghost uppercase tracking-widest">
            {selected.length} translations
          </p>
          <button
            onClick={() => setShowPicker(!showPicker)}
            className="font-body text-[11px] text-gold hover:underline"
          >
            {showPicker ? "Done" : "Edit"}
          </button>
        </div>

        {showPicker ? (
          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
            {ALL_TRANSLATIONS.map((t) => (
              <button
                key={t}
                onClick={() => toggle(t)}
                className={cn(
                  "font-body text-[11px] font-medium px-2.5 py-1 rounded-full border transition-all",
                  selected.includes(t)
                    ? "bg-gold-bg text-gold border-gold-pale"
                    : "text-ink-ghost border-parchment-dark hover:border-ink-ghost hover:text-ink",
                )}
              >
                {t}
              </button>
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {selected.map((t) => (
              <span
                key={t}
                className="font-body text-[11px] font-medium px-2.5 py-1 bg-gold-bg text-gold border border-gold-pale rounded-full"
              >
                {t}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Compare results — one section per selected verse */}
      <div className="flex-1 overflow-y-auto">
        {verses
          .slice()
          .sort((a, b) => a.verse - b.verse)
          .map((v) => (
            <CompareVerseSection
              key={v.verse}
              verse={v}
              translations={selected}
            />
          ))}
      </div>
    </div>
  );
}
