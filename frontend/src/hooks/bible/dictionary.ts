"use client";

// hooks/bible/dictionary.ts
// Dictionary data: /api/bible/dictionary/{suggest,browse,entry/:slug}

import { useQuery } from "@tanstack/react-query";
import { getRequest } from "@/lib/service";

export type DictionarySource = "eastons" | "webster1828";

export interface DictionaryTerm {
  slug: string;
  term: string;
  sources: DictionarySource[];
}

export interface DictionaryBrowse {
  letter: string;
  total: number;
  page: number;
  limit: number;
  terms: DictionaryTerm[];
}

export interface DictionaryEntryView {
  source: DictionarySource;
  source_label: string;
  term: string;
  body_html: string;
}

export interface DictionaryEntry {
  slug: string;
  term: string;
  entries: DictionaryEntryView[];
}

export function useDictionarySuggest(q: string) {
  const query = q.trim();
  return useQuery<DictionaryTerm[]>({
    queryKey: ["dict-suggest", query.toLowerCase()],
    queryFn: async () => {
      const res = await getRequest(
        `/bible/dictionary/suggest?q=${encodeURIComponent(query)}&limit=12`,
      );
      return res.data;
    },
    enabled: query.length > 0 && query.length <= 60,
    staleTime: 1000 * 60 * 30,
  });
}

export function useDictionaryBrowse(letter: string) {
  return useQuery<DictionaryBrowse>({
    queryKey: ["dict-browse", letter],
    queryFn: async () => {
      const res = await getRequest(
        `/bible/dictionary/browse?letter=${encodeURIComponent(letter)}&limit=200`,
      );
      return res.data;
    },
    staleTime: 1000 * 60 * 60,
  });
}

export function useDictionaryEntry(slug: string | null) {
  return useQuery<DictionaryEntry>({
    queryKey: ["dict-entry", slug],
    queryFn: async () => {
      const res = await getRequest(
        `/bible/dictionary/entry/${encodeURIComponent(slug as string)}`,
      );
      return res.data;
    },
    enabled: !!slug,
    staleTime: 1000 * 60 * 60,
  });
}
