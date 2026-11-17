"use client";

// hooks/bible/daily.ts
//
// Today page data: GET /api/bible/daily (verse of the day + gospel + psalm).
// "Today" is the user's LOCAL calendar day, sent as ?date= so the server's
// 24h cache can never serve yesterday's readings. Same midnight rollover
// approach as useVerseOfTheDay in hooks/bible/index.ts.

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getRequest } from "@/lib/service";

export interface DailyVerseOfTheDay {
  translation: string;
  book_name: string;
  chapter: number;
  verse: number;
  text: string;
  reference: string;
  reflection: string | null;
  date: string;
}

export interface DailyReading {
  kind: "gospel" | "psalm";
  translation: string;
  book_name: string;
  book_number: number;
  chapter: number;
  verse: number;
  text: string;
  reference: string;
  date: string;
}

export interface DailyResponse {
  date: string;
  verse: DailyVerseOfTheDay | null;
  gospel: DailyReading | null;
  psalm: DailyReading | null;
}

export function localDateKey(d = new Date()): string {
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
}

function msUntilLocalMidnight(): number {
  const now = new Date();
  const next = new Date(now);
  next.setHours(24, 0, 0, 0);
  return next.getTime() - now.getTime();
}

export function useDaily(translation = "KJV") {
  const [today, setToday] = useState(() => localDateKey());

  useEffect(() => {
    const sync = () => {
      const now = localDateKey();
      setToday((prev) => (prev === now ? prev : now));
    };
    const timer = setTimeout(sync, msUntilLocalMidnight() + 1000);
    const onVisible = () => !document.hidden && sync();
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", sync);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", sync);
    };
  }, [today]);

  return useQuery<DailyResponse>({
    queryKey: ["bible-daily", translation, today],
    queryFn: async () => {
      const res = await getRequest(
        `/bible/daily?translation=${encodeURIComponent(translation)}&date=${today}`,
      );
      return res.data;
    },
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 24,
    retry: 1,
  });
}
