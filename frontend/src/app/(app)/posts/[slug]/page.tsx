"use client";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/useToast";
import {
  Bookmark,
  Calendar,
  MessageCircle,
  ArrowLeft,
  Send,
  Pencil,
  Clock,
  Eye,
  Lock,
  X,
} from "lucide-react";
import Link from "next/link";
import { BibleDrawer } from "@/components/bible/BibleDrawer";
import {
  ScriptureInput,
  ScriptureReference,
} from "@/components/bible/ScriptureInline";
import { PostContent } from "@/components/post/PostContent";
import { fmt, fmtShort } from "@/lib/format";
import { REACTIONS } from "@/lib/utils";
import { usePostDetails } from "@/hooks/usePostDetails";
import { Comment } from "@/lib/type";
import { SeriesNav } from "@/components/Series/SeriesNav";
import { ReadingListButton } from "@/components/Series/ReadingListButton";

export default function PostDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const {
    post,
    isLoading,
    isError,
    counts,
    isBookmarked,
    totalReactions,
    isAuthor,
    handleComment,
    commentText,
    setCommentText,
    replyTo,
    setReplyTo,
    attachedVerses,
    setAttachedVerses,
    reactionMutation,
    commentMutation,
    bookmarkMutation,
  } = usePostDetails(slug);

  /* ── Loading / error ── */
  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-parchment-dark border-t-gold rounded-full animate-spin" />
      </div>
    );

  if (isError || !post)
    return (
      <div className="max-w-2xl mx-auto px-6 py-24 text-center">
        <h2 className="font-display text-2xl font-bold text-ink mb-2">
          Post not found
        </h2>
        <p className="font-body text-sm text-ink-faint mb-6">
          This post may be private, removed, or the link is incorrect.
        </p>
        <Link
          href="/posts"
          className="font-body text-sm text-gold hover:underline"
        >
          ← Back to posts
        </Link>
      </div>
    );

  return (
    <div className="min-h-screen bg-parchment">
      {/* Sticky top bar */}
      <div className="sticky top-0 z-20 bg-parchment/90 backdrop-blur-sm border-b border-parchment-dark">
        <div className="max-w-3xl mx-auto px-6 py-3 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-1.5 font-body text-sm text-ink-faint hover:text-ink transition-colors"
          >
            <ArrowLeft size={15} /> Back
          </button>

          <div className="flex items-center gap-1.5">
            {totalReactions > 0 && (
              <span className="hidden sm:block font-body text-xs text-ink-ghost mr-1">
                {totalReactions} reaction{totalReactions !== 1 ? "s" : ""}
              </span>
            )}
            {isAuthor && (
              <Link
                href={`/posts/${slug}/edit`}
                className="inline-flex items-center gap-1.5 font-body text-sm text-ink-faint hover:text-ink hover:bg-parchment-deep px-3 py-1.5 rounded-lg transition-colors"
              >
                <Pencil size={13} /> Edit
              </Link>
            )}
            {isAuthenticated && (
              <button
                onClick={() => bookmarkMutation.mutate()}
                disabled={bookmarkMutation.isPending}
                className={[
                  "p-2 rounded-lg transition-colors",
                  isBookmarked
                    ? "text-gold bg-gold-bg"
                    : "text-ink-ghost hover:text-ink hover:bg-parchment-deep",
                ].join(" ")}
              >
                <Bookmark
                  size={16}
                  fill={isBookmarked ? "currentColor" : "none"}
                />
              </button>
            )}
          </div>
        </div>
      </div>

      <article className="max-w-3xl mx-auto px-6 py-12">
        {/* Cover */}
        {post.coverImage && (
          <div className="aspect-video rounded-2xl overflow-hidden mb-10 border border-parchment-dark shadow-warm-sm">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Community */}
        {post.community && (
          <Link
            href={`/communities/${post.community.id}`}
            className="inline-flex items-center gap-1.5 font-body text-xs font-medium text-gold bg-gold-bg border border-gold-pale px-3 py-1 rounded-full mb-4 hover:bg-gold-bg/80 transition-colors"
          >
            {post.community.isPrivate && <Lock size={9} />}
            {post.community.name}
          </Link>
        )}

        {/* Tags */}
        {post.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-5">
            {post.tags.map((tag) => (
              <span
                key={tag.id}
                className="font-body text-[11px] font-medium text-ink-faint bg-parchment-deep border border-parchment-dark px-2.5 py-0.5 rounded-full"
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h1 className="font-display text-[clamp(2rem,5vw,3rem)] font-bold text-ink leading-tight tracking-tight mb-6">
          {post.title}
        </h1>

        {/* Author row */}
        <div className="flex items-center gap-4 mb-10 pb-8 border-b border-parchment-dark">
          <Link href={`/profile/${post.author?.id}`} className="shrink-0">
            <div className="w-12 h-12 rounded-2xl bg-gold-bg border border-gold-pale flex items-center justify-center font-display text-base font-bold text-gold hover:opacity-75 transition-opacity overflow-hidden">
              {post.author?.profileImg ? (
                <img
                  src={post.author.profileImg}
                  alt={post.author.username}
                  className="w-full h-full object-cover"
                />
              ) : (
                post.author?.username?.slice(0, 2).toUpperCase()
              )}
            </div>
          </Link>
          <div className="flex-1 min-w-0">
            <Link
              href={`/profile/${post.author?.id}`}
              className="font-display text-sm font-semibold text-ink hover:text-gold transition-colors"
            >
              {post.author?.username}
            </Link>
            <div className="flex flex-wrap items-center gap-3 font-body text-xs text-ink-ghost mt-0.5">
              <span className="flex items-center gap-1">
                <Calendar size={11} />
                {fmt(post.publishedAt ?? post.createdAt)}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={11} />
                {post.readingTime} min read
              </span>
              <span className="flex items-center gap-1">
                <Eye size={11} />
                {post.viewCount?.toLocaleString()} views
              </span>
            </div>
          </div>
        </div>

        {/* ── Series navigation — shown BEFORE the article body ── */}
        <SeriesNav postId={post.id} currentSlug={slug} />

        {/* Article content */}
        <PostContent html={post.content} />

        {/* Reactions */}
        <div className="flex flex-wrap items-center gap-2.5 py-6 border-t border-b border-parchment-dark mb-12">
          {REACTIONS.map(({ type, icon: Icon, label }) => {
            const count = counts[type] ?? 0;
            return (
              <button
                key={type}
                onClick={() => {
                  if (!isAuthenticated) {
                    toast({
                      title: "Sign in to react",
                      variant: "destructive",
                    });
                    return;
                  }
                  reactionMutation.mutate(type);
                }}
                className={[
                  "inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border font-body text-sm transition-all",
                  count > 0
                    ? "border-gold-pale bg-gold-bg text-gold"
                    : "border-parchment-dark text-ink-faint hover:border-gold-pale hover:text-gold hover:bg-gold-bg",
                ].join(" ")}
              >
                <Icon size={14} />
                <span>{label}</span>
                {count > 0 && (
                  <span className="font-semibold tabular-nums ml-0.5">
                    {count}
                  </span>
                )}
              </button>
            );
          })}

          {/* Read-later pill */}
          <ReadingListButton
            postId={post.id}
            variant="pill"
            className="ml-auto"
          />
        </div>

        {/* Comments */}
        <section>
          <h2 className="font-display text-xl font-semibold text-ink mb-6 flex items-center gap-2">
            <MessageCircle size={18} className="text-gold" />
            Comments
            {post.comments.length > 0 && (
              <span className="font-body text-sm font-normal text-ink-ghost">
                ({post.comments.length})
              </span>
            )}
          </h2>

          {/* Comment input */}
          <div className="mb-8 space-y-3">
            {replyTo && (
              <div className="flex items-center gap-2 font-body text-xs text-gold">
                <span>Replying to @{replyTo.username}</span>
                <button
                  onClick={() => setReplyTo(null)}
                  className="text-ink-ghost hover:text-ink transition-colors"
                >
                  <X size={12} />
                </button>
              </div>
            )}

            <div className="flex gap-3">
              <div className="w-9 h-9 rounded-full bg-gold-bg border border-gold-pale flex items-center justify-center font-display text-xs font-bold text-gold shrink-0">
                {user?.username?.slice(0, 2).toUpperCase() ?? "?"}
              </div>
              <div className="flex-1 flex gap-2">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder={
                    isAuthenticated
                      ? "Share your thoughts…"
                      : "Sign in to comment"
                  }
                  disabled={!isAuthenticated}
                  rows={2}
                  className="flex-1 px-4 py-2.5 font-body text-sm border border-parchment-dark rounded-xl bg-parchment text-ink placeholder-ink-ghost outline-none focus:border-gold-pale focus:ring-2 focus:ring-gold/10 resize-none transition-all disabled:opacity-50"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleComment();
                    }
                  }}
                />
                <button
                  onClick={handleComment}
                  disabled={
                    !commentText.trim() ||
                    commentMutation.isPending ||
                    !isAuthenticated
                  }
                  className="self-end inline-flex items-center gap-1.5 px-4 py-2.5 font-body text-sm font-medium bg-ink text-parchment rounded-xl hover:bg-ink-medium disabled:opacity-40 transition-all"
                >
                  {commentMutation.isPending ? (
                    <span className="w-3.5 h-3.5 border-2 border-parchment/30 border-t-parchment rounded-full animate-spin" />
                  ) : (
                    <Send size={13} />
                  )}
                  Post
                </button>
              </div>
            </div>

            {/* Scripture attachment for comment */}
            {isAuthenticated && (
              <div className="pl-12">
                <ScriptureInput
                  attached={attachedVerses}
                  onAttach={(reference, text) =>
                    setAttachedVerses((prev) => [...prev, { reference, text }])
                  }
                  onRemove={(reference) =>
                    setAttachedVerses((prev) =>
                      prev.filter((v) => v.reference !== reference),
                    )
                  }
                />
              </div>
            )}
          </div>

          {/* Comment list */}
          <div className="space-y-5">
            {!post.comments?.length ? (
              <p className="font-body text-sm text-ink-ghost text-center py-8">
                No comments yet — be the first!
              </p>
            ) : (
              post.comments.map((comment) => (
                <div key={comment.id}>
                  <CommentItem
                    comment={comment}
                    onReply={(id, username) => {
                      setReplyTo({ id, username });
                      document.querySelector("textarea")?.focus();
                    }}
                  />
                  {comment.replies?.length > 0 && (
                    <div className="ml-11 mt-3 space-y-3 border-l-2 border-parchment-dark pl-4">
                      {comment.replies.map((reply) => (
                        <CommentItem key={reply.id} comment={reply} isReply />
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </section>
      </article>

      {/* Floating Bible drawer for readers — no insert button outside editor */}
      {isAuthenticated && <BibleDrawer mode="floating" showInsert={false} />}
    </div>
  );
}

/* ── CommentItem ── */
function CommentItem({
  comment,
  onReply,
  isReply = false,
}: {
  comment: Comment;
  onReply?: (id: string, username: string) => void;
  isReply?: boolean;
}) {
  return (
    <div className="flex gap-3">
      <div
        className={[
          "rounded-full bg-gold-bg border border-gold-pale flex items-center justify-center font-display font-bold text-gold shrink-0",
          isReply ? "w-7 h-7 text-[9px]" : "w-9 h-9 text-xs",
        ].join(" ")}
      >
        {comment.author?.username?.slice(0, 2).toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <div className="bg-parchment-deep border border-parchment-dark rounded-xl px-4 py-3">
          <p className="font-display text-xs font-semibold text-ink mb-1">
            @{comment.author?.username}
          </p>
          <p className="font-body text-sm text-ink-light leading-relaxed">
            {comment.content}
          </p>

          {/* Scripture references attached to this comment */}
          {comment.scriptureRefs?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2.5 pt-2.5 border-t border-parchment-dark">
              {comment.scriptureRefs.map((ref: { reference: string }) => (
                <ScriptureReference
                  key={ref.reference}
                  reference={ref.reference}
                />
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center gap-3 mt-1.5 px-1">
          <span className="font-body text-xs text-ink-ghost">
            {fmtShort(comment.createdAt)}
          </span>
          {onReply && (
            <button
              onClick={() => onReply(comment.id, comment.author.username)}
              className="font-body text-xs text-ink-ghost hover:text-gold transition-colors font-medium"
            >
              Reply
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
