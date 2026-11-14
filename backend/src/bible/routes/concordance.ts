// bible/routes/concordance.ts
//
// Strong's, tagged KJV (red letters), reading plans, dictionary, daily readings.
// PUBLIC like the rest of /api/bible: no auth, aggressive HTTP caching.
//
// Mounted from routes/index.ts (two added lines, see the bottom of this file).

import { Router, Request, Response, NextFunction } from "express";
import { Pool } from "pg";
import { BibleService } from "../services";
import { ConcordanceService } from "../services/concordance";
import * as ctrl from "../controllers/concordance";

// Same shape as the helper in routes/index.ts (kept local to avoid a circular import).
const cacheFor =
  (seconds: number) => (_req: Request, res: Response, next: NextFunction) => {
    res.setHeader(
      "Cache-Control",
      `public, max-age=${seconds}, stale-while-revalidate=3600`,
    );
    next();
  };

// Like /votd: a request carrying ?date= is unique per day, so it can cache for
// 24h and never serve yesterday's readings. Without a date, cache only briefly.
const dailyCache = (req: Request, res: Response, next: NextFunction) =>
  cacheFor(req.query.date ? 86400 : 300)(req, res, next);

export function initConcordanceRoutes(pool: Pool, bible: BibleService): Router {
  const router = Router();
  ctrl.initConcordanceControllers(new ConcordanceService(pool, bible));

  // ── Strong's concordance ─────────────────────────────────────────
  router.get("/strongs/:id", cacheFor(86400), ctrl.getStrongs); // 24h
  router.get("/strongs/:id/verses", cacheFor(43200), ctrl.getStrongsVerses); // 12h

  // ── KJV with Strong's tags + words of Christ ─────────────────────
  router.get("/tagged/:book/:chapter", cacheFor(43200), ctrl.getTaggedChapter);

  // ── Reading plans ────────────────────────────────────────────────
  router.get("/plans", cacheFor(86400), ctrl.getPlans);
  router.get("/plans/:slug/:duration", cacheFor(86400), ctrl.getPlanOverview);
  router.get(
    "/plans/:slug/:duration/days/:day",
    cacheFor(86400),
    ctrl.getPlanDay,
  );

  // ── Dictionary (Easton's + Webster's 1828) ───────────────────────
  router.get("/dictionary/suggest", cacheFor(3600), ctrl.suggestTerms); // 1h
  router.get("/dictionary/search", cacheFor(1800), ctrl.searchDictionary); // 30min
  router.get("/dictionary/browse", cacheFor(86400), ctrl.browseDictionary);
  router.get(
    "/dictionary/entry/:slug",
    cacheFor(86400),
    ctrl.getDictionaryEntry,
  );

  // ── Daily verse + gospel + psalm ─────────────────────────────────
  router.get("/daily", dailyCache, ctrl.getDaily);

  return router;
}

/* ─────────────────────────────────────────────────────────────────
 * HOOK-UP — in backend/src/bible/routes/index.ts add:
 *
 *   import { initConcordanceRoutes } from "./concordance";
 *   ...
 *   // inside initBibleRoutes(pool), after `ctrl.initControllers(service);`
 *   router.use(initConcordanceRoutes(pool, service));
 * ───────────────────────────────────────────────────────────────── */
