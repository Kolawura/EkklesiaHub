// bible/repositories/concordance.ts
//
// All raw SQL for the Strong's / tagged KJV / reading plan / dictionary tables
// created by the seed scripts (001_concordance_schema.sql, 002_dictionary_schema.sql).
// Same rules as the rest of the module: SQL lives here and nowhere else.

import { Pool } from "pg";
import {
  StrongsEntry,
  TaggedVerse,
  DictionarySource,
} from "../types/concordance";
import { DailyPoolDef, escapeLike } from "../utils/concordance";

export interface StrongsVerseRow {
  book_number: number;
  chapter: number;
  verse: number;
  tagged_text: string;
}

export interface PlanRow {
  id: number;
  slug: string;
  title: string;
  description: string | null;
}

export interface PlanSummaryRow {
  slug: string;
  title: string;
  description: string | null;
  durations: number[];
}

export interface PlanChapterRow {
  day: number;
  seq: number;
  book_number: number;
  chapter: number;
}

export interface DictionaryTermRow {
  slug: string;
  term: string;
  sources: DictionarySource[];
  total?: number;
}

export interface DictionarySearchRow {
  slug: string;
  term: string;
  source: DictionarySource;
  snippet: string;
  rank: number;
  total: number;
}

export interface DictionaryEntryRow {
  slug: string;
  term: string;
  source: DictionarySource;
  body_html: string;
}

export interface DailyPickRow {
  book_number: number;
  chapter: number;
  verse: number;
}

export class ConcordanceRepository {
  constructor(private readonly pool: Pool) {}

  // ── Strong's ─────────────────────────────────────────────────────
  async getStrongsEntry(id: string): Promise<StrongsEntry | null> {
    const { rows } = await this.pool.query<StrongsEntry>(
      `SELECT id, language, number, lemma, transliteration, pronunciation,
              definition_html, usage, occurrence_count, verse_count
       FROM strongs_entries
       WHERE id = $1`,
      [id],
    );
    return rows[0] ?? null;
  }

  async countStrongsVerses(id: string): Promise<number> {
    const { rows } = await this.pool.query<{ n: number }>(
      `SELECT COUNT(*)::int AS n FROM strongs_occurrences WHERE strongs_id = $1`,
      [id],
    );
    return rows[0]?.n ?? 0;
  }

  // Canonical order (Genesis → Revelation). The PK on strongs_occurrences
  // is (strongs_id, book_number, chapter, verse), so this is an index scan.
  async getStrongsVerses(
    id: string,
    limit: number,
    offset: number,
  ): Promise<StrongsVerseRow[]> {
    const { rows } = await this.pool.query<StrongsVerseRow>(
      `SELECT v.book_number, v.chapter, v.verse, v.tagged_text
       FROM strongs_occurrences o
       JOIN kjv_strongs_verses v
         ON v.book_number = o.book_number
        AND v.chapter     = o.chapter
        AND v.verse       = o.verse
       WHERE o.strongs_id = $1
       ORDER BY o.book_number, o.chapter, o.verse
       LIMIT $2 OFFSET $3`,
      [id, limit, offset],
    );
    return rows;
  }

  // ── Tagged KJV chapter ───────────────────────────────────────────
  async getTaggedChapter(
    bookNumber: number,
    chapter: number,
  ): Promise<TaggedVerse[]> {
    const { rows } = await this.pool.query<TaggedVerse>(
      `SELECT verse, tagged_text AS text
       FROM kjv_strongs_verses
       WHERE book_number = $1 AND chapter = $2
       ORDER BY verse`,
      [bookNumber, chapter],
    );
    return rows;
  }

  async getMaxTaggedChapter(bookNumber: number): Promise<number> {
    const { rows } = await this.pool.query<{ max: number | null }>(
      `SELECT MAX(chapter)::int AS max
       FROM kjv_strongs_verses
       WHERE book_number = $1`,
      [bookNumber],
    );
    return rows[0]?.max ?? 1;
  }

  // ── Reading plans ────────────────────────────────────────────────
  async getPlans(): Promise<PlanSummaryRow[]> {
    const { rows } = await this.pool.query<PlanSummaryRow>(
      `SELECT p.slug, p.title, p.description,
              COALESCE(
                array_agg(DISTINCT d.duration_days ORDER BY d.duration_days DESC)
                  FILTER (WHERE d.duration_days IS NOT NULL),
                '{}'
              ) AS durations
       FROM reading_plans p
       LEFT JOIN reading_plan_days d ON d.plan_id = p.id
       GROUP BY p.id
       ORDER BY p.sort_order`,
    );
    return rows;
  }

  async getPlanBySlug(slug: string): Promise<PlanRow | null> {
    const { rows } = await this.pool.query<PlanRow>(
      `SELECT id, slug, title, description FROM reading_plans WHERE slug = $1`,
      [slug],
    );
    return rows[0] ?? null;
  }

  async getPlanChapters(
    planId: number,
    duration: number,
  ): Promise<PlanChapterRow[]> {
    const { rows } = await this.pool.query<PlanChapterRow>(
      `SELECT day, seq, book_number, chapter
       FROM reading_plan_days
       WHERE plan_id = $1 AND duration_days = $2
       ORDER BY day, seq`,
      [planId, duration],
    );
    return rows;
  }

  async getPlanDayChapters(
    planId: number,
    duration: number,
    day: number,
  ): Promise<PlanChapterRow[]> {
    const { rows } = await this.pool.query<PlanChapterRow>(
      `SELECT day, seq, book_number, chapter
       FROM reading_plan_days
       WHERE plan_id = $1 AND duration_days = $2 AND day = $3
       ORDER BY seq`,
      [planId, duration, day],
    );
    return rows;
  }

  // ── Dictionary ───────────────────────────────────────────────────
  // Autocomplete: terms starting with the typed text, exact match first, then shortest.
  async suggestTerms(
    prefix: string,
    limit: number,
    source?: DictionarySource,
  ): Promise<DictionaryTermRow[]> {
    const lower = prefix.toLowerCase();
    const params: unknown[] = [escapeLike(lower) + "%", lower, limit];
    let sourceClause = "";
    if (source) {
      params.push(source);
      sourceClause = "AND source = $4";
    }
    const { rows } = await this.pool.query<DictionaryTermRow>(
      `SELECT slug,
              MIN(term) AS term,
              array_agg(DISTINCT source ORDER BY source) AS sources
       FROM dictionary_entries
       WHERE term_lower LIKE $1 ESCAPE '\\' ${sourceClause}
       GROUP BY slug
       ORDER BY bool_or(term_lower = $2) DESC,
                MIN(length(term_lower)),
                MIN(term_lower)
       LIMIT $3`,
      params,
    );
    return rows;
  }

  // Full-text search across terms and definitions. websearch_to_tsquery never
  // throws on odd user input (quotes, operators, stray punctuation).
  async searchDictionary(
    query: string,
    limit: number,
    offset: number,
    source?: DictionarySource,
  ): Promise<DictionarySearchRow[]> {
    const params: unknown[] = [query, limit, offset];
    let sourceClause = "";
    if (source) {
      params.push(source);
      sourceClause = "AND d.source = $4";
    }
    const { rows } = await this.pool.query<DictionarySearchRow>(
      `WITH q AS (SELECT websearch_to_tsquery('english', $1) AS tsq)
       SELECT d.slug, d.term, d.source,
              ts_headline(
                'english', d.body_text, q.tsq,
                'StartSel=⟦, StopSel=⟧, MaxWords=30, MinWords=12, ShortWord=3'
              ) AS snippet,
              ts_rank_cd(d.search_vector, q.tsq) AS rank,
              COUNT(*) OVER ()::int AS total
       FROM dictionary_entries d, q
       WHERE d.search_vector @@ q.tsq ${sourceClause}
       ORDER BY rank DESC, d.term_lower, d.source
       LIMIT $2 OFFSET $3`,
      params,
    );
    return rows;
  }

  // A–Z browse. One row per slug, listing which dictionaries have it.
  async browseDictionary(
    letter: string,
    limit: number,
    offset: number,
    source?: DictionarySource,
  ): Promise<DictionaryTermRow[]> {
    const params: unknown[] = [letter, limit, offset];
    let sourceClause = "";
    if (source) {
      params.push(source);
      sourceClause = "AND source = $4";
    }
    const { rows } = await this.pool.query<DictionaryTermRow>(
      `SELECT slug,
              MIN(term) AS term,
              array_agg(DISTINCT source ORDER BY source) AS sources,
              COUNT(*) OVER ()::int AS total
       FROM dictionary_entries
       WHERE first_letter = $1 ${sourceClause}
       GROUP BY slug
       ORDER BY MIN(term_lower), slug
       LIMIT $2 OFFSET $3`,
      params,
    );
    return rows;
  }

  async getDictionaryEntries(slug: string): Promise<DictionaryEntryRow[]> {
    const { rows } = await this.pool.query<DictionaryEntryRow>(
      `SELECT slug, term, source, body_html
       FROM dictionary_entries
       WHERE slug = $1`,
      [slug],
    );
    return rows;
  }

  // ── Daily gospel / psalm pools (KJV rows in bible_verses) ────────
  // The same predicates are used to COUNT the pool and to pick the Nth verse,
  // so an index computed from the count always lands on a real row.
  private poolWhere(def: DailyPoolDef) {
    const where = `v.translation = 'KJV'
      AND v.book_number = ANY($1::int[])
      AND length(v.text) >= $2
      AND NOT EXISTS (
        SELECT 1
        FROM unnest($3::int[], $4::int[], $5::int[], $6::int[]) AS s(b, c, v1, v2)
        WHERE s.b = v.book_number AND s.c = v.chapter
          AND v.verse BETWEEN s.v1 AND s.v2
      )`;
    const params: unknown[] = [
      def.books,
      def.minLength,
      def.skipRanges.map((r) => r[0]),
      def.skipRanges.map((r) => r[1]),
      def.skipRanges.map((r) => r[2]),
      def.skipRanges.map((r) => r[3]),
    ];
    return { where, params };
  }

  async countDailyPool(def: DailyPoolDef): Promise<number> {
    const { where, params } = this.poolWhere(def);
    const { rows } = await this.pool.query<{ n: number }>(
      `SELECT COUNT(*)::int AS n FROM bible_verses v WHERE ${where}`,
      params,
    );
    return rows[0]?.n ?? 0;
  }

  async getDailyPoolVerse(
    def: DailyPoolDef,
    offset: number,
  ): Promise<DailyPickRow | null> {
    const { where, params } = this.poolWhere(def);
    const { rows } = await this.pool.query<DailyPickRow>(
      `SELECT v.book_number, v.chapter, v.verse
       FROM bible_verses v
       WHERE ${where}
       ORDER BY v.book_number, v.chapter, v.verse
       OFFSET $7 LIMIT 1`,
      [...params, offset],
    );
    return rows[0] ?? null;
  }
}
