// ═══════════════════════════════════════════════════════════════
// readingPlanSchedule.ts
// Read-only access to the reading-plan SCHEDULE, which lives in the separate
// Bible DB. The main app needs it to work out which plan days a user has
// finished (a day is done when all of its chapters are read). The schedule is
// static seed data, so each plan/length is loaded once and kept in memory.
// ═══════════════════════════════════════════════════════════════
import type { Pool } from "pg";

export interface ScheduleChapter {
  bookNumber: number;
  chapter: number;
}
export type PlanSchedule = Map<number, ScheduleChapter[]>; // day -> chapters

let biblePool: Pool | null = null;
const cache = new Map<string, PlanSchedule>();

export function initReadingPlanSchedule(pool: Pool) {
  biblePool = pool;
  cache.clear();
}

export async function getPlanSchedule(
  planSlug: string,
  durationDays: number,
): Promise<PlanSchedule> {
  if (!biblePool) throw new Error("Reading-plan schedule is not initialised");
  const key = `${planSlug}:${durationDays}`;
  const hit = cache.get(key);
  if (hit) return hit;

  const { rows } = await biblePool.query<{
    day: number;
    book_number: number;
    chapter: number;
  }>(
    `SELECT d.day, d.book_number, d.chapter
       FROM reading_plan_days d
       JOIN reading_plans p ON p.id = d.plan_id
      WHERE p.slug = $1 AND d.duration_days = $2
      ORDER BY d.day, d.seq`,
    [planSlug, durationDays],
  );

  const schedule: PlanSchedule = new Map();
  for (const r of rows) {
    const list = schedule.get(r.day) ?? [];
    list.push({ bookNumber: r.book_number, chapter: r.chapter });
    schedule.set(r.day, list);
  }
  // Only cache a real schedule, so a not-yet-seeded plan is retried later.
  if (schedule.size > 0) cache.set(key, schedule);
  return schedule;
}
