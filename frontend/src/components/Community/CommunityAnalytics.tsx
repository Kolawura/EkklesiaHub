import type { CommunityAnalytics } from "@/lib/type";
import Link from "next/link";

export function CommunityAnalytics({
  analytics,
}: {
  analytics: CommunityAnalytics;
}) {
  const maxViews = Math.max(
    ...(analytics.dailyViews.map((v) => v.count) || [1]),
    1,
  );

  return (
    <div className="space-y-4">
      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          { label: "Total Members", value: analytics.summary.totalMembers },
          { label: "New Members (30d)", value: analytics.summary.newMembers },
          { label: "Published Posts", value: analytics.summary.totalPosts },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="bg-parchment border border-parchment-dark rounded-2xl p-5"
          >
            <p className="font-display text-[2rem] font-bold text-ink tracking-tight leading-none">
              {value}
            </p>
            <p className="font-body text-xs text-ink-ghost mt-1.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Views chart */}
      {analytics.dailyViews.length > 0 && (
        <div className="bg-parchment border border-parchment-dark rounded-2xl p-6">
          <p className="font-display text-[0.9375rem] font-semibold text-ink mb-0.5">
            Views — last 30 days
          </p>
          <p className="font-body text-xs text-ink-ghost mb-5">
            Community post views per day
          </p>
          <div className="flex items-end gap-0.75 h-32">
            {analytics.dailyViews.map((v, i) => (
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
                  {v.date}: {v.count}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top posts */}
      {analytics.topPosts.length > 0 && (
        <div className="bg-parchment border border-parchment-dark rounded-2xl overflow-hidden">
          <div className="px-5 py-3.5 border-b border-parchment-dark">
            <p className="font-display text-[0.9375rem] font-semibold text-ink">
              Top posts
            </p>
          </div>
          {analytics.topPosts.map((post, i) => (
            <Link
              key={post.id}
              href={`/posts/${post.slug}`}
              className="group flex items-center justify-between px-5 py-3.5 border-b border-parchment-deep last:border-0 hover:bg-parchment-deep transition-colors gap-4"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="font-display text-sm font-bold text-ink-ghost w-4 shrink-0">
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <p className="font-body text-sm font-medium text-ink group-hover:text-gold transition-colors truncate">
                    {post.title}
                  </p>
                  <p className="font-body text-xs text-ink-ghost">
                    by {post.author?.username}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 font-body text-xs text-ink-ghost shrink-0">
                <span>{post.viewCount?.toLocaleString()} views</span>
                <span>{post._count?.reactions} reactions</span>
                <span>{post._count?.comments} comments</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
