"use client";

// hooks/bible/plans.ts
// Reading plans. Schedule: public /api/bible/plans/*. Progress: logged-in
// /api/reading-plans (main DB). "Today" is the user's LOCAL calendar day.

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getRequest, postRequest, deleteRequest } from "@/lib/service";
import { localDateKey } from "@/hooks/bible/daily";

export interface PlanSummary {
  slug: string;
  title: string;
  description: string | null;
  durations: number[];
}

export interface PlanPassage {
  book_number: number;
  book_name: string;
  chapter_start: number;
  chapter_end: number;
  reference: string;
}

export interface PlanDayData {
  day: number;
  reference: string;
  passages: PlanPassage[];
  slug: string;
  title: string;
  duration_days: number;
  total_days: number;
  prev_day: number | null;
  next_day: number | null;
}

export interface PlanEnrollment {
  id: string;
  planSlug: string;
  durationDays: number;
  startDate: string;
  completedDays: number[];
  started: boolean;
  currentDay: number;
  completedCount: number;
  finished: boolean;
  behindBy: number;
}

export function useBiblePlans() {
  return useQuery<PlanSummary[]>({
    queryKey: ["bible-plans"],
    queryFn: async () => (await getRequest("/bible/plans")).data,
    staleTime: 1000 * 60 * 60,
  });
}

export function usePlanDay(slug: string, duration: number, day: number) {
  return useQuery<PlanDayData>({
    queryKey: ["bible-plan-day", slug, duration, day],
    queryFn: async () =>
      (await getRequest(`/bible/plans/${slug}/${duration}/days/${day}`)).data,
    staleTime: 1000 * 60 * 60,
  });
}

const ENROLLMENTS_KEY = ["plan-enrollments"];

export function usePlanEnrollments(enabled: boolean) {
  const today = localDateKey();
  return useQuery<PlanEnrollment[]>({
    queryKey: [...ENROLLMENTS_KEY, today],
    queryFn: async () =>
      (await getRequest(`/reading-plans?today=${today}`)).data,
    enabled,
    staleTime: 1000 * 60,
  });
}

export function useStartPlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (v: { planSlug: string; durationDays: number }) =>
      (
        await postRequest("/reading-plans", {
          ...v,
          startDate: localDateKey(),
        })
      ).data as { id: string },
    onSuccess: () => qc.invalidateQueries({ queryKey: ENROLLMENTS_KEY }),
  });
}

export function useSetPlanDay() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (v: { id: string; day: number; done: boolean }) => {
      const url = `/reading-plans/${v.id}/days/${v.day}/complete`;
      return v.done ? postRequest(url, {}) : deleteRequest(url);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ENROLLMENTS_KEY }),
  });
}

export function useLeavePlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => deleteRequest(`/reading-plans/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ENROLLMENTS_KEY }),
  });
}

export function errorMessage(err: unknown): string {
  const e = err as { response?: { data?: { message?: string } } };
  return e?.response?.data?.message ?? "Something went wrong. Please try again.";
}
