// ═══════════════════════════════════════════════════════════════
// readingPlanService.ts
// Per-user progress through the Bible reading plans (main DB).
// The schedule itself (which chapters on which day) lives in the Bible DB
// and is served by /api/bible/plans — this only tracks who is on which plan
// and which days they have finished. The current day is COMPUTED from
// startDate, never stored.
// ═══════════════════════════════════════════════════════════════
import { prisma } from "../db/prisma";

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
  const rows = await prisma.userPlanEnrollment.findMany({
    where: { userId },
    orderBy: { createdAt: "asc" },
    include: {
      completions: { select: { day: true }, orderBy: { day: "asc" } },
    },
  });
  return rows.map((r) => ({
    id: r.id,
    planSlug: r.planSlug,
    durationDays: r.durationDays,
    startDate: r.startDate.toISOString().slice(0, 10),
    completedDays: r.completions.map((c) => c.day),
    ...computeProgress(r.startDate, r.durationDays, r.completions.length, day),
  }));
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

async function ownedEnrollment(userId: string, id: string) {
  const e = await prisma.userPlanEnrollment.findFirst({
    where: { id, userId },
    select: { id: true, durationDays: true },
  });
  if (!e) fail(404, "Plan not found.");
  return e;
}

export async function setDayCompleted(
  userId: string,
  enrollmentId: string,
  day: number,
  done: boolean,
) {
  const e = await ownedEnrollment(userId, enrollmentId);
  if (!Number.isInteger(day) || day < 1 || day > e.durationDays) {
    fail(400, `Day must be between 1 and ${e.durationDays}.`);
  }
  if (done) {
    await prisma.userPlanDayCompletion.upsert({
      where: { enrollmentId_day: { enrollmentId, day } },
      create: { enrollmentId, day },
      update: {},
    });
  } else {
    await prisma.userPlanDayCompletion.deleteMany({
      where: { enrollmentId, day },
    });
  }
}

export async function leavePlan(userId: string, enrollmentId: string) {
  const { count } = await prisma.userPlanEnrollment.deleteMany({
    where: { id: enrollmentId, userId },
  });
  if (count === 0) fail(404, "Plan not found.");
}
