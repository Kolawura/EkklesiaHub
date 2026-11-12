"use client";

import { useState, useEffect } from "react";
import { BookOpen, X } from "lucide-react";
import { BiblePanel } from "./BiblePanel";
import { cn } from "@/lib/utils";

interface BibleDrawerProps {
  /** Called when user clicks "Insert" in the panel */
  onInsert?: (text: string, reference: string, version: string) => void;
  /** Show the insert button (only in editor context) */
  showInsert?: boolean;
  /** Whether to render as a floating button (post/comment context)
   *  or as an inline toggle button (editor toolbar context) */
  mode?: "floating" | "inline";
}

/**
 * BibleDrawer
 *
 * Two presentation modes:
 *
 * 1. "floating" (default) — shows a small BookOpen pill fixed at bottom-right.
 *    Used on the post detail page and comment sections so readers can look up
 *    references while they read/discuss without leaving the page.
 *
 * 2. "inline" — shows a small toolbar button that slides in a panel.
 *    Used inside the editor new/edit pages.
 */
export function BibleDrawer({
  onInsert,
  showInsert = false,
  mode = "floating",
}: BibleDrawerProps) {
  const [open, setOpen] = useState(false);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const handleInsert = (text: string, reference: string, version: string) => {
    onInsert?.(text, reference, version);
    // Don't close on insert — user may want to insert multiple references
  };

  if (mode === "inline") {
    return (
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          title="Scripture reference"
          className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-2 sm:py-1.5 font-body text-xs rounded-lg border transition-all",
            open
              ? "bg-gold-bg text-gold border-gold-pale"
              : "text-ink-ghost border-parchment-dark hover:text-ink hover:bg-parchment-deep",
          )}
        >
          <BookOpen size={12} />
          <span className="hidden sm:inline">Scripture</span>
        </button>

        {open && (
          <>
          {/* < sm: full-width sheet under the header; ≥ sm: anchored popover */}
          <div
            className="fixed inset-0 z-30 bg-ink/30 sm:hidden"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div className="fixed inset-x-3 bottom-3 top-16 z-40 overflow-hidden rounded-2xl shadow-warm-lg sm:absolute sm:inset-x-auto sm:bottom-auto sm:right-0 sm:top-full sm:mt-2 sm:h-130 sm:w-90">
            <BiblePanel
              onInsert={handleInsert}
              showInsert={showInsert}
              compact
            />
          </div>
          </>
        )}
      </div>
    );
  }

  /* ── Floating mode ── */
  return (
    <>
      {/* Floating trigger button */}
      <button
        onClick={() => setOpen(!open)}
        title="Look up a Bible verse"
        className={cn(
          "fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 sm:bottom-6 sm:right-6 z-40 inline-flex items-center gap-2 font-body text-sm font-medium px-4 py-2.5 rounded-full shadow-warm-lg border transition-all",
          open
            ? "bg-gold text-ink border-gold"
            : "bg-ink text-parchment border-ink hover:bg-ink-medium",
        )}
      >
        <BookOpen size={15} />
        {open ? "Close" : "Scripture"}
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-ink/20 backdrop-blur-[2px] z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Slide-in drawer */}
      <div
        className={cn(
          "fixed right-0 top-0 bottom-0 z-50 w-full max-w-95 shadow-warm-lg transition-transform duration-300",
          open ? "translate-x-0" : "invisible translate-x-full",
        )}
      >
        <div className="h-full flex flex-col">
          {/* Mobile close bar (the side tab below sits off-screen on phones) */}
          {open && (
            <button
              onClick={() => setOpen(false)}
              className="flex shrink-0 items-center justify-end gap-1.5 border-b border-parchment-dark bg-parchment px-4 py-2.5 font-body text-xs text-ink-faint sm:hidden"
            >
              Close <X size={14} />
            </button>
          )}
          {/* Close button overlay */}
          {open && (
            <button
              onClick={() => setOpen(false)}
              className="absolute top-3.5 -left-11 hidden sm:block p-2 bg-parchment border border-parchment-dark rounded-l-xl text-ink-ghost hover:text-ink transition-colors z-10"
            >
              <X size={15} />
            </button>
          )}

          <div className="min-h-0 flex-1">
            <BiblePanel
              onInsert={handleInsert}
              showInsert={showInsert}
              compact={false}
            />
          </div>
        </div>
      </div>
    </>
  );
}
