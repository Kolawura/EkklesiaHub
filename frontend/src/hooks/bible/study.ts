"use client";

// hooks/bible/study.ts
//
// Study-mode data: KJV with Strong's tags + red letters, and the Strong's
// lexicon. Mirrors the style of hooks/bible/index.ts (React Query, getRequest).
// Backed by the public /api/bible/tagged and /api/bible/strongs endpoints.

import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { getRequest } from "@/lib/service";

// ─────────────────────────────────────────────────────────────────
// TYPES (mirror backend/src/bible/types/concordance.ts)
// ─────────────────────────────────────────────────────────────────

export interface TaggedVerse {
  verse: number;
  /** KJV with [[H430]] markers, <em> and <span class="woc"> — see lib/taggedText */
  text: string;
}

export interface TaggedChapter {
  translation: "KJV";
  book_name: string;
  book_number: number;
  chapter: number;
  verses: TaggedVerse[];
  total_verses: number;
  prev_chapter: number | null;
  next_chapter: number | null;
  max_chapters: number;
}

export interface StrongsEntry {
  id: string; // "H430" | "G26"
  language: "hebrew" | "greek";
  number: number;
  lemma: string | null;
  transliteration: string | null;
  pronunciation: string | null;
  definition_html: string | null;
  usage: string | null;
  occurrence_count: number | null;
  verse_count: number | null;
}

export interface StrongsVerse {
  book_number: number;
  book_name: string;
  chapter: number;
  verse: number;
  reference: string;
  tagged_text: string;
}

export interface StrongsVersesPage {
  strongs_id: string;
  total: number;
  page: number;
  limit: number;
  verses: StrongsVerse[];
}

// ─────────────────────────────────────────────────────────────────
// HOOKS
// ─────────────────────────────────────────────────────────────────

/** KJV chapter with Strong's tags + red letters. Cached like useBibleChapter. */
export function useTaggedChapter(
  bookName: string,
  chapter: number,
  enabled = true,
) {
  return useQuery<TaggedChapter>({
    queryKey: ["bible-tagged", bookName, chapter],
    queryFn: async () => {
      const res = await getRequest(
        `/bible/tagged/${encodeURIComponent(bookName)}/${chapter}`,
      );
      return res.data;
    },
    staleTime: 1000 * 60 * 60 * 12, // 12h — matches the server's cache header
    gcTime: 1000 * 60 * 60 * 24,
    enabled: enabled && !!bookName && !!chapter,
    retry: 2,
  });
}

/** One lexicon entry. Static data: fetched once per number per session. */
export function useStrongsEntry(id: string | null) {
  return useQuery<StrongsEntry>({
    queryKey: ["bible-strongs", id],
    queryFn: async () => {
      const res = await getRequest(`/bible/strongs/${id}`);
      return res.data;
    },
    staleTime: Infinity,
    gcTime: 1000 * 60 * 60 * 24,
    enabled: !!id,
    retry: 1,
  });
}

/** Every KJV verse using a Strong's number, paged ("Load more"). */
export function useStrongsVerses(id: string | null, enabled = true) {
  return useInfiniteQuery({
    queryKey: ["bible-strongs-verses", id],
    queryFn: async ({ pageParam }): Promise<StrongsVersesPage> => {
      const res = await getRequest(
        `/bible/strongs/${id}/verses?page=${pageParam}&limit=25`,
      );
      return res.data;
    },
    initialPageParam: 1,
    getNextPageParam: (last) =>
      last.page * last.limit < last.total ? last.page + 1 : undefined,
    staleTime: 1000 * 60 * 60 * 12,
    gcTime: 1000 * 60 * 60,
    enabled: enabled && !!id,
    retry: 1,
  });
}
