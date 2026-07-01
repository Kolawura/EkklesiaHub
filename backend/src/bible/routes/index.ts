// bible/routes/index.ts
//
// Bible routes are PUBLIC (no auth required) so posts can embed
// scripture references that anyone can preview. Auth is optional
// so logged-in users can eventually access personal features
// (highlights, notes, bookmarks) via the same endpoints.
//
// Add to your index.ts:
//   import { initBibleRoutes } from "./bible/routes";
//   const biblePool = new Pool({ connectionString: process.env.BIBLE_DATABASE_URL });
//   app.use("/api/bible", initBibleRoutes(biblePool));

import { Router, Request, Response, NextFunction } from "express";
import { Pool } from "pg";
import { BibleService } from "../services";
import * as ctrl from "../controllers";
// import { optionalAuth } from "../../middlewares/authMiddleware";

// Cache headers helper — tells browsers and CDNs to cache static Bible content.
// Chapters and books don't change, so we can cache aggressively.
const staticCache =
  (seconds: number) => (_req: Request, res: Response, next: NextFunction) => {
    res.setHeader(
      "Cache-Control",
      `public, max-age=${seconds}, stale-while-revalidate=3600`,
    );
    next();
  };

export function initBibleRoutes(pool: Pool): Router {
  const router = Router();
  const service = new BibleService(pool);
  ctrl.initControllers(service);

  // ── Static content (cached heavily) ─────────────────────────────
  router.get("/books", staticCache(86400), ctrl.getBooks); // 24h
  router.get("/translations", staticCache(86400), ctrl.getTranslations); // 24h

  // ── Chapter & verse reads (cached, public) ─────────────────────
  router.get(
    "/chapter/:translation/:book/:chapter",
    staticCache(43200), // 12h
    ctrl.getChapter,
  );
  router.get(
    "/verse/:translation/:book/:chapter/:verse",
    staticCache(43200),
    ctrl.getVerse,
  );

  // ── Reference lookup (e.g. "John 3:16") ───────────────────────
  router.get("/reference", staticCache(43200), ctrl.getByReference);

  // ── Search (shorter cache — results should feel fresh) ─────────
  router.get("/search", staticCache(1800), ctrl.search); // 30min

  // ── Compare (cached) ───────────────────────────────────────────
  router.get(
    "/compare/:book/:chapter/:verse",
    staticCache(43200),
    ctrl.compareVerse,
  );

  // ── Verse of the Day (cached until midnight) ───────────────────
  router.get("/votd", staticCache(86400), ctrl.getVerseOfTheDay);

  // ── Debug / admin ──────────────────────────────────────────────
  if (process.env.NODE_ENV === "development") {
    router.get("/cache-stats", ctrl.getCacheStats);
  }

  return router;
}
