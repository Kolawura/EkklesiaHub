"use client";

import { Bookmark, Eye, Clock, X } from "lucide-react";
import Link from "next/link";
import { useBookmarks } from "@/hooks/useBookmarks";
import { stripHtml } from "@/lib/utils";
import Image from "next/image";

export default function BookmarksPage() {
  const {
    bookmarks = [],
    isLoading,
    isPending,
    removeBookmark,
  } = useBookmarks() || {};
  console.log("bookmarks:", bookmarks);

  return (
    <div className="max-w-3xl mx-auto px-6 py-9">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-[2rem] font-bold text-ink tracking-tight">
          Bookmarks
        </h1>
        <p className="font-body text-sm text-ink-faint mt-1">
          {(bookmarks ?? []).length > 0
            ? `${(bookmarks ?? []).length} saved article${
                (bookmarks ?? []).length !== 1 ? "s" : ""
              }`
            : "Your saved reading list"}
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-7 h-7 border-2 border-parchment-dark border-t-gold rounded-full animate-spin" />
        </div>
      ) : bookmarks?.length === 0 ? (
        <div className="text-center py-20">
          <Bookmark size={40} className="mx-auto text-parchment-dark mb-4" />
          <p className="font-body text-sm text-ink-ghost mb-3">
            No bookmarks yet — save articles to read later.
          </p>
          <Link
            href="/posts"
            className="font-body text-sm text-gold hover:underline"
          >
            Browse posts →
          </Link>
        </div>
      ) : (
        <div className="space-y-0">
          {bookmarks?.map((b) => {
            const post = b.post;
            return (
              <article
                key={b.id}
                className="group flex items-start gap-4 py-6 border-b border-parchment-dark last:border-0"
              >
                {/* Cover image */}
                {post.coverImage && (
                  <Link href={`/posts/${post.slug}`} className="shrink-0">
                    <div className="w-20 h-16 rounded-xl overflow-hidden bg-parchment-deep border border-parchment-dark">
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </Link>
                )}

                {/* Content */}
                <div className="flex-1 min-w-0">
                  {/* Author */}
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <div className="w-4 h-4 rounded-full bg-gold-bg border border-gold-pale flex items-center justify-center font-display text-[8px] font-bold text-gold shrink-0">
                      {post.author?.username?.[0]?.toUpperCase() ?? "?"}
                    </div>
                    <span className="font-body text-xs text-ink-ghost">
                      {post.author?.username}
                    </span>
                    {post.community && (
                      <>
                        <span className="text-parchment-dark text-xs">·</span>
                        <span className="font-body text-[11px] text-gold">
                          {post.community.name}
                        </span>
                      </>
                    )}
                  </div>

                  <Link href={`/posts/${post.slug}`}>
                    <h3 className="font-display text-[1.0625rem] font-semibold text-ink group-hover:text-gold transition-colors line-clamp-2 leading-snug mb-1">
                      {post.title}
                    </h3>
                  </Link>

                  <p className="font-body text-sm text-ink-faint line-clamp-1 mb-2 leading-relaxed">
                    {post.excerpt || stripHtml(post.content)}
                  </p>

                  <div className="flex items-center gap-3 font-body text-xs text-ink-ghost">
                    <span className="flex items-center gap-1">
                      <Clock size={10} />
                      {post.readingTime} min
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye size={10} />
                      {post.viewCount ?? 0}
                    </span>
                  </div>
                </div>

                {/* Remove button */}
                <button
                  onClick={() => removeBookmark(post.id)}
                  disabled={isPending}
                  title="Remove bookmark"
                  className="shrink-0 p-1.5 text-ink-ghost hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-40 mt-0.5"
                >
                  <X size={14} />
                </button>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
