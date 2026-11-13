"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { getRequest } from "@/lib/service";

// ─────────────────────────────────────────────────────────────────
// TYPES (mirror the backend types)
// ─────────────────────────────────────────────────────────────────

export interface BibleBook {
  book_number: number;
  book_name: string;
  abbreviation: string;
  testament: "OT" | "NT";
}

export interface BibleVerse {
  id: number;
  translation: string;
  book_name: string;
  book_number: number;
  chapter: number;
  verse: number;
  text: string;
}

export interface BibleChapter {
  translation: string;
  book_name: string;
  book_number: number;
  chapter: number;
  verses: BibleVerse[];
  total_verses: number;
  prev_chapter: number | null;
  next_chapter: number | null;
  max_chapters: number;
}

export interface SearchResult {
  translation: string;
  book_name: string;
  book_number: number;
  chapter: number;
  verse: number;
  text: string;
  snippet: string;
}

export interface CompareEntry {
  translation: string;
  text: string;
  available: boolean;
}

export interface VerseOfTheDay {
  translation: string;
  book_name: string;
  chapter: number;
  verse: number;
  text: string;
  reference: string;
  reflection: string;
  date: string;
}

export interface TranslationInfo {
  translation: string;
  verse_count: number;
  is_featured: boolean;
  description?: string;
}

// ─────────────────────────────────────────────────────────────────
// REACT QUERY HOOKS — for cached, reactive data
// ─────────────────────────────────────────────────────────────────

/** All 66 books — cached indefinitely, never changes */
export function useBibleBooks(testament?: "OT" | "NT") {
  return useQuery<BibleBook[]>({
    queryKey: ["bible-books", testament ?? "all"],
    queryFn: async () => {
      const res = await api.get("/bible/books", {
        params: testament ? { testament } : {},
      });
      return res.data.data;
    },
    staleTime: Infinity,
    gcTime: Infinity,
  });
}

/** Chapter content — cached for the session */
export function useBibleChapter(
  translation: string,
  bookName: string,
  chapter: number,
  enabled = true,
) {
  return useQuery<BibleChapter>({
    queryKey: ["bible-chapter", translation, bookName, chapter],
    queryFn: async () => {
      const res = await getRequest(
        `/bible/chapter/${translation}/${encodeURIComponent(bookName)}/${chapter}`,
      );
      return res.data;
    },
    staleTime: 1000 * 60 * 60 * 12, // 12h
    gcTime: 1000 * 60 * 60 * 24,
    enabled: enabled && !!translation && !!bookName && !!chapter,
    retry: 2,
  });
}

/**
 * Lightweight hook that returns the number of chapters in a book.
 * Fetches chapter 1 (which returns max_chapters) — React Query caches
 * this indefinitely so it is only ever fetched once per book.
 */
export function useBibleBookMeta(
  translation: string,
  bookName: string,
  enabled = true,
) {
  return useQuery<{ maxChapters: number }>({
    queryKey: ["bible-book-meta", translation, bookName],
    queryFn: async () => {
      const res = await api.get(
        `/bible/chapter/${translation}/${encodeURIComponent(bookName)}/1`,
      );
      const data: BibleChapter = res.data.data ?? res.data;
      return { maxChapters: data.max_chapters };
    },
    staleTime: Infinity,
    gcTime: Infinity,
    enabled: enabled && !!translation && !!bookName,
    retry: 2,
  });
}

/**
 * Returns the number of verses in a specific chapter.
 * Shares the same cache key as useBibleChapter so if the user
 * navigates to that chapter, no extra request is made.
 */
export function useBibleChapterMeta(
  translation: string,
  bookName: string,
  chapter: number,
  enabled = true,
) {
  return useQuery<{ totalVerses: number }>({
    queryKey: ["bible-chapter-meta", translation, bookName, chapter],
    queryFn: async () => {
      const res = await api.get(
        `/bible/chapter/${translation}/${encodeURIComponent(bookName)}/${chapter}`,
      );
      const data: BibleChapter = res.data.data ?? res.data;
      console.log("chapter meta", data);
      return { totalVerses: data.total_verses };
    },
    staleTime: Infinity,
    gcTime: Infinity,
    enabled: enabled && !!translation && !!bookName && chapter > 0,
    retry: 2,
  });
}

/** Available translations */
export function useBibleTranslations() {
  return useQuery<TranslationInfo[]>({
    queryKey: ["bible-translations"],
    queryFn: async (): Promise<TranslationInfo[]> => {
      const res: { data: TranslationInfo[] } = await getRequest(
        "/bible/translations",
      );
      console.log("Translations ", res.data);
      return res.data;
    },
    staleTime: Infinity,
    gcTime: Infinity,
  });
}

/** Compare one verse across all (or specific) translations */
export function useCompareVerse(
  bookName: string,
  chapter: number,
  verse: number,
  translations?: string[],
  enabled = true,
) {
  return useQuery<{
    reference: string;
    entries: CompareEntry[];
  }>({
    queryKey: [
      "bible-compare",
      bookName,
      chapter,
      verse,
      translations?.join(",") ?? "all",
    ],
    queryFn: async () => {
      const params: Record<string, string> = {};
      if (translations?.length) params.translations = translations.join(",");
      const res = await api.get(
        `/bible/compare/${encodeURIComponent(bookName)}/${chapter}/${verse}`,
        { params },
      );
      return res.data.data;
    },
    staleTime: 1000 * 60 * 60 * 12,
    enabled: enabled && !!bookName && !!chapter && !!verse,
  });
}
// ─────────────────────────────────────────────────────────────────
// VERSE OF THE DAY
//
// "Today" = the USER'S local calendar day, so the verse changes at their own
// 12:00 AM. How it stays correct without hammering the API:
//   • the local date is part of the React Query key (new day ⇒ new entry)
//   • that date is sent to the API, which picks the verse from it
//   • each day's verse is also saved in localStorage, so reloads / new tabs
//     reuse it with ZERO network requests until the date changes
//   • a timer + tab-visibility check flips the date at midnight even if the
//     app is left open (or a phone wakes up the next morning)
// ─────────────────────────────────────────────────────────────────

const VOTD_LS_PREFIX = "ekk:votd:";

/** YYYY-MM-DD in the user's local timezone (not UTC). */
function localDateKey(d = new Date()): string {
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
}

function msUntilLocalMidnight(): number {
  const now = new Date();
  const next = new Date(now);
  next.setHours(24, 0, 0, 0); // next local 00:00
  return next.getTime() - now.getTime();
}

function readVotdCache(translation: string, day: string): VerseOfTheDay | null {
  try {
    const raw = localStorage.getItem(`${VOTD_LS_PREFIX}${translation}`);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { day: string; data: VerseOfTheDay };
    return parsed.day === day ? parsed.data : null; // yesterday's = miss
  } catch {
    return null;
  }
}

function writeVotdCache(translation: string, day: string, data: VerseOfTheDay) {
  try {
    // one entry per translation → old days are overwritten, never pile up
    localStorage.setItem(
      `${VOTD_LS_PREFIX}${translation}`,
      JSON.stringify({ day, data }),
    );
  } catch {
    /* storage full / blocked (private mode) — just skip caching */
  }
}

/** Verse of the Day */
export function useVerseOfTheDay(translation = "KJV") {
  const [today, setToday] = useState(() => localDateKey());

  // Roll over at local midnight, and re-check whenever the tab becomes visible
  // again (timers are throttled/paused while a phone sleeps).
  useEffect(() => {
    const sync = () => {
      const now = localDateKey();
      setToday((prev) => (prev === now ? prev : now));
    };
    const timer = setTimeout(sync, msUntilLocalMidnight() + 1000);
    const onVisible = () => !document.hidden && sync();
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", sync);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", sync);
    };
  }, [today]);

  return useQuery<VerseOfTheDay>({
    queryKey: ["bible-votd", translation, today],
    queryFn: async () => {
      // 1) already have today's verse on this device? no request at all.
      const cached = readVotdCache(translation, today);
      if (cached) return cached;

      // 2) otherwise fetch once, then remember it until the date changes
      const res = await api.get("/bible/votd", {
        params: { translation, date: today },
      });
      const data: VerseOfTheDay = res.data.data;
      writeVotdCache(translation, today, data);
      return data;
    },
    // The key already changes every day, so a given entry never goes stale.
    staleTime: Infinity,
    gcTime: 48 * 60 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}

// ─────────────────────────────────────────────────────────────────
// SEARCH HOOK — imperative, with abort controller
// ─────────────────────────────────────────────────────────────────

export function useBibleSearch() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const search = useCallback(
    async (
      query: string,
      translation: string,
      options?: {
        testament?: "OT" | "NT";
        book?: string;
        page?: number;
        limit?: number;
      },
    ) => {
      if (!query.trim() || query.trim().length < 2) return;

      abortRef.current?.abort();
      abortRef.current = new AbortController();

      setLoading(true);
      setError(null);

      try {
        const res = await api.get("/bible/search", {
          params: {
            q: query,
            translation,
            testament: options?.testament,
            book: options?.book,
            page: options?.page ?? 1,
            limit: options?.limit ?? 20,
          },
          signal: abortRef.current.signal,
        });

        setResults(res.data.results ?? []);
        setTotal(res.data.total ?? 0);
      } catch (e: any) {
        if (e.name === "CanceledError" || e.name === "AbortError") return;
        setError(
          e?.response?.data?.message ?? "Search failed. Please try again.",
        );
        setResults([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const reset = () => {
    abortRef.current?.abort();
    setResults([]);
    setTotal(0);
    setError(null);
    setLoading(false);
  };

  return { search, reset, loading, results, total, error };
}

// ─────────────────────────────────────────────────────────────────
// REFERENCE LOOKUP — for the jump-to-reference input
// ─────────────────────────────────────────────────────────────────

/**
 * Result of resolving a reference string like "Romans 8:28-30".
 * A single-verse reference ("John 3:16") resolves with
 * startVerse === endVerse and verses.length === 1.
 */
export interface ResolvedReference {
  book_name: string;
  chapter: number;
  startVerse: number;
  endVerse: number;
  /** Every verse in the range, in order, with text included. */
  verses: BibleVerse[];
}

export function useReferenceJump() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const lookup = useCallback(
    async (
      ref: string,
      translation: string,
    ): Promise<ResolvedReference | null> => {
      if (!ref.trim()) return null;
      setLoading(true);
      setError(null);
      try {
        const res = await api.get("/bible/reference", {
          params: { ref, translation },
        });
        const data = res.data.data;

        // Backend returns a single verse object for "John 3:16",
        // or an array of verse objects for a range like "Romans 8:28-30".
        const verses: BibleVerse[] = Array.isArray(data) ? data : [data];

        if (verses.length === 0) return null;

        const verseNumbers = verses.map((v) => v.verse);

        return {
          book_name: verses[0].book_name,
          chapter: verses[0].chapter,
          startVerse: Math.min(...verseNumbers),
          endVerse: Math.max(...verseNumbers),
          verses,
        };
      } catch (e: any) {
        setError(e?.response?.data?.message ?? "Reference not found.");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { lookup, loading, error };
}
