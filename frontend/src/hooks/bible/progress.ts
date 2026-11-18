"use client";

// hooks/bible/progress.ts
// Chapters the signed-in user has read (/api/reading-progress). This is the
// single source of truth for progress: reading-plan days are derived from it
// on the server, so marking/unmarking chapters also moves plan progress.

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getRequest, postRequest } from "@/lib/service";

/** { "<bookNumber>": [chapters read…] } */
export type ReadMap = Record<string, number[]>;
export interface ChapterRef {
  bookNumber: number;
  chapter: number;
}

const READ_KEY = ["read-chapters"];

export function isChapterRead(map: ReadMap | undefined, c: ChapterRef): boolean {
  return !!map?.[String(c.bookNumber)]?.includes(c.chapter);
}

export function useReadChapters(enabled: boolean) {
  return useQuery<ReadMap>({
    queryKey: READ_KEY,
    queryFn: async () => (await getRequest("/reading-progress/chapters")).data,
    enabled,
    staleTime: 1000 * 60 * 5,
  });
}

function useChaptersMutation(path: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (v: { chapters: ChapterRef[] }) =>
      postRequest(path, { chapters: v.chapters }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: READ_KEY });
      // plan days are derived from chapter reads
      qc.invalidateQueries({ queryKey: ["plan-enrollments"] });
    },
  });
}

export const useMarkChapters = () =>
  useChaptersMutation("/reading-progress/chapters");
export const useUnmarkChapters = () =>
  useChaptersMutation("/reading-progress/chapters/unmark");
