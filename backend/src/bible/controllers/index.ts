// bible/controllers/index.ts

import { Request, Response } from "express";
import { BibleService } from "../services";
import {
  getBooksSchema,
  getChapterSchema,
  getVerseSchema,
  searchSchema,
  compareSchema,
  votdSchema,
  referenceSchema,
} from "../validators";
import { FEATURED_TRANSLATIONS } from "../utils/featuredTranslation";

// Service is injected — controllers stay testable
let service: BibleService;
export const initControllers = (bibleService: BibleService) => {
  service = bibleService;
};

// ── Helper: send a structured error response ───────────────────────
const err = (res: Response, status: number, message: string) =>
  res.status(status).json({ success: false, message });

// ── GET /bible/books ───────────────────────────────────────────────
export const getBooks = async (req: Request, res: Response) => {
  try {
    const { testament } = getBooksSchema.parse(req.query);
    const books = await service.getBooks(testament);
    return res.json({ success: true, data: books });
  } catch (e: any) {
    return err(res, e.status ?? 500, e.message);
  }
};

// ── GET /bible/translations ────────────────────────────────────────
export const getTranslations = async (_req: Request, res: Response) => {
  try {
    const translations = await service.getTranslations();
    return res.json({
      success: true,
      data: translations,
      featured: FEATURED_TRANSLATIONS,
    });
  } catch (e: any) {
    return err(res, 500, e.message);
  }
};

// ── GET /bible/chapter/:translation/:book/:chapter ─────────────────
export const getChapter = async (req: Request, res: Response) => {
  try {
    const { translation, book, chapter } = getChapterSchema.parse(req.params);
    const data = await service.getChapter(translation, book, chapter);
    return res.json({ success: true, data });
  } catch (e: any) {
    return err(res, e.status ?? 500, e.message);
  }
};

// ── GET /bible/verse/:translation/:book/:chapter/:verse ────────────
export const getVerse = async (req: Request, res: Response) => {
  try {
    const { translation, book, chapter, verse } = getVerseSchema.parse(
      req.params,
    );
    const data = await service.getVerse(translation, book, chapter, verse);
    return res.json({ success: true, data });
  } catch (e: any) {
    return err(res, e.status ?? 500, e.message);
  }
};

// ── GET /bible/reference?ref=John+3:16&translation=KJV ────────────
export const getByReference = async (req: Request, res: Response) => {
  try {
    const { ref, translation } = referenceSchema.parse(req.query);
    const data = await service.getByReference(ref, translation);
    return res.json({ success: true, data });
  } catch (e: any) {
    return err(res, e.status ?? 500, e.message);
  }
};

// ── GET /bible/search?q=...&translation=KJV ───────────────────────
export const search = async (req: Request, res: Response) => {
  try {
    const { q, translation, testament, book, page, limit } = searchSchema.parse(
      req.query,
    );
    const data = await service.search(q, translation, {
      testament,
      book,
      page,
      limit,
    });
    return res.json({ success: true, ...data });
  } catch (e: any) {
    return err(res, e.status ?? 500, e.message);
  }
};

// ── GET /bible/compare/:book/:chapter/:verse ──────────────────────
export const compareVerse = async (req: Request, res: Response) => {
  try {
    const {
      book,
      chapter,
      verse,
      translations: tStr,
    } = compareSchema.parse({
      ...req.params,
      ...req.query,
    });
    const translationList = tStr
      ? tStr.split(",").map((t) => t.trim().toUpperCase())
      : undefined;

    const data = await service.compare(book, chapter, verse, translationList);
    return res.json({ success: true, data });
  } catch (e: any) {
    return err(res, e.status ?? 500, e.message);
  }
};

// ── GET /bible/votd?translation=KJV ──────────────────────────────
export const getVerseOfTheDay = async (req: Request, res: Response) => {
  try {
    const { translation } = votdSchema.parse(req.query);
    const data = await service.getVerseOfTheDay(translation);
    return res.json({ success: true, data });
  } catch (e: any) {
    return err(res, 500, e.message);
  }
};

// ── GET /bible/cache-stats (debug only) ───────────────────────────
export const getCacheStats = (_req: Request, res: Response) => {
  return res.json({ success: true, data: service.getCacheStats() });
};
