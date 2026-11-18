"use client";

// components/bible/ChapterReadMarker.tsx
//
// A small circle with a tick, pinned to the bottom-right of the chapter text.
// It fades in over the last stretch of the chapter as the reader scrolls
// down (always fully shown once the end is reached, and for short chapters
// that fit on screen). A chapter is marked as read automatically once the
// end has been reached for a few seconds (tab visible); tapping the circle
// marks or unmarks by hand. A chapter the reader unmarked is not auto-marked
// again in this page session. Signed-out readers are not tracked.
//
// It floats: rendered next to (not inside) the scroll container `rootRef`, in
// a `relative` wrapper, so it takes up no space in the text flow.

import { useEffect, useState, type RefObject } from "react";
import { Check } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import {
  isChapterRead,
  useReadChapters,
  useMarkChapters,
  useUnmarkChapters,
} from "@/hooks/bible/progress";

const DWELL_MS = 3000;
const END_SLACK_PX = 32; // this close to the bottom counts as "at the end"
const FADE_ZONE_PX = 360; // the circle fades in over this much scrolling

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
  // 0 = far from the end, 1 = at the end (steps of 0.05)
  const [progress, setProgress] = useState(0);

  const key = `${bookNumber}:${chapter}`;
  const loaded = !!read.data;
  const isRead = isChapterRead(read.data, { bookNumber, chapter });
  const markMutate = mark.mutate;
  const atEnd = progress >= 1;

  // How close the reader is to the end of the chapter
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    let raf = 0;
    const measure = () => {
      raf = 0;
      const remaining = root.scrollHeight - root.scrollTop - root.clientHeight;
      const t = (remaining - END_SLACK_PX) / FADE_ZONE_PX;
      setProgress(Math.round((1 - Math.min(Math.max(t, 0), 1)) * 20) / 20);
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    measure();
    root.addEventListener("scroll", schedule, { passive: true });
    const ro = new ResizeObserver(schedule);
    ro.observe(root);
    if (root.firstElementChild) ro.observe(root.firstElementChild);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      root.removeEventListener("scroll", schedule);
      ro.disconnect();
    };
  }, [rootRef]);

  // Auto-mark: at the end, tab visible, for DWELL_MS
  useEffect(() => {
    if (!user || !loaded || isRead || !atEnd || attempted.has(key)) return;

    let timer: ReturnType<typeof setTimeout> | null = null;
    const stop = () => {
      if (timer) clearTimeout(timer);
      timer = null;
    };
    const start = () => {
      if (timer || document.hidden) return;
      timer = setTimeout(() => {
        timer = null;
        attempted.add(key);
        markMutate({ chapters: [{ bookNumber, chapter }] });
      }, DWELL_MS);
    };
    start();
    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [user, loaded, isRead, atEnd, key, bookNumber, chapter, markMutate]);

  if (!user || !loaded) return null;

  const busy = mark.isPending || unmark.isPending;
  const shown = progress > 0.2; // below this it is too faint to tap
  return (
    <button
      type="button"
      disabled={busy}
      aria-label="Chapter read"
      aria-pressed={isRead}
      aria-hidden={!shown}
      tabIndex={shown ? 0 : -1}
      style={{ opacity: progress }}
      onClick={() => {
        attempted.add(key);
        const payload = { chapters: [{ bookNumber, chapter }] };
        if (isRead) unmark.mutate(payload);
        else mark.mutate(payload);
      }}
      className={
        "absolute bottom-2 right-5 sm:right-10 flex h-8 w-8 items-center justify-center rounded-full border bg-transparent transition-[opacity,background-color,border-color,color] duration-300 disabled:cursor-default " +
        (shown ? "pointer-events-auto " : "pointer-events-none ") +
        (isRead
          ? "border-gold/60 bg-gold/10 text-gold"
          : "border-ink-faint/40 text-ink-faint/60 hover:border-gold/60 hover:text-gold")
      }
    >
      <Check size={16} strokeWidth={2.5} />
    </button>
  );
}
