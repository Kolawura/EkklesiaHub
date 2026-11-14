// bible/validators/concordance.ts

import { z } from "zod";
import { normalizeStrongsId } from "../utils/concordance";

const page = z.coerce.number().int().positive().max(1000).default(1);
const translation = z.string().min(2).max(10).toUpperCase().default("KJV");
const source = z.enum(["eastons", "webster1828"]);

// ── Strong's ──────────────────────────────────────────────────────
// Accepts h430 / H430 / H0430 and normalises to "H430".
export const strongsIdSchema = z.object({
  id: z
    .string()
    .max(10)
    .transform((s, ctx) => {
      const id = normalizeStrongsId(s);
      if (!id) {
        ctx.addIssue({
          code: "custom",
          message: 'Invalid Strong\'s number. Try "H430" or "G26"',
        });
        return z.NEVER;
      }
      return id;
    }),
});

export const strongsVersesQuerySchema = z.object({
  page,
  limit: z.coerce.number().int().positive().max(100).default(25),
});

// ── Tagged KJV chapter ────────────────────────────────────────────
export const taggedChapterSchema = z.object({
  book: z.string().min(1).max(30), // name or number
  chapter: z.coerce.number().int().positive().max(150),
});

// ── Reading plans ─────────────────────────────────────────────────
const planSlug = z
  .string()
  .min(2)
  .max(40)
  .regex(/^[a-z0-9-]+$/);
const planDuration = z.coerce
  .number()
  .int()
  .refine((n) => [90, 180, 365].includes(n), {
    message: "duration must be 90, 180 or 365",
  });

export const planOverviewSchema = z.object({
  slug: planSlug,
  duration: planDuration,
});

export const planDaySchema = z.object({
  slug: planSlug,
  duration: planDuration,
  day: z.coerce.number().int().min(1).max(365),
});

// ── Dictionary ────────────────────────────────────────────────────
export const dictionarySuggestSchema = z.object({
  q: z.string().trim().min(1).max(60),
  limit: z.coerce.number().int().positive().max(20).default(8),
  source: source.optional(),
});

export const dictionarySearchSchema = z.object({
  q: z.string().trim().min(2).max(100),
  page,
  limit: z.coerce.number().int().positive().max(50).default(20),
  source: source.optional(),
});

export const dictionaryBrowseSchema = z.object({
  letter: z
    .string()
    .length(1)
    .transform((s) => s.toUpperCase())
    .refine((s) => /^[A-Z#]$/.test(s), { message: "letter must be A-Z or #" }),
  page,
  limit: z.coerce.number().int().positive().max(200).default(100),
  source: source.optional(),
});

export const dictionaryEntrySchema = z.object({
  slug: z
    .string()
    .min(1)
    .max(120)
    .regex(/^[a-z0-9-]+$/),
});

// ── Daily ─────────────────────────────────────────────────────────
export const dailySchema = z.object({
  translation,
  // Client's LOCAL calendar date (YYYY-MM-DD); validated by resolveVotdDate().
  date: z.string().max(10).optional(),
});
