"use client";

import { useState, useCallback, useRef } from "react";
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
  // console.log(bookName, chapter);
  return useQuery<BibleChapter>({
    queryKey: ["bible-chapter", translation, bookName, chapter],
    queryFn: async () => {
      const res = await getRequest(
        `/bible/chapter/${translation}/${encodeURIComponent(bookName)}/${chapter}`,
      );
      console.log("Full response:", res);
      console.log("Response data:", res.data);
      console.log("Nested data:", res.data?.data);
      return res.data;
    },
    staleTime: 1000 * 60 * 60 * 12, // 12h
    gcTime: 1000 * 60 * 60 * 24,
    enabled: enabled && !!translation && !!bookName && !!chapter,
    retry: 2,
  });
}

/** Available translations */
export function useBibleTranslations() {
  return useQuery<TranslationInfo[]>({
    queryKey: ["bible-translations"],
    queryFn: async () => {
      const res: { data: { data: TranslationInfo[] } } = await getRequest(
        "/bible/translations",
      );
      return res.data.data;
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

/** Verse of the Day */
export function useVerseOfTheDay(translation = "KJV") {
  return useQuery<VerseOfTheDay>({
    queryKey: ["bible-votd", translation],
    queryFn: async () => {
      const res = await api.get("/bible/votd", { params: { translation } });
      console.log("Verse of the day:", res.data);
      return res.data.data;
    },
    staleTime: 1000 * 60 * 60 * 24, // 24h — one verse per day
    gcTime: 1000 * 60 * 60 * 24,
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
