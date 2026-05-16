"use client";

import Link from "next/link";
import { Clock, MessageCircle, Heart, Pin, Lock, Eye } from "lucide-react";
import { PostCardProps, Tag } from "@/lib/type";
import { fmt } from "@/lib/format";

const stripHtml = (html: string) => html.replace(/<[^>]*>/g, "");

export function PostCard({
  post,
  showAdminActions,
  onRemove,
  onPin,
}: PostCardProps) {
  const authorInitial = post.author.username[0].toUpperCase();

  return (
    <article className="group border-b border-parchment-dark last:border-0 py-7 flex gap-5">
      <div className="flex-1 min-w-0">
        {/* Author row */}
        <div className="flex items-center gap-2 flex-wrap mb-2.5">
          <Link href={`/profile/${post.author.id}`}>
            {post.author.profileImg ? (
              <img
                src={post.author.profileImg}
                alt={post.author.username}
                className="w-6 h-6 rounded-full object-cover"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-gold-bg border border-gold-pale flex items-center justify-center font-display text-[10px] font-bold text-gold hover:opacity-75 transition-opacity shrink-0">
                {authorInitial}
              </div>
            )}
          </Link>
          <Link
            href={`/profile/${post.author.id}`}
            className="font-body text-sm font-medium text-ink-faint hover:text-gold transition-colors"
          >
            {post.author.username}
          </Link>

          {post.community && (
            <>
              <span className="text-parchment-dark font-body text-xs">in</span>
              <Link
                href={`/communities/${post.community.id}`}
                className="inline-flex items-center gap-1 font-body text-[11px] font-medium text-gold bg-gold-bg border border-gold-pale px-2 py-0.5 rounded-full hover:bg-gold-bg/80 transition-colors"
              >
                {post.community.isPrivate && <Lock size={9} />}
                {post.community.name}
              </Link>
            </>
          )}

          <span className="text-parchment-dark text-xs">·</span>
          <span className="font-body text-xs text-ink-ghost">
            {fmt(post.publishedAt ?? post.createdAt)}
          </span>

          {post.isPinned && (
            <span className="inline-flex items-center gap-1 font-body text-[11px] text-gold">
              <Pin size={10} /> Pinned
            </span>
          )}
        </div>

        {/* Title */}
        <Link href={`/posts/${post.slug}`}>
          <h2 className="font-display text-xl font-bold text-ink mb-1.5 group-hover:text-gold transition-colors line-clamp-2 leading-snug">
            {post.title}
          </h2>
        </Link>

        {/* Excerpt */}
        <p className="font-body text-sm text-ink-faint leading-relaxed line-clamp-2 mb-3">
          {post.excerpt || stripHtml(post.content)}
        </p>

        {/* Footer */}
        <div className="flex items-center gap-3 flex-wrap">
          {post.tags.slice(0, 3).map((tag: Tag) => (
            <span
              key={tag.id}
              className="font-body text-[11px] font-medium px-2.5 py-0.5 bg-parchment-deep border border-parchment-dark text-ink-faint rounded-full"
            >
              {tag.name}
            </span>
          ))}

          <div className="ml-auto flex items-center gap-3">
            <span className="inline-flex items-center gap-1 font-body text-xs text-ink-ghost">
              <Clock size={11} />
              {post.readingTime} min
            </span>
            <span className="inline-flex items-center gap-1 font-body text-xs text-ink-ghost">
              <Eye size={11} />
              {post.viewCount ?? 0}
            </span>
            <span className="inline-flex items-center gap-1 font-body text-xs text-ink-ghost">
              <Heart size={11} />
              {post._count?.reactions ?? 0}
            </span>
            <span className="inline-flex items-center gap-1 font-body text-xs text-ink-ghost">
              <MessageCircle size={11} />
              {post._count?.comments ?? 0}
            </span>
          </div>
        </div>

        {/* Admin actions */}
        {showAdminActions && (
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-parchment-deep">
            {onPin && (
              <button
                onClick={() => onPin(post.id)}
                className="inline-flex items-center gap-1.5 font-body text-xs text-ink-ghost hover:text-gold transition-colors"
              >
                <Pin size={12} />
                {post.isPinned ? "Unpin" : "Pin"}
              </button>
            )}
            {onRemove && (
              <button
                onClick={() => onRemove(post.id)}
                className="inline-flex items-center gap-1.5 font-body text-xs text-ink-ghost hover:text-red-600 transition-colors"
              >
                Remove
              </button>
            )}
          </div>
        )}
      </div>

      {/* Cover image */}
      {post.coverImage && (
        <Link href={`/posts/${post.slug}`} className="shrink-0 self-start">
          <div className="w-28 h-20 rounded-xl overflow-hidden bg-parchment-deep border border-parchment-dark">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </Link>
      )}
    </article>
  );
}
