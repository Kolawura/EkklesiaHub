"use client";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import {
  Eye,
  Heart,
  MessageCircle,
  TrendingUp,
  FileEdit,
  FileText,
  Clock,
  BarChart2,
  PenLine,
} from "lucide-react";
import { useAnalytics } from "@/hooks/useAnalytics";
import { fmt } from "@/lib/format";

export default function DashboardPage() {
  const { user } = useAuth();
  const { s, topPosts, recentPosts, isLoading } = useAnalytics();

  return (
    <div className="max-w-5xl mx-auto px-6 py-9">
      {/* Header */}
      <div className="flex items-start justify-between mb-8 gap-4">
        <div>
          <h1 className="font-display text-[2rem] font-bold text-ink tracking-tight leading-tight">
            Welcome back, {user?.firstName}
          </h1>
          <p className="font-body text-sm text-ink-faint mt-1">
            Your writing at a glance
          </p>
        </div>
        <Link
          href="/new"
          className="shrink-0 inline-flex items-center gap-1.5 font-body text-sm font-medium bg-ink text-parchment px-4 py-2 rounded-lg hover:bg-ink-medium transition-all hover:-translate-y-px"
        >
          <PenLine size={13} /> Write
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center min-h-56">
          <div className="w-8 h-8 border-2 border-parchment-dark border-t-gold rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-4">
          {/* Primary stat cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              {
                label: "Total views",
                value: s?.totalViews?.toLocaleString() ?? "0",
                icon: Eye,
                href: "/analytics",
              },
              {
                label: "Reactions",
                value: s?.totalReactions?.toLocaleString() ?? "0",
                icon: Heart,
                href: "/analytics",
              },
              {
                label: "Comments",
                value: s?.totalComments?.toLocaleString() ?? "0",
                icon: MessageCircle,
                href: "/analytics",
              },
              {
                label: "Published posts",
                value: s?.publishedPosts ?? "0",
                icon: TrendingUp,
                href: "/posts",
              },
            ].map(({ label, value, icon: Icon, href }) => (
              <Link
                key={label}
                href={href}
                className="group bg-parchment border border-parchment-dark rounded-2xl p-5 card-gold-top hover:border-gold-pale hover:shadow-warm-md hover:-translate-y-0.5 transition-all"
              >
                <div className="w-9 h-9 rounded-xl bg-gold-bg border border-gold-pale flex items-center justify-center text-gold mb-3 group-hover:bg-gold-bg/80 transition-colors">
                  <Icon size={15} />
                </div>
                <p className="font-display text-[2rem] font-bold text-ink tracking-tight leading-none">
                  {value}
                </p>
                <p className="font-body text-xs text-ink-ghost mt-1.5">
                  {label}
                </p>
              </Link>
            ))}
          </div>

          {/* Secondary stat cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              {
                label: "Drafts",
                value: s?.draftPosts ?? 0,
                note: "Unpublished",
                icon: FileEdit,
                href: "/drafts",
              },
              {
                label: "Bookmarks",
                value: s?.totalBookmarks ?? 0,
                note: "Saved by readers",
                icon: FileText,
                href: "/bookmarks",
              },
              {
                label: "Avg read time",
                value: `${s?.avgReadingTime ?? 0} min`,
                note: "Per post",
                icon: Clock,
                href: "/analytics",
              },
              {
                label: "All posts",
                value: s?.totalPosts ?? 0,
                note: "All statuses",
                icon: BarChart2,
                href: "/analytics",
              },
            ].map(({ label, value, note, icon: Icon, href }) => (
              <Link
                key={label}
                href={href}
                className="bg-parchment border border-parchment-dark rounded-2xl p-4 hover:border-parchment-dark hover:shadow-warm-sm transition-all"
              >
                <div className="flex items-center justify-between mb-2.5">
                  <Icon size={13} className="text-ink-ghost" />
                  <span className="font-body text-[10px] text-ink-ghost">
                    {note}
                  </span>
                </div>
                <p className="font-display text-[1.5rem] font-bold text-ink tracking-tight leading-none">
                  {value}
                </p>
                <p className="font-body text-xs text-ink-ghost mt-1">{label}</p>
              </Link>
            ))}
          </div>

          {/* Panels */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Recent posts */}
            <div className="bg-parchment border border-parchment-dark rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-parchment-dark">
                <h2 className="font-display text-[0.9375rem] font-semibold text-ink">
                  Recent posts
                </h2>
                <Link
                  href="/posts"
                  className="font-body text-xs text-gold hover:underline"
                >
                  View all →
                </Link>
              </div>
              {recentPosts.length === 0 ? (
                <div className="px-5 py-8 text-center font-body text-sm text-ink-ghost">
                  No published posts yet.{" "}
                  <Link href="/new" className="text-gold hover:underline">
                    Write one →
                  </Link>
                </div>
              ) : (
                recentPosts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/posts/${post.slug}`}
                    className="group flex items-center justify-between px-5 py-3 border-b border-parchment-deep last:border-0 hover:bg-parchment-deep transition-colors"
                  >
                    <div className="min-w-0">
                      <p className="font-body text-sm font-medium text-ink truncate group-hover:text-gold transition-colors">
                        {post.title}
                      </p>
                      <p className="font-body text-[11px] text-ink-ghost mt-0.5">
                        {fmt(post.publishedAt ?? post.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2.5 font-body text-[11px] text-ink-ghost shrink-0 ml-3">
                      <span className="flex items-center gap-1">
                        <Eye size={10} />
                        {post.viewCount ?? 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart size={10} />
                        {post._count?.reactions ?? 0}
                      </span>
                    </div>
                  </Link>
                ))
              )}
            </div>

            {/* Top posts */}
            <div className="bg-parchment border border-parchment-dark rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-parchment-dark">
                <h2 className="font-display text-[0.9375rem] font-semibold text-ink">
                  Top by views
                </h2>
                <Link
                  href="/analytics"
                  className="font-body text-xs text-gold hover:underline"
                >
                  Analytics →
                </Link>
              </div>
              {topPosts.length === 0 ? (
                <div className="px-5 py-8 text-center font-body text-sm text-ink-ghost">
                  Publish posts to see analytics here.
                </div>
              ) : (
                topPosts.map((post, i) => (
                  <Link
                    key={post.id}
                    href={`/posts/${post.slug}`}
                    className="group flex items-center justify-between px-5 py-3 border-b border-parchment-deep last:border-0 hover:bg-parchment-deep transition-colors gap-3"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="font-display text-sm font-bold text-ink-ghost w-4 shrink-0">
                        {i + 1}
                      </span>
                      <p className="font-body text-sm font-medium text-ink truncate group-hover:text-gold transition-colors">
                        {post.title}
                      </p>
                    </div>
                    <span className="font-body text-[11px] text-ink-ghost flex items-center gap-1 shrink-0">
                      <Eye size={10} />
                      {post.viewCount?.toLocaleString()}
                    </span>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
