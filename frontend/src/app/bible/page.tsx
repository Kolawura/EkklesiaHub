"use client";

import { useState, useCallback, useEffect } from "react";
import { GitCompare, X } from "lucide-react";
import { BibleSidebar } from "@/components/bible/BibleSidebar";
import { BibleReader } from "@/components/bible/BibleReader";
import { BibleToolbar } from "@/components/bible/BibleToolbar";
import { CompareDrawer } from "@/components/bible/CompareDrawer";
import { VerseOfTheDay } from "@/components/bible/VerseOfTheDay";
import { BibleVerse } from "@/hooks/bible";
import { cn } from "@/lib/utils";

// Persist reader preferences in localStorage
const PREFS_KEY = "ekk-bible-prefs";
interface ReaderPrefs {
  translation: string;
  fontSize: "sm" | "md" | "lg" | "xl";
  lineSpacing: "compact" | "normal" | "relaxed";
  showNumbers: boolean;
}

function loadPrefs(): ReaderPrefs {
  if (typeof window === "undefined") return DEFAULT_PREFS;
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    return raw ? { ...DEFAULT_PREFS, ...JSON.parse(raw) } : DEFAULT_PREFS;
  } catch {
    return DEFAULT_PREFS;
  }
}

function savePrefs(prefs: ReaderPrefs) {
  try {
    localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
  } catch {}
}

const DEFAULT_PREFS: ReaderPrefs = {
  translation: "KJV",
  fontSize: "md",
  lineSpacing: "normal",
  showNumbers: true,
};

export default function BiblePage() {
  const [prefs, setPrefs] = useState<ReaderPrefs>(DEFAULT_PREFS);

  // Load from localStorage after hydration
  useEffect(() => {
    setPrefs(loadPrefs());
  }, []);

  const [bookName, setBookName] = useState("Genesis");
  const [chapter, setChapter] = useState(1);
  const [activeVerse, setActive] = useState<number | null>(null);
  const [activeVerseEnd, setActiveEnd] = useState<number | null>(null);
  const [compareVerse, setCompare] = useState<BibleVerse | null>(null);
  const [showVotd, setShowVotd] = useState(true);

  const updatePrefs = useCallback((patch: Partial<ReaderPrefs>) => {
    setPrefs((prev) => {
      const next = { ...prev, ...patch };
      savePrefs(next);
      return next;
    });
  }, []);

  const navigate = useCallback(
    (book: string, ch: number, verse?: number, endVerse?: number) => {
      setBookName(book);
      setChapter(ch);
      setActive(verse ?? null);
      setActiveEnd(endVerse && endVerse > (verse ?? 0) ? endVerse : null);
      setShowVotd(false);
      setCompare(null);
    },
    [],
  );

  const handleVerseClick = useCallback((verse: BibleVerse) => {
    setActive((prev) => (prev === verse.verse ? null : verse.verse));
    setActiveEnd(null);
  }, []);

  const handleCompare = useCallback((verse: BibleVerse) => {
    setCompare((prev) =>
      prev?.verse === verse.verse && prev.chapter === verse.chapter
        ? null
        : verse,
    );
    setActive(verse.verse);
    setActiveEnd(null);
  }, []);

  return (
    <div className="h-screen flex flex-col bg-parchment overflow-hidden">
      {/* ── Three-panel layout ── */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT: Book/chapter navigator + search */}
        <div className="w-56 shrink-0 flex flex-col overflow-hidden">
          <BibleSidebar
            translation={prefs.translation}
            bookName={bookName}
            chapter={chapter}
            onTranslationChange={(t) => updatePrefs({ translation: t })}
            onNavigate={navigate}
          />
        </div>

        {/* CENTRE: Reading area */}
        <div className="flex-1 flex flex-col overflow-hidden border-x border-parchment-dark">
          {/* Toolbar */}
          <BibleToolbar
            translation={prefs.translation}
            bookName={bookName}
            chapter={chapter}
            fontSize={prefs.fontSize}
            lineSpacing={prefs.lineSpacing}
            showNumbers={prefs.showNumbers}
            onFontSize={(s) => updatePrefs({ fontSize: s })}
            onLineSpacing={(s) => updatePrefs({ lineSpacing: s })}
            onShowNumbers={(v) => updatePrefs({ showNumbers: v })}
            onNavigate={navigate}
          />

          {/* VOTD banner — dismissible */}
          {showVotd && (
            <div className="shrink-0 relative border-b border-parchment-dark">
              <button
                onClick={() => setShowVotd(false)}
                className="absolute top-2 right-3 text-parchment/30 hover:text-parchment/60 transition-colors z-10"
                title="Dismiss"
              >
                <X size={14} />
              </button>
              <div className="px-8 py-5">
                <VerseOfTheDay
                  translation={prefs.translation}
                  onNavigate={navigate}
                  compact
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
              activeVerse={activeVerse}
              activeVerseEnd={activeVerseEnd}
              onNavigate={navigate}
              onVerseClick={handleVerseClick}
              fontSize={prefs.fontSize}
              lineSpacing={prefs.lineSpacing}
              showNumbers={prefs.showNumbers}
            />
          </div>

          {/* Verse action bar — appears when a verse is selected */}
          {activeVerse && (
            <div className="shrink-0 border-t border-parchment-dark bg-parchment px-8 py-3">
              <div className="flex items-center gap-3">
                <p className="font-body text-xs text-ink-ghost">
                  <span className="text-gold font-medium">
                    {bookName} {chapter}:{activeVerse}
                    {activeVerseEnd ? `-${activeVerseEnd}` : ""}
                  </span>{" "}
                  selected
                </p>
                <button
                  onClick={() => {
                    setCompare({
                      id: 0,
                      translation: prefs.translation,
                      book_name: bookName,
                      book_number: 0,
                      chapter,
                      verse: activeVerse,
                      text: "",
                    });
                  }}
                  className={cn(
                    "inline-flex items-center gap-1.5 font-body text-xs px-3 py-1.5 rounded-lg border transition-all",
                    compareVerse?.verse === activeVerse
                      ? "bg-gold-bg text-gold border-gold-pale"
                      : "text-ink-ghost border-parchment-dark hover:text-gold hover:bg-gold-bg hover:border-gold-pale",
                  )}
                >
                  <GitCompare size={12} />
                  Compare translations
                </button>
                <button
                  onClick={() => {
                    setActive(null);
                    setActiveEnd(null);
                  }}
                  className="ml-auto text-ink-ghost hover:text-ink transition-colors"
                >
                  <X size={13} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT: Compare drawer (slides in when verse selected) */}
        <div
          className={cn(
            "shrink-0 overflow-hidden transition-all duration-300",
            compareVerse ? "w-80" : "w-0",
          )}
        >
          {compareVerse && (
            <CompareDrawer
              verse={compareVerse}
              onClose={() => {
                setCompare(null);
                setActive(null);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
