// bible/repositories/index.ts
//
// All raw SQL lives here. Controllers and services never touch SQL directly.
// Uses the pg Pool from the seeder — separate from the Prisma database.

import { Pool } from "pg";
import {
  BibleVerse,
  BibleBook,
  BibleChapter,
  SearchResult,
  CompareEntry,
} from "../types";
import { getBookName } from "../utils";

export class BibleRepository {
  constructor(private readonly pool: Pool) {}

  // ── Books ─────────────────────────────────────────────────────────
  async getBooks(testament?: "OT" | "NT"): Promise<BibleBook[]> {
    const where = testament ? "WHERE testament = $1" : "";
    const params = testament ? [testament] : [];
    const { rows } = await this.pool.query<BibleBook>(
      `SELECT book_number, book_name, abbreviation, testament
       FROM bible_books
       ${where}
       ORDER BY book_number`,
      params,
    );
    return rows;
  }

  async getBookChapterCount(
    bookNumber: number,
    translation: string,
  ): Promise<number> {
    const { rows } = await this.pool.query<{ max_chapter: number }>(
      `SELECT MAX(chapter) as max_chapter
       FROM bible_verses
       WHERE book_number = $1 AND translation = $2`,
      [bookNumber, translation],
    );
    return rows[0]?.max_chapter ?? 0;
  }

  // ── Chapter ───────────────────────────────────────────────────────
  async getChapter(
    translation: string,
    bookNumber: number,
    chapter: number,
  ): Promise<BibleVerse[]> {
    const { rows } = await this.pool.query<BibleVerse>(
      `SELECT id, translation, book_name, book_number, chapter, verse, text
       FROM bible_verses
       WHERE translation = $1
         AND book_number = $2
         AND chapter     = $3
       ORDER BY verse`,
      [translation, bookNumber, chapter],
    );
    return rows;
  }

  async getMaxChapter(
    translation: string,
    bookNumber: number,
  ): Promise<number> {
    const { rows } = await this.pool.query<{ max: number }>(
      `SELECT MAX(chapter) as max FROM bible_verses
       WHERE translation = $1 AND book_number = $2`,
      [translation, bookNumber],
    );
    return rows[0]?.max ?? 1;
  }

  // ── Single Verse ──────────────────────────────────────────────────
  async getVerse(
    translation: string,
    bookNumber: number,
    chapter: number,
    verse: number,
  ): Promise<BibleVerse | null> {
    const { rows } = await this.pool.query<BibleVerse>(
      `SELECT id, translation, book_name, book_number, chapter, verse, text
       FROM bible_verses
       WHERE translation = $1
         AND book_number = $2
         AND chapter     = $3
         AND verse       = $4`,
      [translation, bookNumber, chapter, verse],
    );
    return rows[0] ?? null;
  }

  // ── Verse range (for passage comparison) ──────────────────────────
  async getVerseRange(
    translation: string,
    bookNumber: number,
    chapter: number,
    verseStart: number,
    verseEnd: number,
  ): Promise<BibleVerse[]> {
    const { rows } = await this.pool.query<BibleVerse>(
      `SELECT id, translation, book_name, book_number, chapter, verse, text
       FROM bible_verses
       WHERE translation = $1
         AND book_number = $2
         AND chapter     = $3
         AND verse BETWEEN $4 AND $5
       ORDER BY verse`,
      [translation, bookNumber, chapter, verseStart, verseEnd],
    );
    return rows;
  }

  // ── Full-text search ──────────────────────────────────────────────
  // Uses PostgreSQL tsvector index — extremely fast even on millions of rows.
  // ts_headline wraps the matching words in <mark>...</mark> for frontend highlighting.
  async search(
    query: string,
    translation: string,
    options: {
      testament?: "OT" | "NT";
      bookNumber?: number;
      page: number;
      limit: number;
    },
  ): Promise<{ results: SearchResult[]; total: number }> {
    const { testament, bookNumber, page, limit } = options;
    const offset = (page - 1) * limit;

    // Build WHERE clauses dynamically
    const conditions: string[] = [
      "translation = $1",
      "text_search @@ plainto_tsquery('english', $2)",
    ];
    const params: unknown[] = [translation, query];
    let idx = 3;

    if (testament) {
      // Join to bible_books to filter by testament
      conditions.push(`book_number IN (
        SELECT book_number FROM bible_books WHERE testament = $${idx}
      )`);
      params.push(testament);
      idx++;
    }

    if (bookNumber) {
      conditions.push(`book_number = $${idx}`);
      params.push(bookNumber);
      idx++;
    }

    const where = conditions.join(" AND ");

    // Count query (fast because it uses the GIN index)
    const countResult = await this.pool.query<{ count: string }>(
      `SELECT COUNT(*) FROM bible_verses WHERE ${where}`,
      params,
    );
    const total = parseInt(countResult.rows[0]?.count ?? "0");

    // Results with snippet and rank
    const { rows } = await this.pool.query(
      `SELECT
         translation, book_name, book_number, chapter, verse, text,
         ts_headline(
           'english', text, plainto_tsquery('english', $2),
           'StartSel=<mark>, StopSel=</mark>, MaxWords=30, MinWords=15, ShortWord=3'
         ) as snippet,
         ts_rank(text_search, plainto_tsquery('english', $2)) as rank
       FROM bible_verses
       WHERE ${where}
       ORDER BY rank DESC, book_number, chapter, verse
       LIMIT $${idx} OFFSET $${idx + 1}`,
      [...params, limit, offset],
    );

    return { results: rows, total };
  }

  // ── Compare verse across translations ─────────────────────────────
  async compareVerse(
    bookNumber: number,
    chapter: number,
    verse: number,
    translations: string[],
  ): Promise<CompareEntry[]> {
    if (translations.length === 0) return [];

    // Build $1,$2,$3... placeholders for the IN clause
    const placeholders = translations.map((_, i) => `$${i + 4}`).join(",");

    const { rows } = await this.pool.query<{
      translation: string;
      text: string;
    }>(
      `SELECT translation, text
       FROM bible_verses
       WHERE book_number = $1
         AND chapter     = $2
         AND verse       = $3
         AND translation IN (${placeholders})
       ORDER BY translation`,
      [bookNumber, chapter, verse, ...translations],
    );

    // Map all requested translations — mark unavailable ones
    const found = new Map(rows.map((r) => [r.translation, r.text]));
    return translations.map((t) => ({
      translation: t,
      text: found.get(t) ?? "",
      available: found.has(t),
    }));
  }

  // ── Available translations ─────────────────────────────────────────
  async getTranslations(): Promise<
    { translation: string; verse_count: number }[]
  > {
    const { rows } = await this.pool.query(
      `SELECT translation, COUNT(*) as verse_count
       FROM bible_verses
       GROUP BY translation
       ORDER BY translation`,
    );
    return rows;
  }
}
