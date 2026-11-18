import { z } from "zod";

const chapterRef = z.object({
  bookNumber: z.number().int().min(1).max(66), // canonical 1-66
  chapter: z.number().int().min(1).max(150),
});

export const chaptersBodySchema = z.object({
  chapters: z.array(chapterRef).min(1).max(60),
});

export type ChapterRef = z.infer<typeof chapterRef>;
