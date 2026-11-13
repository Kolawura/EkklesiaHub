// bible/validators/index.ts

import { z } from "zod";

// ── GET /bible/books ──────────────────────────────────────────────
export const getBooksSchema = z.object({
  testament: z.enum(["OT", "NT"]).optional(),
});

// ── GET /bible/chapter/:translation/:book/:chapter ────────────────
export const getChapterSchema = z.object({
  translation: z.string().min(2).max(10).toUpperCase(),
  book: z.string().min(1), // name or number
  chapter: z.coerce.number().int().positive().max(150),
});

// ── GET /bible/verse/:translation/:book/:chapter/:verse ───────────
export const getVerseSchema = z.object({
  translation: z.string().min(2).max(10).toUpperCase(),
  book: z.string().min(1),
  chapter: z.coerce.number().int().positive().max(150),
  verse: z.coerce.number().int().positive().max(176),
});

// ── GET /bible/search ─────────────────────────────────────────────
export const searchSchema = z.object({
  q: z.string().min(2).max(200),
  translation: z.string().min(2).max(10).toUpperCase().default("KJV"),
  testament: z.enum(["OT", "NT"]).optional(),
  book: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(20),
});

// ── GET /bible/compare/:book/:chapter/:verse ──────────────────────
export const compareSchema = z.object({
  book: z.string().min(1),
  chapter: z.coerce.number().int().positive().max(150),
  verse: z.coerce.number().int().positive().max(176),
  translations: z.string().optional(), // comma-separated e.g. "KJV,NIV,ESV"
});

// ── GET /bible/votd ───────────────────────────────────────────────
export const votdSchema = z.object({
  translation: z.string().min(2).max(10).toUpperCase().default("KJV"),
  // The client's LOCAL calendar date (YYYY-MM-DD) so the verse changes at the
  // user's own midnight. Validated/clamped in utils.resolveVotdDate().
  date: z.string().max(10).optional(),
});

// ── GET /bible/reference ──────────────────────────────────────────
export const referenceSchema = z.object({
  ref: z.string().min(3).max(100), // e.g. "John 3:16"
  translation: z.string().min(2).max(10).toUpperCase().default("KJV"),
});
