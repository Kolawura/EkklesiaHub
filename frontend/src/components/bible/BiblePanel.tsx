"use client";

import { useState, useRef, useEffect, useCallback, KeyboardEvent } from "react";
import {
  BookOpen,
  Search,
  Copy,
  Check,
  ChevronDown,
  ChevronLeft,
  X,
  Loader2,
  BookMarked,
  Hash,
} from "lucide-react";
import {
  useBibleBooks,
  useBibleSearch,
  useBibleTranslations,
  useBibleBookMeta,
  useBibleChapterMeta,
  useReferenceJump,
  type SearchResult,
  type TranslationInfo,
  type ResolvedReference,
} from "@/hooks/bible";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────

type Mode = "lookup" | "search" | "browse";

interface BiblePanelProps {
  /** Called when user clicks "Insert" — passes verse text + reference */
  onInsert?: (text: string, reference: string, version: string) => void;
  /** Whether the Insert button should be shown (hide outside the editor) */
  showInsert?: boolean;
  /** Compact mode for inline/drawer context */
  compact?: boolean;
}

// ─────────────────────────────────────────────────────────────────
// Copy button
// ─────────────────────────────────────────────────────────────────

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <button
      onClick={copy}
      title="Copy to clipboard"
      className="p-1.5 text-ink-ghost hover:text-gold hover:bg-gold-bg rounded-lg transition-all"
    >
      {copied ? <Check size={12} className="text-gold" /> : <Copy size={12} />}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────
// Translation picker — loaded from the local DB
//
// Anchored `right-0` with a width relative to itself (not the full
// header), and capped with `max-w-[80vw]` so it never overflows the
// panel even in the narrow `compact` drawer used inside the editor.
// ─────────────────────────────────────────────────────────────────

function TranslationPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (t: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { data: translations, isLoading } = useBibleTranslations();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const sorted = translations
    ? [
        ...translations.filter((t) => t.is_featured),
        ...translations.filter((t) => !t.is_featured),
      ]
    : [];

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        onClick={() => setOpen(!open)}
        disabled={isLoading}
        className="inline-flex items-center gap-1.5 font-body text-xs font-medium text-ink-faint bg-parchment-deep border border-parchment-dark px-2.5 py-1 rounded-lg hover:border-gold-pale hover:text-ink transition-all disabled:opacity-50"
      >
        {isLoading ? <Loader2 size={10} className="animate-spin" /> : value}
        <ChevronDown
          size={10}
          className={cn("transition-transform", open ? "rotate-180" : "")}
        />
      </button>

      {open && sorted.length > 0 && (
        <div className="absolute right-0 top-full mt-1.5 w-56 max-w-[80vw] bg-parchment border border-parchment-dark rounded-xl shadow-warm-lg z-50 overflow-hidden">
          <div className="max-h-64 overflow-y-auto p-1">
            {sorted.map((t: TranslationInfo) => (
              <button
                key={t.translation}
                onClick={() => {
                  onChange(t.translation);
                  setOpen(false);
                }}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center justify-between gap-3",
                  t.translation === value
                    ? "bg-gold-bg text-gold"
                    : "hover:bg-parchment-deep",
                )}
              >
                <span
                  className={cn(
                    "font-display font-bold text-xs shrink-0",
                    t.translation === value ? "text-gold" : "text-ink",
                  )}
                >
                  {t.translation}
                </span>
                {t.description && (
                  <span className="font-body text-[10px] text-ink-ghost truncate">
                    {t.description}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Single verse result card (search mode)
// ─────────────────────────────────────────────────────────────────

function VerseCard({
  verse,
  translation,
  onInsert,
  showInsert,
}: {
  verse: SearchResult;
  translation: string;
  onInsert?: (text: string, ref: string, version: string) => void;
  showInsert?: boolean;
}) {
  const reference = `${verse.book_name} ${verse.chapter}:${verse.verse}`;
  const formatted = `"${verse.text}" — ${reference} (${translation})`;

  return (
    <div className="group bg-parchment border border-parchment-dark rounded-xl p-4 hover:border-gold-pale transition-all">
      <p className="font-body text-xs font-semibold text-gold mb-2 flex items-center gap-1.5">
        <Hash size={10} />
        {reference}
        <span className="font-normal text-ink-ghost normal-case tracking-normal ml-0.5">
          · {translation}
        </span>
      </p>
      <p
        className="font-body text-sm text-ink-light leading-relaxed [&_em]:not-italic [&_em]:font-semibold [&_em]:text-gold"
        dangerouslySetInnerHTML={{ __html: verse.snippet || verse.text }}
      />
      <div className="flex items-center gap-1 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <CopyButton text={formatted} />
        {showInsert && onInsert && (
          <button
            onClick={() => onInsert(verse.text, reference, translation)}
            className="inline-flex items-center gap-1 font-body text-[11px] font-medium text-gold bg-gold-bg border border-gold-pale px-2.5 py-1 rounded-lg hover:bg-gold-bg/80 transition-colors"
          >
            Insert into editor
          </button>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Lookup result card — handles both a single verse and a range
// (e.g. "Romans 8:28-30"). The full passage text is joined together
// for copy/insert, while individual verse numbers are still shown.
// ─────────────────────────────────────────────────────────────────

function LookupCard({
  result,
  translation,
  onInsert,
  showInsert,
}: {
  result: ResolvedReference;
  translation: string;
  onInsert?: (text: string, ref: string, version: string) => void;
  showInsert?: boolean;
}) {
  const isRange = result.endVerse !== result.startVerse;
  const reference = isRange
    ? `${result.book_name} ${result.chapter}:${result.startVerse}-${result.endVerse}`
    : `${result.book_name} ${result.chapter}:${result.startVerse}`;

  // Join all verses into one passage for copy/insert
  const fullText = result.verses.map((v) => v.text).join(" ");
  const formatted = `"${fullText}" — ${reference} (${translation})`;

  return (
    <div className="bg-parchment border border-parchment-dark rounded-xl p-4">
      <div className="flex items-start justify-between gap-2 mb-3">
        <div>
          <p className="font-display text-sm font-semibold text-gold">
            {reference}
          </p>
          <p className="font-body text-[10px] text-ink-ghost mt-0.5">
            {translation}
          </p>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <CopyButton text={formatted} />
          {showInsert && onInsert && (
            <button
              onClick={() => onInsert(fullText, reference, translation)}
              className="inline-flex items-center gap-1 font-body text-[11px] font-medium text-gold bg-gold-bg border border-gold-pale px-2.5 py-1 rounded-lg hover:bg-gold-bg/80 transition-colors"
            >
              Insert
            </button>
          )}
        </div>
      </div>

      {isRange ? (
        <p className="font-body text-sm text-ink-light leading-[1.85] tracking-[0.01em]">
          {result.verses.map((v) => (
            <span key={v.verse}>
              <sup className="font-display font-bold text-gold/60 text-[0.65em] mr-0.5">
                {v.verse}
              </sup>
              {v.text}{" "}
            </span>
          ))}
        </p>
      ) : (
        <p className="font-body text-sm text-ink-light leading-[1.85] tracking-[0.01em] italic">
          &quot;{fullText}&quot;
        </p>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Book browser — 3-level drill-down: Books → Chapters → Verses
// ─────────────────────────────────────────────────────────────────

type BrowseLevel = "books" | "chapters" | "verses";

function BookBrowser({
  translation,
  onSelect,
}: {
  translation: string;
  onSelect: (reference: string) => void;
}) {
  const [level, setLevel] = useState<BrowseLevel>("books");
  const [testament, setTestament] = useState<"OT" | "NT">("NT");
  const [selectedBook, setSelectedBook] = useState<{ name: string } | null>(
    null,
  );
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null);
  const { data: books, isLoading: booksLoading } = useBibleBooks(testament);
  const { data: chapterMeta, isLoading: chaptersLoading } = useBibleBookMeta(
    translation,
    selectedBook?.name ?? "",
    level === "chapters" || level === "verses",
  );
  const { data: verseMeta, isLoading: versesLoading } = useBibleChapterMeta(
    translation,
    selectedBook?.name ?? "",
    selectedChapter ?? 0,
    level === "verses",
  );

  const handleBack = () => {
    if (level === "verses") {
      setLevel("chapters");
      setSelectedChapter(null);
    } else if (level === "chapters") {
      setLevel("books");
      setSelectedBook(null);
    }
  };

  const breadcrumb =
    level === "chapters"
      ? selectedBook?.name
      : level === "verses"
        ? `${selectedBook?.name} ${selectedChapter}`
        : null;

  return (
    <div>
      {/* Breadcrumb / back */}
      {level !== "books" && (
        <div className="flex items-center gap-1.5 mb-2.5">
          <button
            onClick={handleBack}
            className="text-ink-ghost hover:text-gold transition-colors"
          >
            <ChevronLeft size={14} />
          </button>
          <span className="font-display text-xs font-semibold text-ink">
            {breadcrumb}
          </span>
          <span className="font-body text-[10px] text-ink-ghost ml-auto">
            {level === "chapters" ? "Pick a chapter" : "Pick a verse"}
          </span>
        </div>
      )}

      {/* Testament toggle — only shown at books level */}
      {level === "books" && (
        <div className="flex gap-1 mb-2.5">
          {(["OT", "NT"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTestament(t)}
              className={cn(
                "flex-1 py-1.5 font-body text-xs font-medium rounded-lg transition-all",
                testament === t
                  ? "bg-ink text-parchment"
                  : "text-ink-faint bg-parchment-deep border border-parchment-dark hover:text-ink",
              )}
            >
              {t === "OT" ? "Old Testament" : "New Testament"}
            </button>
          ))}
        </div>
      )}

      {/* Level: Books */}
      {level === "books" &&
        (booksLoading ? (
          <div className="grid grid-cols-3 gap-1.5">
            {Array.from({ length: 9 }).map((_, i) => (
              <div
                key={i}
                className="h-8 bg-parchment-deep rounded-lg animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-1 max-h-64 overflow-y-auto">
            {(books ?? []).map((book) => (
              <button
                key={book.book_number}
                onClick={() => {
                  setSelectedBook({ name: book.book_name });
                  setLevel("chapters");
                }}
                className="text-left font-body text-xs text-ink-faint hover:text-gold hover:bg-gold-bg border border-transparent hover:border-gold-pale px-2 py-1.5 rounded-lg transition-all truncate"
                title={book.book_name}
              >
                {book.book_name}
              </button>
            ))}
          </div>
        ))}

      {/* Level: Chapters */}
      {level === "chapters" &&
        (chaptersLoading ? (
          <div className="flex justify-center py-6">
            <Loader2 size={16} className="animate-spin text-ink-ghost" />
          </div>
        ) : (
          <div className="grid grid-cols-5 gap-1 max-h-64 overflow-y-auto">
            {Array.from(
              { length: chapterMeta?.maxChapters ?? 0 },
              (_, i) => i + 1,
            ).map((ch) => (
              <button
                key={ch}
                onClick={() => {
                  setSelectedChapter(ch);
                  setLevel("verses");
                }}
                className="aspect-square rounded-lg font-body text-xs font-medium text-ink-faint hover:text-gold hover:bg-gold-bg border border-transparent hover:border-gold-pale transition-all"
              >
                {ch}
              </button>
            ))}
          </div>
        ))}

      {/* Level: Verses */}
      {level === "verses" &&
        (versesLoading ? (
          <div className="flex justify-center py-6">
            <Loader2 size={16} className="animate-spin text-ink-ghost" />
          </div>
        ) : (
          <div className="grid grid-cols-5 gap-1 max-h-64 overflow-y-auto">
            {Array.from(
              { length: verseMeta?.totalVerses ?? 0 },
              (_, i) => i + 1,
            ).map((v) => (
              <button
                key={v}
                onClick={() => {
                  if (selectedBook && selectedChapter) {
                    onSelect(`${selectedBook.name} ${selectedChapter}:${v}`);
                    // Reset drill
                    setLevel("books");
                    setSelectedBook(null);
                    setSelectedChapter(null);
                  }
                }}
                className="aspect-square rounded-lg font-body text-xs font-medium text-ink-faint hover:text-gold hover:bg-gold-bg border border-transparent hover:border-gold-pale transition-all"
              >
                {v}
              </button>
            ))}
          </div>
        ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Main BiblePanel
// ─────────────────────────────────────────────────────────────────

export function BiblePanel({
  onInsert,
  showInsert = false,
  compact = false,
}: BiblePanelProps) {
  const [mode, setMode] = useState<Mode>("lookup");
  const [translation, setTranslation] = useState("KJV");
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Lookup state — useReferenceJump now returns the FULL resolved
  // range (verses with text included), not just the first verse.
  const {
    lookup,
    loading: lookupLoading,
    error: lookupError,
  } = useReferenceJump();
  const [lookupResult, setLookupResult] = useState<ResolvedReference | null>(
    null,
  );
  const [lookupFailed, setLookupFailed] = useState(false);

  // Search state
  const {
    search,
    reset: resetSearch,
    loading: searchLoading,
    results,
    error: searchError,
  } = useBibleSearch();

  const loading = lookupLoading || searchLoading;
  const error = lookupError || searchError;

  const resetAll = useCallback(() => {
    resetSearch();
    setLookupResult(null);
    setLookupFailed(false);
    setInput("");
  }, [resetSearch]);

  const runLookup = useCallback(
    async (ref: string, t: string) => {
      setLookupResult(null);
      setLookupFailed(false);
      const result = await lookup(ref, t);
      if (result) {
        setLookupResult(result);
      } else {
        setLookupFailed(true);
      }
    },
    [lookup],
  );

  const handleTranslationChange = useCallback(
    (t: string) => {
      setTranslation(t);
      if (mode === "lookup" && input.trim() && lookupResult) {
        runLookup(input.trim(), t);
      }
    },
    [mode, input, lookupResult, runLookup],
  );

  const handleSubmit = useCallback(() => {
    const val = input.trim();
    if (!val) return;

    if (mode === "lookup") {
      runLookup(val, translation);
    } else if (mode === "search") {
      setLookupResult(null);
      search(val, translation);
    }
  }, [input, mode, translation, runLookup, search]);

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSubmit();
    if (e.key === "Escape") {
      resetAll();
      inputRef.current?.focus();
    }
  };

  const handleBrowseSelect = useCallback(
    (ref: string) => {
      setInput(ref);
      setMode("lookup");
      runLookup(ref, translation);
    },
    [runLookup, translation],
  );

  const modeLabel: Record<Mode, string> = {
    lookup: "Reference — e.g. John 3:16 or Romans 8:28-30",
    search: "Search — e.g. 'love your neighbour'",
    browse: "Browse books",
  };

  return (
    <div
      className={cn(
        "flex flex-col bg-parchment border border-parchment-dark rounded-2xl overflow-hidden",
        compact ? "max-h-104" : "h-full",
      )}
    >
      {/* Header */}
      <div className="relative flex items-center justify-between gap-2 px-4 py-3 border-b border-parchment-dark shrink-0 bg-parchment-deep">
        <div className="flex items-center gap-2 min-w-0">
          <BookOpen size={14} className="text-gold shrink-0" />
          <span className="font-display text-sm font-semibold text-ink truncate">
            Scripture
          </span>
        </div>
        <TranslationPicker
          value={translation}
          onChange={handleTranslationChange}
        />
      </div>

      {/* Mode tabs */}
      <div className="flex border-b border-parchment-dark shrink-0">
        {(
          [
            { id: "lookup" as Mode, icon: Hash, label: "Lookup" },
            { id: "search" as Mode, icon: Search, label: "Search" },
            { id: "browse" as Mode, icon: BookMarked, label: "Browse" },
          ] as const
        ).map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => {
              setMode(id);
              resetAll();
            }}
            className={cn(
              "flex-1 inline-flex items-center justify-center gap-1.5 py-2 font-body text-xs transition-all border-b-2 -mb-px",
              mode === id
                ? "text-gold border-gold font-medium"
                : "text-ink-ghost border-transparent hover:text-ink-faint",
            )}
          >
            <Icon size={11} />
            {label}
          </button>
        ))}
      </div>

      {/* Input — shown for lookup and search */}
      {mode !== "browse" && (
        <div className="flex items-center gap-2 px-3 py-2.5 border-b border-parchment-dark shrink-0">
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder={modeLabel[mode]}
              className="w-full pr-7 py-2 px-3 font-body text-sm bg-parchment border border-parchment-dark rounded-lg text-ink placeholder-ink-ghost outline-none focus:border-gold-pale focus:ring-2 focus:ring-gold/10 transition-all"
            />
            {input && (
              <button
                onClick={() => {
                  resetAll();
                  inputRef.current?.focus();
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-ink-ghost hover:text-ink transition-colors"
              >
                <X size={12} />
              </button>
            )}
          </div>
          <button
            onClick={handleSubmit}
            disabled={!input.trim() || loading}
            className="shrink-0 inline-flex items-center justify-center w-8 h-8 bg-ink text-parchment rounded-lg hover:bg-ink-medium disabled:opacity-40 transition-all"
          >
            {loading ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <Search size={13} />
            )}
          </button>
        </div>
      )}

      {/* Content area */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {/* Error */}
        {(error || lookupFailed) && (
          <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
            <span className="text-red-500 text-sm shrink-0">⚠</span>
            <p className="font-body text-xs text-red-600 leading-relaxed">
              {error ||
                'Reference not found. Try a different format — e.g. "John 3:16" or "Romans 8:28-30".'}
            </p>
          </div>
        )}

        {/* Browse */}
        {mode === "browse" && (
          <BookBrowser
            translation={translation}
            onSelect={handleBrowseSelect}
          />
        )}

        {/* Loading skeleton */}
        {loading && !error && (
          <div className="space-y-2.5 animate-pulse">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="h-20 bg-parchment-deep rounded-xl" />
            ))}
          </div>
        )}

        {/* Lookup result — single verse or full range */}
        {!loading && lookupResult && (
          <LookupCard
            result={lookupResult}
            translation={translation}
            onInsert={onInsert}
            showInsert={showInsert}
          />
        )}

        {/* Search results */}
        {!loading && results.length > 0 && (
          <div className="space-y-2">
            <p className="font-body text-[11px] text-ink-ghost px-1">
              {results.length} result{results.length !== 1 ? "s" : ""}
            </p>
            {results.map((verse) => (
              <VerseCard
                key={`${verse.book_number}-${verse.chapter}-${verse.verse}`}
                verse={verse}
                translation={translation}
                onInsert={onInsert}
                showInsert={showInsert}
              />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading &&
          !error &&
          !lookupFailed &&
          !lookupResult &&
          results.length === 0 &&
          mode !== "browse" && (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <BookOpen size={32} className="text-parchment-dark mb-3" />
              <p className="font-body text-sm text-ink-ghost mb-1">
                {mode === "lookup"
                  ? "Enter a reference to look it up"
                  : "Search for words or phrases"}
              </p>
              <p className="font-body text-[11px] text-ink-ghost">
                {mode === "lookup"
                  ? 'e.g. "John 3:16", "Psalm 23", "Romans 8:28-30"'
                  : 'e.g. "grace", "love your neighbour", "faith"'}
              </p>
            </div>
          )}
      </div>
    </div>
  );
}
