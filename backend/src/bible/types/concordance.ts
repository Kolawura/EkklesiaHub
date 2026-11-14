// bible/types/concordance.ts
//
// Types for the Strong's / KJV-tagged / dictionary / reading-plan / daily endpoints.
// Field names are snake_case to match the rest of the Bible module's API.

import type { VerseOfTheDay } from "./index";

// ── Strong's ───────────────────────────────────────────────────────
export interface StrongsEntry {
  id: string; // 'H430' | 'G26'
  language: "hebrew" | "greek";
  number: number;
  lemma: string | null; // original-script word
  transliteration: string | null;
  pronunciation: string | null;
  definition_html: string | null; // raw source HTML — sanitise on render
  usage: string | null; // e.g. "beginning (18x), firstfruits (11x)"
  occurrence_count: number | null;
  verse_count: number | null;
}

export interface StrongsVerse {
  book_number: number;
  book_name: string;
  chapter: number;
  verse: number;
  reference: string; // "Genesis 1:1"
  tagged_text: string; // KJV with [[H430]] markers (see TaggedVerse.text)
}

export interface StrongsVersesResponse {
  strongs_id: string;
  total: number;
  page: number;
  limit: number;
  verses: StrongsVerse[];
}

// ── Tagged KJV chapter ─────────────────────────────────────────────
// `text` is KJV with inline markup:
//   word[[H430]]                 Strong's number(s) attach to the word BEFORE them
//   <em>…</em>                   words the KJV translators added (italics)
//   <span class="woc">…</span>   words of Christ (red letters)
export interface TaggedVerse {
  verse: number;
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

// ── Reading plans ──────────────────────────────────────────────────
export interface ReadingPlanSummary {
  slug: string; // canonical | chronological | historical
  title: string;
  description: string | null;
  durations: number[]; // e.g. [365, 180, 90]
}

export interface PlanPassage {
  book_number: number;
  book_name: string;
  chapter_start: number;
  chapter_end: number;
  reference: string; // "Genesis 1–3"
}

export interface PlanDay {
  day: number;
  reference: string; // "Genesis 1–3; Psalms 1"
  passages: PlanPassage[];
}

export interface PlanOverview {
  slug: string;
  title: string;
  description: string | null;
  duration_days: number;
  total_days: number;
  days: PlanDay[];
}

export interface PlanDayResponse extends PlanDay {
  slug: string;
  title: string;
  duration_days: number;
  total_days: number;
  prev_day: number | null;
  next_day: number | null;
}

// ── Dictionary ─────────────────────────────────────────────────────
export type DictionarySource = "eastons" | "webster1828";

export interface DictionaryTerm {
  slug: string;
  term: string;
  sources: DictionarySource[]; // which dictionaries have this term
}

export interface DictionarySearchResult {
  slug: string;
  term: string;
  source: DictionarySource;
  source_label: string;
  snippet: string; // HTML-escaped, matches wrapped in <mark>…</mark>
  rank: number;
}

export interface DictionarySearchResponse {
  query: string;
  total: number;
  page: number;
  limit: number;
  results: DictionarySearchResult[];
}

export interface DictionaryBrowseResponse {
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
  body_html: string; // cleaned source HTML — sanitise on render
}

export interface DictionaryEntryResponse {
  slug: string;
  term: string;
  entries: DictionaryEntryView[];
}

// ── Daily ──────────────────────────────────────────────────────────
export interface DailyVerse {
  kind: "gospel" | "psalm";
  translation: string;
  book_name: string;
  book_number: number;
  chapter: number;
  verse: number;
  text: string;
  reference: string;
  date: string;
}

export interface DailyResponse {
  date: string;
  verse: VerseOfTheDay | null; // curated, with reflection
  gospel: DailyVerse | null;
  psalm: DailyVerse | null;
}
