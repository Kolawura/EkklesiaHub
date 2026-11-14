// bible/services/concordance.ts
//
// Business logic for Strong's, the tagged KJV, reading plans, the dictionary
// and the daily readings. The repository handles SQL; this assembles results.

import { Pool } from "pg";
import { BibleService } from "./index";
import { ConcordanceRepository } from "../repositories/concordance";
import { getBookName, resolveBookNumber, resolveVotdDate } from "../utils";
import {
  DAILY_POOLS,
  DICTIONARY_SOURCE_ORDER,
  dailyIndex,
  joinReferences,
  parseBookNumberInput,
  snippetToHtml,
  sourceLabel,
  toPassages,
} from "../utils/concordance";
import {
  DailyResponse,
  DailyVerse,
  DictionaryBrowseResponse,
  DictionaryEntryResponse,
  DictionarySearchResponse,
  DictionarySource,
  DictionaryTerm,
  PlanDay,
  PlanDayResponse,
  PlanOverview,
  ReadingPlanSummary,
  StrongsEntry,
  StrongsVersesResponse,
  TaggedChapter,
} from "../types/concordance";

// ── Tiny TTL cache (daily picks only) ──────────────────────────────
// Everything else is static data and relies on HTTP cache headers, as the
// rest of the Bible module does. Daily picks need two queries each, so they
// are worth holding in memory.
class TtlCache {
  private store = new Map<string, { value: unknown; expiresAt: number }>();
  get<T>(key: string): T | null {
    const e = this.store.get(key);
    if (!e || Date.now() > e.expiresAt) {
      this.store.delete(key);
      return null;
    }
    return e.value as T;
  }
  set(key: string, value: unknown, ttlMs: number) {
    if (this.store.size > 500) {
      Array.from(this.store.keys())
        .slice(0, 50)
        .forEach((k) => this.store.delete(k));
    }
    this.store.set(key, { value, expiresAt: Date.now() + ttlMs });
  }
}

const cache = new TtlCache();
const MIN1 = 1000 * 60;
const H24 = 1000 * 60 * 60 * 24;

const httpError = (status: number, message: string) =>
  Object.assign(new Error(message), { status });

export class ConcordanceService {
  private repo: ConcordanceRepository;

  constructor(
    pool: Pool,
    private readonly bible: BibleService,
  ) {
    this.repo = new ConcordanceRepository(pool);
  }

  // ── Strong's ─────────────────────────────────────────────────────
  async getStrongs(id: string): Promise<StrongsEntry> {
    const entry = await this.repo.getStrongsEntry(id);
    if (!entry) throw httpError(404, `Strong's ${id} not found`);
    return entry;
  }

  async getStrongsVerses(
    id: string,
    page: number,
    limit: number,
  ): Promise<StrongsVersesResponse> {
    const [total, rows] = await Promise.all([
      this.repo.countStrongsVerses(id),
      this.repo.getStrongsVerses(id, limit, (page - 1) * limit),
    ]);

    // Zero hits is either an unknown id or a (rare) unused entry: tell them apart.
    if (total === 0 && !(await this.repo.getStrongsEntry(id))) {
      throw httpError(404, `Strong's ${id} not found`);
    }

    return {
      strongs_id: id,
      total,
      page,
      limit,
      verses: rows.map((r) => {
        const name = getBookName(r.book_number);
        return {
          book_number: r.book_number,
          book_name: name,
          chapter: r.chapter,
          verse: r.verse,
          reference: `${name} ${r.chapter}:${r.verse}`,
          tagged_text: r.tagged_text,
        };
      }),
    };
  }

  // ── Tagged KJV chapter ───────────────────────────────────────────
  async getTaggedChapter(
    bookInput: string,
    chapter: number,
  ): Promise<TaggedChapter> {
    const bookNumber = this.resolveBook(bookInput);
    const verses = await this.repo.getTaggedChapter(bookNumber, chapter);
    if (verses.length === 0) {
      throw httpError(
        404,
        `Chapter ${chapter} not found in ${getBookName(bookNumber)} (KJV)`,
      );
    }
    const maxChapter = await this.repo.getMaxTaggedChapter(bookNumber);
    return {
      translation: "KJV",
      book_name: getBookName(bookNumber),
      book_number: bookNumber,
      chapter,
      verses,
      total_verses: verses.length,
      prev_chapter: chapter > 1 ? chapter - 1 : null,
      next_chapter: chapter < maxChapter ? chapter + 1 : null,
      max_chapters: maxChapter,
    };
  }

  // ── Reading plans ────────────────────────────────────────────────
  async getPlans(): Promise<ReadingPlanSummary[]> {
    return this.repo.getPlans();
  }

  async getPlanOverview(slug: string, duration: number): Promise<PlanOverview> {
    const plan = await this.repo.getPlanBySlug(slug);
    if (!plan) throw httpError(404, `Reading plan "${slug}" not found`);

    const rows = await this.repo.getPlanChapters(plan.id, duration);
    if (rows.length === 0) {
      throw httpError(404, `"${slug}" has no ${duration}-day schedule`);
    }

    const byDay = new Map<number, typeof rows>();
    for (const r of rows) {
      const list = byDay.get(r.day) ?? [];
      list.push(r);
      byDay.set(r.day, list);
    }

    const days: PlanDay[] = [...byDay.entries()]
      .sort((a, b) => a[0] - b[0])
      .map(([day, chapters]) => {
        const passages = toPassages(chapters, getBookName);
        return { day, reference: joinReferences(passages), passages };
      });

    return {
      slug: plan.slug,
      title: plan.title,
      description: plan.description,
      duration_days: duration,
      total_days: days.length,
      days,
    };
  }

  async getPlanDay(
    slug: string,
    duration: number,
    day: number,
  ): Promise<PlanDayResponse> {
    const plan = await this.repo.getPlanBySlug(slug);
    if (!plan) throw httpError(404, `Reading plan "${slug}" not found`);

    const rows = await this.repo.getPlanDayChapters(plan.id, duration, day);
    if (rows.length === 0) {
      throw httpError(
        404,
        `Day ${day} not found in "${slug}" (${duration} days)`,
      );
    }

    const passages = toPassages(rows, getBookName);
    return {
      slug: plan.slug,
      title: plan.title,
      duration_days: duration,
      total_days: duration, // schedules run day 1..duration with no gaps
      day,
      reference: joinReferences(passages),
      passages,
      prev_day: day > 1 ? day - 1 : null,
      next_day: day < duration ? day + 1 : null,
    };
  }

  // ── Dictionary ───────────────────────────────────────────────────
  async suggestTerms(
    q: string,
    limit: number,
    source?: DictionarySource,
  ): Promise<DictionaryTerm[]> {
    const rows = await this.repo.suggestTerms(q, limit, source);
    return rows.map(({ slug, term, sources }) => ({ slug, term, sources }));
  }

  async searchDictionary(
    q: string,
    page: number,
    limit: number,
    source?: DictionarySource,
  ): Promise<DictionarySearchResponse> {
    const rows = await this.repo.searchDictionary(
      q,
      limit,
      (page - 1) * limit,
      source,
    );
    return {
      query: q,
      total: rows[0]?.total ?? 0,
      page,
      limit,
      results: rows.map((r) => ({
        slug: r.slug,
        term: r.term,
        source: r.source,
        source_label: sourceLabel(r.source),
        snippet: snippetToHtml(r.snippet),
        rank: Number(r.rank),
      })),
    };
  }

  async browseDictionary(
    letter: string,
    page: number,
    limit: number,
    source?: DictionarySource,
  ): Promise<DictionaryBrowseResponse> {
    const rows = await this.repo.browseDictionary(
      letter,
      limit,
      (page - 1) * limit,
      source,
    );
    return {
      letter,
      total: rows[0]?.total ?? 0,
      page,
      limit,
      terms: rows.map(({ slug, term, sources }) => ({ slug, term, sources })),
    };
  }

  async getDictionaryEntry(slug: string): Promise<DictionaryEntryResponse> {
    const rows = await this.repo.getDictionaryEntries(slug);
    if (rows.length === 0)
      throw httpError(404, `No dictionary entry "${slug}"`);

    // Easton's first, then Webster's 1828
    const rank = (s: string) => {
      const i = DICTIONARY_SOURCE_ORDER.indexOf(s as DictionarySource);
      return i === -1 ? DICTIONARY_SOURCE_ORDER.length : i;
    };
    rows.sort((a, b) => rank(a.source) - rank(b.source));

    return {
      slug,
      term: rows[0].term,
      entries: rows.map((r) => ({
        source: r.source,
        source_label: sourceLabel(r.source),
        term: r.term,
        body_html: r.body_html,
      })),
    };
  }

  // ── Daily readings ───────────────────────────────────────────────
  async getDaily(translation: string, date?: string): Promise<DailyResponse> {
    const day = resolveVotdDate(date); // same client-local-date rules as /votd
    const key = `daily:${translation}:${day}`;
    const hit = cache.get<DailyResponse>(key);
    if (hit) return hit;

    // Independent: one failing (e.g. translation gap) must not blank the others.
    const [verse, gospel, psalm] = await Promise.allSettled([
      this.bible.getVerseOfTheDay(translation, day),
      this.pickDaily("gospel", translation, day),
      this.pickDaily("psalm", translation, day),
    ]);
    const settle = <T>(r: PromiseSettledResult<T>, label: string): T | null => {
      if (r.status === "fulfilled") return r.value;
      console.error(`daily ${label} failed:`, (r.reason as Error)?.message);
      return null;
    };

    const result: DailyResponse = {
      date: day,
      verse: settle(verse, "verse"),
      gospel: settle(gospel, "gospel"),
      psalm: settle(psalm, "psalm"),
    };

    if (!result.verse && !result.gospel && !result.psalm) {
      throw httpError(503, "Daily readings are unavailable right now");
    }
    const complete = result.verse && result.gospel && result.psalm;
    cache.set(key, result, complete ? H24 : MIN1);
    return result;
  }

  private async pickDaily(
    kind: "gospel" | "psalm",
    translation: string,
    day: string,
  ): Promise<DailyVerse> {
    const def = DAILY_POOLS[kind];

    const countKey = `dailycount:${kind}`;
    let count = cache.get<number>(countKey);
    if (count === null) {
      count = await this.repo.countDailyPool(def);
      if (count > 0) cache.set(countKey, count, H24);
    }
    if (!count) throw new Error(`No KJV verses available for the ${kind} pool`);

    const pick = await this.repo.getDailyPoolVerse(
      def,
      dailyIndex(day, count, def.salt),
    );
    if (!pick) throw new Error(`Could not pick a ${kind} verse`);

    // Ask for the reader's translation; fall back to KJV if it lacks the verse.
    const book = String(pick.book_number);
    let v;
    try {
      v = await this.bible.getVerse(
        translation,
        book,
        pick.chapter,
        pick.verse,
      );
    } catch (e) {
      if (translation === "KJV") throw e;
      v = await this.bible.getVerse("KJV", book, pick.chapter, pick.verse);
    }

    return {
      kind,
      translation: v.translation,
      book_name: v.book_name,
      book_number: v.book_number,
      chapter: v.chapter,
      verse: v.verse,
      text: v.text,
      reference: `${v.book_name} ${v.chapter}:${v.verse}`,
      date: day,
    };
  }

  // ── Private helpers ──────────────────────────────────────────────
  // Same rule as BibleService.resolveBook (which is private): all-digit input
  // is a book number, otherwise a name — "1 Corinthians" must never become book 1.
  private resolveBook(input: string): number {
    const asNumber = parseBookNumberInput(input);
    if (asNumber) return asNumber;
    const num = resolveBookNumber(input);
    if (!num) throw httpError(400, `Book "${input}" not found`);
    return num;
  }
}
