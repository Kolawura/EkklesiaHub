"use client";

import { useState, useRef, useEffect } from "react";
import { BookOpen, Loader2, X } from "lucide-react";
import { useReferenceJump, type ResolvedReference } from "@/hooks/bible";

/**
 * ScriptureInline
 *
 * Lightweight components for comments and discussion replies, backed by
 * the local Bible database (no external API calls). Supports both single
 * verses ("John 3:16") and ranges ("Romans 8:28-30").
 *
 *   ScriptureReference — read-only chip, fetches + previews on hover
 *   ScriptureInput      — input mode for composing a comment, with preview
 */

const DEFAULT_TRANSLATION = "KJV";

// ─────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────

function formatReference(r: ResolvedReference): string {
  return r.endVerse !== r.startVerse
    ? `${r.book_name} ${r.chapter}:${r.startVerse}-${r.endVerse}`
    : `${r.book_name} ${r.chapter}:${r.startVerse}`;
}

function formatPassageText(r: ResolvedReference): string {
  return r.verses.map((v) => v.text).join(" ");
}

/* ──────────────────────────────────────────────────────
   A — Read-only chip that previews on hover
────────────────────────────────────────────────────── */
export function ScriptureReference({
  reference,
  translation = DEFAULT_TRANSLATION,
}: {
  reference: string;
  translation?: string;
}) {
  const [hovered, setHovered] = useState(false);
  const [fetched, setFetched] = useState(false);
  const { lookup, loading, error } = useReferenceJump();
  const [result, setResult] = useState<ResolvedReference | null>(null);

  const handleHover = () => {
    setHovered(true);
    if (!fetched) {
      setFetched(true);
      lookup(reference, translation).then((r) => setResult(r));
    }
  };

  return (
    <span className="relative inline-block">
      <button
        onMouseEnter={handleHover}
        onMouseLeave={() => setHovered(false)}
        onClick={handleHover}
        className="inline-flex items-center gap-1 font-body text-xs font-medium text-gold bg-gold-bg border border-gold-pale px-2 py-0.5 rounded-full hover:bg-gold-bg/80 transition-colors"
      >
        <BookOpen size={9} />
        {reference}
      </button>

      {/* Hover card */}
      {hovered && (
        <div className="absolute bottom-full left-0 mb-2 w-72 bg-parchment border border-parchment-dark rounded-xl shadow-warm-lg z-50 p-3.5">
          {loading ? (
            <div className="flex items-center gap-2 py-2">
              <Loader2 size={13} className="animate-spin text-gold" />
              <span className="font-body text-xs text-ink-ghost">Loading…</span>
            </div>
          ) : error ? (
            <p className="font-body text-xs text-red-500">{error}</p>
          ) : result ? (
            <>
              <p className="font-body text-[11px] font-semibold text-gold mb-1.5">
                {formatReference(result)}
                <span className="font-normal text-ink-ghost ml-1">
                  · {translation}
                </span>
              </p>
              <p className="font-body text-xs text-ink-light leading-relaxed">
                {formatPassageText(result)}
              </p>
            </>
          ) : null}
        </div>
      )}
    </span>
  );
}

/* ──────────────────────────────────────────────────────
   B — Input mode for comments / discussion composer
   Renders a small "Add scripture" button → input → preview
────────────────────────────────────────────────────── */
interface ScriptureInputProps {
  onAttach: (reference: string, text: string) => void;
  attached?: { reference: string; text: string }[];
  onRemove?: (reference: string) => void;
  translation?: string;
}

export function ScriptureInput({
  onAttach,
  attached = [],
  onRemove,
  translation = DEFAULT_TRANSLATION,
}: ScriptureInputProps) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { lookup, loading, error } = useReferenceJump();
  const [result, setResult] = useState<ResolvedReference | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  const handlePreview = async () => {
    if (!input.trim()) return;
    setResult(null);
    setNotFound(false);
    const r = await lookup(input.trim(), translation);
    if (r) setResult(r);
    else setNotFound(true);
  };

  const handleAttach = () => {
    if (!result) return;
    onAttach(formatReference(result), formatPassageText(result));
    setInput("");
    setResult(null);
    setNotFound(false);
    setOpen(false);
  };

  const handleCancel = () => {
    setInput("");
    setResult(null);
    setNotFound(false);
    setOpen(false);
  };

  return (
    <div className="space-y-2">
      {/* Attached references */}
      {attached.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {attached.map(({ reference }) => (
            <span
              key={reference}
              className="inline-flex items-center gap-1 font-body text-[11px] font-medium text-gold bg-gold-bg border border-gold-pale px-2 py-0.5 rounded-full"
            >
              <BookOpen size={9} />
              {reference}
              {onRemove && (
                <button
                  onClick={() => onRemove(reference)}
                  className="text-gold/60 hover:text-gold transition-colors ml-0.5"
                >
                  <X size={9} />
                </button>
              )}
            </span>
          ))}
        </div>
      )}

      {/* Add button */}
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-1.5 font-body text-[11px] text-ink-ghost hover:text-gold hover:bg-gold-bg border border-dashed border-parchment-dark hover:border-gold-pale px-2.5 py-1 rounded-full transition-all"
        >
          <BookOpen size={10} />
          Add scripture reference
        </button>
      )}

      {/* Lookup form */}
      {open && (
        <div className="bg-parchment-deep border border-parchment-dark rounded-xl p-3 space-y-2.5">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                if (result || notFound) {
                  setResult(null);
                  setNotFound(false);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handlePreview();
                }
                if (e.key === "Escape") handleCancel();
              }}
              placeholder="e.g. John 3:16 or Romans 8:28-30"
              className="flex-1 px-3 py-1.5 font-body text-xs bg-parchment border border-parchment-dark rounded-lg text-ink placeholder-ink-ghost outline-none focus:border-gold-pale focus:ring-2 focus:ring-gold/10 transition-all"
            />
            <button
              onClick={handlePreview}
              disabled={!input.trim() || loading}
              className="font-body text-xs font-medium bg-ink text-parchment px-3 py-1.5 rounded-lg hover:bg-ink-medium disabled:opacity-40 transition-all inline-flex items-center gap-1"
            >
              {loading ? <Loader2 size={11} className="animate-spin" /> : null}
              Preview
            </button>
          </div>

          {(error || notFound) && (
            <p className="font-body text-[11px] text-red-500">
              {error || "Reference not found."}
            </p>
          )}

          {result && !loading && (
            <div className="bg-parchment border border-gold-pale/50 rounded-xl p-3">
              <p className="font-body text-[11px] font-semibold text-gold mb-1">
                {formatReference(result)}
              </p>
              <p className="font-body text-xs text-ink-light leading-relaxed line-clamp-4">
                {formatPassageText(result)}
              </p>
              <div className="flex items-center gap-2 mt-2.5">
                <button
                  onClick={handleAttach}
                  className="font-body text-[11px] font-medium text-gold bg-gold-bg border border-gold-pale px-2.5 py-1 rounded-full hover:bg-gold-bg/80 transition-colors"
                >
                  Attach to comment
                </button>
                <button
                  onClick={handleCancel}
                  className="font-body text-[11px] text-ink-ghost hover:text-ink transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {!result && !loading && !error && !notFound && (
            <div className="flex justify-end">
              <button
                onClick={handleCancel}
                className="font-body text-[11px] text-ink-ghost hover:text-ink transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
