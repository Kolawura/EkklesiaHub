/**
 * scriptureService.ts
 *
 * Proxies all calls to https://scripture.api.bible
 * - API key stays server-side (never sent to browser)
 * - In-memory LRU cache — 1,000 entries, 12-hour TTL
 *   A typical lookup/search costs 1 api.bible request.
 *   Cached hits cost 0. Most popular verses (John 3:16, Ps 23…)
 *   will hit the cache for every user after the first call.
 *
 * To use Redis instead of in-memory cache, swap the SimpleCache
 * class for an ioredis client — the interface is identical.
 *
 * Setup:
 *   Add to backend .env:
 *     BIBLE_API_KEY=your_api_bible_key
 */

import https from "https";

const API_KEY = process.env.BIBLE_API_KEY ?? "";
const BASE_URL = "https://rest.api.bible/v1";

// ─────────────────────────────────────────────────────────────────────────────
// Simple in-memory LRU cache (no extra dependency)
// ─────────────────────────────────────────────────────────────────────────────
const TTL_MS = 1000 * 60 * 60 * 12; // 12 hours
const MAX_SIZE = 1_000;

class SimpleCache {
  private store = new Map<string, { value: any; expiresAt: number }>();

  get(key: string): any | null {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }
    return entry.value;
  }

  set(key: string, value: any): void {
    if (this.store.size >= MAX_SIZE) {
      // Evict oldest entry
      this.store.delete(this.store.keys().next().value!);
    }
    this.store.set(key, { value, expiresAt: Date.now() + TTL_MS });
  }
}

const cache = new SimpleCache();

// ─────────────────────────────────────────────────────────────────────────────
// HTTP helper
// ─────────────────────────────────────────────────────────────────────────────
function apiFetch(path: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const url = `${BASE_URL}${path}`;
    const req = https.get(url, { headers: { "api-key": API_KEY } }, (res) => {
      let body = "";
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => {
        if (res.statusCode && res.statusCode >= 400) {
          reject(
            Object.assign(new Error(`api.bible returned ${res.statusCode}`), {
              status: res.statusCode,
            }),
          );
          return;
        }
        try {
          resolve(JSON.parse(body));
        } catch {
          reject(new Error("Invalid JSON from api.bible"));
        }
      });
    });
    req.on("error", reject);
    req.setTimeout(10_000, () => {
      req.destroy(new Error("api.bible request timed out"));
    });
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Strip html tags from api.bible content
// ─────────────────────────────────────────────────────────────────────────────
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s{2,}/g, " ")
    .replace(/\[\d+\]/g, "")
    .trim();
}

// ─────────────────────────────────────────────────────────────────────────────
// Book name → api.bible book ID resolver
// ─────────────────────────────────────────────────────────────────────────────
const BOOK_MAP: Record<string, string> = {
  // Old Testament
  genesis: "GEN",
  gen: "GEN",
  exodus: "EXO",
  exo: "EXO",
  exod: "EXO",
  leviticus: "LEV",
  lev: "LEV",
  numbers: "NUM",
  num: "NUM",
  deuteronomy: "DEU",
  deu: "DEU",
  deut: "DEU",
  joshua: "JOS",
  jos: "JOS",
  josh: "JOS",
  judges: "JDG",
  jdg: "JDG",
  judg: "JDG",
  ruth: "RUT",
  rut: "RUT",
  "1 samuel": "1SA",
  "1samuel": "1SA",
  "1sa": "1SA",
  "1sam": "1SA",
  "2 samuel": "2SA",
  "2samuel": "2SA",
  "2sa": "2SA",
  "2sam": "2SA",
  "1 kings": "1KI",
  "1kings": "1KI",
  "1ki": "1KI",
  "1kgs": "1KI",
  "2 kings": "2KI",
  "2kings": "2KI",
  "2ki": "2KI",
  "2kgs": "2KI",
  "1 chronicles": "1CH",
  "1chronicles": "1CH",
  "1ch": "1CH",
  "1chr": "1CH",
  "2 chronicles": "2CH",
  "2chronicles": "2CH",
  "2ch": "2CH",
  "2chr": "2CH",
  ezra: "EZR",
  ezr: "EZR",
  nehemiah: "NEH",
  neh: "NEH",
  esther: "EST",
  est: "EST",
  esth: "EST",
  job: "JOB",
  psalms: "PSA",
  psalm: "PSA",
  psa: "PSA",
  ps: "PSA",
  proverbs: "PRO",
  pro: "PRO",
  prov: "PRO",
  ecclesiastes: "ECC",
  ecc: "ECC",
  eccl: "ECC",
  "song of solomon": "SNG",
  "song of songs": "SNG",
  sng: "SNG",
  sos: "SNG",
  isaiah: "ISA",
  isa: "ISA",
  jeremiah: "JER",
  jer: "JER",
  lamentations: "LAM",
  lam: "LAM",
  ezekiel: "EZK",
  ezk: "EZK",
  ezek: "EZK",
  daniel: "DAN",
  dan: "DAN",
  hosea: "HOS",
  hos: "HOS",
  joel: "JOL",
  jol: "JOL",
  amos: "AMO",
  amo: "AMO",
  obadiah: "OBA",
  oba: "OBA",
  jonah: "JON",
  jon: "JON",
  micah: "MIC",
  mic: "MIC",
  nahum: "NAM",
  nam: "NAM",
  habakkuk: "HAB",
  hab: "HAB",
  zephaniah: "ZEP",
  zep: "ZEP",
  zeph: "ZEP",
  haggai: "HAG",
  hag: "HAG",
  zechariah: "ZEC",
  zec: "ZEC",
  zech: "ZEC",
  malachi: "MAL",
  mal: "MAL",
  // New Testament
  matthew: "MAT",
  mat: "MAT",
  matt: "MAT",
  mark: "MRK",
  mrk: "MRK",
  mk: "MRK",
  luke: "LUK",
  luk: "LUK",
  lk: "LUK",
  john: "JHN",
  jhn: "JHN",
  jn: "JHN",
  acts: "ACT",
  act: "ACT",
  romans: "ROM",
  rom: "ROM",
  "1 corinthians": "1CO",
  "1corinthians": "1CO",
  "1co": "1CO",
  "1cor": "1CO",
  "2 corinthians": "2CO",
  "2corinthians": "2CO",
  "2co": "2CO",
  "2cor": "2CO",
  galatians: "GAL",
  gal: "GAL",
  ephesians: "EPH",
  eph: "EPH",
  philippians: "PHP",
  php: "PHP",
  phil: "PHP",
  colossians: "COL",
  col: "COL",
  "1 thessalonians": "1TH",
  "1thessalonians": "1TH",
  "1th": "1TH",
  "1thes": "1TH",
  "2 thessalonians": "2TH",
  "2thessalonians": "2TH",
  "2th": "2TH",
  "2thes": "2TH",
  "1 timothy": "1TI",
  "1timothy": "1TI",
  "1ti": "1TI",
  "1tim": "1TI",
  "2 timothy": "2TI",
  "2timothy": "2TI",
  "2ti": "2TI",
  "2tim": "2TI",
  titus: "TIT",
  tit: "TIT",
  philemon: "PHM",
  phm: "PHM",
  phlm: "PHM",
  hebrews: "HEB",
  heb: "HEB",
  james: "JAS",
  jas: "JAS",
  jam: "JAS",
  "1 peter": "1PE",
  "1peter": "1PE",
  "1pe": "1PE",
  "1pet": "1PE",
  "2 peter": "2PE",
  "2peter": "2PE",
  "2pe": "2PE",
  "2pet": "2PE",
  "1 john": "1JN",
  "1john": "1JN",
  "1jn": "1JN",
  "2 john": "2JN",
  "2john": "2JN",
  "2jn": "2JN",
  "3 john": "3JN",
  "3john": "3JN",
  "3jn": "3JN",
  jude: "JUD",
  jud: "JUD",
  revelation: "REV",
  rev: "REV",
  revl: "REV",
};

export function resolveBookId(input: string): string | null {
  return BOOK_MAP[input.toLowerCase().trim()] ?? null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Parse "John 3:16" or "Romans 8:28-30" into components
// ─────────────────────────────────────────────────────────────────────────────
export function parseReference(ref: string): {
  bookId: string | null;
  chapter: number | null;
  verseStart: number | null;
  verseEnd: number | null;
  displayRef: string;
} {
  const match = ref.trim().match(/^([\w\s]+?)\s+(\d+):(\d+)(?:-(\d+))?$/i);
  if (!match) {
    return {
      bookId: null,
      chapter: null,
      verseStart: null,
      verseEnd: null,
      displayRef: ref,
    };
  }
  const bookId = resolveBookId(match[1].trim());
  return {
    bookId,
    chapter: parseInt(match[2]),
    verseStart: parseInt(match[3]),
    verseEnd: match[4] ? parseInt(match[4]) : null,
    displayRef: ref.trim(),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Available Bible versions
// ─────────────────────────────────────────────────────────────────────────────
export const BIBLE_VERSIONS = [
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

const DEFAULT_VERSION = "de4e12af7f28f599-02"; // KJV

// ─────────────────────────────────────────────────────────────────────────────
// Public service functions
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Look up a passage by reference string.
 * e.g. "John 3:16", "Romans 8:28-30", "Psalm 23:1-6"
 */
export async function lookupPassage(
  ref: string,
  versionId = DEFAULT_VERSION,
): Promise<{
  reference: string;
  text: string;
  version: string;
  versionId: string;
}> {
  const { bookId, chapter, verseStart, verseEnd, displayRef } =
    parseReference(ref);

  if (!bookId || !chapter || !verseStart) {
    throw Object.assign(
      new Error(
        `Could not parse reference "${ref}". Use format "Book Chapter:Verse" e.g. "John 3:16"`,
      ),
      { status: 400 },
    );
  }

  const passageId = verseEnd
    ? `${bookId}.${chapter}.${verseStart}-${bookId}.${chapter}.${verseEnd}`
    : `${bookId}.${chapter}.${verseStart}`;

  const cacheKey = `passage:${versionId}:${passageId}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const json = await apiFetch(
    `/bibles/${versionId}/passages/${encodeURIComponent(passageId)}` +
      `?content-type=text&include-notes=false&include-titles=false` +
      `&include-chapter-numbers=false&include-verse-numbers=true`,
  );

  const version =
    BIBLE_VERSIONS.find((v) => v.id === versionId)?.label ?? "KJV";
  const result = {
    reference: json.data.reference ?? displayRef,
    text: stripHtml(json.data.content ?? ""),
    version,
    versionId,
  };

  cache.set(cacheKey, result);
  return result;
}

/**
 * Full-text search across the Bible.
 * e.g. "love your neighbour", "grace", "faith hope"
 */
export async function searchScripture(
  query: string,
  versionId = DEFAULT_VERSION,
  limit = 12,
): Promise<
  {
    id: string;
    reference: string;
    text: string;
    version: string;
    versionId: string;
  }[]
> {
  const trimmed = query.trim();
  const cacheKey = `search:${versionId}:${trimmed}:${limit}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const json = await apiFetch(
    `/bibles/${versionId}/search` +
      `?query=${encodeURIComponent(trimmed)}&limit=${limit}&sort=relevance`,
  );

  const version =
    BIBLE_VERSIONS.find((v) => v.id === versionId)?.label ?? "KJV";
  const results = (json.data?.verses ?? []).map((v: any) => ({
    id: v.id,
    reference: v.reference,
    text: stripHtml(v.text ?? ""),
    version,
    versionId,
  }));

  cache.set(cacheKey, results);
  return results;
}

/** Return the list of supported Bible versions */
export function getVersions() {
  return BIBLE_VERSIONS;
}
