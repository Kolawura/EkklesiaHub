// bible/utils/concordance.ts
//
// Pure helpers — no I/O, no database — so they can be unit-tested directly.

import type { DictionarySource, PlanPassage } from "../types/concordance";

// ── Dictionary sources ─────────────────────────────────────────────
export const DICTIONARY_SOURCE_LABELS: Record<DictionarySource, string> = {
  eastons: "Easton's Bible Dictionary (1897)",
  webster1828: "Webster's 1828 Dictionary",
};
export const DICTIONARY_SOURCE_ORDER: DictionarySource[] = [
  "eastons",
  "webster1828",
];

export function sourceLabel(source: string): string {
  return DICTIONARY_SOURCE_LABELS[source as DictionarySource] ?? source;
}

// ── Strong's ids ───────────────────────────────────────────────────
/** "h430" | "H0430" | " G26 " -> "H430" | "H430" | "G26";  anything else -> null */
export function normalizeStrongsId(raw: string): string | null {
  const m = /^([HGhg])0*(\d{1,4})$/.exec(String(raw ?? "").trim());
  if (!m) return null;
  const n = Number(m[2]);
  if (n === 0) return null;
  return `${m[1].toUpperCase()}${n}`;
}

// ── Reading plans ──────────────────────────────────────────────────
/**
 * Groups a day's chapter rows (already in reading order) into passages:
 * [1:1, 1:2, 1:3, 19:1] -> "Genesis 1–3", "Psalms 1"
 */
export function toPassages(
  rows: Array<{ book_number: number; chapter: number }>,
  bookName: (n: number) => string,
): PlanPassage[] {
  const out: PlanPassage[] = [];
  for (const r of rows) {
    const last = out[out.length - 1];
    if (
      last &&
      last.book_number === r.book_number &&
      r.chapter === last.chapter_end + 1
    ) {
      last.chapter_end = r.chapter;
    } else {
      out.push({
        book_number: r.book_number,
        book_name: bookName(r.book_number),
        chapter_start: r.chapter,
        chapter_end: r.chapter,
        reference: "",
      });
    }
  }
  for (const p of out) {
    p.reference =
      p.chapter_start === p.chapter_end
        ? `${p.book_name} ${p.chapter_start}`
        : `${p.book_name} ${p.chapter_start}–${p.chapter_end}`;
  }
  return out;
}

export const joinReferences = (passages: PlanPassage[]): string =>
  passages.map((p) => p.reference).join("; ");

// ── Daily picks ────────────────────────────────────────────────────
const DAY_MS = 1000 * 60 * 60 * 24;

export interface DailyPoolDef {
  books: number[];
  /** [book, chapter, firstVerse, lastVerse] ranges never picked (genealogies etc.) */
  skipRanges: Array<[number, number, number, number]>;
  /** shorter verses are skipped: fragments make poor "verse of the day" cards */
  minLength: number;
  /** de-correlates pools so gospel and psalm don't advance in lock-step */
  salt: number;
}

export const DAILY_POOLS: Record<"gospel" | "psalm", DailyPoolDef> = {
  gospel: {
    books: [40, 41, 42, 43], // Matthew, Mark, Luke, John
    skipRanges: [
      [40, 1, 2, 16], // Matthew's genealogy
      [42, 3, 23, 38], // Luke's genealogy
    ],
    minLength: 50,
    salt: 17,
  },
  psalm: {
    books: [19], // Psalms
    skipRanges: [],
    minLength: 40, // drops one-line superscriptions
    salt: 31,
  },
};

/** Whole days since 1970-01-01 for a YYYY-MM-DD key (timezone-free). */
export function dayNumber(dateKey: string): number {
  const [y, m, d] = dateKey.split("-").map(Number);
  return Math.floor(Date.UTC(y, m - 1, d) / DAY_MS);
}

/**
 * Deterministic position in a pool of `count` verses for a date.
 * 7919 is prime, so (as long as count isn't a multiple of it) consecutive days
 * walk the whole pool in a scattered order before any verse repeats.
 */
export function dailyIndex(
  dateKey: string,
  count: number,
  salt: number,
): number {
  if (count <= 0) return 0;
  return (((dayNumber(dateKey) * 7919 + salt) % count) + count) % count;
}

// ── Dictionary search helpers ──────────────────────────────────────
/** Escapes %, _ and \ so user input can't act as a LIKE wildcard. */
export function escapeLike(s: string): string {
  return s.replace(/[\\%_]/g, "\\$&");
}

/**
 * ts_headline is asked to wrap hits in ⟦ ⟧ (characters that never occur in the
 * text). Everything else is HTML-escaped and only then are the markers turned
 * into <mark>, so the snippet is safe to render as HTML.
 */
export function snippetToHtml(raw: string): string {
  return String(raw ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/⟦/g, "<mark>")
    .replace(/⟧/g, "</mark>");
}

// ── Book input ─────────────────────────────────────────────────────
/** Entirely-numeric input 1..66 is a book number; anything else is a name. */
export function parseBookNumberInput(input: string): number | null {
  const t = input.trim();
  if (!/^\d+$/.test(t)) return null;
  const n = parseInt(t, 10);
  return n >= 1 && n <= 66 ? n : null;
}
