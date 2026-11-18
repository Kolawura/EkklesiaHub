"use client";

// components/bible/ChapterReadMarker.tsx
//
// Sits at the very end of a chapter in the reader. A chapter is marked as read
// automatically once this end-of-chapter row has been fully on screen for a few
// seconds (tab visible), i.e. the reader scrolled to the end and stayed.
// Signed-out readers are not tracked. The same row lets anyone mark or unmark
// by hand; a chapter the reader unmarked is not auto-marked again in this
// page session.

import { useEffect, useRef, type RefObject } from "react";
import { Check } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import {
  isChapterRead,
  useReadChapters,
  useMarkChapters,
  useUnmarkChapters,
} from "@/hooks/bible/progress";

const DWELL_MS = 3000;

// "book:chapter" keys we have already auto-marked, or that the reader unmarked
const attempted = new Set<string>();

interface Props {
  bookNumber: number;
  chapter: number;
  /** The scroll container the chapter text lives in */
  rootRef: RefObject<HTMLElement | null>;
}

export function ChapterReadMarker({ bookNumber, chapter, rootRef }: Props) {
  const user = useAuthStore((s) => s.user);
  const read = useReadChapters(!!user);
  const mark = useMarkChapters();
  const unmark = useUnmarkChapters();
  const rowRef = useRef<HTMLDivElement>(null);

  const key = `${bookNumber}:${chapter}`;
  const loaded = !!read.data;
  const isRead = isChapterRead(read.data, { bookNumber, chapter });
  const markMutate = mark.mutate;

  useEffect(() => {
    if (!user || !loaded || isRead || attempted.has(key)) return;
    const el = rowRef.current;
    if (!el) return;

    let visible = false;
    let timer: ReturnType<typeof setTimeout> | null = null;
    const stop = () => {
      if (timer) clearTimeout(timer);
      timer = null;
    };
    const start = () => {
      if (timer || !visible || document.hidden) return;
      timer = setTimeout(() => {
        timer = null;
        attempted.add(key);
        markMutate({ chapters: [{ bookNumber, chapter }] });
      }, DWELL_MS);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) start();
        else stop();
      },
      { root: rootRef.current, threshold: 0.9 },
    );
    io.observe(el);
    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [user, loaded, isRead, key, bookNumber, chapter, rootRef, markMutate]);

  if (!user || !loaded) return null;

  const busy = mark.isPending || unmark.isPending;
  return (
    <div
      ref={rowRef}
      className="max-w-2xl mt-4 flex items-center gap-3 font-body text-xs"
    >
      {isRead ? (
        <>
          <span className="inline-flex items-center gap-1 text-gold">
            <Check size={13} /> Read
          </span>
          <button
            type="button"
            disabled={busy}
            onClick={() => {
              attempted.add(key);
              unmark.mutate({ chapters: [{ bookNumber, chapter }] });
            }}
            className="text-ink-ghost underline underline-offset-2 hover:text-ink disabled:opacity-50"
          >
            Mark unread
          </button>
        </>
      ) : (
        <button
          type="button"
          disabled={busy}
          onClick={() => {
            attempted.add(key);
            mark.mutate({ chapters: [{ bookNumber, chapter }] });
          }}
          className="text-ink-faint underline underline-offset-2 hover:text-ink disabled:opacity-50"
        >
          Mark as read
        </button>
      )}
    </div>
  );
}
