"use client";
import { FileText, Clock, Archive, Trash2, Pencil, Send } from "lucide-react";
import Link from "next/link";
import { cn, STATUS_PILL } from "@/lib/utils";
import { fmt } from "@/lib/format";
import { usePost } from "@/hooks/usePost";

type FilterStatus = "ALL" | "DRAFT" | "ARCHIVED";

export default function DraftsPage() {
  const {
    authorPosts,
    isMyPostsLoading,
    publishMutation,
    archiveMutation,
    deleteMutation,
    confirmDelete,
    setConfirmDelete,
    filter,
    filterLabels,
    setFilter,
    counts,
  } = usePost({});

  return (
    <div className="max-w-3xl mx-auto px-6 py-9">
      {/* Header */}
      <div className="flex items-start justify-between mb-7 gap-4">
        <div>
          <h1 className="font-display text-[2rem] font-bold text-ink tracking-tight">
            Drafts
          </h1>
          <p className="font-body text-sm text-ink-faint mt-1">
            Unpublished and archived posts — visible only to you
          </p>
        </div>
        <Link
          href="/new"
          className="shrink-0 inline-flex items-center gap-1.5 font-body text-sm font-medium bg-ink text-parchment px-4 py-2 rounded-lg hover:bg-ink-medium transition-all hover:-translate-y-px"
        >
          <Pencil size={13} /> New post
        </Link>
      </div>

      {/* Filter pills */}
      <div className="flex items-center gap-2 mb-7 flex-wrap">
        {(Object.keys(filterLabels) as FilterStatus[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "font-body text-sm px-4 py-1.5 rounded-full border transition-all",
              filter === f
                ? "bg-ink text-parchment border-ink"
                : "bg-transparent text-ink-faint border-parchment-dark hover:bg-parchment-deep hover:border-ink-ghost",
            )}
          >
            {filterLabels[f]}
            <span className="ml-1.5 font-body text-[11px] opacity-60">
              ({counts[f]})
            </span>
          </button>
        ))}
      </div>

      {/* Content */}
      {isMyPostsLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-7 h-7 border-2 border-parchment-dark border-t-gold rounded-full animate-spin" />
        </div>
      ) : authorPosts.length === 0 ? (
        <div className="text-center py-20">
          <FileText size={36} className="mx-auto text-parchment-dark mb-4" />
          <p className="font-body text-sm text-ink-ghost mb-3">
            {filter === "DRAFT"
              ? "No drafts yet."
              : filter === "ARCHIVED"
                ? "No archived posts."
                : "No unpublished posts."}
          </p>
          <Link
            href="/new"
            className="font-body text-sm text-gold hover:underline"
          >
            Start writing →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {authorPosts.map((post) => (
            <div
              key={post.id}
              className="bg-parchment border border-parchment-dark rounded-2xl p-5 hover:border-gold-pale/60 hover:shadow-warm-sm transition-all group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  {/* Status + community */}
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <span
                      className={cn(
                        "font-body text-[11px] font-medium px-2.5 py-0.5 rounded-full",
                        STATUS_PILL[post.status] ?? STATUS_PILL.DRAFT,
                      )}
                    >
                      {post.status}
                    </span>
                    {post.community && (
                      <span className="font-body text-[11px] font-medium px-2.5 py-0.5 bg-gold-bg text-gold border border-gold-pale rounded-full">
                        {post.community.name}
                      </span>
                    )}
                  </div>

                  <h3 className="font-display text-[1.0625rem] font-semibold text-ink group-hover:text-gold transition-colors truncate mb-1.5">
                    {post.title || (
                      <span className="text-ink-ghost italic">Untitled</span>
                    )}
                  </h3>

                  <div className="flex items-center gap-3 font-body text-xs text-ink-ghost">
                    <span className="flex items-center gap-1">
                      <Clock size={10} />
                      {post.readingTime} min read
                    </span>
                    <span>Last edited {fmt(post.updatedAt)}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  <Link
                    href={`/posts/${post.slug}/edit`}
                    title="Edit"
                    className="p-2 rounded-lg text-ink-ghost hover:text-gold hover:bg-gold-bg transition-colors"
                  >
                    <Pencil size={14} />
                  </Link>

                  {post.status === "DRAFT" && (
                    <>
                      <button
                        onClick={() => publishMutation.mutate(post.id)}
                        disabled={publishMutation.isPending}
                        title="Publish"
                        className="p-2 rounded-lg text-ink-ghost hover:text-green-700 hover:bg-green-50 transition-colors disabled:opacity-50"
                      >
                        <Send size={14} />
                      </button>
                      <button
                        onClick={() => archiveMutation.mutate(post.id)}
                        disabled={archiveMutation.isPending}
                        title="Archive"
                        className="p-2 rounded-lg text-ink-ghost hover:text-amber-600 hover:bg-amber-50 transition-colors disabled:opacity-50"
                      >
                        <Archive size={14} />
                      </button>
                    </>
                  )}

                  {confirmDelete === post.id ? (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => deleteMutation.mutate(post.id)}
                        disabled={deleteMutation.isPending}
                        className="font-body text-xs px-2.5 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => setConfirmDelete(null)}
                        className="font-body text-xs px-2.5 py-1 bg-parchment-deep border border-parchment-dark text-ink-faint rounded-lg hover:bg-parchment-dark transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmDelete(post.id)}
                      title="Delete"
                      className="p-2 rounded-lg text-ink-ghost hover:text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
