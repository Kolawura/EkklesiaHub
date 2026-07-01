"use client";

import { useQuery } from "@tanstack/react-query";
import { getRequest } from "@/lib/service";
import { BookMarked, ChevronLeft, ChevronRight, Lock } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface SeriesNavProps {
  postId: string;
  currentSlug: string;
}

export function SeriesNav({ postId, currentSlug }: SeriesNavProps) {
  const { data, isLoading } = useQuery({
    queryKey: ["post-series", postId],
    queryFn: () => getRequest(`/series/post/${postId}`),
    enabled: !!postId,
    staleTime: 1000 * 60 * 5,
  });

  const seriesEntries: any[] = data?.data ?? [];

  // Only show published series
  const published = seriesEntries.filter((e: any) => e.series.published);
  if (isLoading || published.length === 0) return null;

  return (
    <div className="space-y-4 mb-10">
      {published.map((entry: any) => {
        const series = entry.series;
        const allPosts = series.posts; // ordered by position
        const currentIndex = allPosts.findIndex(
          (sp: any) => sp.post.slug === currentSlug,
        );
        const currentPos = allPosts[currentIndex]?.position ?? 1;
        const prev = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
        const next =
          currentIndex < allPosts.length - 1
            ? allPosts[currentIndex + 1]
            : null;

        return (
          <div
            key={series.id}
            className="bg-gold-bg border border-gold-pale rounded-2xl overflow-hidden"
          >
            {/* Series header */}
            <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-gold-pale/60">
              <BookMarked size={14} className="text-gold shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-body text-[10px] uppercase tracking-widest text-gold/70 font-medium">
                  Part {currentPos} of {allPosts.length}
                </p>
                <Link
                  href={`/series/${series.slug}`}
                  className="font-display text-sm font-semibold text-ink hover:text-gold transition-colors line-clamp-1"
                >
                  {series.title}
                </Link>
              </div>
              <Link
                href={`/series/${series.slug}`}
                className="shrink-0 font-body text-xs text-gold hover:underline"
              >
                View all
              </Link>
            </div>

            {/* Posts list — compact */}
            <div className="px-5 py-3 space-y-0">
              {allPosts.map((sp: any, i: number) => {
                const isCurrent = sp.post.slug === currentSlug;
                const isPublished = sp.post.status === "PUBLISHED";

                return (
                  <div
                    key={sp.post.id}
                    className={cn(
                      "flex items-center gap-2.5 py-2 border-b border-gold-pale/30 last:border-0",
                    )}
                  >
                    {/* Position dot */}
                    <div
                      className={cn(
                        "w-5 h-5 rounded-full flex items-center justify-center font-display text-[10px] font-bold shrink-0",
                        isCurrent
                          ? "bg-gold text-parchment"
                          : "bg-parchment border border-gold-pale text-ink-ghost",
                      )}
                    >
                      {sp.position}
                    </div>

                    {/* Title */}
                    {isPublished ? (
                      <Link
                        href={`/posts/${sp.post.slug}`}
                        className={cn(
                          "font-body text-sm flex-1 min-w-0 line-clamp-1 transition-colors",
                          isCurrent
                            ? "text-ink font-semibold"
                            : "text-ink-faint hover:text-gold",
                        )}
                      >
                        {sp.post.title}
                        {isCurrent && (
                          <span className="ml-1.5 font-body text-[10px] text-gold font-normal">
                            ← you are here
                          </span>
                        )}
                      </Link>
                    ) : (
                      <span className="font-body text-sm text-ink-ghost flex-1 min-w-0 line-clamp-1 flex items-center gap-1">
                        {sp.post.title}
                        <Lock size={9} className="shrink-0 opacity-50" />
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Prev / Next navigation */}
            {(prev || next) && (
              <div className="flex items-center gap-2 px-5 py-3 border-t border-gold-pale/60">
                {prev && prev.post.status === "PUBLISHED" ? (
                  <Link
                    href={`/posts/${prev.post.slug}`}
                    className="flex-1 flex items-center gap-2 group"
                  >
                    <ChevronLeft
                      size={14}
                      className="text-ink-ghost group-hover:text-gold transition-colors shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="font-body text-[10px] text-ink-ghost uppercase tracking-wide">
                        Previous
                      </p>
                      <p className="font-body text-xs text-ink-faint group-hover:text-gold transition-colors line-clamp-1">
                        {prev.post.title}
                      </p>
                    </div>
                  </Link>
                ) : (
                  <div className="flex-1" />
                )}

                {next && next.post.status === "PUBLISHED" && (
                  <Link
                    href={`/posts/${next.post.slug}`}
                    className="flex-1 flex items-center justify-end gap-2 group text-right"
                  >
                    <div className="min-w-0">
                      <p className="font-body text-[10px] text-ink-ghost uppercase tracking-wide">
                        Next
                      </p>
                      <p className="font-body text-xs text-ink-faint group-hover:text-gold transition-colors line-clamp-1">
                        {next.post.title}
                      </p>
                    </div>
                    <ChevronRight
                      size={14}
                      className="text-ink-ghost group-hover:text-gold transition-colors shrink-0"
                    />
                  </Link>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
