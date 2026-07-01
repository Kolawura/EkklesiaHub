"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getRequest,
  putRequest,
  deleteRequest,
  postRequest,
} from "@/lib/service";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/useToast";
import { ImageUpload } from "@/components/ui/ImageUpload";
import {
  GripVertical,
  Trash2,
  Plus,
  Check,
  X,
  Globe,
  Lock,
  Eye,
  ArrowLeft,
  Loader2,
  BookMarked,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function SeriesDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [editing, setEditing] = useState(false);
  const [showAddPost, setShowAddPost] = useState(false);
  const [confirmDel, setConfirmDel] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    coverImage: "",
    published: false,
  });

  /* ── Queries ── */
  const { data, isLoading, isError } = useQuery({
    queryKey: ["series", slug],
    queryFn: () => getRequest(`/series/${slug}`),
    enabled: !!slug,
  });

  const series = data?.data;
  const isOwner = series?.author?.id === user?.id;

  // Populate form when series loads
  useEffect(() => {
    if (series) {
      setForm({
        title: series.title,
        description: series.description ?? "",
        coverImage: series.coverImage ?? "",
        published: series.published,
      });
    }
  }, [series?.id]);

  // Own posts to pick from when adding
  const { data: myPostsData } = useQuery({
    queryKey: ["my-posts-simple"],
    queryFn: () => getRequest(`/posts/author/${user?.id}?status=PUBLISHED`),
    enabled: !!user?.id && showAddPost,
  });

  const myPosts: any[] = myPostsData?.data ?? [];
  const seriesPostIds = new Set(
    (series?.posts ?? []).map((sp: any) => sp.post.id),
  );
  const availablePosts = myPosts.filter((p: any) => !seriesPostIds.has(p.id));

  /* ── Mutations ── */
  const updateMutation = useMutation({
    mutationFn: () => putRequest(`/series/${series?.id}`, form),
    onSuccess: (data) => {
      if (data?.success) {
        queryClient.invalidateQueries({ queryKey: ["series", slug] });
        queryClient.invalidateQueries({ queryKey: ["my-series"] });
        toast({ title: "Series updated!", variant: "success" });
        setEditing(false);
      } else {
        toast({
          title: data?.message ?? "Update failed",
          variant: "destructive",
        });
      }
    },
    onError: () =>
      toast({ title: "Failed to update series", variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteRequest(`/series/${series?.id}`),
    onSuccess: () => {
      toast({ title: "Series deleted", variant: "success" });
      router.push("/series");
    },
    onError: () =>
      toast({ title: "Failed to delete series", variant: "destructive" }),
  });

  const addPostMutation = useMutation({
    mutationFn: (postId: string) =>
      postRequest(`/series/${series?.id}/posts`, { postId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["series", slug] });
      toast({ title: "Post added to series", variant: "success" });
    },
    onError: (e: any) =>
      toast({
        title: e?.response?.data?.message ?? "Failed",
        variant: "destructive",
      }),
  });

  const removePostMutation = useMutation({
    mutationFn: (postId: string) =>
      deleteRequest(`/series/${series?.id}/posts/${postId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["series", slug] });
      toast({ title: "Post removed", variant: "success" });
    },
    onError: () =>
      toast({ title: "Failed to remove post", variant: "destructive" }),
  });

  const reorderMutation = useMutation({
    mutationFn: (postIds: string[]) =>
      postRequest(`/series/${series?.id}/posts/reorder`, { postIds }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["series", slug] }),
  });

  const movePost = (index: number, direction: "up" | "down") => {
    const posts = [...(series?.posts ?? [])];
    const swap = direction === "up" ? index - 1 : index + 1;
    if (swap < 0 || swap >= posts.length) return;
    [posts[index], posts[swap]] = [posts[swap], posts[index]];
    const postIds = posts.map((sp: any) => sp.post.id);
    reorderMutation.mutate(postIds);
  };

  /* ── States ── */
  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-7 h-7 border-2 border-parchment-dark border-t-gold rounded-full animate-spin" />
      </div>
    );

  if (isError || !series)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="font-body text-sm text-ink-faint mb-3">
            Series not found.
          </p>
          <Link
            href="/series"
            className="font-body text-sm text-gold hover:underline"
          >
            ← Back to series
          </Link>
        </div>
      </div>
    );

  const inputCls =
    "w-full px-3.5 py-2.5 font-body text-sm bg-parchment border border-parchment-dark rounded-xl text-ink placeholder-ink-ghost outline-none focus:border-gold-pale focus:ring-2 focus:ring-gold/10 transition-all";

  return (
    <div className="max-w-3xl mx-auto px-6 py-9">
      {/* Back link */}
      <Link
        href="/series"
        className="inline-flex items-center gap-1.5 font-body text-sm text-ink-ghost hover:text-ink transition-colors mb-6"
      >
        <ArrowLeft size={14} /> All series
      </Link>

      {/* ── Series header card ── */}
      <div className="bg-parchment border border-parchment-dark rounded-2xl overflow-hidden mb-6">
        {/* Cover */}
        <div className="aspect-video bg-ink overflow-hidden relative">
          {editing ? (
            <ImageUpload
              value={form.coverImage}
              onChange={(url) => setForm({ ...form, coverImage: url })}
              onClear={() => setForm({ ...form, coverImage: "" })}
              label=""
              aspectRatio="video"
            />
          ) : series.coverImage ? (
            <img
              src={series.coverImage}
              alt={series.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(0deg,transparent,transparent 20px,rgba(184,125,44,0.06) 20px,rgba(184,125,44,0.07) 21px)",
              }}
            >
              <BookMarked size={40} className="text-gold/30" />
            </div>
          )}
        </div>

        <div className="p-6">
          {editing ? (
            /* Edit form */
            <div className="space-y-4">
              <div>
                <label className="block font-body text-xs font-medium text-ink-faint mb-1.5">
                  Series title
                </label>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className={inputCls}
                />
              </div>

              <div>
                <label className="block font-body text-xs font-medium text-ink-faint mb-1.5">
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  rows={3}
                  className={`${inputCls} resize-none`}
                />
              </div>

              {/* Publish toggle */}
              <div className="flex items-center justify-between py-3 border-t border-parchment-dark">
                <div>
                  <p className="font-body text-sm font-medium text-ink">
                    Published
                  </p>
                  <p className="font-body text-xs text-ink-ghost mt-0.5">
                    Make this series visible to readers
                  </p>
                </div>
                <button
                  onClick={() =>
                    setForm({ ...form, published: !form.published })
                  }
                  className={cn(
                    "relative w-10 h-[1.375rem] rounded-full transition-colors",
                    form.published ? "bg-gold" : "bg-parchment-dark",
                  )}
                >
                  <span
                    className={cn(
                      "absolute top-0.5 left-0.5 w-[1.125rem] h-[1.125rem] rounded-full bg-parchment shadow-sm transition-transform",
                      form.published ? "translate-x-[1.125rem]" : "",
                    )}
                  />
                </button>
              </div>

              <div className="flex items-center gap-2.5 pt-1">
                <button
                  onClick={() => updateMutation.mutate()}
                  disabled={!form.title.trim() || updateMutation.isPending}
                  className="inline-flex items-center gap-1.5 font-body text-sm font-medium bg-ink text-parchment px-5 py-2 rounded-lg hover:bg-ink-medium disabled:opacity-50 transition-all"
                >
                  {updateMutation.isPending ? (
                    <Loader2 size={13} className="animate-spin" />
                  ) : (
                    <Check size={13} />
                  )}
                  Save changes
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="font-body text-sm text-ink-faint hover:text-ink transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            /* View mode */
            <div>
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={cn(
                        "font-body text-[11px] font-medium px-2 py-0.5 rounded-full",
                        series.published
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-parchment-deep text-ink-ghost border border-parchment-dark",
                      )}
                    >
                      {series.published ? "Published" : "Draft"}
                    </span>
                    {series.community && (
                      <span className="font-body text-[11px] text-gold flex items-center gap-1">
                        {series.community.isPrivate ? (
                          <Lock size={9} />
                        ) : (
                          <Globe size={9} />
                        )}
                        {series.community.name}
                      </span>
                    )}
                  </div>

                  <h1 className="font-display text-2xl font-bold text-ink tracking-tight">
                    {series.title}
                  </h1>

                  {series.description && (
                    <p className="font-body text-sm text-ink-faint mt-2 leading-relaxed">
                      {series.description}
                    </p>
                  )}

                  <p className="font-body text-xs text-ink-ghost mt-3">
                    {series._count?.posts ?? 0} posts · by{" "}
                    {series.author?.username}
                  </p>
                </div>

                {isOwner && (
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => setEditing(true)}
                      className="inline-flex items-center gap-1.5 font-body text-sm text-ink-faint border border-parchment-dark px-3.5 py-1.5 rounded-lg hover:bg-parchment-deep hover:text-ink transition-all"
                    >
                      Edit
                    </button>
                    {!confirmDel ? (
                      <button
                        onClick={() => setConfirmDel(true)}
                        className="p-1.5 text-ink-ghost hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete series"
                      >
                        <Trash2 size={14} />
                      </button>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <span className="font-body text-xs text-red-600">
                          Delete?
                        </span>
                        <button
                          onClick={() => deleteMutation.mutate()}
                          disabled={deleteMutation.isPending}
                          className="font-body text-xs px-2.5 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                        >
                          Yes
                        </button>
                        <button
                          onClick={() => setConfirmDel(false)}
                          className="font-body text-xs px-2.5 py-1 border border-parchment-dark rounded-lg hover:bg-parchment-deep transition-colors"
                        >
                          No
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Posts in series ── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg font-semibold text-ink">
            Posts in this series
          </h2>
          {isOwner && (
            <button
              onClick={() => setShowAddPost(!showAddPost)}
              className={cn(
                "inline-flex items-center gap-1.5 font-body text-sm px-4 py-1.5 rounded-lg border transition-all",
                showAddPost
                  ? "bg-gold-bg text-gold border-gold-pale"
                  : "text-ink-faint border-parchment-dark hover:bg-parchment-deep hover:text-ink",
              )}
            >
              <Plus size={13} /> Add post
            </button>
          )}
        </div>

        {/* Add post dropdown */}
        {showAddPost && isOwner && (
          <div className="bg-parchment border border-parchment-dark rounded-2xl overflow-hidden mb-4">
            <div className="px-4 py-3 border-b border-parchment-dark">
              <p className="font-body text-xs font-medium text-ink-faint">
                Your published posts not yet in this series
              </p>
            </div>
            {availablePosts.length === 0 ? (
              <div className="px-4 py-6 text-center font-body text-sm text-ink-ghost">
                {myPosts.length === 0
                  ? "No published posts yet."
                  : "All your published posts are already in this series."}
              </div>
            ) : (
              <div className="divide-y divide-parchment-deep max-h-64 overflow-y-auto">
                {availablePosts.map((post: any) => (
                  <div
                    key={post.id}
                    className="flex items-center justify-between px-4 py-3 hover:bg-parchment-deep transition-colors gap-3"
                  >
                    <p className="font-body text-sm text-ink line-clamp-1 flex-1">
                      {post.title}
                    </p>
                    <button
                      onClick={() => addPostMutation.mutate(post.id)}
                      disabled={addPostMutation.isPending}
                      className="shrink-0 inline-flex items-center gap-1 font-body text-xs font-medium text-gold bg-gold-bg border border-gold-pale px-2.5 py-1 rounded-full hover:bg-gold-bg/80 disabled:opacity-50 transition-colors"
                    >
                      {addPostMutation.isPending &&
                      addPostMutation.variables === post.id ? (
                        <Loader2 size={10} className="animate-spin" />
                      ) : (
                        <Plus size={10} />
                      )}
                      Add
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Posts list */}
        {series.posts.length === 0 ? (
          <div className="text-center py-12 bg-parchment border border-parchment-dark rounded-2xl">
            <BookMarked
              size={32}
              className="mx-auto text-parchment-dark mb-3"
            />
            <p className="font-body text-sm text-ink-ghost mb-2">
              No posts in this series yet.
            </p>
            {isOwner && (
              <button
                onClick={() => setShowAddPost(true)}
                className="font-body text-sm text-gold hover:underline"
              >
                Add your first post →
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {series.posts.map((sp: any, index: number) => (
              <div
                key={sp.id}
                className="group flex items-center gap-3 bg-parchment border border-parchment-dark rounded-2xl px-4 py-3.5 hover:border-gold-pale/60 transition-all"
              >
                {/* Position number */}
                <span className="font-display text-sm font-bold text-ink-ghost w-6 shrink-0 text-center">
                  {sp.position}
                </span>

                {/* Cover thumbnail */}
                {sp.post.coverImage && (
                  <div className="w-12 h-9 rounded-lg overflow-hidden bg-parchment-deep border border-parchment-dark shrink-0">
                    <img
                      src={sp.post.coverImage}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Title + meta */}
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/posts/${sp.post.slug}`}
                    className="font-body text-sm font-medium text-ink hover:text-gold transition-colors line-clamp-1"
                  >
                    {sp.post.title}
                  </Link>
                  <p className="font-body text-[11px] text-ink-ghost mt-0.5">
                    {sp.post.readingTime} min · {sp.post._count?.reactions ?? 0}{" "}
                    reactions
                  </p>
                </div>

                {/* Reorder + remove — owner only */}
                {isOwner && (
                  <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <button
                      onClick={() => movePost(index, "up")}
                      disabled={index === 0 || reorderMutation.isPending}
                      className="p-1.5 text-ink-ghost hover:text-ink hover:bg-parchment-deep rounded-lg disabled:opacity-25 transition-colors"
                      title="Move up"
                    >
                      <ChevronUp size={14} />
                    </button>
                    <button
                      onClick={() => movePost(index, "down")}
                      disabled={
                        index === series.posts.length - 1 ||
                        reorderMutation.isPending
                      }
                      className="p-1.5 text-ink-ghost hover:text-ink hover:bg-parchment-deep rounded-lg disabled:opacity-25 transition-colors"
                      title="Move down"
                    >
                      <ChevronDown size={14} />
                    </button>
                    <button
                      onClick={() => removePostMutation.mutate(sp.post.id)}
                      disabled={removePostMutation.isPending}
                      className="p-1.5 text-ink-ghost hover:text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-40 transition-colors"
                      title="Remove from series"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
