import { z } from "zod";

// Must match the plans seeded in the Bible DB (reading_plans.slug and the
// three schedule lengths). The Bible DB is a separate database, so these are
// checked here as constants rather than by a cross-DB lookup.
export const PLAN_SLUGS = ["canonical", "chronological", "historical"] as const;
export const PLAN_DURATIONS = [90, 180, 365] as const;

const dateString = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD")
  .refine((s) => {
    const d = new Date(`${s}T00:00:00Z`);
    return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s;
  }, "Invalid date");

export const startPlanSchema = z.object({
  planSlug: z.enum(PLAN_SLUGS),
  durationDays: z.union([z.literal(90), z.literal(180), z.literal(365)]),
  // The user's LOCAL calendar day when they started (defaults to server UTC day)
  startDate: dateString.optional(),
});

export const todayQuerySchema = z.object({
  today: dateString.optional(),
});
