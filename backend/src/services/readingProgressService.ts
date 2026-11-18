// ═══════════════════════════════════════════════════════════════
// readingProgressService.ts
// Which chapters a user has read (main DB). This is the single source of
// truth for reading progress: reading-plan days are DERIVED from it
// (see readingPlanService), never ticked separately.
// ═══════════════════════════════════════════════════════════════
import { prisma } from "../db/prisma";
import type { ChapterRef } from "../schema/readingProgressSchema";

function unique(chapters: ChapterRef[]): ChapterRef[] {
  const seen = new Set<string>();
  return chapters.filter((c) => {
    const k = `${c.bookNumber}:${c.chapter}`;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

/** Mark chapters read. Idempotent: re-reading only refreshes lastReadAt. */
export async function markRead(userId: string, chapters: ChapterRef[]) {
  const now = new Date();
  await prisma.$transaction(
    unique(chapters).map((c) =>
      prisma.userChapterRead.upsert({
        where: {
          userId_bookNumber_chapter: {
            userId,
            bookNumber: c.bookNumber,
            chapter: c.chapter,
          },
        },
        create: { userId, bookNumber: c.bookNumber, chapter: c.chapter },
        update: { lastReadAt: now },
      }),
    ),
  );
}

export async function unmarkRead(userId: string, chapters: ChapterRef[]) {
  await prisma.userChapterRead.deleteMany({
    where: {
      userId,
      OR: unique(chapters).map((c) => ({
        bookNumber: c.bookNumber,
        chapter: c.chapter,
      })),
    },
  });
}

/** Every chapter the user has read, as { "<bookNumber>": [chapters…] }. */
export async function listRead(userId: string) {
  const rows = await prisma.userChapterRead.findMany({
    where: { userId },
    select: { bookNumber: true, chapter: true },
    orderBy: [{ bookNumber: "asc" }, { chapter: "asc" }],
  });
  const out: Record<string, number[]> = {};
  for (const r of rows) (out[String(r.bookNumber)] ??= []).push(r.chapter);
  return out;
}
