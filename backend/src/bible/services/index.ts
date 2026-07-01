// bible/services/index.ts
//
// Business logic sits here. The repository handles SQL.
// The service handles caching, assembly, and domain logic.

import { Pool } from "pg";
import { BibleRepository } from "../repositories";
import {
  BibleBook,
  BibleChapter,
  BibleVerse,
  SearchResponse,
  CompareResponse,
  VerseOfTheDay,
  TranslationInfo,
} from "../types";
import {
  resolveBookNumber,
  getBookName,
  parseReference,
  getTodayVotdEntry,
} from "../utils";
import { FEATURED_TRANSLATIONS } from "../utils/featuredTranslation";

// ── Simple in-memory cache ─────────────────────────────────────────
// Chapters and books are static — cache for 24h.
// Search results cache for 30min.
// VOTD caches for 24h.

interface CacheEntry {
  value: unknown;
  expiresAt: number;
}
class SimpleCache {
  private store = new Map<string, CacheEntry>();
  get<T>(key: string): T | null {
    const e = this.store.get(key);
    if (!e || Date.now() > e.expiresAt) {
      this.store.delete(key);
      return null;
    }
    return e.value as T;
  }
  set(key: string, value: unknown, ttlMs: number) {
    if (this.store.size > 3_000) {
      // Evict oldest 10%
      const keys = Array.from(this.store.keys()).slice(0, 300);
      keys.forEach((k) => this.store.delete(k));
    }
    this.store.set(key, { value, expiresAt: Date.now() + ttlMs });
  }
  stats() {
    return { size: this.store.size };
  }
}

const cache = new SimpleCache();
const H12 = 1000 * 60 * 60 * 12;
const H24 = 1000 * 60 * 60 * 24;
const M30 = 1000 * 60 * 30;

export class BibleService {
  private repo: BibleRepository;

  constructor(pool: Pool) {
    this.repo = new BibleRepository(pool);
  }

  // ── Books ──────────────────────────────────────────────────────────
  async getBooks(testament?: "OT" | "NT"): Promise<BibleBook[]> {
    const key = `books:${testament ?? "all"}`;
    const hit = cache.get<BibleBook[]>(key);
    if (hit) return hit;

    const books = await this.repo.getBooks(testament);
    cache.set(key, books, H24);
    return books;
  }

  // ── Chapter ────────────────────────────────────────────────────────
  async getChapter(
    translation: string,
    bookInput: string,
    chapter: number,
  ): Promise<BibleChapter> {
    const bookNumber = this.resolveBook(bookInput);
    const key = `chapter:${translation}:${bookNumber}:${chapter}`;
    const hit = cache.get<BibleChapter>(key);
    if (hit) return hit;

    const [verses, maxChapter] = await Promise.all([
      this.repo.getChapter(translation, bookNumber, chapter),
      this.repo.getMaxChapter(translation, bookNumber),
    ]);

    if (verses.length === 0) {
      throw Object.assign(
        new Error(
          `Chapter ${chapter} not found in ${getBookName(bookNumber)} (${translation})`,
        ),
        { status: 404 },
      );
    }

    const result: BibleChapter = {
      translation,
      book_name: verses[0].book_name,
      book_number: bookNumber,
      chapter,
      verses,
      total_verses: verses.length,
      prev_chapter: chapter > 1 ? chapter - 1 : null,
      next_chapter: chapter < maxChapter ? chapter + 1 : null,
      max_chapters: maxChapter,
    };

    cache.set(key, result, H12);
    return result;
  }

  // ── Single verse ───────────────────────────────────────────────────
  async getVerse(
    translation: string,
    bookInput: string,
    chapter: number,
    verse: number,
  ): Promise<BibleVerse> {
    const bookNumber = this.resolveBook(bookInput);
    const key = `verse:${translation}:${bookNumber}:${chapter}:${verse}`;
    const hit = cache.get<BibleVerse>(key);
    if (hit) return hit;

    const result = await this.repo.getVerse(
      translation,
      bookNumber,
      chapter,
      verse,
    );
    if (!result) {
      throw Object.assign(
        new Error(
          `Verse not found: ${getBookName(bookNumber)} ${chapter}:${verse} (${translation})`,
        ),
        { status: 404 },
      );
    }
    cache.set(key, result, H12);
    return result;
  }

  // ── Reference lookup e.g. "John 3:16" ─────────────────────────────
  async getByReference(
    ref: string,
    translation: string,
  ): Promise<BibleVerse | BibleVerse[]> {
    const parsed = parseReference(ref);
    if (!parsed.valid) {
      throw Object.assign(new Error(parsed.error ?? "Invalid reference"), {
        status: 400,
      });
    }

    if (parsed.verse_start === null) {
      // Return full chapter
      return this.getChapter(
        translation,
        parsed.book_name,
        parsed.chapter!,
      ).then((c) => c.verses);
    }

    if (parsed.verse_end !== null) {
      // Verse range
      const verses = await this.repo.getVerseRange(
        translation,
        parsed.book_number,
        parsed.chapter!,
        parsed.verse_start,
        parsed.verse_end,
      );
      if (verses.length === 0)
        throw Object.assign(new Error("Passage not found"), { status: 404 });
      return verses;
    }

    // Single verse
    const verse = await this.repo.getVerse(
      translation,
      parsed.book_number,
      parsed.chapter!,
      parsed.verse_start,
    );
    if (!verse)
      throw Object.assign(new Error("Verse not found"), { status: 404 });
    return verse;
  }

  // ── Search ─────────────────────────────────────────────────────────
  async search(
    query: string,
    translation: string,
    options: {
      testament?: "OT" | "NT";
      book?: string;
      page: number;
      limit: number;
    },
  ): Promise<SearchResponse> {
    const { testament, book, page, limit } = options;
    const bookNumber = book ? this.resolveBook(book) : undefined;

    const key = `search:${translation}:${query}:${testament}:${bookNumber}:${page}:${limit}`;
    const hit = cache.get<SearchResponse>(key);
    if (hit) return hit;

    const { results, total } = await this.repo.search(query, translation, {
      testament,
      bookNumber,
      page,
      limit,
    });

    const response: SearchResponse = {
      query,
      translation,
      results,
      total,
      page,
      limit,
    };
    cache.set(key, response, M30);
    return response;
  }

  // ── Compare across translations ────────────────────────────────────
  async compare(
    bookInput: string,
    chapter: number,
    verse: number,
    requestedTranslations?: string[],
  ): Promise<CompareResponse> {
    const bookNumber = this.resolveBook(bookInput);

    // Default to all featured translations if none specified
    const translations = requestedTranslations?.length
      ? requestedTranslations
      : FEATURED_TRANSLATIONS.map((t) => t.key);

    const key = `compare:${bookNumber}:${chapter}:${verse}:${translations.join(",")}`;
    const hit = cache.get<CompareResponse>(key);
    if (hit) return hit;

    const entries = await this.repo.compareVerse(
      bookNumber,
      chapter,
      verse,
      translations,
    );
    const bookName = getBookName(bookNumber);

    const result: CompareResponse = {
      book_name: bookName,
      chapter,
      verse,
      reference: `${bookName} ${chapter}:${verse}`,
      entries,
    };

    cache.set(key, result, H12);
    return result;
  }

  // ── Verse of the Day ───────────────────────────────────────────────
  async getVerseOfTheDay(translation: string): Promise<VerseOfTheDay> {
    const key = `votd:${translation}:${new Date().toISOString().split("T")[0]}`;
    const hit = cache.get<VerseOfTheDay>(key);
    if (hit) return hit;

    const entry = getTodayVotdEntry();
    const verse = await this.repo.getVerse(
      translation,
      entry.book_number,
      entry.chapter,
      entry.verse,
    );

    // Graceful fallback to KJV if the translation doesn't have this verse
    const verseText =
      verse ??
      (await this.repo.getVerse(
        "KJV",
        entry.book_number,
        entry.chapter,
        entry.verse,
      ));

    if (!verseText) throw new Error("Verse of the day not available");

    const result: VerseOfTheDay = {
      translation: verseText.translation,
      book_name: verseText.book_name,
      chapter: verseText.chapter,
      verse: verseText.verse,
      text: verseText.text,
      reference: `${verseText.book_name} ${verseText.chapter}:${verseText.verse}`,
      reflection: entry.reflection,
      date: new Date().toISOString().split("T")[0],
    };

    cache.set(key, result, H24);
    return result;
  }

  // ── Translations list ──────────────────────────────────────────────
  async getTranslations(): Promise<TranslationInfo[]> {
    const key = "translations";
    const hit = cache.get<TranslationInfo[]>(key);
    if (hit) return hit;

    const dbTranslations = await this.repo.getTranslations();
    const featuredKeys = new Set(FEATURED_TRANSLATIONS.map((t) => t.key));

    const result: TranslationInfo[] = dbTranslations.map((t) => {
      const featured = FEATURED_TRANSLATIONS.find(
        (f) => f.key === t.translation,
      );
      return {
        translation: t.translation,
        verse_count: parseInt(String(t.verse_count)),
        is_featured: featuredKeys.has(t.translation),
        description: featured?.description,
      };
    });

    cache.set(key, result, H24);
    return result;
  }

  // ── Cache stats (for admin/debug) ──────────────────────────────────
  getCacheStats() {
    return cache.stats();
  }

  // ── Private helpers ────────────────────────────────────────────────
  private resolveBook(input: string): number {
    // Try as number first
    const asNum = parseInt(input);
    if (!isNaN(asNum) && asNum >= 1 && asNum <= 66) return asNum;

    const num = resolveBookNumber(input);
    if (!num) {
      throw Object.assign(new Error(`Book "${input}" not found`), {
        status: 400,
      });
    }
    return num;
  }
}
