"use client";

// components/bible/TodayPanel.tsx
//
// Right-hand panel on /bible: today's verse, gospel and psalm (KJV).
// "Read" opens the passage in the reader; "Write a reflection" hands it to
// the editor (login is asked for by the route guard if needed).

import { useRouter } from "next/navigation";
import { X, Loader2, CalendarDays, PenLine, BookOpen } from "lucide-react";
import { useDaily } from "@/hooks/bible/daily";
import { setPendingScripture } from "@/lib/pendingScripture";

interface TodayPanelProps {
  onClose: () => void;
  onNavigate: (
    book: string,
    chapter: number,
    verse?: number,
    endVerse?: number,
  ) => void;
}

interface Item {
  label: string;
  reference: string;
  translation: string;
  text: string;
  reflection?: string | null;
  book: string;
  chapter: number;
  verse: number;
}

export function TodayPanel({ onClose, onNavigate }: TodayPanelProps) {
  const router = useRouter();
  const { data, isLoading, isError, refetch } = useDaily("KJV");

  const items: Item[] = [];
  if (data?.verse)
    items.push({
      label: "Verse of the Day",
      reference: data.verse.reference,
      translation: data.verse.translation,
      text: data.verse.text,
      reflection: data.verse.reflection,
      book: data.verse.book_name,
      chapter: data.verse.chapter,
      verse: data.verse.verse,
    });
  if (data?.gospel)
    items.push({
      label: "Gospel",
      reference: data.gospel.reference,
      translation: data.gospel.translation,
      text: data.gospel.text,
      book: data.gospel.book_name,
      chapter: data.gospel.chapter,
      verse: data.gospel.verse,
    });
  if (data?.psalm)
    items.push({
      label: "Psalm",
      reference: data.psalm.reference,
      translation: data.psalm.translation,
      text: data.psalm.text,
      book: data.psalm.book_name,
      chapter: data.psalm.chapter,
      verse: data.psalm.verse,
    });

  const reflect = (it: Item) => {
    setPendingScripture({
      text: it.text,
      reference: it.reference,
      version: it.translation,
    });
    router.push("/new");
  };

  const dateLabel = data
    ? new Date(`${data.date}T00:00:00`).toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <div className="flex flex-col h-full bg-parchment border-l border-parchment-dark">
      <div className="shrink-0 flex items-center justify-between px-5 py-4 border-b border-parchment-dark">
        <div className="flex items-center gap-2">
          <CalendarDays size={15} className="text-gold" />
          <div>
            <p className="font-display text-sm font-semibold text-ink">Today</p>
            <p className="font-body text-[11px] text-gold min-h-4">
              {dateLabel}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          aria-label="Close"
          className="text-ink-ghost hover:text-ink transition-colors p-1"
        >
          <X size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto overscroll-y-contain">
        {isLoading && (
          <div className="flex justify-center py-10">
            <Loader2 size={16} className="animate-spin text-ink-ghost" />
          </div>
        )}

        {isError && (
          <div className="px-5 py-6">
            <p className="font-body text-sm text-ink-faint mb-3">
              Today&apos;s readings could not be loaded.
            </p>
            <button
              onClick={() => refetch()}
              className="font-body text-xs text-ink border border-parchment-dark px-3 py-1.5 rounded-lg hover:bg-parchment-deep transition-all"
            >
              Try again
            </button>
          </div>
        )}

        {data && items.length === 0 && (
          <p className="px-5 py-6 font-body text-sm text-ink-faint">
            No readings are available for today.
          </p>
        )}

        <div className="divide-y divide-parchment-dark">
          {items.map((it) => (
            <article key={it.label} className="px-5 py-5">
              <p className="font-body text-[10px] uppercase tracking-[0.18em] text-gold font-medium mb-2">
                {it.label}
              </p>
              <blockquote className="font-display text-[15px] italic text-ink leading-relaxed">
                &ldquo;{it.text}&rdquo;
              </blockquote>
              <p className="font-body text-xs text-gold font-medium mt-2">
                — {it.reference} ({it.translation})
              </p>
              {it.reflection && (
                <p className="font-body text-[13px] text-ink-faint leading-relaxed mt-3">
                  {it.reflection}
                </p>
              )}
              <div className="flex flex-wrap gap-2 mt-3">
                <button
                  onClick={() => onNavigate(it.book, it.chapter, it.verse)}
                  className="inline-flex items-center gap-1.5 font-body text-xs text-ink-faint border border-parchment-dark px-2.5 py-1.5 rounded-lg hover:bg-parchment-deep hover:text-ink transition-all"
                >
                  <BookOpen size={12} /> Read in context
                </button>
                <button
                  onClick={() => reflect(it)}
                  className="inline-flex items-center gap-1.5 font-body text-xs text-ink-faint border border-parchment-dark px-2.5 py-1.5 rounded-lg hover:bg-parchment-deep hover:text-ink transition-all"
                >
                  <PenLine size={12} /> Write a reflection
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
