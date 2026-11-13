"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Copy, Check, GitCompare, X, BookOpen } from "lucide-react";
import { BibleSidebar } from "@/components/bible/BibleSidebar";
import { BibleReader } from "@/components/bible/BibleReader";
import { BibleToolbar } from "@/components/bible/BibleToolbar";
import { CompareDrawer } from "@/components/bible/CompareDrawer";
import { VerseOfTheDay } from "@/components/bible/VerseOfTheDay";
import { useBibleChapter, type BibleVerse } from "@/hooks/bible";
import { cn } from "@/lib/utils";

// ─── Reader preferences ────────────────────────────────────────────
const PREFS_KEY = "ekk-bible-prefs";
interface ReaderPrefs {
  translation: string;
  fontSize: "sm" | "md" | "lg" | "xl";
  lineSpacing: "compact" | "normal" | "relaxed";
  showNumbers: boolean;
  versify: boolean;
}
const DEFAULT_PREFS: ReaderPrefs = {
  translation: "KJV",
  fontSize: "md",
  lineSpacing: "normal",
  showNumbers: true,
  versify: false,
};
function loadPrefs(): ReaderPrefs {
  if (typeof window === "undefined") return DEFAULT_PREFS;
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    return raw ? { ...DEFAULT_PREFS, ...JSON.parse(raw) } : DEFAULT_PREFS;
  } catch {
    return DEFAULT_PREFS;
  }
}
function savePrefs(p: ReaderPrefs) {
  try {
    localStorage.setItem(PREFS_KEY, JSON.stringify(p));
  } catch {}
}

// ─── Verse action bar ──────────────────────────────────────────────
/**
 * The text used for the compare drawer must match BibleVerse, but we only
 * need one representative verse to open the compare panel (which then
 * fetches all translations for that verse). We always use the first
 * selected verse for compare, and show a note if the user selected multiple.
 */
function VerseActionBar({
  bookName,
  chapter,
  translation,
  selectedVerses,
  onCompare,
  onClear,
}: {
  bookName: string;
  chapter: number;
  translation: string;
  selectedVerses: Set<number>;
  onCompare: (verses: BibleVerse[]) => void;
  onClear: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const sorted = Array.from(selectedVerses).sort((a, b) => a - b);
  const first = sorted[0];
  const last = sorted[sorted.length - 1];

  // Fetch the chapter data to get verse texts for copy
  const { data: chapterData } = useBibleChapter(translation, bookName, chapter);

  const referenceLabel =
    sorted.length === 1
      ? `${bookName} ${chapter}:${first}`
      : `${bookName} ${chapter}:${first}–${last}`;

  const handleCopy = () => {
    if (!chapterData) return;
    const verseTexts = sorted
      .map((vNum) => {
        const vData = chapterData.verses.find((v) => v.verse === vNum);
        return vData ? `[${vNum}] ${vData.text}` : null;
      })
      .filter(Boolean)
      .join(" ");

    const text = `${verseTexts}\n— ${referenceLabel} (${translation})`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleCompare = () => {
    if (!chapterData) return;
    // Every selected verse gets compared, not just the first — order
    // preserved as the user selected (CompareDrawer re-sorts for display).
    const verseData = sorted
      .map((vNum) => chapterData.verses.find((v) => v.verse === vNum))
      .filter((v): v is BibleVerse => Boolean(v));
    if (verseData.length > 0) onCompare(verseData);
  };

  return (
    <div className="shrink-0 border-t border-parchment-dark bg-parchment px-3 sm:px-6 py-2.5 sm:py-3 pb-[max(0.625rem,env(safe-area-inset-bottom))] sm:pb-3">
      <div className="flex items-center gap-3 flex-wrap">
        {/* Reference label */}
        <div className="flex items-center gap-1.5">
          <BookOpen size={11} className="text-gold" />
          <span className="font-body text-xs font-medium text-gold">
            {referenceLabel}
          </span>
          <span className="font-body text-xs text-ink-ghost">
            ({sorted.length} verse{sorted.length !== 1 ? "s" : ""} selected)
          </span>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          {/* Copy */}
          <button
            onClick={handleCopy}
            disabled={!chapterData}
            className={cn(
              "inline-flex items-center gap-1.5 font-body text-xs px-3 py-1.5 rounded-lg border transition-all",
              copied
                ? "text-gold border-gold-pale bg-gold-bg"
                : "text-ink-ghost border-parchment-dark hover:text-gold hover:bg-gold-bg hover:border-gold-pale disabled:opacity-40",
            )}
          >
            {copied ? <Check size={11} /> : <Copy size={11} />}
            {copied ? "Copied!" : "Copy"}
          </button>

          {/* Compare */}
          <button
            onClick={handleCompare}
            disabled={!chapterData}
            className="inline-flex items-center gap-1.5 font-body text-xs px-3 py-1.5 rounded-lg border text-ink-ghost border-parchment-dark hover:text-gold hover:bg-gold-bg hover:border-gold-pale disabled:opacity-40 transition-all"
          >
            <GitCompare size={11} />
            Compare{" "}
            {sorted.length > 1 ? `${sorted.length} verses` : "translations"}
          </button>

          {/* Clear */}
          <button
            onClick={onClear}
            className="ml-1 text-ink-ghost hover:text-ink transition-colors"
            title="Clear selection"
          >
            <X size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────
export default function BiblePage() {
  const [prefs, setPrefs] = useState<ReaderPrefs>(DEFAULT_PREFS);
  useEffect(() => {
    setPrefs(loadPrefs());
  }, []);

  const [bookName, setBookName] = useState("Genesis");
  const [chapter, setChapter] = useState(1);
  const [scrollToVerse, setScrollToVerse] = useState<number | null>(null);
  const [showVotd, setShowVotd] = useState(true);
  const [compareVerses, setCompareVerses] = useState<BibleVerse[]>([]);
  // Book navigator drawer — only used below xl, where the sidebar isn't inline
  const [booksOpen, setBooksOpen] = useState(false);

  // Escape closes whichever overlay is open
  useEffect(() => {
    if (!booksOpen && compareVerses.length === 0) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setBooksOpen(false);
      setCompareVerses([]);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [booksOpen, compareVerses.length]);

  // Multi-verse selection
  const [selectedVerses, setSelectedVerses] = useState<Set<number>>(new Set());
  // Track the last verse clicked — used for shift-click range extension
  const lastClickedVerse = useRef<number | null>(null);

  const updatePrefs = useCallback((patch: Partial<ReaderPrefs>) => {
    setPrefs((prev) => {
      const next = { ...prev, ...patch };
      savePrefs(next);
      return next;
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedVerses(new Set());
    lastClickedVerse.current = null;
  }, []);

  /**
   * navigate() is called from:
   * - BibleSidebar (book/chapter/verse drill-down)
   * - BibleToolbar (reference jump — may carry a range)
   * - VerseOfTheDay
   * - BibleReader (prev/next chapter dots)
   *
   * When a verse is supplied, we scroll to it and pre-select it.
   * When a range is supplied (endVerse), we select the whole range.
   */
  const navigate = useCallback(
    (book: string, ch: number, verse?: number, endVerse?: number) => {
      setBookName(book);
      setChapter(ch);
      setScrollToVerse(verse ?? null);
      setShowVotd(false);
      setCompareVerses([]);
      setBooksOpen(false); // picking a chapter in the drawer closes it

      if (verse != null) {
        const end = endVerse ?? verse;
        const range = new Set<number>();
        for (let v = verse; v <= end; v++) range.add(v);
        setSelectedVerses(range);
        lastClickedVerse.current = verse;
      } else {
        clearSelection();
      }
    },
    [clearSelection],
  );

  /**
   * Verse click handler — supports:
   * - Click: toggle the verse (add if not selected, remove if selected)
   * - Shift-click: select the contiguous range from the last clicked verse to this one
   */
  const handleVerseClick = useCallback(
    (verse: BibleVerse, shiftKey: boolean) => {
      setSelectedVerses((prev) => {
        const next = new Set(prev);

        if (shiftKey && lastClickedVerse.current != null) {
          // Extend selection from last clicked to this verse
          const from = Math.min(lastClickedVerse.current, verse.verse);
          const to = Math.max(lastClickedVerse.current, verse.verse);
          for (let v = from; v <= to; v++) next.add(v);
        } else {
          // Toggle single verse
          if (next.has(verse.verse)) {
            next.delete(verse.verse);
          } else {
            next.add(verse.verse);
          }
          lastClickedVerse.current = verse.verse;
        }

        return next;
      });
    },
    [],
  );

  // NOTE: bookName/chapter only ever change via navigate() above, which
  // already sets scrollToVerse/selectedVerses correctly for BOTH cases —
  // null/cleared for a plain chapter change, or the target verse/range for
  // a verse-targeted jump. A separate "clear on chapter change" effect used
  // to live here, but since it also fires on every verse-targeted
  // navigation (bookName/chapter change then too), it was resetting
  // scrollToVerse and the highlight back to nothing right after navigate()
  // set them — which is why jumping to a verse in a different chapter
  // (search results, cross-references, Verse of the Day, sidebar
  // drill-down) never landed on the right spot.

  return (
    /*
     * Standalone public page (no app shell), so the toolbar carries its own
     * Back link. Full viewport height via h-dvh.
     *
     *   ≥ xl : [book navigator | reader | compare]  — all inline columns
     *   < xl : reader only; navigator = left drawer ("Books" button),
     *          compare = bottom sheet (phones) / right panel (tablets)
     */
    <div className="relative flex h-dvh overflow-hidden">
      {/* Backdrop for the book navigator drawer */}
      <div
        onClick={() => setBooksOpen(false)}
        aria-hidden="true"
        className={cn(
          "fixed inset-0 z-40 bg-ink/40 backdrop-blur-[2px] transition-opacity duration-300 xl:hidden",
          booksOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />

      {/* LEFT: Book navigator */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-80 max-w-[88vw] shadow-warm-lg",
          "transition-[transform,visibility] duration-300 ease-out",
          "xl:visible xl:static xl:z-auto xl:w-60 xl:max-w-none xl:shrink-0 xl:translate-x-0 xl:shadow-none xl:transition-none",
          booksOpen ? "visible translate-x-0" : "invisible -translate-x-full",
        )}
      >
        <BibleSidebar
          translation={prefs.translation}
          bookName={bookName}
          chapter={chapter}
          onTranslationChange={(t) => updatePrefs({ translation: t })}
          onClose={() => setBooksOpen(false)}
          onNavigate={navigate}
        />
      </div>

      {/* CENTRE: Reading area */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden xl:border-x xl:border-parchment-dark">
        <BibleToolbar
          translation={prefs.translation}
          bookName={bookName}
          chapter={chapter}
          fontSize={prefs.fontSize}
          lineSpacing={prefs.lineSpacing}
          showNumbers={prefs.showNumbers}
          versify={prefs.versify}
          onFontSize={(s) => updatePrefs({ fontSize: s })}
          onLineSpacing={(s) => updatePrefs({ lineSpacing: s })}
          onShowNumbers={(v) => updatePrefs({ showNumbers: v })}
          onVersify={(b) => updatePrefs({ versify: b })}
          onOpenBooks={() => setBooksOpen(true)}
          onNavigate={navigate}
        />
        <div className="flex-1 overflow-y-auto overscroll-y-contain">
          {/* Verse of the Day banner */}
          {showVotd && (
            <div className="shrink-0 relative border-b border-parchment-dark">
              <button
                onClick={() => setShowVotd(false)}
                className="absolute top-4 right-5 sm:top-5 sm:right-8 p-1.5 text-gold hover:text-red-600 transition-colors z-10 cursor-pointer"
                title="Dismiss"
                aria-label="Dismiss verse of the day"
              >
                <X size={16} />
              </button>
              <div className="px-3 py-3 sm:px-6 sm:py-4">
                <VerseOfTheDay
                  translation={prefs.translation}
                  onNavigate={navigate}
                  compact={false}
                />
              </div>
            </div>
          )}

          {/* Reader */}
          <div className="flex-1 overflow-hidden">
            <BibleReader
              translation={prefs.translation}
              bookName={bookName}
              chapter={chapter}
              selectedVerses={selectedVerses}
              onVerseClick={handleVerseClick}
              onNavigate={navigate}
              fontSize={prefs.fontSize}
              lineSpacing={prefs.lineSpacing}
              showNumbers={prefs.showNumbers}
              scrollToVerse={scrollToVerse}
              versify={prefs.versify}
            />
          </div>
        </div>
        {/* Multi-verse action bar */}
        {selectedVerses.size > 0 && (
          <VerseActionBar
            bookName={bookName}
            chapter={chapter}
            translation={prefs.translation}
            selectedVerses={selectedVerses}
            onCompare={(verses) => {
              setCompareVerses(verses);
            }}
            onClear={clearSelection}
          />
        )}
      </div>

      {/* RIGHT: Compare — inline column ≥ xl, overlay sheet below */}
      {compareVerses.length > 0 && (
        <>
          <div
            className="fixed inset-0 z-40 bg-ink/40 backdrop-blur-[2px] xl:hidden"
            onClick={() => setCompareVerses([])}
            aria-hidden="true"
          />
          <div
            className={cn(
              "fixed inset-x-0 bottom-0 top-[18dvh] z-50 overflow-hidden rounded-t-2xl shadow-warm-lg",
              "sm:inset-x-auto sm:right-0 sm:top-0 sm:w-96 sm:rounded-none",
              "xl:static xl:z-auto xl:h-full xl:w-80 xl:shrink-0 xl:shadow-none",
            )}
          >
            <CompareDrawer
              verses={compareVerses}
              onClose={() => setCompareVerses([])}
            />
          </div>
        </>
      )}
    </div>
  );
}
