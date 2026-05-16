"use client";
import { PostCard } from "@/components/post/PostCard";
import Link from "next/link";
import { Search, PenLine, X } from "lucide-react";
import { Pagination } from "@/components/ui/Pagination";
import { usePost } from "@/hooks/usePost";

const LIMIT = 10;

export default function PostsPage() {
  const {
    posts,
    pagination,
    search,
    debouncedSearch,
    setSearch,
    page,
    setPage,
    isLoading,
    isError,
    isFetching,
  } = usePost({ limit: LIMIT });

  return (
    <div className="max-w-3xl mx-auto px-6 py-9">
      {/* Header */}
      <div className="flex items-start justify-between mb-7 gap-4">
        <div>
          <h1 className="font-display text-[2rem] font-bold text-ink tracking-tight">
            Posts
          </h1>
          {pagination && (
            <p className="font-body text-sm text-ink-faint mt-1">
              {pagination.total.toLocaleString()} post
              {pagination.total !== 1 ? "s" : ""} published
            </p>
          )}
        </div>
        <Link
          href="/new"
          className="shrink-0 inline-flex items-center gap-1.5 font-body text-sm font-medium bg-ink text-parchment px-4 py-2 rounded-lg hover:bg-ink-medium transition-all hover:-translate-y-px"
        >
          <PenLine size={13} /> Write
        </Link>
      </div>

      {/* Search */}
      <div className="relative mb-8">
        <Search
          size={13}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-ghost pointer-events-none"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search posts…"
          className="w-full pl-9 pr-9 py-2.5 font-body text-sm bg-parchment border border-parchment-dark rounded-xl text-ink placeholder-ink-ghost outline-none focus:border-gold-pale focus:ring-2 focus:ring-gold/10 transition-all"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-ghost hover:text-ink-faint transition-colors"
          >
            <X size={13} />
          </button>
        )}
      </div>

      {/* States */}
      {isLoading && (
        <div className="flex justify-center items-center py-20">
          <div className="w-7 h-7 border-2 border-parchment-dark border-t-gold rounded-full animate-spin" />
        </div>
      )}

      {isError && (
        <p className="text-center py-16 font-body text-sm text-red-600">
          Failed to load posts. Please try again.
        </p>
      )}

      {!isLoading && !isError && posts.length === 0 && (
        <div className="text-center py-16">
          <p className="font-body text-sm text-ink-ghost mb-3">
            {debouncedSearch
              ? `No results for "${debouncedSearch}"`
              : "No posts yet — be the first to write one."}
          </p>
          {!debouncedSearch && (
            <Link
              href="/new"
              className="inline-flex items-center gap-1.5 font-body text-sm font-medium text-gold hover:underline"
            >
              Start writing →
            </Link>
          )}
        </div>
      )}

      {!isLoading && !isError && posts.length > 0 && (
        <div
          className={[
            "transition-opacity duration-150",
            isFetching ? "opacity-50 pointer-events-none" : "opacity-100",
          ].join(" ")}
        >
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}

      {pagination && (
        <Pagination
          page={page}
          totalPages={pagination.totalPages}
          onPageChange={(p) => {
            setPage(p);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      )}
    </div>
  );
}
