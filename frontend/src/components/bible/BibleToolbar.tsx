"use client";

import { useState, useRef, useEffect } from "react";
import {
  Settings2,
  Type,
  AlignJustify,
  Hash,
  Search,
  ArrowRight,
  Loader2,
  Library,
  ArrowLeft,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "../ui/ThemeToggle";
import { useReferenceJump } from "@/hooks/bible";
import { cn } from "@/lib/utils";

interface BibleToolbarProps {
  translation: string;
  bookName: string;
  chapter: number;
  fontSize: "sm" | "md" | "lg" | "xl";
  lineSpacing: "compact" | "normal" | "relaxed";
  showNumbers: boolean; 
  versify: boolean;
  onFontSize: (s: "sm" | "md" | "lg" | "xl") => void;
  onLineSpacing: (s: "compact" | "normal" | "relaxed") => void;
  onShowNumbers: (v: boolean) => void;
  onVersify: (b:boolean) => void;
  /** Opens the book navigator drawer (shown below xl, where the sidebar is hidden). */
  onOpenBooks?: () => void;
  onNavigate: (
    book: string,
    chapter: number,
    verse?: number,
    endVerse?: number,
  ) => void;
}

export function BibleToolbar({
  translation,
  bookName,
  chapter,
  fontSize,
  lineSpacing,
  showNumbers,
  versify,
  onFontSize,
  onLineSpacing,
  onShowNumbers,
  onVersify,
  onOpenBooks,
  onNavigate,
}: BibleToolbarProps) {
  const router = useRouter();
  const [showSettings, setShowSettings] = useState(false);
  const [showJump, setShowJump] = useState(false);
  const [jumpInput, setJumpInput] = useState("");
  const settingsRef = useRef<HTMLDivElement>(null);
  const jumpRef = useRef<HTMLDivElement>(null);
  const jumpInputRef = useRef<HTMLInputElement>(null);

  const { lookup, loading: jumpLoading, error: jumpError } = useReferenceJump();

  // Close panels on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        settingsRef.current &&
        !settingsRef.current.contains(e.target as Node)
      )
        setShowSettings(false);
      if (jumpRef.current && !jumpRef.current.contains(e.target as Node))
        setShowJump(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Focus jump input when opened
  useEffect(() => {
    if (showJump) setTimeout(() => jumpInputRef.current?.focus(), 50);
  }, [showJump]);

  const handleJump = async () => {
    const val = jumpInput.trim();
    if (!val) return;
    const result = await lookup(val, translation);
    if (result) {
      onNavigate(
        result.book_name,
        result.chapter,
        result.startVerse,
        result.endVerse !== result.startVerse ? result.endVerse : undefined,
      );
      setJumpInput("");
      setShowJump(false);
    }
  };

  return (
    <div className="relative shrink-0 flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 border-b border-parchment-dark bg-parchment/95 z-10">
      {/* Back: previous page if there is one, otherwise home */}
      <button
        type="button"
        onClick={() =>
          window.history.length > 1 ? router.back() : router.push("/")
        }
        aria-label="Go back"
        className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-parchment-dark px-2.5 py-2 sm:py-1.5 font-body text-xs text-ink-faint transition-all hover:bg-parchment-deep hover:text-ink"
      >
        <ArrowLeft size={14} />
        <span className="hidden sm:inline">Back</span>
      </button>

      {/* Open book navigator — the sidebar is a drawer below xl */}
      {onOpenBooks && (
        <button
          type="button"
          onClick={onOpenBooks}
          aria-label="Browse books"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-parchment-dark px-2.5 py-2 font-body text-xs text-ink-faint transition-all hover:bg-parchment-deep hover:text-ink xl:hidden"
        >
          <Library size={14} />
          <span className="hidden sm:inline">Books</span>
        </button>
      )}

      {/* Current location breadcrumb */}
      <div className="flex min-w-0 items-center gap-1.5 font-body text-sm text-ink-faint">
        <span className="shrink-0 text-gold font-medium">{translation}</span>
        <span className="shrink-0 text-parchment-dark">/</span>
        <span className="truncate">{bookName}</span>
        <span className="shrink-0 text-parchment-dark">/</span>
        <span className="shrink-0 whitespace-nowrap">
          <span className="hidden sm:inline">Chapter </span>
          {chapter}
        </span>
      </div>

      <div className="flex-1" />

      <ThemeToggle />

      {/* Jump to reference */}
      <div ref={jumpRef} className="relative">
        <button
          onClick={() => setShowJump(!showJump)}
          className={cn(
            "inline-flex items-center gap-1.5 font-body text-xs px-2.5 sm:px-3 py-2 sm:py-1.5 rounded-lg border transition-all",
            showJump
              ? "bg-gold-bg text-gold border-gold-pale"
              : "text-ink-ghost border-parchment-dark hover:text-ink hover:bg-parchment-deep",
          )}
        >
          <Search size={13} />
          <span className="hidden sm:inline">Jump to</span>
        </button>

        {showJump && (
          <div className="fixed inset-x-3 top-14 sm:absolute sm:inset-x-auto sm:right-0 sm:top-full sm:mt-2 sm:w-72 bg-parchment border border-parchment-dark rounded-2xl shadow-warm-lg z-20 p-4">
            <p className="font-body text-xs text-ink-ghost mb-2">
              Type a reference e.g. <span className="text-gold">John 3:16</span>
            </p>
            <div className="flex gap-2">
              <input
                ref={jumpInputRef}
                value={jumpInput}
                onChange={(e) => setJumpInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleJump();
                  if (e.key === "Escape") setShowJump(false);
                }}
                placeholder="Romans 8:28-30"
                className="flex-1 px-3 py-2 font-body text-sm bg-parchment-deep border border-parchment-dark rounded-xl text-ink placeholder-ink-ghost outline-none focus:border-gold-pale focus:ring-2 focus:ring-gold/10 transition-all"
              />
              <button
                onClick={handleJump}
                disabled={!jumpInput.trim() || jumpLoading}
                className="p-2 bg-ink text-parchment rounded-xl hover:bg-ink-medium disabled:opacity-40 transition-all"
              >
                {jumpLoading ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <ArrowRight size={14} />
                )}
              </button>
            </div>
            {jumpError && (
              <p className="font-body text-[11px] text-red-500 mt-2">
                {jumpError}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Reader settings */}
      <div ref={settingsRef} className="relative">
        <button
          onClick={() => setShowSettings(!showSettings)}
          className={cn(
            "p-2 sm:p-1.5 rounded-lg border transition-all",
            showSettings
              ? "bg-gold-bg text-gold border-gold-pale"
              : "text-ink-ghost border-parchment-dark hover:text-ink hover:bg-parchment-deep",
          )}
          title="Reader settings"
        >
          <Settings2 size={14} />
        </button>

        {showSettings && (
          <div className="fixed inset-x-3 top-14 sm:absolute sm:inset-x-auto sm:right-0 sm:top-full sm:mt-2 sm:w-64 bg-parchment border border-parchment-dark rounded-2xl shadow-warm-lg z-20 p-4 space-y-5">
            {/* Font size */}
            <div>
              <div className="flex items-center gap-1.5 mb-2.5">
                <Type size={12} className="text-ink-ghost" />
                <p className="font-body text-xs text-ink-faint font-medium">
                  Text size
                </p>
              </div>
              <div className="flex gap-1.5">
                {(["sm", "md", "lg", "xl"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => onFontSize(s)}
                    className={cn(
                      "flex-1 py-1.5 rounded-lg font-body font-medium transition-all",
                      s === "sm"
                        ? "text-xs"
                        : s === "md"
                          ? "text-sm"
                          : s === "lg"
                            ? "text-base"
                            : "text-lg",
                      fontSize === s
                        ? "bg-gold-bg text-gold border border-gold-pale"
                        : "text-ink-ghost hover:text-ink border border-parchment-dark hover:bg-parchment-deep",
                    )}
                  >
                    A
                  </button>
                ))}
              </div>
            </div>

            {/* Line spacing */}
            <div>
              <div className="flex items-center gap-1.5 mb-2.5">
                <AlignJustify size={12} className="text-ink-ghost" />
                <p className="font-body text-xs text-ink-faint font-medium">
                  Line spacing
                </p>
              </div>
              <div className="flex gap-1.5">
                {(["compact", "normal", "relaxed"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => onLineSpacing(s)}
                    className={cn(
                      "flex-1 py-1.5 rounded-lg font-body text-[11px] font-medium capitalize transition-all",
                      lineSpacing === s
                        ? "bg-gold-bg text-gold border border-gold-pale"
                        : "text-ink-ghost hover:text-ink border border-parchment-dark hover:bg-parchment-deep",
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Verse numbers */}
            <div className="flex items-center justify-between pt-1 border-t border-parchment-dark">
              <div className="flex items-center gap-1.5">
                <Hash size={12} className="text-ink-ghost" />
                <p className="font-body text-xs text-ink-faint font-medium">
                  Verse numbers
                </p>
              </div>
              <button
                onClick={() => onShowNumbers(!showNumbers)}
                className={cn(
                  "relative w-9 h-5 rounded-full transition-colors",
                  showNumbers ? "bg-gold" : "bg-parchment-dark",
                )}
              >
                <span
                  className={cn(
                    "absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-parchment shadow-sm transition-transform",
                    showNumbers ? "translate-x-4.5" : "",
                  )}
                />
              </button>
            </div>

             {/* Versify Text */}
             <div className="flex items-center justify-between pt-1 border-t border-parchment-dark">
              <div className="flex items-center gap-1.5">
                <Hash size={12} className="text-ink-ghost" />
                <p className="font-body text-xs text-ink-faint font-medium">
                  Versify Text
                </p>
              </div>
              <button
                onClick={() => onVersify(!versify)}
                className={cn(
                  "relative w-9 h-5 rounded-full transition-colors",
                  versify ? "bg-gold" : "bg-parchment-dark",
                )}
              >
                <span
                  className={cn(
                    "absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-parchment shadow-sm transition-transform",
                    versify ? "translate-x-4.5" : "",
                  )}
                />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
