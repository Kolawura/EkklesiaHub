"use client";

// components/bible/DictionaryPanel.tsx
//
// Right-hand panel on /bible: search-as-you-type + A–Z browse over Easton's
// (1897) and Webster's (1828). A term page shows every source that has it,
// each clearly labelled; Webster's carries a "from 1828" badge because its
// language and views are of its period.

import { useEffect, useMemo, useState } from "react";
import { X, Loader2, ArrowLeft, Search, BookText } from "lucide-react";
import {
  useDictionarySuggest,
  useDictionaryBrowse,
  useDictionaryEntry,
  type DictionarySource,
} from "@/hooks/bible/dictionary";
import { DEFINITION_SANITIZE_CONFIG } from "@/lib/taggedText";
import { cn } from "@/lib/utils";

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const SOURCE_SHORT: Record<DictionarySource, string> = {
  eastons: "Easton\u2019s",
  webster1828: "Webster 1828",
};

// DOMPurify is browser-only, loaded dynamically as elsewhere in the app.
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

function useDebounced<T>(value: T, ms: number): T {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return v;
}

function SourceBadges({ sources }: { sources: DictionarySource[] }) {
  return (
    <span className="flex shrink-0 gap-1">
      {sources.map((s) => (
        <span
          key={s}
          className="font-body text-[10px] text-ink-ghost border border-parchment-dark rounded px-1.5 py-0.5"
        >
          {SOURCE_SHORT[s]}
        </span>
      ))}
    </span>
  );
}

function EntryView({ slug, onBack }: { slug: string; onBack: () => void }) {
  const { data, isLoading, isError } = useDictionaryEntry(slug);
  const sanitize = useSanitizer();

  return (
    <div className="flex-1 overflow-y-auto overscroll-y-contain">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 px-5 pt-4 font-body text-xs text-ink-faint hover:text-ink transition-colors"
      >
        <ArrowLeft size={12} /> Back
      </button>

      {isLoading && (
        <div className="flex justify-center py-10">
          <Loader2 size={16} className="animate-spin text-ink-ghost" />
        </div>
      )}
      {isError && (
        <p className="px-5 py-6 font-body text-sm text-ink-faint">
          That entry could not be loaded.
        </p>
      )}

      {data && (
        <>
          <h2 className="px-5 pt-3 pb-1 font-display text-xl font-bold text-ink">
            {data.term}
          </h2>
          <div className="divide-y divide-parchment-dark">
            {data.entries.map((e) => (
              <section key={e.source} className="px-5 py-4">
                <div className="flex items-center gap-2 mb-2">
                  <p className="font-body text-[11px] uppercase tracking-wider text-gold font-medium">
                    {e.source_label}
                  </p>
                  {e.source === "webster1828" && (
                    <span className="font-body text-[10px] text-ink-ghost border border-parchment-dark rounded px-1.5 py-0.5">
                      from 1828
                    </span>
                  )}
                </div>
                {sanitize ? (
                  <div
                    className="font-body text-sm text-ink leading-relaxed [&_p]:mb-2 [&_sup]:text-[10px]"
                    dangerouslySetInnerHTML={{ __html: sanitize(e.body_html) }}
                  />
                ) : (
                  <Loader2
                    size={14}
                    className="animate-spin text-ink-ghost"
                  />
                )}
              </section>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export function DictionaryPanel({ onClose }: { onClose: () => void }) {
  const [input, setInput] = useState("");
  const [letter, setLetter] = useState("A");
  const [slug, setSlug] = useState<string | null>(null);

  const q = useDebounced(input, 200);
  const searching = input.trim().length > 0;
  const suggest = useDictionarySuggest(q);
  const browse = useDictionaryBrowse(letter);

  const list = useMemo(
    () => (searching ? (suggest.data ?? []) : (browse.data?.terms ?? [])),
    [searching, suggest.data, browse.data],
  );
  const loading = searching ? suggest.isFetching : browse.isLoading;
  const failed = searching ? suggest.isError : browse.isError;

  return (
    <div className="flex flex-col h-full bg-parchment border-l border-parchment-dark">
      <div className="shrink-0 flex items-center justify-between px-5 py-4 border-b border-parchment-dark">
        <div className="flex items-center gap-2">
          <BookText size={15} className="text-gold" />
          <div>
            <p className="font-display text-sm font-semibold text-ink">
              Dictionary
            </p>
            <p className="font-body text-[11px] text-gold">
              Easton&apos;s 1897 · Webster&apos;s 1828
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          aria-label="Close"
          className="text-ink-ghost hover:text-ink transition-colors p-1"
        >
          <X size={16} />
        </button>
      </div>

      {slug ? (
        <EntryView slug={slug} onBack={() => setSlug(null)} />
      ) : (
        <>
          <div className="shrink-0 px-5 py-3 border-b border-parchment-dark space-y-3">
            <div className="relative">
              <Search
                size={13}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-ghost"
              />
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                maxLength={60}
                placeholder="Look up a word…"
                aria-label="Look up a word"
                className="w-full rounded-lg border border-parchment-dark bg-parchment pl-8 pr-3 py-2 font-body text-sm text-ink placeholder:text-ink-ghost focus:outline-none focus:border-gold"
              />
            </div>
            {!searching && (
              <div className="flex flex-wrap gap-1">
                {LETTERS.map((l) => (
                  <button
                    key={l}
                    onClick={() => setLetter(l)}
                    className={cn(
                      "h-7 w-7 rounded font-body text-xs transition-colors",
                      l === letter
                        ? "bg-gold-bg text-gold border border-gold-pale"
                        : "text-ink-faint hover:bg-parchment-deep hover:text-ink",
                    )}
                  >
                    {l}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto overscroll-y-contain">
            {loading && list.length === 0 && (
              <div className="flex justify-center py-8">
                <Loader2 size={16} className="animate-spin text-ink-ghost" />
              </div>
            )}
            {failed && (
              <p className="px-5 py-6 font-body text-sm text-ink-faint">
                The dictionary could not be loaded.
              </p>
            )}
            {!loading && !failed && list.length === 0 && (
              <p className="px-5 py-6 font-body text-sm text-ink-faint">
                {searching
                  ? "No matching words."
                  : "No words under this letter."}
              </p>
            )}
            <ul className="divide-y divide-parchment-dark">
              {list.map((t) => (
                <li key={t.slug}>
                  <button
                    onClick={() => setSlug(t.slug)}
                    className="w-full flex items-center justify-between gap-3 px-5 py-2.5 text-left hover:bg-parchment-deep transition-colors"
                  >
                    <span className="font-body text-sm text-ink truncate">
                      {t.term}
                    </span>
                    <SourceBadges sources={t.sources} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
