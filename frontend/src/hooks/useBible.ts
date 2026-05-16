/**
 * useBible — calls YOUR backend /api/scripture (which proxies api.bible)
 *
 * No API key in the browser. No CORS issues.
 * The backend handles caching so repeated lookups are instant.
 */

"use client";

import { useState, useCallback, useRef } from "react";
import { api } from "@/lib/api";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export type BibleVersion = {
  id: string;
  label: string;
  name: string;
};

export type ScriptureVerse = {
  id: string;
  reference: string;
  text: string;
  version: string;
  versionId: string;
};

export type ScripturePassage = {
  reference: string;
  text: string;
  version: string;
  versionId: string;
  copyright?: string;
};

// ─────────────────────────────────────────────────────────────────────────────
// Static book list for the Browse tab (doesn't need an API call)
// ─────────────────────────────────────────────────────────────────────────────
export const BIBLE_BOOKS = {
  OT: [
    { id: "GEN", name: "Genesis" },
    { id: "EXO", name: "Exodus" },
    { id: "LEV", name: "Leviticus" },
    { id: "NUM", name: "Numbers" },
    { id: "DEU", name: "Deuteronomy" },
    { id: "JOS", name: "Joshua" },
    { id: "JDG", name: "Judges" },
    { id: "RUT", name: "Ruth" },
    { id: "1SA", name: "1 Samuel" },
    { id: "2SA", name: "2 Samuel" },
    { id: "1KI", name: "1 Kings" },
    { id: "2KI", name: "2 Kings" },
    { id: "1CH", name: "1 Chronicles" },
    { id: "2CH", name: "2 Chronicles" },
    { id: "EZR", name: "Ezra" },
    { id: "NEH", name: "Nehemiah" },
    { id: "EST", name: "Esther" },
    { id: "JOB", name: "Job" },
    { id: "PSA", name: "Psalms" },
    { id: "PRO", name: "Proverbs" },
    { id: "ECC", name: "Ecclesiastes" },
    { id: "SNG", name: "Song of Solomon" },
    { id: "ISA", name: "Isaiah" },
    { id: "JER", name: "Jeremiah" },
    { id: "LAM", name: "Lamentations" },
    { id: "EZK", name: "Ezekiel" },
    { id: "DAN", name: "Daniel" },
    { id: "HOS", name: "Hosea" },
    { id: "JOL", name: "Joel" },
    { id: "AMO", name: "Amos" },
    { id: "OBA", name: "Obadiah" },
    { id: "JON", name: "Jonah" },
    { id: "MIC", name: "Micah" },
    { id: "NAM", name: "Nahum" },
    { id: "HAB", name: "Habakkuk" },
    { id: "ZEP", name: "Zephaniah" },
    { id: "HAG", name: "Haggai" },
    { id: "ZEC", name: "Zechariah" },
    { id: "MAL", name: "Malachi" },
  ],
  NT: [
    { id: "MAT", name: "Matthew" },
    { id: "MRK", name: "Mark" },
    { id: "LUK", name: "Luke" },
    { id: "JHN", name: "John" },
    { id: "ACT", name: "Acts" },
    { id: "ROM", name: "Romans" },
    { id: "1CO", name: "1 Corinthians" },
    { id: "2CO", name: "2 Corinthians" },
    { id: "GAL", name: "Galatians" },
    { id: "EPH", name: "Ephesians" },
    { id: "PHP", name: "Philippians" },
    { id: "COL", name: "Colossians" },
    { id: "1TH", name: "1 Thessalonians" },
    { id: "2TH", name: "2 Thessalonians" },
    { id: "1TI", name: "1 Timothy" },
    { id: "2TI", name: "2 Timothy" },
    { id: "TIT", name: "Titus" },
    { id: "PHM", name: "Philemon" },
    { id: "HEB", name: "Hebrews" },
    { id: "JAS", name: "James" },
    { id: "1PE", name: "1 Peter" },
    { id: "2PE", name: "2 Peter" },
    { id: "1JN", name: "1 John" },
    { id: "2JN", name: "2 John" },
    { id: "3JN", name: "3 John" },
    { id: "JUD", name: "Jude" },
    { id: "REV", name: "Revelation" },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Default versions list (mirrors what the backend exposes)
// Fetched fresh from /api/scripture/versions on first use.
// ─────────────────────────────────────────────────────────────────────────────
export const DEFAULT_VERSIONS: BibleVersion[] = [
  { id: "de4e12af7f28f599-02", label: "KJV", name: "King James Version" },
  {
    id: "06125adad2d5898a-01",
    label: "NIV",
    name: "New International Version",
  },
  { id: "65eec8e0b60e656b-01", label: "ESV", name: "English Standard Version" },
  { id: "c315fa9f71d4af3d-02", label: "NKJV", name: "New King James Version" },
  { id: "9879dbb7cfe39e4d-04", label: "MSG", name: "The Message" },
  { id: "7142879509583d59-04", label: "AMP", name: "Amplified Bible" },
];

// ─────────────────────────────────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────────────────────────────────
export function useBible(defaultVersionId = "de4e12af7f28f599-02") {
  const [versionId, setVersionId] = useState(defaultVersionId);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<ScriptureVerse[]>([]);
  const [passage, setPassage] = useState<ScripturePassage | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const reset = () => {
    setResults([]);
    setPassage(null);
    setError(null);
  };

  /** Lookup a passage — calls GET /api/scripture/lookup */
  const lookupVerse = useCallback(
    async (ref: string) => {
      if (!ref.trim()) return;

      abortRef.current?.abort();
      abortRef.current = new AbortController();

      setLoading(true);
      setError(null);
      setPassage(null);

      try {
        const res = await api.get("/scripture/lookup", {
          params: { ref: ref.trim(), version: versionId },
          signal: abortRef.current.signal,
        });

        if (res.data?.success) {
          setPassage(res.data.data);
        } else {
          setError(res.data?.message ?? "Lookup failed.");
        }
      } catch (e: any) {
        if (e.name === "CanceledError" || e.name === "AbortError") return;
        const msg =
          e?.response?.data?.message ??
          (e?.response?.status === 429
            ? "Too many requests — please slow down."
            : e?.response?.status === 503
              ? "Scripture service not configured. Ask your admin to add BIBLE_API_KEY."
              : "Network error — please check your connection.");
        setError(msg);
      } finally {
        setLoading(false);
      }
    },
    [versionId],
  );

  /** Full-text search — calls GET /api/scripture/search */
  const searchScripture = useCallback(
    async (query: string) => {
      if (!query.trim()) return;

      abortRef.current?.abort();
      abortRef.current = new AbortController();

      setLoading(true);
      setError(null);
      setPassage(null);
      setResults([]);

      try {
        const res = await api.get("/scripture/search", {
          params: { q: query.trim(), version: versionId, limit: 12 },
          signal: abortRef.current.signal,
        });

        if (res.data?.success) {
          const verses: ScriptureVerse[] = res.data.data;
          setResults(verses);
          if (verses.length === 0) {
            setError(`No results found for "${query}".`);
          }
        } else {
          setError(res.data?.message ?? "Search failed.");
        }
      } catch (e: any) {
        if (e.name === "CanceledError" || e.name === "AbortError") return;
        const msg =
          e?.response?.data?.message ??
          (e?.response?.status === 429
            ? "Too many requests — please slow down."
            : "Network error — please check your connection.");
        setError(msg);
      } finally {
        setLoading(false);
      }
    },
    [versionId],
  );

  return {
    versionId,
    setVersionId,
    loading,
    error,
    results,
    passage,
    lookupVerse,
    searchScripture,
    reset,
  };
}
