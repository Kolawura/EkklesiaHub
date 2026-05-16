"use client";

import { useParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import {
  FileText,
  Users,
  UserPlus,
  UserMinus,
  Calendar,
  Eye,
  Heart,
  MessageCircle,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Pagination } from "@/lib/Pagination";
import { usePublicProfile } from "@/hooks/usePublicProfile";
import { fmtLong } from "@/lib/format";

const stripHtml = (html: string) => html.replace(/<[^>]*>/g, "");

/* ── MAIN ── */
export default function PublicProfilePage() {
  const { userId } = useParams<{ userId: string }>();
  const { isAuthenticated } = useAuth();
  const {
    profile,
    posts,
    pagination,
    page,
    setPage,
    profileLoading,
    postsLoading,
    followMutation,
    isFollowing,
    isOwnProfile,
  } = usePublicProfile(userId);

  if (profileLoading)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-7 h-7 border-2 border-parchment-dark border-t-gold rounded-full animate-spin" />
      </div>
    );

  if (!profile)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="font-body text-sm text-ink-faint">User not found.</p>
      </div>
    );

  const initials =
    `${profile.firstName?.[0] ?? ""}${profile.lastName?.[0] ?? ""}`.toUpperCase();

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      {/* Banner */}
      <div className="relative h-36 rounded-2xl overflow-hidden">
        {profile.bannerImg ? (
          <img
            src={profile.bannerImg}
            alt="Banner"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-ink" />
        )}
        <div
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg,transparent,transparent 20px,rgba(184,125,44,0.06) 20px,rgba(184,125,44,0.07) 21px)",
          }}
        />
      </div>

      {/* Avatar + follow row */}
      <div className="flex items-end justify-between -mt-10 mb-5 gap-3">
        <div className="shrink-0 relative">
          {/* Avatar */}
          {profile.profileImg ? (
            <img
              src={profile.profileImg}
              alt={profile.username}
              className="w-20 h-20 rounded-2xl border-4 border-parchment object-cover shadow-warm-md"
            />
          ) : (
            <div className="w-20 h-20 rounded-2xl bg-gold-bg border-4 border-parchment flex items-center justify-center font-display text-2xl font-bold text-gold shadow-warm-md">
              {initials}
            </div>
          )}
        </div>
        {/* CTA */}
        <div className="flex items-center gap-2">
          {isOwnProfile ? (
            <Link
              href="/profile"
              className="font-body text-sm font-medium border border-parchment-dark text-ink-faint px-4 py-1.5 rounded-full hover:bg-parchment-deep hover:text-ink transition-all self-start mt-10"
            >
              Edit profile
            </Link>
          ) : isAuthenticated ? (
            <button
              onClick={() => followMutation.mutate()}
              disabled={followMutation.isPending}
              className={cn(
                "inline-flex items-center gap-1.5 font-body text-sm font-medium px-4 py-1.5 rounded-full transition-all self-start mt-10 disabled:opacity-50",
                isFollowing
                  ? "border border-parchment-dark text-ink-faint hover:border-red-300 hover:text-red-600"
                  : "bg-ink text-parchment hover:bg-ink-medium",
              )}
            >
              {followMutation.isPending ? (
                <span className="w-3.5 h-3.5 border-2 border-current/30 border-t-current rounded-full animate-spin" />
              ) : isFollowing ? (
                <UserMinus size={13} />
              ) : (
                <UserPlus size={13} />
              )}
              {isFollowing ? "Unfollow" : "Follow"}
            </button>
          ) : null}
        </div>
      </div>

      {/* Name + bio */}
      <div className="mb-7">
        <h1 className="font-display text-2xl font-bold text-ink tracking-tight">
          {profile.firstName} {profile.lastName}
        </h1>
        <p className="font-body text-sm text-ink-ghost mt-0.5">
          @{profile.username}
        </p>

        {profile.bio && (
          <p className="font-body text-sm text-ink-faint mt-3 leading-relaxed max-w-xl">
            {profile.bio}
          </p>
        )}

        {/* Stats row */}
        <div className="flex flex-wrap items-center gap-5 mt-4 font-body text-sm text-ink-faint">
          <span className="flex items-center gap-1.5">
            <FileText size={13} className="text-ink-ghost" />
            <strong className="font-semibold text-ink">
              {profile._count?.posts ?? 0}
            </strong>{" "}
            posts
          </span>
          <span className="flex items-center gap-1.5">
            <Users size={13} className="text-ink-ghost" />
            <strong className="font-semibold text-ink">
              {profile._count?.followers ?? 0}
            </strong>{" "}
            followers
          </span>
          <span>
            <strong className="font-semibold text-ink">
              {profile._count?.following ?? 0}
            </strong>{" "}
            following
          </span>
          <span className="ml-auto flex items-center gap-1.5 text-ink-ghost text-xs">
            <Calendar size={11} />
            Joined {fmtLong(profile.createdAt)}
          </span>
        </div>
      </div>

      {/* Posts */}
      <div>
        <h2 className="font-display text-lg font-semibold text-ink mb-5">
          Posts
        </h2>

        {postsLoading ? (
          <div className="flex justify-center py-12">
            <div className="w-7 h-7 border-2 border-parchment-dark border-t-gold rounded-full animate-spin" />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16 bg-parchment border border-parchment-dark rounded-2xl">
            <FileText size={32} className="mx-auto text-parchment-dark mb-3" />
            <p className="font-body text-sm text-ink-ghost">
              No published posts yet.
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-0">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="group border-b border-parchment-dark last:border-0 py-6 flex gap-4"
                >
                  <div className="flex-1 min-w-0">
                    {/* Community badge */}
                    {post.community && (
                      <Link
                        href={`/communities/${post.community.id}`}
                        className="inline-flex items-center gap-1 font-body text-[11px] font-medium text-gold bg-gold-bg border border-gold-pale px-2.5 py-0.5 rounded-full mb-2 hover:bg-gold-bg/80 transition-colors"
                      >
                        {post.community.name}
                      </Link>
                    )}

                    <Link href={`/posts/${post.slug}`}>
                      <h3 className="font-display text-lg font-bold text-ink group-hover:text-gold transition-colors line-clamp-2 leading-snug mb-1.5">
                        {post.title}
                      </h3>
                    </Link>

                    <p className="font-body text-sm text-ink-faint leading-relaxed line-clamp-2 mb-2.5">
                      {post.excerpt || stripHtml(post.content)}
                    </p>

                    {/* Tags + meta */}
                    <div className="flex items-center gap-2 flex-wrap">
                      {post.tags?.slice(0, 3).map((tag) => (
                        <span
                          key={tag.id}
                          className="font-body text-[11px] text-ink-ghost bg-parchment-deep border border-parchment-dark px-2.5 py-0.5 rounded-full"
                        >
                          {tag.name}
                        </span>
                      ))}
                      <div className="ml-auto flex items-center gap-3 font-body text-xs text-ink-ghost">
                        <span className="flex items-center gap-1">
                          <Clock size={10} />
                          {post.readingTime} min
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye size={10} />
                          {post.viewCount ?? 0}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart size={10} />
                          {post._count?.reactions ?? 0}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle size={10} />
                          {post._count?.comments ?? 0}
                        </span>
                      </div>
                    </div>
                  </div>

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
                </article>
              ))}
            </div>

            <Pagination
              page={page}
              totalPages={pagination?.totalPages ?? 1}
              onPageChange={(p) => {
                setPage(p);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
          </>
        )}
      </div>
    </div>
  );
}
