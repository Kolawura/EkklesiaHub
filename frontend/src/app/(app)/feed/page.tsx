"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getRequest, postRequest, deleteRequest } from "@/lib/service";
import { toast } from "@/hooks/useToast";
import { PostCard } from "@/components/post/PostCard";
import { Hash, Plus, X, Loader2, Rss } from "lucide-react";
import { cn } from "@/lib/utils";

export default function TagFeedPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [browseMode, setBrowseMode] = useState(false);

  /* ── Queries ── */
  const { data: feedData, isLoading: feedLoading } = useQuery({
    queryKey: ["tag-feed", page],
    queryFn: () => getRequest(`/tags/feed?page=${page}&limit=12`),
    staleTime: 1000 * 60,
  });

  const { data: followedData } = useQuery({
    queryKey: ["followed-tags"],
    queryFn: () => getRequest("/tags/following"),
  });

  const { data: allTagsData, isLoading: allTagsLoading } = useQuery({
    queryKey: ["all-tags"],
    queryFn: () => getRequest("/tags"),
    enabled: browseMode,
    staleTime: 1000 * 60 * 10,
  });

  const posts = feedData?.posts ?? [];
  const pagination = feedData?.pagination;
  const followed: any[] = (followedData?.data ?? []).map((f: any) => f.tag);
  const allTags: any[] = allTagsData?.data ?? [];
  const followedIds = new Set(followed.map((t: any) => t.id));

  /* ── Mutations ── */
  const followMutation = useMutation({
    mutationFn: (tagId: string) => postRequest(`/tags/${tagId}/follow`, {}),
    onSuccess: (_, tagId) => {
      queryClient.invalidateQueries({ queryKey: ["followed-tags"] });
      queryClient.invalidateQueries({ queryKey: ["tag-feed"] });
      const tag = allTags.find((t) => t.id === tagId);
      toast({ title: `Following #${tag?.name ?? "tag"}`, variant: "success" });
    },
    onError: (e: any) =>
      toast({
        title: e?.response?.data?.message ?? "Failed",
        variant: "destructive",
      }),
  });

  const unfollowMutation = useMutation({
    mutationFn: (tagId: string) => deleteRequest(`/tags/${tagId}/unfollow`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["followed-tags"] });
      queryClient.invalidateQueries({ queryKey: ["tag-feed"] });
    },
    onError: () =>
      toast({ title: "Failed to unfollow", variant: "destructive" }),
  });

  const toggleTag = (tagId: string) => {
    if (followedIds.has(tagId)) {
      unfollowMutation.mutate(tagId);
    } else {
      followMutation.mutate(tagId);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-9">
      {/* Header */}
      <div className="flex items-start justify-between mb-7 gap-4">
        <div>
          <h1 className="font-display text-[2rem] font-bold text-ink tracking-tight flex items-center gap-2">
            <Rss size={24} className="text-gold" />
            Tag Feed
          </h1>
          <p className="font-body text-sm text-ink-faint mt-1">
            Posts from topics you follow
          </p>
        </div>
        <button
          onClick={() => setBrowseMode(!browseMode)}
          className={cn(
            "inline-flex items-center gap-1.5 font-body text-sm px-4 py-2 rounded-lg border transition-all",
            browseMode
              ? "bg-gold-bg text-gold border-gold-pale"
              : "text-ink-faint border-parchment-dark hover:bg-parchment-deep hover:text-ink",
          )}
        >
          <Hash size={14} />
          {browseMode ? "Hide tags" : "Browse topics"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
        {/* ── Left: Post feed ── */}
        <div>
          {/* Followed tags pills */}
          {followed.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {followed.map((tag: any) => (
                <div
                  key={tag.id}
                  className="inline-flex items-center gap-1.5 font-body text-xs font-medium px-3 py-1.5 bg-gold-bg text-gold border border-gold-pale rounded-full"
                >
                  <Hash size={10} />
                  {tag.name}
                  <button
                    onClick={() => unfollowMutation.mutate(tag.id)}
                    disabled={unfollowMutation.isPending}
                    className="text-gold/60 hover:text-gold transition-colors ml-0.5"
                  >
                    <X size={10} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {feedLoading ? (
            <div className="flex justify-center py-16">
              <div className="w-7 h-7 border-2 border-parchment-dark border-t-gold rounded-full animate-spin" />
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20 bg-parchment border border-parchment-dark rounded-2xl">
              <Hash size={40} className="mx-auto text-parchment-dark mb-4" />
              <p className="font-body text-sm text-ink-ghost mb-3">
                {followed.length === 0
                  ? "You're not following any topics yet."
                  : "No recent posts from your followed topics."}
              </p>
              <button
                onClick={() => setBrowseMode(true)}
                className="font-body text-sm text-gold hover:underline"
              >
                Browse topics to follow →
              </button>
            </div>
          ) : (
            <div>
              {posts.map((post: any) => (
                <PostCard key={post.id} post={post} />
              ))}

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-1.5 pt-8">
                  <button
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                    className="px-3 py-1.5 font-body text-sm text-ink-faint border border-parchment-dark rounded-lg hover:bg-parchment-deep disabled:opacity-40 transition-colors"
                  >
                    ←
                  </button>
                  <span className="font-body text-sm text-ink-ghost px-3">
                    {page} / {pagination.totalPages}
                  </span>
                  <button
                    onClick={() => setPage(page + 1)}
                    disabled={page === pagination.totalPages}
                    className="px-3 py-1.5 font-body text-sm text-ink-faint border border-parchment-dark rounded-lg hover:bg-parchment-deep disabled:opacity-40 transition-colors"
                  >
                    →
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Right: Tag browser ── */}
        {browseMode && (
          <div className="lg:sticky lg:top-20 self-start">
            <div className="bg-parchment border border-parchment-dark rounded-2xl overflow-hidden">
              <div className="px-4 py-3.5 border-b border-parchment-dark">
                <p className="font-display text-sm font-semibold text-ink">
                  Browse all topics
                </p>
                <p className="font-body text-[11px] text-ink-ghost mt-0.5">
                  Follow topics to personalise your feed
                </p>
              </div>

              {allTagsLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 size={18} className="animate-spin text-ink-ghost" />
                </div>
              ) : (
                <div className="p-3 max-h-125 overflow-y-auto">
                  <div className="space-y-1">
                    {allTags.map((tag: any) => {
                      const isFollowing = followedIds.has(tag.id);
                      const isPending =
                        (followMutation.isPending &&
                          followMutation.variables === tag.id) ||
                        (unfollowMutation.isPending &&
                          unfollowMutation.variables === tag.id);

                      return (
                        <div
                          key={tag.id}
                          className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-parchment-deep transition-colors"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <Hash
                              size={12}
                              className={
                                isFollowing ? "text-gold" : "text-ink-ghost"
                              }
                            />
                            <span
                              className={cn(
                                "font-body text-sm font-medium truncate",
                                isFollowing ? "text-gold" : "text-ink-faint",
                              )}
                            >
                              {tag.name}
                            </span>
                            <span className="font-body text-[11px] text-ink-ghost shrink-0">
                              {tag._count?.posts ?? 0}
                            </span>
                          </div>
                          <button
                            onClick={() => toggleTag(tag.id)}
                            disabled={isPending}
                            className={cn(
                              "shrink-0 inline-flex items-center gap-1 font-body text-[11px] font-medium px-2.5 py-1 rounded-full border transition-all disabled:opacity-50 ml-2",
                              isFollowing
                                ? "bg-gold-bg text-gold border-gold-pale hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                                : "bg-transparent text-ink-ghost border-parchment-dark hover:bg-gold-bg hover:text-gold hover:border-gold-pale",
                            )}
                          >
                            {isPending ? (
                              <Loader2 size={10} className="animate-spin" />
                            ) : isFollowing ? (
                              <>
                                <X size={9} /> Unfollow
                              </>
                            ) : (
                              <>
                                <Plus size={9} /> Follow
                              </>
                            )}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
