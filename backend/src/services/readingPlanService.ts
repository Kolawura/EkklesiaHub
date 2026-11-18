// ═══════════════════════════════════════════════════════════════
// readingPlanService.ts
// Per-user reading-plan enrolment (main DB). Progress is DERIVED from the
// chapters the user has read (readingProgressService): a plan day is complete
// when every chapter scheduled for that day has been read — whenever it was
// read, even before the user joined the plan. The schedule itself comes from
// the Bible DB (readingPlanSchedule). The current day is computed from
// startDate, never stored.
// ═══════════════════════════════════════════════════════════════
import { prisma } from "../db/prisma";
import {
  getPlanSchedule,
  type PlanSchedule,
} from "./readingPlanSchedule";

const DAY_MS = 24 * 60 * 60 * 1000;

function fail(status: number, message: string): never {
  throw Object.assign(new Error(message), { status });
}

function utcDayStart(isoDate: string): number {
  return new Date(`${isoDate}T00:00:00Z`).getTime();
}

function todayUtc(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Whole days between two calendar dates (b - a). */
export function daysBetween(a: Date | string, b: Date | string): number {
  const toMs = (v: Date | string) =>
    typeof v === "string" ? utcDayStart(v) : v.getTime();
  return Math.round((toMs(b) - toMs(a)) / DAY_MS);
}

/** Days whose every scheduled chapter is in the read set. */
export function completedDaysFrom(
  schedule: PlanSchedule,
  readSet: Set<string>,
): number[] {
  const done: number[] = [];
  for (const [day, chapters] of schedule) {
    if (
      chapters.length > 0 &&
      chapters.every((c) => readSet.has(`${c.bookNumber}:${c.chapter}`))
    ) {
      done.push(day);
    }
  }
  return done.sort((a, b) => a - b);
}

export function computeProgress(
  startDate: Date,
  durationDays: number,
  completedCount: number,
  today: string,
) {
  const elapsed = daysBetween(startDate, today); // 0 on the start day
  const started = elapsed >= 0;
  const currentDay = Math.min(Math.max(elapsed + 1, 1), durationDays);
  return {
    started,
    currentDay,
    completedCount,
    finished: completedCount >= durationDays,
    // days that should be done by now but are not (never negative)
    behindBy: started
      ? Math.max(0, Math.min(elapsed + 1, durationDays) - completedCount)
      : 0,
  };
}

export async function listEnrollments(userId: string, today?: string) {
  const day = today ?? todayUtc();
  const [rows, reads] = await Promise.all([
    prisma.userPlanEnrollment.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" },
    }),
    prisma.userChapterRead.findMany({
      where: { userId },
      select: { bookNumber: true, chapter: true },
    }),
  ]);
  const readSet = new Set<string>(
    reads.map((r: { bookNumber: number; chapter: number }) => `${r.bookNumber}:${r.chapter}`),
  );

  return Promise.all(
    rows.map(async (r) => {
      const schedule = await getPlanSchedule(r.planSlug, r.durationDays);
      const completedDays = completedDaysFrom(schedule, readSet);
      return {
        id: r.id,
        planSlug: r.planSlug,
        durationDays: r.durationDays,
        startDate: r.startDate.toISOString().slice(0, 10),
        completedDays,
        ...computeProgress(r.startDate, r.durationDays, completedDays.length, day),
      };
    }),
  );
}

export async function startPlan(
  userId: string,
  input: { planSlug: string; durationDays: number; startDate?: string },
) {
  const startDate = new Date(`${input.startDate ?? todayUtc()}T00:00:00Z`);
  try {
    return await prisma.userPlanEnrollment.create({
      data: {
        userId,
        planSlug: input.planSlug,
        durationDays: input.durationDays,
        startDate,
      },
      select: { id: true },
    });
  } catch (err: any) {
    if (err?.code === "P2002") fail(409, "You are already on this plan.");
    throw err;
  }
}

export async function leavePlan(userId: string, enrollmentId: string) {
  // Leaving removes the enrolment only; chapters already read stay read.
  const { count } = await prisma.userPlanEnrollment.deleteMany({
    where: { id: enrollmentId, userId },
  });
  if (count === 0) fail(404, "Plan not found.");
}
