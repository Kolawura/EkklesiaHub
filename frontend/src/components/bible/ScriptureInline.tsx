"use client";

import { useState, useRef, useEffect } from "react";
import { BookOpen, Loader2, X } from "lucide-react";
import { useBible } from "@/hooks/useBible";
/**
 * ScriptureInline
 *
 * A lightweight component for comments and discussion replies.
 * Renders as a small "✦ John 3:16" trigger chip that:
 *   - Shows a floating card with the verse text on hover/click
 *   - Can be used standalone OR as an input field where users
 *     type a reference and get a preview before "attaching" it
 *
 * Usage in comments — two patterns:
 *
 * Pattern A: Read-only chip (verse already stored as text)
 *   <ScriptureReference reference="John 3:16" />
 *
 * Pattern B: Input mode (user is composing a comment)
 *   <ScriptureInput onAttach={(ref, text) => ...} />
 */

/* ──────────────────────────────────────────────────────
   A — Read-only chip that previews on hover
────────────────────────────────────────────────────── */
export function ScriptureReference({
  reference,
  versionId = "de4e12af7f28f599-02",
}: {
  reference: string;
  versionId?: string;
}) {
  const [hovered, setHovered] = useState(false);
  const [fetched, setFetched] = useState(false);
  const { lookupVerse, passage, loading, error } = useBible(versionId);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleHover = () => {
    setHovered(true);
    if (!fetched) {
      lookupVerse(reference);
      setFetched(true);
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
        <div
          ref={cardRef}
          className="absolute bottom-full left-0 mb-2 w-72 bg-parchment border border-parchment-dark rounded-xl shadow-warm-lg z-50 p-3.5"
        >
          {loading ? (
            <div className="flex items-center gap-2 py-2">
              <Loader2 size={13} className="animate-spin text-gold" />
              <span className="font-body text-xs text-ink-ghost">Loading…</span>
            </div>
          ) : error ? (
            <p className="font-body text-xs text-red-500">{error}</p>
          ) : passage ? (
            <>
              <p className="font-body text-[11px] font-semibold text-gold mb-1.5">
                {passage.reference}
              </p>
              <p className="font-body text-xs text-ink-light leading-relaxed">
                {passage.text}
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
}

export function ScriptureInput({
  onAttach,
  attached = [],
  onRemove,
}: ScriptureInputProps) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [previewing, setPreviewing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { lookupVerse, passage, loading, error, reset } = useBible();

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  const handlePreview = () => {
    if (!input.trim()) return;
    setPreviewing(true);
    lookupVerse(input.trim());
  };

  const handleAttach = () => {
    if (!passage) return;
    onAttach(passage.reference, passage.text);
    setInput("");
    setPreviewing(false);
    reset();
    setOpen(false);
  };

  const handleCancel = () => {
    setInput("");
    setPreviewing(false);
    reset();
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
                if (previewing) {
                  reset();
                  setPreviewing(false);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handlePreview();
                }
                if (e.key === "Escape") handleCancel();
              }}
              placeholder="e.g. John 3:16 or Romans 8:28"
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

          {error && (
            <p className="font-body text-[11px] text-red-500">{error}</p>
          )}

          {passage && !loading && (
            <div className="bg-parchment border border-gold-pale/50 rounded-xl p-3">
              <p className="font-body text-[11px] font-semibold text-gold mb-1">
                {passage.reference}
              </p>
              <p className="font-body text-xs text-ink-light leading-relaxed line-clamp-4">
                {passage.text}
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

          {!passage && !loading && !error && (
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
