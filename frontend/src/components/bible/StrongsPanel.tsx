"use client";

// components/bible/StrongsPanel.tsx
//
// Opens when a Strong's-tagged word is tapped in the reader. Shows the lexicon
// entry (original word, transliteration, definition, KJV usage) and a paged
// concordance of every verse that uses the number. Sits in the same right-hand
// slot as CompareDrawer (inline column ≥ xl, overlay sheet below).

import { useEffect, useMemo, useState } from "react";
import { X, Loader2, AlertCircle, ChevronDown, ChevronUp } from "lucide-react";
import { useStrongsEntry, useStrongsVerses } from "@/hooks/bible/study";
import { TaggedVerseText } from "./TaggedVerseText";
import {
  buildDefinitionHtml,
  DEFINITION_SANITIZE_CONFIG,
  strongsLanguage,
} from "@/lib/taggedText";
import { cn } from "@/lib/utils";

interface StrongsPanelProps {
  /** The word that was tapped, as printed in the KJV. */
  word: string;
  /** Strong's numbers attached to it, e.g. ["H1254", "H853"]. */
  ids: string[];
  onClose: () => void;
  onNavigate: (
    book: string,
    chapter: number,
    verse?: number,
    endVerse?: number,
  ) => void;
}

// ── DOMPurify, loaded in the browser only (as elsewhere in the app) ─────────
type Sanitizer = (html: string) => string;

function useSanitizer(): Sanitizer | null {
  const [fn, setFn] = useState<Sanitizer | null>(null);
  useEffect(() => {
    let live = true;
    import("dompurify").then((m) => {
      if (!live) return;
      const purify = m.default;
      setFn(
        () => (html: string) =>
          String(purify.sanitize(html, DEFINITION_SANITIZE_CONFIG)),
      );
    });
    return () => {
      live = false;
    };
  }, []);
  return fn;
}

// ── Concordance list ────────────────────────────────────────────────────────
function StrongsVerseList({
  id,
  onNavigate,
}: {
  id: string;
  onNavigate: StrongsPanelProps["onNavigate"];
}) {
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useStrongsVerses(id);

  const verses = data?.pages.flatMap((p) => p.verses) ?? [];
  const total = data?.pages[0]?.total ?? 0;

  if (isLoading)
    return (
      <div className="flex justify-center py-8">
        <Loader2 size={16} className="animate-spin text-ink-ghost" />
      </div>
    );

  if (isError)
    return (
      <p className="px-5 py-6 font-body text-sm text-ink-faint">
        Couldn&apos;t load the verses. Please try again.
      </p>
    );

  return (
    <div>
      <p className="px-5 py-2 font-body text-[11px] uppercase tracking-[0.15em] text-ink-ghost">
        Showing {verses.length.toLocaleString()} of {total.toLocaleString()}{" "}
        verses
      </p>
      <ul className="divide-y divide-parchment-dark border-y border-parchment-dark">
        {verses.map((v) => (
          <li key={`${v.book_number}:${v.chapter}:${v.verse}`}>
            <button
              onClick={() => onNavigate(v.book_name, v.chapter, v.verse)}
              className="block w-full px-5 py-3 text-left transition-colors hover:bg-parchment-deep"
            >
              <span className="mb-1 block font-display text-xs font-bold text-gold">
                {v.reference}
              </span>
              <span className="block font-body text-sm leading-relaxed text-ink-light">
                <TaggedVerseText text={v.tagged_text} highlightId={id} />
              </span>
            </button>
          </li>
        ))}
      </ul>
      {hasNextPage && (
        <div className="px-5 py-4">
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-parchment-dark px-3 py-2 font-body text-xs text-ink-faint transition-all hover:border-gold-pale hover:bg-gold-bg hover:text-gold disabled:opacity-50"
          >
            {isFetchingNextPage && (
              <Loader2 size={12} className="animate-spin" />
            )}
            Load more
          </button>
        </div>
      )}
    </div>
  );
}

// ── Panel ───────────────────────────────────────────────────────────────────
export function StrongsPanel({
  word,
  ids,
  onClose,
  onNavigate,
}: StrongsPanelProps) {
  const first = ids[0];
  const idsKey = ids.join(",");

  const [activeId, setActiveId] = useState(first);
  const [extraIds, setExtraIds] = useState<string[]>([]); // numbers reached via cross-references
  const [showVerses, setShowVerses] = useState(false);

  // A different word was tapped: start fresh.
  useEffect(() => {
    setActiveId(first);
    setExtraIds([]);
    setShowVerses(false);
  }, [idsKey, first]);

  const chipIds = [...ids, ...extraIds.filter((x) => !ids.includes(x))];

  const { data: entry, isLoading, isError } = useStrongsEntry(activeId);
  const sanitize = useSanitizer();

  const definition = useMemo(
    () =>
      entry?.definition_html && sanitize
        ? buildDefinitionHtml(entry.definition_html, sanitize)
        : null,
    [entry?.definition_html, sanitize],
  );

  const followRef = (ref: string) => {
    setExtraIds((prev) => (prev.includes(ref) ? prev : [...prev, ref]));
    setActiveId(ref);
    setShowVerses(false);
  };

  // Cross-references in the definition are buttons injected after sanitising.
  const onDefinitionClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = (e.target as HTMLElement).closest<HTMLElement>("[data-sref]");
    const ref = el?.dataset.sref;
    if (ref && /^[HG]\d{1,4}$/.test(ref)) followRef(ref);
  };

  const language = strongsLanguage(activeId);

  return (
    <aside
      aria-label="Strong's definition"
      className="flex h-full flex-col bg-parchment"
    >
      {/* Header */}
      <div className="flex shrink-0 items-start justify-between gap-3 border-b border-parchment-dark px-5 py-4">
        <div className="min-w-0">
          <p className="font-body text-[11px] uppercase tracking-[0.2em] text-gold">
            Strong&apos;s · KJV
          </p>
          <h2 className="mt-0.5 wrap-break-word font-display text-xl font-bold text-ink">
            {word}
          </h2>
        </div>
        <button
          onClick={onClose}
          aria-label="Close"
          className="shrink-0 p-1 text-ink-ghost transition-colors hover:text-ink"
        >
          <X size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto overscroll-y-contain">
        {/* One chip per Strong's number on this word */}
        {chipIds.length > 1 && (
          <div className="flex flex-wrap gap-1.5 border-b border-parchment-dark px-5 py-3">
            {chipIds.map((id) => (
              <button
                key={id}
                onClick={() => {
                  setActiveId(id);
                  setShowVerses(false);
                }}
                className={cn(
                  "rounded-full border px-2.5 py-1 font-body text-xs transition-colors",
                  id === activeId
                    ? "border-gold-pale bg-gold-bg font-medium text-gold"
                    : "border-parchment-dark text-ink-faint hover:border-gold-pale hover:text-gold",
                )}
              >
                {id}
              </button>
            ))}
          </div>
        )}

        {isLoading && (
          <div className="flex justify-center py-10">
            <Loader2 size={18} className="animate-spin text-ink-ghost" />
          </div>
        )}

        {isError && (
          <div className="flex flex-col items-center gap-2 px-6 py-10 text-center">
            <AlertCircle size={22} className="text-ink-ghost" />
            <p className="font-body text-sm text-ink-faint">
              Couldn&apos;t load Strong&apos;s {activeId}.
            </p>
          </div>
        )}

        {entry && (
          <>
            <div className="border-b border-parchment-dark px-5 py-4">
              {entry.lemma && (
                <p
                  lang={language === "hebrew" ? "he" : "grc"}
                  dir={language === "hebrew" ? "rtl" : "ltr"}
                  className="font-display text-3xl leading-tight text-ink"
                >
                  {entry.lemma}
                </p>
              )}
              {(entry.transliteration || entry.pronunciation) && (
                <p className="mt-1 font-body text-sm italic text-ink-light">
                  {entry.transliteration}
                  {entry.pronunciation && (
                    <span className="not-italic text-ink-faint">
                      {entry.transliteration ? " · " : ""}
                      {entry.pronunciation}
                    </span>
                  )}
                </p>
              )}
              <p className="mt-2 font-body text-[11px] uppercase tracking-[0.15em] text-gold">
                {entry.language} · {entry.id}
              </p>
            </div>

            <div className="space-y-4 px-5 py-4">
              {definition ? (
                <div
                  onClick={onDefinitionClick}
                  className="font-body text-sm leading-relaxed text-ink-light [&_.strongs-ref]:cursor-pointer [&_.strongs-ref]:font-semibold [&_.strongs-ref]:text-gold [&_.strongs-ref]:underline [&_.strongs-ref]:underline-offset-2 [&_p]:mb-2"
                  dangerouslySetInnerHTML={{ __html: definition }}
                />
              ) : (
                entry.definition_html && (
                  <div className="h-16 animate-pulse rounded bg-parchment-deep" />
                )
              )}

              {entry.usage && (
                <div>
                  <p className="mb-1 font-body text-[11px] uppercase tracking-[0.15em] text-ink-ghost">
                    Rendered in the KJV as
                  </p>
                  <p className="font-body text-sm leading-relaxed text-ink-light">
                    {entry.usage}
                  </p>
                </div>
              )}

              {entry.occurrence_count != null && entry.verse_count != null && (
                <p className="font-body text-xs text-ink-faint">
                  Used {entry.occurrence_count.toLocaleString()} times in{" "}
                  {entry.verse_count.toLocaleString()} verses.
                </p>
              )}

              <button
                onClick={() => setShowVerses((s) => !s)}
                className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-parchment-dark px-3 py-2 font-body text-xs text-ink-faint transition-all hover:border-gold-pale hover:bg-gold-bg hover:text-gold"
              >
                {showVerses
                  ? "Hide verses"
                  : entry.verse_count != null
                    ? `See all ${entry.verse_count.toLocaleString()} verses`
                    : "See all verses"}
                {showVerses ? (
                  <ChevronUp size={12} />
                ) : (
                  <ChevronDown size={12} />
                )}
              </button>
            </div>

            {showVerses && (
              <StrongsVerseList
                key={activeId}
                id={activeId}
                onNavigate={onNavigate}
              />
            )}
          </>
        )}
      </div>
    </aside>
  );
}
