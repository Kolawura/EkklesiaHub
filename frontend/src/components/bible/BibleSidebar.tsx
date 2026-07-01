"use client";

import { useState, useRef, useEffect } from "react";
import {
  ChevronDown,
  Search,
  X,
  BookOpen,
  Loader2,
  Globe,
  ChevronLeft,
} from "lucide-react";
import {
  useBibleBooks,
  useBibleTranslations,
  useBibleSearch,
  BibleBook,
} from "@/hooks/bible";
import { cn } from "@/lib/utils";

interface BibleSidebarProps {
  translation: string;
  bookName: string;
  chapter: number;
  onTranslationChange: (t: string) => void;
  onNavigate: (book: string, chapter: number, verse?: number) => void;
}

type Panel = "navigator" | "search";

// ── Book list organised by testament ──────────────────────────────
function BookGrid({
  books,
  currentBook,
  onSelect,
}: {
  books: BibleBook[];
  currentBook: string;
  onSelect: (book: BibleBook) => void;
}) {
  const ot = books.filter((b) => b.testament === "OT");
  const nt = books.filter((b) => b.testament === "NT");

  const Section = ({ label, items }: { label: string; items: BibleBook[] }) => (
    <div className="mb-4">
      <p className="font-body text-[10px] uppercase tracking-widest text-gold/70 font-medium px-3 mb-2">
        {label}
      </p>
      <div className="grid grid-cols-2 gap-0.5">
        {items.map((book) => (
          <button
            key={book.book_number}
            onClick={() => onSelect(book)}
            className={cn(
              "text-left px-3 py-1.5 rounded-lg font-body text-xs transition-all",
              book.book_name === currentBook
                ? "bg-gold text-parchment font-semibold"
                : "text-ink-faint hover:text-ink hover:bg-parchment-dark",
            )}
          >
            {book.book_name}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="overflow-y-auto flex-1 px-2 py-2">
      <Section label="Old Testament" items={ot} />
      <Section label="New Testament" items={nt} />
    </div>
  );
}

// ── Chapter picker ─────────────────────────────────────────────────
function ChapterPicker({
  max,
  current,
  onSelect,
}: {
  max: number;
  current: number;
  onSelect: (ch: number) => void;
}) {
  return (
    <div className="grid grid-cols-5 gap-1 p-3 overflow-y-auto">
      {Array.from({ length: max }, (_, i) => i + 1).map((ch) => (
        <button
          key={ch}
          onClick={() => onSelect(ch)}
          className={cn(
            "aspect-square rounded-lg font-body text-sm font-medium transition-all",
            ch === current
              ? "bg-gold text-parchment shadow-warm-sm"
              : "text-ink-faint hover:text-ink hover:bg-parchment-dark",
          )}
        >
          {ch}
        </button>
      ))}
    </div>
  );
}

// ── Translation Picker ─────────────────────────────────────────────
function TranslationPicker({
  current,
  onChange,
  onClose,
}: {
  current: string;
  onChange: (t: string) => void;
  onClose: () => void;
}) {
  const { data: translations } = useBibleTranslations();
  const featured = translations?.filter((t) => t.is_featured) ?? [];
  const others = translations?.filter((t) => !t.is_featured) ?? [];

  return (
    <div className="absolute right-0 top-full mt-1.5 bg-parchment border border-parchment-dark rounded-2xl shadow-warm-lg z-30 overflow-hidden">
      <div className="px-4 py-3 border-b border-parchment-dark flex items-center justify-between">
        <p className="font-display text-sm font-semibold text-ink">
          Translation
        </p>
        <button
          onClick={onClose}
          className="text-ink-ghost hover:text-ink transition-colors"
        >
          <X size={14} />
        </button>
      </div>

      <div className="max-h-80 overflow-y-auto p-2">
        {featured.length > 0 && (
          <>
            <p className="font-body text-[10px] uppercase tracking-widest text-gold/70 font-medium px-2 py-1.5">
              Featured
            </p>
            {featured.map((t) => (
              <button
                key={t.translation}
                onClick={() => {
                  onChange(t.translation);
                  onClose();
                }}
                className={cn(
                  "w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all",
                  t.translation === current
                    ? "bg-gold-bg text-gold border border-gold-pale"
                    : "hover:bg-parchment-deep",
                )}
              >
                <span
                  className={cn(
                    "font-display font-bold text-sm w-12 shrink-0",
                    t.translation === current ? "text-gold" : "text-ink",
                  )}
                >
                  {t.translation}
                </span>
                <div className="min-w-0">
                  {t.description && (
                    <p className="font-body text-[11px] text-ink-ghost leading-snug line-clamp-1">
                      {t.description}
                    </p>
                  )}
                </div>
              </button>
            ))}
          </>
        )}

        {others.length > 0 && (
          <>
            <p className="font-body text-[10px] uppercase tracking-widest text-ink-ghost font-medium px-2 py-1.5 mt-2">
              All installed ({others.length})
            </p>
            {others.map((t) => (
              <button
                key={t.translation}
                onClick={() => {
                  onChange(t.translation);
                  onClose();
                }}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-xl font-body text-sm transition-all",
                  t.translation === current
                    ? "bg-gold-bg text-gold"
                    : "text-ink-faint hover:text-ink hover:bg-parchment-deep",
                )}
              >
                {t.translation}
              </button>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

// ── Search Panel ───────────────────────────────────────────────────
function SearchPanel({
  translation,
  onNavigate,
}: {
  translation: string;
  onNavigate: (book: string, chapter: number, verse: number) => void;
}) {
  const { search, reset, loading, results, total, error } = useBibleSearch();
  const [query, setQuery] = useState("");
  const [testament, setTestament] = useState<"OT" | "NT" | "">("");
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleChange = (val: string) => {
    setQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (val.trim().length < 2) {
      reset();
      return;
    }
    debounceRef.current = setTimeout(() => {
      search(val, translation, { testament: (testament as any) || undefined });
    }, 350);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Search input */}
      <div className="px-3 py-3 border-b border-parchment-dark space-y-2">
        <div className="relative">
          <Search
            size={13}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-ghost pointer-events-none"
          />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="Search all scripture…"
            className="w-full pl-8 pr-7 py-2 font-body text-sm bg-parchment border border-parchment-dark rounded-xl text-ink placeholder-ink-ghost outline-none focus:border-gold-pale focus:ring-2 focus:ring-gold/10 transition-all"
          />
          {query && (
            <button
              onClick={() => {
                setQuery("");
                reset();
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-ghost hover:text-ink transition-colors"
            >
              <X size={11} />
            </button>
          )}
        </div>

        {/* Testament filter */}
        <div className="flex gap-1.5">
          {(["", "OT", "NT"] as const).map((t) => (
            <button
              key={t || "all"}
              onClick={() => {
                setTestament(t);
                if (query.trim().length >= 2) {
                  search(query, translation, { testament: t || undefined });
                }
              }}
              className={cn(
                "flex-1 py-1 font-body text-[11px] rounded-lg transition-all",
                testament === t
                  ? "bg-gold-bg text-gold border border-gold-pale font-medium"
                  : "text-ink-ghost hover:text-ink border border-parchment-dark",
              )}
            >
              {t || "All"}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto">
        {loading && (
          <div className="flex justify-center py-8">
            <Loader2 size={18} className="animate-spin text-ink-ghost" />
          </div>
        )}

        {error && (
          <p className="font-body text-xs text-red-500 px-4 py-3">{error}</p>
        )}

        {!loading && results.length === 0 && query.length >= 2 && !error && (
          <div className="text-center py-10">
            <p className="font-body text-sm text-ink-ghost">
              No results for "{query}"
            </p>
            <p className="font-body text-xs text-ink-ghost mt-1">
              Try different words or check spelling
            </p>
          </div>
        )}

        {!loading && results.length > 0 && (
          <>
            <p className="font-body text-[11px] text-ink-ghost px-4 py-2 border-b border-parchment-deep">
              {total.toLocaleString()} result{total !== 1 ? "s" : ""}
            </p>
            {results.map((r, i) => (
              <button
                key={i}
                onClick={() => onNavigate(r.book_name, r.chapter, r.verse)}
                className="w-full text-left px-4 py-3.5 border-b border-parchment-deep last:border-0 hover:bg-parchment-deep transition-colors"
              >
                <p className="font-body text-[11px] font-semibold text-gold mb-1">
                  {r.book_name} {r.chapter}:{r.verse}
                </p>
                <p
                  className="font-body text-xs text-ink-faint leading-relaxed line-clamp-3"
                  dangerouslySetInnerHTML={{ __html: r.snippet }}
                />
              </button>
            ))}
          </>
        )}

        {!query && (
          <div className="px-4 py-8 text-center">
            <Search size={28} className="mx-auto text-parchment-dark mb-3" />
            <p className="font-body text-sm text-ink-ghost">
              Search across all installed translations
            </p>
            <p className="font-body text-[11px] text-ink-ghost mt-1">
              Powered by PostgreSQL full-text search
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── MAIN SIDEBAR ───────────────────────────────────────────────────
export function BibleSidebar({
  translation,
  bookName,
  chapter,
  onTranslationChange,
  onNavigate,
}: BibleSidebarProps) {
  const [panel, setPanel] = useState<Panel>("navigator");
  const [selectedBook, setSelectedBook] = useState<BibleBook | null>(null);
  const [showTranslation, setShowTrans] = useState(false);
  const transRef = useRef<HTMLDivElement>(null);

  const { data: books = [] } = useBibleBooks();
  const currentBook = books.find((b) => b.book_name === bookName);

  // Close translation picker on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (transRef.current && !transRef.current.contains(e.target as Node)) {
        setShowTrans(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleBookSelect = (book: BibleBook) => {
    setSelectedBook(book);
  };

  const handleChapterSelect = (ch: number) => {
    if (selectedBook) {
      onNavigate(selectedBook.book_name, ch);
      setSelectedBook(null);
    }
  };

  const maxChapters =
    currentBook?.book_name === selectedBook?.book_name ? undefined : undefined; // will be loaded from chapter data

  return (
    <div className="flex flex-col h-full bg-parchment-deep border-r border-parchment-dark">
      {/* Header */}
      <div className="shrink-0 px-4 py-4 border-b border-parchment-dark">
        {/* Translation toggle */}
        <div ref={transRef} className="relative mb-3">
          <button
            onClick={() => setShowTrans(!showTranslation)}
            className={cn(
              "w-full flex items-center justify-between px-3 py-2 rounded-xl border font-body text-sm font-medium transition-all",
              showTranslation
                ? "bg-gold-bg text-gold border-gold-pale"
                : "text-ink-faint border-parchment-dark hover:border-gold-pale hover:text-ink",
            )}
          >
            <div className="flex items-center gap-2">
              <Globe size={13} className="shrink-0" />
              <span>{translation}</span>
            </div>
            <ChevronDown
              size={12}
              className={cn(
                "transition-transform",
                showTranslation ? "rotate-180" : "",
              )}
            />
          </button>

          {showTranslation && (
            <TranslationPicker
              current={translation}
              onChange={onTranslationChange}
              onClose={() => setShowTrans(false)}
            />
          )}
        </div>

        {/* Panel tabs */}
        <div className="flex gap-0.5">
          {[
            { id: "navigator" as Panel, icon: BookOpen, label: "Books" },
            { id: "search" as Panel, icon: Search, label: "Search" },
          ].map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setPanel(id)}
              className={cn(
                "flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg font-body text-xs font-medium transition-all",
                panel === id
                  ? "bg-ink text-parchment"
                  : "text-ink-ghost hover:text-ink hover:bg-parchment-dark",
              )}
            >
              <Icon size={12} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {panel === "search" ? (
          <SearchPanel
            translation={translation}
            onNavigate={(book, ch, verse) => {
              onNavigate(book, ch, verse);
              setPanel("navigator");
            }}
          />
        ) : selectedBook ? (
          /* Chapter picker */
          <div className="flex flex-col h-full">
            <div className="px-3 py-2.5 border-b border-parchment-dark flex items-center gap-2">
              <button
                onClick={() => setSelectedBook(null)}
                className="text-ink-ghost hover:text-ink transition-colors"
              >
                <ChevronLeft size={15} />
              </button>
              <p className="font-display text-sm font-semibold text-ink">
                {selectedBook.book_name}
              </p>
            </div>
            <ChapterPicker
              max={150} // will render up to 150, backend returns only valid ones
              current={selectedBook.book_name === bookName ? chapter : 0}
              onSelect={handleChapterSelect}
            />
          </div>
        ) : (
          /* Book list */
          <BookGrid
            books={books}
            currentBook={bookName}
            onSelect={handleBookSelect}
          />
        )}
      </div>

      {/* Current location footer */}
      <div className="shrink-0 px-4 py-3 border-t border-parchment-dark bg-parchment">
        <p className="font-body text-[11px] text-ink-ghost text-center">
          <span className="text-gold font-medium">
            {bookName} {chapter}
          </span>
          {" · "}
          {translation}
        </p>
      </div>
    </div>
  );
}
