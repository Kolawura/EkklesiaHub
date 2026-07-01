"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getRequest, deleteRequest, patchRequest } from "@/lib/service";
import { toast } from "@/hooks/useToast";
import {
  BookOpen,
  CheckCheck,
  X,
  Clock,
  Eye,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Filter = "unread" | "read" | "all";

const stripHtml = (html: string) => html.replace(/<[^>]*>/g, "");

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

export default function ReadingListPage() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<Filter>("unread");

  const { data, isLoading } = useQuery({
    queryKey: ["reading-list", filter],
    queryFn: () => getRequest(`/reading-list?filter=${filter}`),
  });

  const { data: statsData } = useQuery({
    queryKey: ["reading-list-stats"],
    queryFn: () => getRequest("/reading-list/stats"),
  });

  const items = data?.items ?? [];
  const stats = statsData?.data ?? { total: 0, read: 0, unread: 0 };

  const markRead = useMutation({
    mutationFn: (postId: string) =>
      patchRequest(`/reading-list/${postId}/read`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reading-list"] });
      queryClient.invalidateQueries({ queryKey: ["reading-list-stats"] });
      toast({ title: "Marked as read", variant: "success" });
    },
  });

  const markUnread = useMutation({
    mutationFn: (postId: string) =>
      patchRequest(`/reading-list/${postId}/unread`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reading-list"] });
      queryClient.invalidateQueries({ queryKey: ["reading-list-stats"] });
    },
  });

  const remove = useMutation({
    mutationFn: (postId: string) => deleteRequest(`/reading-list/${postId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reading-list"] });
      queryClient.invalidateQueries({ queryKey: ["reading-list-stats"] });
      toast({ title: "Removed from reading list", variant: "success" });
    },
  });

  const FILTERS: { id: Filter; label: string; count: number }[] = [
    { id: "unread", label: "Unread", count: stats.unread },
    { id: "read", label: "Read", count: stats.read },
    { id: "all", label: "All saved", count: stats.total },
  ];

  return (
    <div className="max-w-3xl mx-auto px-6 py-9">
      {/* Header */}
      <div className="mb-7">
        <h1 className="font-display text-[2rem] font-bold text-ink tracking-tight">
          Reading List
        </h1>
        <p className="font-body text-sm text-ink-faint mt-1">
          Articles saved to read later
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-7">
        {[
          { label: "Saved", value: stats.total },
          { label: "Unread", value: stats.unread },
          { label: "Read", value: stats.read },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="bg-parchment border border-parchment-dark rounded-2xl p-4 text-center"
          >
            <p className="font-display text-2xl font-bold text-ink tracking-tight leading-none">
              {value}
            </p>
            <p className="font-body text-xs text-ink-ghost mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-1.5 mb-7 border-b border-parchment-dark pb-0">
        {FILTERS.map(({ id, label, count }) => (
          <button
            key={id}
            onClick={() => setFilter(id)}
            className={cn(
              "px-4 py-2.5 font-body text-sm border-b-2 -mb-px transition-all",
              filter === id
                ? "text-gold border-gold font-medium"
                : "text-ink-ghost border-transparent hover:text-ink-faint",
            )}
          >
            {label}
            <span className="ml-1.5 font-body text-[11px] opacity-60">
              ({count})
            </span>
          </button>
        ))}
      </div>

      {/* List */}
      {isLoading ? (
        <div className="flex justify-center py-16">
          <div className="w-7 h-7 border-2 border-parchment-dark border-t-gold rounded-full animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20">
          <BookOpen size={40} className="mx-auto text-parchment-dark mb-4" />
          <p className="font-body text-sm text-ink-ghost mb-2">
            {filter === "unread"
              ? "No unread articles. You're all caught up!"
              : filter === "read"
                ? "You haven't marked any articles as read yet."
                : "Your reading list is empty."}
          </p>
          <Link
            href="/posts"
            className="font-body text-sm text-gold hover:underline"
          >
            Browse posts to add →
          </Link>
        </div>
      ) : (
        <div className="space-y-0">
          {items.map((item: any) => {
            const post = item.post;
            const isRead = !!item.readAt;

            return (
              <article
                key={item.id}
                className={cn(
                  "group flex gap-4 py-6 border-b border-parchment-dark last:border-0",
                  isRead && "opacity-60",
                )}
              >
                {/* Cover */}
                {post.coverImage && (
                  <Link href={`/posts/${post.slug}`} className="shrink-0">
                    <div className="w-24 h-18 rounded-xl overflow-hidden bg-parchment-deep border border-parchment-dark">
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </Link>
                )}

                {/* Content */}
                <div className="flex-1 min-w-0">
                  {/* Author + community */}
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <div className="w-4 h-4 rounded-full bg-gold-bg border border-gold-pale flex items-center justify-center font-display text-[8px] font-bold text-gold shrink-0">
                      {post.author?.username?.[0]?.toUpperCase()}
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
                    {isRead && (
                      <span className="ml-auto font-body text-[11px] text-emerald-600 flex items-center gap-1">
                        <CheckCheck size={11} /> Read
                      </span>
                    )}
                  </div>

                  <Link href={`/posts/${post.slug}`}>
                    <h3 className="font-display text-[1.0625rem] font-semibold text-ink group-hover:text-gold transition-colors line-clamp-2 leading-snug mb-1">
                      {post.title}
                    </h3>
                  </Link>

                  <p className="font-body text-xs text-ink-faint line-clamp-1 mb-2 leading-relaxed">
                    {post.excerpt || stripHtml(post.content ?? "")}
                  </p>

                  {/* Meta + actions */}
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-body text-xs text-ink-ghost flex items-center gap-1">
                      <Clock size={10} /> {post.readingTime} min
                    </span>
                    <span className="font-body text-xs text-ink-ghost flex items-center gap-1">
                      <Eye size={10} /> {post.viewCount ?? 0}
                    </span>
                    <span className="font-body text-xs text-ink-ghost">
                      Saved {fmtDate(item.createdAt)}
                    </span>

                    {/* Actions */}
                    <div className="ml-auto flex items-center gap-1">
                      {!isRead ? (
                        <button
                          onClick={() => markRead.mutate(post.id)}
                          disabled={markRead.isPending}
                          className="inline-flex items-center gap-1 font-body text-xs text-ink-ghost hover:text-emerald-600 px-2 py-1 rounded-lg hover:bg-emerald-50 transition-colors disabled:opacity-40"
                          title="Mark as read"
                        >
                          <CheckCheck size={12} /> Mark read
                        </button>
                      ) : (
                        <button
                          onClick={() => markUnread.mutate(post.id)}
                          disabled={markUnread.isPending}
                          className="inline-flex items-center gap-1 font-body text-xs text-ink-ghost hover:text-ink px-2 py-1 rounded-lg hover:bg-parchment-deep transition-colors disabled:opacity-40"
                          title="Mark as unread"
                        >
                          <BookOpen size={12} /> Mark unread
                        </button>
                      )}
                      <Link
                        href={`/posts/${post.slug}`}
                        className="inline-flex items-center gap-1 font-body text-xs text-gold hover:underline px-2 py-1"
                      >
                        Read <ChevronRight size={11} />
                      </Link>
                      <button
                        onClick={() => remove.mutate(post.id)}
                        disabled={remove.isPending}
                        className="p-1.5 text-ink-ghost hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-40"
                        title="Remove"
                      >
                        <X size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
