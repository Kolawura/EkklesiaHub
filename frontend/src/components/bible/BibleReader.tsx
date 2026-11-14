"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { ChevronLeft, ChevronRight, BookOpen } from "lucide-react";
import { useBibleChapter, type BibleVerse } from "@/hooks/bible";
import { cn } from "@/lib/utils";
import { BibleReaderSkeleton } from "./BibleReaderSkeleton";
import { useTaggedChapter } from "@/hooks/bible/study";
import { TaggedVerseText } from "./TaggedVerseText";
import { taggedToPlain } from "@/lib/taggedText";

interface BibleReaderProps {
  translation: string;
  bookName: string;
  chapter: number;
  /** Set of currently selected verse numbers — drives highlighting */
  selectedVerses: Set<number>;
  /**
   * Fired when the user clicks a verse.
   * - Plain click: toggle that single verse
   * - Shift-click: extend selection from the last-clicked verse to this one
   */
  onVerseClick: (verse: BibleVerse, shiftKey: boolean) => void;
  onNavigate: (book: string, chapter: number, verse?: number) => void;
  fontSize: "sm" | "md" | "lg" | "xl";
  lineSpacing: "compact" | "normal" | "relaxed";
  showNumbers: boolean;
  versify: boolean;
  /** When set, the reader scrolls to this verse on mount/change */
  scrollToVerse?: number | null;
  /** KJV only: colour the words of Christ (uses the tagged text) */
  redLetters?: boolean;
  /** KJV only: make Strong's-tagged words tappable */
  strongsMode?: boolean;
  /** Fired when a Strong's-tagged word is tapped */
  onWordClick?: (word: string, ids: string[]) => void;
}

const FONT_SIZES: Record<string, string> = {
  // one step smaller on phones; desktop sizes unchanged
  sm: "text-[0.875rem] sm:text-[0.9375rem]",
  md: "text-[0.9375rem] sm:text-[1.0625rem]",
  lg: "text-[1.0625rem] sm:text-[1.25rem]",
  xl: "text-[1.25rem] sm:text-[1.5rem]",
};

const LINE_SPACINGS: Record<string, string> = {
  compact: "leading-[1.65]",
  normal: "leading-[1.85]",
  relaxed: "leading-[2.15]",
};

export function BibleReader({
  translation,
  bookName,
  chapter,
  selectedVerses,
  onVerseClick,
  onNavigate,
  fontSize,
  lineSpacing,
  showNumbers,
  versify,
  scrollToVerse,
  redLetters = false,
  strongsMode = false,
  onWordClick,
}: BibleReaderProps) {
  // KJV study features (red letters, Strong's) need the tagged text. If it
  // can't be loaded, the reader quietly falls back to the plain chapter.
  const wantsTagged = translation === "KJV" && (redLetters || strongsMode);
  const tagged = useTaggedChapter(bookName, chapter, wantsTagged);
  const taggedOk = wantsTagged && !!tagged.data;
  const taggedFailed = wantsTagged && tagged.isError;
  const plain = useBibleChapter(
    translation,
    bookName,
    chapter,
    !wantsTagged || taggedFailed,
  );

  const isLoading = wantsTagged
    ? tagged.isLoading || (taggedFailed && plain.isLoading)
    : plain.isLoading;
  const isError = wantsTagged ? taggedFailed && plain.isError : plain.isError;

  // One shape for rendering, whichever source supplied the chapter.
  const data = useMemo(() => {
    const src = taggedOk ? tagged.data : plain.data;
    if (!src) return null;
    const verses: Array<{ verse: number; text: string }> = src.verses;
    return {
      book_name: src.book_name,
      book_number: src.book_number,
      chapter: src.chapter,
      total_verses: src.total_verses,
      prev_chapter: src.prev_chapter,
      next_chapter: src.next_chapter,
      max_chapters: src.max_chapters,
      verses: verses.map((v) => ({
        verse: v.verse,
        text: v.text,
        tagged: taggedOk,
        // onVerseClick expects a BibleVerse; tagged verses get a plain-text one
        bible: taggedOk
          ? ({
              id: 0,
              translation: "KJV",
              book_name: src.book_name,
              book_number: src.book_number,
              chapter: src.chapter,
              verse: v.verse,
              text: taggedToPlain(v.text),
            } as BibleVerse)
          : (v as unknown as BibleVerse),
      })),
    };
  }, [taggedOk, tagged.data, plain.data]);
  const contentRef = useRef<HTMLDivElement>(null);
  const [hoveredVerse, setHoveredVerse] = useState<number | null>(null);
  // Scroll to a specific verse when requested (e.g. from reference jump or sidebar)
  useEffect(() => {
    if (!scrollToVerse || !contentRef.current) return;
    const el = contentRef.current.querySelector(
      `[data-verse="${scrollToVerse}"]`,
    );
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [scrollToVerse, data]);

  // Scroll to top on chapter change
  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [bookName, chapter]);

  const handleClick = useCallback(
    (e: React.MouseEvent, verse: BibleVerse) => {
      onVerseClick(verse, e.shiftKey);
    },
    [onVerseClick],
  );

  if (isLoading) return <BibleReaderSkeleton />;

  if (isError || !data)
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[50vh] px-6 py-20 text-center">
        <BookOpen size={40} className="text-parchment-dark mb-4" />
        <p className="font-body text-sm text-ink-faint mb-2">
          This chapter is not available in {translation}.
        </p>
        <p className="font-body text-xs text-ink-ghost">
          Try switching to KJV or another translation.
        </p>
      </div>
    );

  return (
    <div className="mx-auto flex h-full w-full max-w-3xl flex-col">
      {/* Chapter heading */}
      <div className="shrink-0 px-4 sm:px-8 pt-6 sm:pt-10 pb-5 sm:pb-6">
        <p className="font-body text-xs uppercase tracking-[0.2em] text-gold mb-1.5">
          {translation}
        </p>
        <h1 className="font-display text-[1.5rem] sm:text-[2.25rem] font-bold text-ink tracking-tight leading-tight break-words">
          {data.book_name}
        </h1>
        <p className="font-display text-base sm:text-[1.125rem] text-ink-faint mt-1">
          Chapter {data.chapter}
        </p>
        <div className="mt-4 w-12 h-0.5 bg-gold/40 rounded-full" />
      </div>

      {/* Verses */}
      <div
        ref={contentRef}
        className="flex-1 overflow-y-auto px-4 sm:px-8 pb-16 scroll-smooth"
      >
        <div className="max-w-2xl">
          <p
            className={cn(
              "font-body text-ink-light space",
              FONT_SIZES[fontSize],
              LINE_SPACINGS[lineSpacing],
              redLetters && "woc-on",
            )}
          >
            {data.verses.map((v) => {
              const isSelected = selectedVerses.has(v.verse);
              const isHovered = hoveredVerse === v.verse;
              return (
                <span
                  key={v.verse}
                  data-verse={v.verse}
                  role="button"
                  tabIndex={0}
                  onClick={(e) => handleClick(e, v.bible)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onVerseClick(v.bible, false);
                    }
                  }}
                  onMouseEnter={() => setHoveredVerse(v.verse)}
                  onMouseLeave={() => setHoveredVerse(null)}
                  className={cn(
                    "cursor-pointer transition-colors duration-100 rounded px-0.5 -mx-0.5",
                    isSelected
                      ? "bg-gold/20 text-ink"
                      : isHovered
                        ? "bg-parchment-deep"
                        : "",
                    versify ? "flex gap-1" : "",
                  )}
                >
                  {showNumbers && (
                    <sup
                      className={cn(
                        "font-display font-bold mr-0.5 select-none transition-colors",
                        "text-[0.6em] relative top-[-0.15em]",
                        isSelected ? "text-gold" : "text-gold/50",
                        versify ? "flex items-start pt-4" : "",
                      )}
                    >
                      {v.verse}
                    </sup>
                  )}
                  {v.tagged ? (
                    // one wrapper so versify's flex layout sees a single child
                    <span>
                      <TaggedVerseText
                        text={v.text}
                        strongsMode={strongsMode}
                        onWordClick={onWordClick}
                      />
                    </span>
                  ) : (
                    v.text
                  )}{" "}
                </span>
              );
            })}
          </p>
        </div>

        {/* Bottom metadata */}
        <div className="max-w-2xl mt-12 pt-6 border-t border-parchment-dark flex items-center justify-between">
          <p className="font-body text-xs text-ink-ghost">
            {data.book_name} {data.chapter} · {data.total_verses} verses ·{" "}
            {translation}
          </p>
          {selectedVerses.size > 0 && (
            <p className="font-body text-[11px] text-gold">
              {selectedVerses.size} verse{selectedVerses.size !== 1 ? "s" : ""}{" "}
              selected
            </p>
          )}
        </div>
      </div>

      {/* Chapter navigation */}
      <div className="shrink-0 border-t border-parchment-dark bg-parchment/95 backdrop-blur-sm">
        <div className="flex items-center justify-between gap-2 px-3 sm:px-8 py-2.5 sm:py-4 pb-[max(0.625rem,env(safe-area-inset-bottom))] sm:pb-4">
          {data.prev_chapter ? (
            <button
              onClick={() => onNavigate(data.book_name, data.prev_chapter!)}
              className="inline-flex items-center gap-1.5 sm:gap-2 py-2 pr-2 font-body text-sm text-ink-faint hover:text-gold transition-colors group"
            >
              <ChevronLeft
                size={16}
                className="group-hover:-translate-x-0.5 transition-transform"
              />
              <span className="hidden sm:inline">Chapter&nbsp;</span>
              {data.prev_chapter}
            </button>
          ) : (
            <div />
          )}

          {/* Progress dots */}
          <div className="hidden md:flex items-center gap-1.5">
            {Array.from({ length: Math.min(data.max_chapters, 30) }, (_, i) => {
              const chNum = Math.ceil((i + 1) * (data.max_chapters / 30));
              const isActive = Math.abs(chNum - data.chapter) < 2;
              const isCurrent = chNum === data.chapter;
              return (
                <button
                  key={i}
                  onClick={() => onNavigate(data.book_name, chNum)}
                  className={cn(
                    "rounded-full transition-all",
                    isCurrent
                      ? "w-5 h-1.5 bg-gold"
                      : isActive
                        ? "w-1.5 h-1.5 bg-gold/40"
                        : "w-1 h-1 bg-parchment-dark hover:bg-gold/30",
                  )}
                />
              );
            })}
          </div>

          {data.next_chapter ? (
            <button
              onClick={() => onNavigate(data.book_name, data.next_chapter!)}
              className="inline-flex items-center gap-1.5 sm:gap-2 py-2 pl-2 font-body text-sm text-ink-faint hover:text-gold transition-colors group"
            >
              <span className="hidden sm:inline">Chapter&nbsp;</span>
              {data.next_chapter}
              <ChevronRight
                size={16}
                className="group-hover:translate-x-0.5 transition-transform"
              />
            </button>
          ) : (
            <div />
          )}
        </div>
      </div>
    </div>
  );
}
