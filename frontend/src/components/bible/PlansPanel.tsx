"use client";

// components/bible/PlansPanel.tsx
//
// Right-hand panel on /bible: reading plans with per-user progress.
// Browsing plans is public; starting one and ticking days needs a login.

import { useEffect, useState } from "react";
import {
  X,
  Loader2,
  ListChecks,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Check,
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import {
  useBiblePlans,
  usePlanDay,
  usePlanEnrollments,
  useStartPlan,
  useLeavePlan,
  errorMessage,
  type PlanEnrollment,
  type PlanSummary,
} from "@/hooks/bible/plans";
import {
  isChapterRead,
  useReadChapters,
  useMarkChapters,
  useUnmarkChapters,
  type ChapterRef,
} from "@/hooks/bible/progress";
import { cn } from "@/lib/utils";

interface PlansPanelProps {
  onClose: () => void;
  onNavigate: (book: string, chapter: number) => void;
}

const btn =
  "font-body text-xs border border-parchment-dark px-2.5 py-1.5 rounded-lg transition-all hover:bg-parchment-deep hover:text-ink text-ink-faint disabled:opacity-50";

function titleFor(slug: string, plans?: PlanSummary[]) {
  return (
    plans?.find((p) => p.slug === slug)?.title ??
    slug.charAt(0).toUpperCase() + slug.slice(1)
  );
}

function ProgressBar({ done, total }: { done: number; total: number }) {
  const pct = total > 0 ? Math.min(100, Math.round((done / total) * 100)) : 0;
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={total}
      aria-valuenow={done}
      className="h-1.5 w-full rounded-full bg-parchment-deep overflow-hidden"
    >
      <div className="h-full bg-gold" style={{ width: `${pct}%` }} />
    </div>
  );
}

function PlanView({
  enrollment,
  plans,
  onBack,
  onNavigate,
}: {
  enrollment: PlanEnrollment;
  plans?: PlanSummary[];
  onBack: () => void;
  onNavigate: PlansPanelProps["onNavigate"];
}) {
  const [day, setDay] = useState(enrollment.currentDay);
  const [confirmLeave, setConfirmLeave] = useState(false);
  const dayQuery = usePlanDay(enrollment.planSlug, enrollment.durationDays, day);
  const readMap = useReadChapters(true).data;
  const markChapters = useMarkChapters();
  const unmarkChapters = useUnmarkChapters();
  const leave = useLeavePlan();

  const done = enrollment.completedDays.includes(day);
  const total = enrollment.durationDays;
  const d = dayQuery.data;

  // Every chapter scheduled for this day (passages can span several chapters)
  const dayChapters: ChapterRef[] = (d?.passages ?? []).flatMap((p) =>
    Array.from(
      { length: p.chapter_end - p.chapter_start + 1 },
      (_, i): ChapterRef => ({
        bookNumber: p.book_number,
        chapter: p.chapter_start + i,
      }),
    ),
  );
  const readCount = dayChapters.filter((c) => isChapterRead(readMap, c)).length;
  const busy = markChapters.isPending || unmarkChapters.isPending;

  return (
    <div className="flex-1 overflow-y-auto overscroll-y-contain">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 px-5 pt-4 font-body text-xs text-ink-faint hover:text-ink transition-colors"
      >
        <ArrowLeft size={12} /> All plans
      </button>

      <div className="px-5 pt-3 pb-4 border-b border-parchment-dark">
        <h2 className="font-display text-lg font-bold text-ink">
          {titleFor(enrollment.planSlug, plans)}
        </h2>
        <p className="font-body text-xs text-ink-faint mb-3">
          {total}-day plan · {enrollment.completedCount} of {total} days done
          {enrollment.finished ? " · finished" : ""}
        </p>
        <ProgressBar done={enrollment.completedCount} total={total} />
        {!enrollment.started && (
          <p className="font-body text-xs text-ink-faint mt-2">
            Starts {enrollment.startDate}.
          </p>
        )}
        {enrollment.behindBy > 0 && !enrollment.finished && (
          <p className="font-body text-xs text-ink-faint mt-2">
            {enrollment.behindBy} {enrollment.behindBy === 1 ? "day" : "days"}{" "}
            behind — no rush, you can tick days in any order.
          </p>
        )}
      </div>

      <div className="px-5 py-4">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => setDay((x) => Math.max(1, x - 1))}
            disabled={day <= 1}
            aria-label="Previous day"
            className="p-1 text-ink-faint hover:text-ink disabled:opacity-30"
          >
            <ChevronLeft size={16} />
          </button>
          <div className="text-center">
            <p className="font-body text-[10px] uppercase tracking-[0.18em] text-gold font-medium">
              Day {day} of {total}
            </p>
            {day !== enrollment.currentDay && (
              <button
                onClick={() => setDay(enrollment.currentDay)}
                className="font-body text-[11px] text-ink-faint underline underline-offset-2 hover:text-ink"
              >
                Go to today (day {enrollment.currentDay})
              </button>
            )}
          </div>
          <button
            onClick={() => setDay((x) => Math.min(total, x + 1))}
            disabled={day >= total}
            aria-label="Next day"
            className="p-1 text-ink-faint hover:text-ink disabled:opacity-30"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {dayQuery.isLoading && (
          <div className="flex justify-center py-6">
            <Loader2 size={16} className="animate-spin text-ink-ghost" />
          </div>
        )}
        {dayQuery.isError && (
          <p className="font-body text-sm text-ink-faint">
            This day&apos;s readings could not be loaded.
          </p>
        )}
        {d && (
          <ul className="space-y-2">
            {d.passages.map((p) => {
              const total = p.chapter_end - p.chapter_start + 1;
              const done = Array.from({ length: total }).filter((_, i) =>
                isChapterRead(readMap, {
                  bookNumber: p.book_number,
                  chapter: p.chapter_start + i,
                }),
              ).length;
              return (
                <li key={`${p.book_number}-${p.chapter_start}`}>
                  <button
                    onClick={() => onNavigate(p.book_name, p.chapter_start)}
                    className="w-full flex items-center justify-between gap-2 text-left rounded-lg border border-parchment-dark px-3 py-2.5 font-body text-sm text-ink hover:bg-parchment-deep transition-colors"
                  >
                    <span>{p.reference}</span>
                    {done === total ? (
                      <Check size={14} className="shrink-0 text-gold" />
                    ) : done > 0 ? (
                      <span className="shrink-0 text-xs text-ink-faint">
                        {done}/{total}
                      </span>
                    ) : null}
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        <button
          onClick={() =>
            done
              ? unmarkChapters.mutate({ chapters: dayChapters })
              : markChapters.mutate({ chapters: dayChapters })
          }
          disabled={busy || dayChapters.length === 0}
          className={cn(
            "mt-4 w-full inline-flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2 font-body text-sm transition-all disabled:opacity-60",
            done
              ? "border-gold-pale bg-gold-bg text-gold"
              : "border-parchment-dark text-ink hover:bg-parchment-deep",
          )}
        >
          {done ? (
            <>
              <Check size={14} /> Done — tap to unmark
            </>
          ) : (
            "Mark day complete"
          )}
        </button>
        <p className="font-body text-[11px] text-ink-faint mt-2">
          {dayChapters.length > 0
            ? `${readCount} of ${dayChapters.length} chapters read. `
            : ""}
          Days complete on their own as you read each chapter to its end.
        </p>
        {(markChapters.isError || unmarkChapters.isError) && (
          <p className="font-body text-xs text-ink-faint mt-2">
            {errorMessage(markChapters.error ?? unmarkChapters.error)}
          </p>
        )}
      </div>

      <div className="px-5 pb-6">
        {confirmLeave ? (
          <div className="flex items-center gap-2">
            <button
              onClick={() => leave.mutate(enrollment.id, { onSuccess: onBack })}
              disabled={leave.isPending}
              className={btn}
            >
              Yes, leave and erase progress
            </button>
            <button onClick={() => setConfirmLeave(false)} className={btn}>
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirmLeave(true)}
            className="font-body text-xs text-ink-ghost underline underline-offset-2 hover:text-ink"
          >
            Leave this plan
          </button>
        )}
        {leave.isError && (
          <p className="font-body text-xs text-ink-faint mt-2">
            {errorMessage(leave.error)}
          </p>
        )}
      </div>
    </div>
  );
}

export function PlansPanel({ onClose, onNavigate }: PlansPanelProps) {
  const user = useAuthStore((s) => s.user);
  const plans = useBiblePlans();
  const enrollments = usePlanEnrollments(!!user);
  const start = useStartPlan();
  const [openId, setOpenId] = useState<string | null>(null);

  // If the open plan disappears (left on another tab), return to the list.
  useEffect(() => {
    if (
      openId &&
      enrollments.data &&
      !enrollments.data.some((e) => e.id === openId)
    ) {
      setOpenId(null);
    }
  }, [openId, enrollments.data]);

  const open = enrollments.data?.find((e) => e.id === openId);

  return (
    <div className="flex flex-col h-full bg-parchment border-l border-parchment-dark">
      <div className="shrink-0 flex items-center justify-between px-5 py-4 border-b border-parchment-dark">
        <div className="flex items-center gap-2">
          <ListChecks size={15} className="text-gold" />
          <div>
            <p className="font-display text-sm font-semibold text-ink">
              Reading plans
            </p>
            <p className="font-body text-[11px] text-gold">
              Read the whole Bible, a day at a time
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          aria-label="Close"
          className="text-ink-ghost hover:text-ink transition-colors p-1"
        >
          <X size={16} />
        </button>
      </div>

      {open ? (
        <PlanView
          enrollment={open}
          plans={plans.data}
          onBack={() => setOpenId(null)}
          onNavigate={onNavigate}
        />
      ) : (
        <div className="flex-1 overflow-y-auto overscroll-y-contain">
          {user && (
            <section className="px-5 py-4 border-b border-parchment-dark">
              <p className="font-body text-[10px] uppercase tracking-[0.18em] text-gold font-medium mb-3">
                Your plans
              </p>
              {enrollments.isLoading && (
                <Loader2 size={14} className="animate-spin text-ink-ghost" />
              )}
              {enrollments.isError && (
                <p className="font-body text-sm text-ink-faint">
                  Your plans could not be loaded.
                </p>
              )}
              {enrollments.data?.length === 0 && (
                <p className="font-body text-sm text-ink-faint">
                  You haven&apos;t started a plan yet.
                </p>
              )}
              <ul className="space-y-2">
                {enrollments.data?.map((e) => (
                  <li key={e.id}>
                    <button
                      onClick={() => setOpenId(e.id)}
                      className="w-full text-left rounded-lg border border-parchment-dark px-3 py-3 hover:bg-parchment-deep transition-colors"
                    >
                      <p className="font-body text-sm text-ink">
                        {titleFor(e.planSlug, plans.data)} · {e.durationDays}{" "}
                        days
                      </p>
                      <p className="font-body text-xs text-ink-faint mt-0.5 mb-2">
                        {e.finished
                          ? "Finished"
                          : e.started
                            ? `Day ${e.currentDay} today · ${e.completedCount} done`
                            : `Starts ${e.startDate}`}
                      </p>
                      <ProgressBar
                        done={e.completedCount}
                        total={e.durationDays}
                      />
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="px-5 py-4">
            <p className="font-body text-[10px] uppercase tracking-[0.18em] text-gold font-medium mb-3">
              Start a plan
            </p>
            {!user && (
              <p className="font-body text-sm text-ink-faint mb-3">
                <a
                  href="/auth?from=/bible"
                  className="underline underline-offset-2 text-ink"
                >
                  Sign in
                </a>{" "}
                to start a plan and track your progress.
              </p>
            )}
            {plans.isLoading && (
              <Loader2 size={14} className="animate-spin text-ink-ghost" />
            )}
            {plans.isError && (
              <p className="font-body text-sm text-ink-faint">
                Plans could not be loaded.
              </p>
            )}
            <ul className="space-y-3">
              {plans.data?.map((p) => (
                <li
                  key={p.slug}
                  className="rounded-lg border border-parchment-dark px-3 py-3"
                >
                  <p className="font-body text-sm text-ink font-medium">
                    {p.title}
                  </p>
                  {p.description && (
                    <p className="font-body text-xs text-ink-faint leading-relaxed mt-1">
                      {p.description}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {[...p.durations]
                      .sort((a, b) => a - b)
                      .map((dur) => {
                        const existing = enrollments.data?.find(
                          (e) =>
                            e.planSlug === p.slug && e.durationDays === dur,
                        );
                        return (
                          <button
                            key={dur}
                            disabled={!user || start.isPending}
                            onClick={() =>
                              existing
                                ? setOpenId(existing.id)
                                : start.mutate(
                                    { planSlug: p.slug, durationDays: dur },
                                    { onSuccess: (r) => setOpenId(r.id) },
                                  )
                            }
                            className={btn}
                          >
                            {existing ? "Continue" : "Start"} · {dur} days
                          </button>
                        );
                      })}
                  </div>
                </li>
              ))}
            </ul>
            {start.isError && (
              <p className="font-body text-xs text-ink-faint mt-3">
                {errorMessage(start.error)}
              </p>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
