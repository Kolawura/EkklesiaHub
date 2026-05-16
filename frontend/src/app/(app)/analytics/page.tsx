"use client";

import Link from "next/link";
import {
  Eye,
  Heart,
  MessageCircle,
  Bookmark,
  TrendingUp,
  FileText,
  Clock,
  BarChart2,
} from "lucide-react";
import { fmt } from "@/lib/format";
import { useAnalytics } from "@/hooks/useAnalytics";
import { StatCard } from "@/components/Analytics/StatCard";
import { REACTION_COLORS } from "@/lib/utils";


export default function AnalyticsPage() {
  const { analytics, isLoading, isError } = useAnalytics();

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-parchment-dark border-t-gold rounded-full animate-spin" />
      </div>
    );

  if (isError || !analytics)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="font-body text-sm text-red-600">
          Failed to load analytics.
        </p>
      </div>
    );

  const { summary: s, topPosts, dailyViews, reactionBreakdown } = analytics;
  const maxViews = Math.max(...dailyViews.map((v) => v.count), 1);
  const totalReactions = reactionBreakdown.reduce((acc, r) => acc + r.count, 0);

  return (
    <div className="max-w-5xl mx-auto px-6 py-9">
      {/* Header */}
      <div className="flex items-start justify-between mb-8 gap-4">
        <div>
          <h1 className="font-display text-[2rem] font-bold text-ink tracking-tight">
            Analytics
          </h1>
          <p className="font-body text-sm text-ink-faint mt-1">
            Your writing performance at a glance
          </p>
        </div>
        <div className="inline-flex items-center gap-1.5 font-body text-xs text-ink-ghost bg-parchment-deep border border-parchment-dark px-3 py-1.5 rounded-full">
          <Clock size={11} />
          Last 30 days
        </div>
      </div>

      {/* Primary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
        <StatCard
          label="Total views"
          value={s.totalViews.toLocaleString()}
          icon={Eye}
        />
        <StatCard
          label="Reactions"
          value={s.totalReactions.toLocaleString()}
          icon={Heart}
        />
        <StatCard
          label="Comments"
          value={s.totalComments.toLocaleString()}
          icon={MessageCircle}
        />
        <StatCard
          label="Bookmarks"
          value={s.totalBookmarks.toLocaleString()}
          icon={Bookmark}
        />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <StatCard
          label="Published"
          value={s.publishedPosts}
          icon={TrendingUp}
        />
        <StatCard
          label="Drafts"
          value={s.draftPosts}
          icon={FileText}
          sub="Only visible to you"
        />
        <StatCard
          label="Avg read time"
          value={`${s.avgReadingTime} min`}
          icon={Clock}
          sub="Across published"
        />
        <StatCard label="Total posts" value={s.totalPosts} icon={BarChart2} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        {/* Views chart */}
        <div className="lg:col-span-2 bg-parchment border border-parchment-dark rounded-2xl p-6">
          <h2 className="font-display text-[0.9375rem] font-semibold text-ink mb-0.5">
            Views over time
          </h2>
          <p className="font-body text-[11px] text-ink-ghost mb-5">
            Unique views per day — last 30 days
          </p>

          {dailyViews.length === 0 ? (
            <div className="flex items-center justify-center h-36 font-body text-sm text-ink-ghost">
              No view data yet — publish your first post!
            </div>
          ) : (
            <>
              <div className="flex items-end gap-0.75 h-36">
                {dailyViews.map((v, i) => (
                  <div
                    key={i}
                    className="flex-1 h-full flex flex-col items-center justify-end group relative"
                  >
                    <div
                      className="w-full bg-gold rounded-t-xs min-h-0.5 hover:bg-gold-light transition-colors"
                      style={{
                        height: `${Math.max(2, (v.count / maxViews) * 100)}%`,
                      }}
                    />
                    <div className="absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 bg-ink text-parchment font-body text-[10px] px-1.5 py-0.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                      {fmt(v.date)}: {v.count}
                    </div>
                  </div>
                ))}
              </div>
              {dailyViews.length > 0 && (
                <div className="flex justify-between mt-2">
                  <span className="font-body text-[10px] text-ink-ghost">
                    {fmt(dailyViews[0].date)}
                  </span>
                  {dailyViews.length > 2 && (
                    <span className="font-body text-[10px] text-ink-ghost">
                      {fmt(dailyViews[Math.floor(dailyViews.length / 2)].date)}
                    </span>
                  )}
                  <span className="font-body text-[10px] text-ink-ghost">
                    {fmt(dailyViews[dailyViews.length - 1].date)}
                  </span>
                </div>
              )}
            </>
          )}
        </div>

        {/* Reactions */}
        <div className="bg-parchment border border-parchment-dark rounded-2xl p-6">
          <h2 className="font-display text-[0.9375rem] font-semibold text-ink mb-0.5">
            Reactions
          </h2>
          <p className="font-body text-[11px] text-ink-ghost mb-5">
            {totalReactions > 0
              ? `${totalReactions} total`
              : "No reactions yet"}
          </p>
          {reactionBreakdown.length === 0 ? (
            <div className="flex items-center justify-center h-24 font-body text-sm text-ink-ghost">
              No reactions yet
            </div>
          ) : (
            <div className="space-y-3.5">
              {reactionBreakdown.map((r) => {
                const pct =
                  totalReactions > 0
                    ? Math.round((r.count / totalReactions) * 100)
                    : 0;
                return (
                  <div key={r.type}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-body text-xs font-medium text-ink-light capitalize">
                        {r.type.toLowerCase()}
                      </span>
                      <span className="font-body text-[11px] text-ink-ghost">
                        {r.count} ({pct}%)
                      </span>
                    </div>
                    <div className="w-full bg-parchment-dark rounded-full h-1.5">
                      <div
                        className={`${REACTION_COLORS[r.type] ?? "bg-ink-ghost"} h-1.5 rounded-full transition-all`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Top posts table */}
      <div className="bg-parchment border border-parchment-dark rounded-2xl p-6">
        <h2 className="font-display text-[0.9375rem] font-semibold text-ink mb-0.5">
          Top performing posts
        </h2>
        <p className="font-body text-[11px] text-ink-ghost mb-5">
          Ranked by total views
        </p>

        {topPosts.length === 0 ? (
          <div className="text-center py-8 font-body text-sm text-ink-ghost">
            No published posts yet.{" "}
            <Link href="/new" className="text-gold hover:underline">
              Write one →
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full font-body text-sm">
              <thead>
                <tr className="border-b border-parchment-dark">
                  {["Post", "Views", "Reactions", "Comments", "Saves"].map(
                    (h) => (
                      <th
                        key={h}
                        className={`font-medium text-ink-ghost pb-2.5 text-${h === "Post" ? "left" : "right"} whitespace-nowrap px-2 first:pl-0 last:pr-0`}
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {topPosts.map((post, i) => (
                  <tr
                    key={post.id}
                    className="border-b border-parchment-deep last:border-0"
                  >
                    <td className="py-2.5 pr-3">
                      <div className="flex items-center gap-2.5">
                        <span className="font-display text-xs font-bold text-ink-ghost w-4 shrink-0">
                          {i + 1}
                        </span>
                        <Link
                          href={`/posts/${post.slug}`}
                          className="font-medium text-ink hover:text-gold transition-colors line-clamp-1"
                        >
                          {post.title}
                        </Link>
                      </div>
                    </td>
                    <td className="py-2.5 px-2 text-right font-semibold text-ink">
                      {post.viewCount.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-2 text-right text-ink-faint">
                      {post.reactions.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-2 text-right text-ink-faint">
                      {post.comments.toLocaleString()}
                    </td>
                    <td className="py-2.5 pl-2 text-right text-ink-faint">
                      {post.bookmarks.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
