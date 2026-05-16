import { Request, Response } from "express";
import * as scriptureService from "../services/scriptureService";

// Per-user rate limiter: max 60 scripture requests per minute
// Stored in memory — swap for Redis in production
const userRequestCounts = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 60;
const RATE_WINDOW_MS = 60_000;

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const entry = userRequestCounts.get(userId);

  if (!entry || now > entry.resetAt) {
    userRequestCounts.set(userId, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

/**
 * GET /api/scripture/lookup
 * Query params: ref (required), version (optional, defaults to KJV)
 *
 * Example: GET /api/scripture/lookup?ref=John+3:16&version=de4e12af7f28f599-02
 */
export const lookupPassage = async (req: Request, res: Response) => {
  const { ref, version } = req.query as { ref?: string; version?: string };
  const userId = (req as any).userId ?? req.ip ?? "anon";

  if (!ref?.trim()) {
    return res
      .status(400)
      .json({ success: false, message: "Missing required query param: ref" });
  }

  if (!checkRateLimit(userId)) {
    return res.status(429).json({
      success: false,
      message: "Too many scripture requests. Please slow down.",
    });
  }

  if (!process.env.BIBLE_API_KEY) {
    return res.status(503).json({
      success: false,
      message:
        "Bible API is not configured on this server. Add BIBLE_API_KEY to backend .env",
    });
  }

  try {
    const result = await scriptureService.lookupPassage(ref.trim(), version);
    return res.json({ success: true, data: result });
  } catch (err: any) {
    const status = err.status ?? 500;
    return res.status(status).json({ success: false, message: err.message });
  }
};

/**
 * GET /api/scripture/search
 * Query params: q (required), version (optional), limit (optional, max 20)
 *
 * Example: GET /api/scripture/search?q=love+your+neighbour&version=de4e12af7f28f599-02
 */
export const searchScripture = async (req: Request, res: Response) => {
  const { q, version, limit } = req.query as {
    q?: string;
    version?: string;
    limit?: string;
  };
  const userId = (req as any).userId ?? req.ip ?? "anon";

  if (!q?.trim()) {
    return res
      .status(400)
      .json({ success: false, message: "Missing required query param: q" });
  }

  if (!checkRateLimit(userId)) {
    return res.status(429).json({
      success: false,
      message: "Too many scripture requests. Please slow down.",
    });
  }

  if (!process.env.BIBLE_API_KEY) {
    return res.status(503).json({
      success: false,
      message: "Bible API is not configured on this server.",
    });
  }

  const parsedLimit = Math.min(parseInt(limit ?? "12", 10) || 12, 20);

  try {
    const results = await scriptureService.searchScripture(
      q.trim(),
      version,
      parsedLimit,
    );
    return res.json({ success: true, data: results });
  } catch (err: any) {
    const status = err.status ?? 500;
    return res.status(status).json({ success: false, message: err.message });
  }
};

/**
 * GET /api/scripture/versions
 * Returns the list of supported Bible versions — no API key call needed.
 */
export const getVersions = (_req: Request, res: Response) => {
  return res.json({ success: true, data: scriptureService.getVersions() });
};
