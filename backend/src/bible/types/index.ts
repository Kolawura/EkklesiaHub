// bible/types/index.ts

export interface BibleBook {
  book_number: number;
  book_name: string;
  abbreviation: string;
  testament: "OT" | "NT";
  chapter_count?: number;
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
  snippet: string; // highlighted snippet from postgres ts_headline
  rank: number;
}

export interface SearchResponse {
  query: string;
  translation: string;
  results: SearchResult[];
  total: number;
  page: number;
  limit: number;
}

export interface CompareEntry {
  translation: string;
  text: string;
  available: boolean;
}

export interface CompareResponse {
  book_name: string;
  chapter: number;
  verse: number;
  reference: string;
  entries: CompareEntry[];
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
  license?: string;
}

export interface ParsedRef {
  book_name: string;
  book_number: number;
  chapter: number;
  verse_start: number | null;
  verse_end: number | null;
  valid: boolean;
  error?: string;
}
