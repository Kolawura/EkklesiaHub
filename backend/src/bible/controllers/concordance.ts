// bible/controllers/concordance.ts
//
// Thin HTTP adapters: validate input, call the service, shape the response.
// Same conventions as controllers/index.ts ({ success, data } and a module-level
// injected service), with two small improvements:
//   • invalid input is a 400 (a ZodError has no .status, so it used to become a 500)
//   • unexpected 5xx errors return a generic message instead of leaking e.message

import { Request, Response } from "express";
import { ZodError } from "zod";
import { ConcordanceService } from "../services/concordance";
import {
  strongsIdSchema,
  strongsVersesQuerySchema,
  taggedChapterSchema,
  planOverviewSchema,
  planDaySchema,
  dictionarySuggestSchema,
  dictionarySearchSchema,
  dictionaryBrowseSchema,
  dictionaryEntrySchema,
  dailySchema,
} from "../validators/concordance";

let service: ConcordanceService;
export const initConcordanceControllers = (s: ConcordanceService) => {
  service = s;
};

// ── Helper: one place that turns any thrown error into a response ───
const fail = (res: Response, e: unknown) => {
  if (e instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: e.issues.map((i) => i.message).join("; ") || "Invalid request",
    });
  }
  const status = (e as { status?: number }).status ?? 500;
  if (status >= 500) {
    console.error("Bible concordance error:", e);
    return res
      .status(status)
      .json({ success: false, message: "Internal server error" });
  }
  return res
    .status(status)
    .json({ success: false, message: (e as Error).message });
};

// ── Strong's ───────────────────────────────────────────────────────
// GET /bible/strongs/:id
export const getStrongs = async (req: Request, res: Response) => {
  try {
    const { id } = strongsIdSchema.parse(req.params);
    return res.json({ success: true, data: await service.getStrongs(id) });
  } catch (e) {
    return fail(res, e);
  }
};

// GET /bible/strongs/:id/verses?page=1&limit=25
export const getStrongsVerses = async (req: Request, res: Response) => {
  try {
    const { id } = strongsIdSchema.parse(req.params);
    const { page, limit } = strongsVersesQuerySchema.parse(req.query);
    return res.json({
      success: true,
      data: await service.getStrongsVerses(id, page, limit),
    });
  } catch (e) {
    return fail(res, e);
  }
};

// ── Tagged KJV chapter ─────────────────────────────────────────────
// GET /bible/tagged/:book/:chapter
export const getTaggedChapter = async (req: Request, res: Response) => {
  try {
    const { book, chapter } = taggedChapterSchema.parse(req.params);
    return res.json({
      success: true,
      data: await service.getTaggedChapter(book, chapter),
    });
  } catch (e) {
    return fail(res, e);
  }
};

// ── Reading plans ──────────────────────────────────────────────────
// GET /bible/plans
export const getPlans = async (_req: Request, res: Response) => {
  try {
    return res.json({ success: true, data: await service.getPlans() });
  } catch (e) {
    return fail(res, e);
  }
};

// GET /bible/plans/:slug/:duration
export const getPlanOverview = async (req: Request, res: Response) => {
  try {
    const { slug, duration } = planOverviewSchema.parse(req.params);
    return res.json({
      success: true,
      data: await service.getPlanOverview(slug, duration),
    });
  } catch (e) {
    return fail(res, e);
  }
};

// GET /bible/plans/:slug/:duration/days/:day
export const getPlanDay = async (req: Request, res: Response) => {
  try {
    const { slug, duration, day } = planDaySchema.parse(req.params);
    return res.json({
      success: true,
      data: await service.getPlanDay(slug, duration, day),
    });
  } catch (e) {
    return fail(res, e);
  }
};

// ── Dictionary ─────────────────────────────────────────────────────
// GET /bible/dictionary/suggest?q=aar&limit=8
export const suggestTerms = async (req: Request, res: Response) => {
  try {
    const { q, limit, source } = dictionarySuggestSchema.parse(req.query);
    return res.json({
      success: true,
      data: await service.suggestTerms(q, limit, source),
    });
  } catch (e) {
    return fail(res, e);
  }
};

// GET /bible/dictionary/search?q=faith&page=1&limit=20
export const searchDictionary = async (req: Request, res: Response) => {
  try {
    const { q, page, limit, source } = dictionarySearchSchema.parse(req.query);
    return res.json({
      success: true,
      data: await service.searchDictionary(q, page, limit, source),
    });
  } catch (e) {
    return fail(res, e);
  }
};

// GET /bible/dictionary/browse?letter=A&page=1&limit=100
export const browseDictionary = async (req: Request, res: Response) => {
  try {
    const { letter, page, limit, source } = dictionaryBrowseSchema.parse(
      req.query,
    );
    return res.json({
      success: true,
      data: await service.browseDictionary(letter, page, limit, source),
    });
  } catch (e) {
    return fail(res, e);
  }
};

// GET /bible/dictionary/entry/:slug
export const getDictionaryEntry = async (req: Request, res: Response) => {
  try {
    const { slug } = dictionaryEntrySchema.parse(req.params);
    return res.json({
      success: true,
      data: await service.getDictionaryEntry(slug),
    });
  } catch (e) {
    return fail(res, e);
  }
};

// ── Daily ──────────────────────────────────────────────────────────
// GET /bible/daily?translation=KJV&date=YYYY-MM-DD
export const getDaily = async (req: Request, res: Response) => {
  try {
    const { translation, date } = dailySchema.parse(req.query);
    return res.json({
      success: true,
      data: await service.getDaily(translation, date),
    });
  } catch (e) {
    return fail(res, e);
  }
};
