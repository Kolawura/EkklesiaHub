"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import {
  BookOpen,
  Search,
  Copy,
  Check,
  ChevronDown,
  X,
  Loader2,
  BookMarked,
  Hash,
} from "lucide-react";
import {
  useBible,
  DEFAULT_VERSIONS as BIBLE_VERSIONS,
  BIBLE_BOOKS,
  type ScriptureVerse,
} from "@/hooks/useBible";
import { cn } from "@/lib/utils";

type Mode = "lookup" | "search" | "browse";

interface BiblePanelProps {
  /** Called when user clicks "Insert" — passes formatted text for the editor */
  onInsert?: (text: string, reference: string) => void;
  /** Whether the Insert button should be shown (hide outside the editor) */
  showInsert?: boolean;
  /** Compact mode for the comment / discussion context */
  compact?: boolean;
}

/* ── Version selector ── */
function VersionPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = BIBLE_VERSIONS.find((v) => v.id === value)!;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-1.5 font-body text-xs font-medium text-ink-faint bg-parchment-deep border border-parchment-dark px-2.5 py-1 rounded-lg hover:border-gold-pale hover:text-ink transition-all"
      >
        {current.label}
        <ChevronDown
          size={10}
          className={cn("transition-transform", open ? "rotate-180" : "")}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 bg-parchment border border-parchment-dark rounded-xl shadow-warm-md z-50 overflow-hidden min-w-45">
          {BIBLE_VERSIONS.map((v) => (
            <button
              key={v.id}
              onClick={() => {
                onChange(v.id);
                setOpen(false);
              }}
              className={cn(
                "w-full text-left px-3.5 py-2 font-body text-xs hover:bg-parchment-deep transition-colors flex items-center justify-between gap-3",
                v.id === value ? "text-gold font-medium" : "text-ink-faint",
              )}
            >
              <span className="font-medium text-ink text-[11px]">
                {v.label}
              </span>
              <span className="text-ink-ghost">{v.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Copy button with check feedback ── */
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

/* ── Single verse result card ── */
function VerseCard({
  verse,
  onInsert,
  showInsert,
}: {
  verse: ScriptureVerse;
  onInsert?: (text: string, ref: string) => void;
  showInsert?: boolean;
}) {
  const formatted = `"${verse.text}" — ${verse.reference}`;

  return (
    <div className="group bg-parchment border border-parchment-dark rounded-xl p-4 hover:border-gold-pale transition-all">
      <p className="font-body text-xs font-semibold text-gold mb-2 flex items-center gap-1.5">
        <Hash size={10} />
        {verse.reference}
      </p>
      <p className="font-body text-sm text-ink-light leading-relaxed">
        {verse.text}
      </p>
      <div className="flex items-center gap-1 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <CopyButton text={formatted} />
        {showInsert && onInsert && (
          <button
            onClick={() => onInsert(verse.text, verse.reference)}
            className="inline-flex items-center gap-1 font-body text-[11px] font-medium text-gold bg-gold-bg border border-gold-pale px-2.5 py-1 rounded-lg hover:bg-gold-bg/80 transition-colors"
          >
            Insert into editor
          </button>
        )}
      </div>
    </div>
  );
}

/* ── Book browser (OT / NT grid) ── */
function BookBrowser({ onSelect }: { onSelect: (book: string) => void }) {
  const [testament, setTestament] = useState<"OT" | "NT">("NT");
  const books = BIBLE_BOOKS[testament];

  return (
    <div>
      <div className="flex gap-1 mb-3">
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
      <div className="grid grid-cols-3 gap-1.5 max-h-64 overflow-y-auto">
        {books.map((book) => (
          <button
            key={book.id}
            onClick={() => onSelect(`${book.name} 1:1`)}
            className="text-left font-body text-xs text-ink-faint hover:text-gold hover:bg-gold-bg border border-transparent hover:border-gold-pale px-2.5 py-1.5 rounded-lg transition-all truncate"
          >
            {book.name}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── Main BiblePanel ── */
export function BiblePanel({
  onInsert,
  showInsert = false,
  compact = false,
}: BiblePanelProps) {
  const [mode, setMode] = useState<Mode>("lookup");
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    versionId,
    setVersionId,
    loading,
    error,
    results,
    passage,
    lookupVerse,
    searchScripture,
    reset,
  } = useBible();

  const handleSubmit = () => {
    const val = input.trim();
    if (!val) return;
    if (mode === "lookup") {
      lookupVerse(val);
    } else if (mode === "search") {
      searchScripture(val);
    }
  };

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSubmit();
    if (e.key === "Escape") {
      reset();
      setInput("");
    }
  };

  const handleClear = () => {
    reset();
    setInput("");
    inputRef.current?.focus();
  };

  const handleInsert = (text: string, reference: string) => {
    onInsert?.(text, reference);
  };

  const handleBrowseSelect = (ref: string) => {
    setInput(ref);
    setMode("lookup");
    lookupVerse(ref);
  };

  const modeLabel: Record<Mode, string> = {
    lookup: "Reference (e.g. John 3:16 or Rom 8:28-30)",
    search: "Search (e.g. 'love your neighbour')",
    browse: "Browse books",
  };

  return (
    <div
      className={cn(
        "flex flex-col bg-parchment border border-parchment-dark rounded-2xl overflow-hidden",
        compact ? "max-h-105" : "h-full",
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-parchment-dark shrink-0 bg-parchment-deep">
        <div className="flex items-center gap-2">
          <BookOpen size={14} className="text-gold" />
          <span className="font-display text-sm font-semibold text-ink">
            Scripture
          </span>
        </div>
        <VersionPicker
          value={versionId}
          onChange={(id) => {
            setVersionId(id);
            reset();
          }}
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
              reset();
              setInput("");
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

      {/* Input — shown for lookup and search modes */}
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
                onClick={handleClear}
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
        {error && (
          <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
            <span className="text-red-500 text-sm shrink-0">⚠</span>
            <p className="font-body text-xs text-red-600 leading-relaxed">
              {error}
            </p>
          </div>
        )}

        {/* Browse mode */}
        {mode === "browse" && <BookBrowser onSelect={handleBrowseSelect} />}

        {/* Loading skeleton */}
        {loading && !error && (
          <div className="space-y-2.5 animate-pulse">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-parchment-deep rounded-xl" />
            ))}
          </div>
        )}

        {/* Passage result (lookup mode) */}
        {!loading && passage && (
          <div className="bg-parchment border border-parchment-dark rounded-xl p-4">
            <div className="flex items-start justify-between gap-2 mb-3">
              <p className="font-display text-sm font-semibold text-gold">
                {passage.reference}
              </p>
              <div className="flex items-center gap-1 shrink-0">
                <CopyButton text={`"${passage.text}" — ${passage.reference}`} />
                {showInsert && onInsert && (
                  <button
                    onClick={() =>
                      handleInsert(passage.text, passage.reference)
                    }
                    className="inline-flex items-center gap-1 font-body text-[11px] font-medium text-gold bg-gold-bg border border-gold-pale px-2.5 py-1 rounded-lg hover:bg-gold-bg/80 transition-colors"
                  >
                    Insert
                  </button>
                )}
              </div>
            </div>
            <p className="font-body text-sm text-ink-light leading-[1.85] tracking-[0.01em]">
              {passage.text}
            </p>
            {passage.copyright && (
              <p className="font-body text-[10px] text-ink-ghost mt-3 border-t border-parchment-dark pt-2">
                {passage.copyright}
              </p>
            )}
          </div>
        )}

        {/* Search results */}
        {!loading && results.length > 0 && (
          <div className="space-y-2">
            <p className="font-body text-[11px] text-ink-ghost px-1">
              {results.length} result{results.length !== 1 ? "s" : ""}
            </p>
            {results.map((verse) => (
              <VerseCard
                key={verse.id}
                verse={verse}
                onInsert={showInsert ? handleInsert : undefined}
                showInsert={showInsert}
              />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading &&
          !error &&
          !passage &&
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
                  ? 'e.g. "John 3:16", "Psalm 23:1-6", "Romans 8:28"'
                  : 'e.g. "grace", "love your neighbour", "faith hope love"'}
              </p>
            </div>
          )}
      </div>
    </div>
  );
}
