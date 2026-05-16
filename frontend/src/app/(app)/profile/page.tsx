"use client";

import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { fmtLong } from "@/lib/format";
import {
  usernameBorder,
  UsernameStatusIcon,
  usernameHint,
} from "@/lib/profile";
import {
  Pencil,
  Check,
  X,
  FileText,
  Eye,
  Heart,
  MessageCircle,
  Camera,
  ImageIcon,
  Loader2,
  AtSign,
} from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const { user } = useAuth();
  const {
    editing,
    setEditing,
    form,
    setForm,
    uploadingAvatar,
    uploadingBanner,
    usernameState,
    avatarInputRef,
    bannerInputRef,
    cancelEdit,
    handleAvatarFile,
    handleBannerFile,
    handleUsernameChange,
    updateMutation,
    canSave,
    allPosts,
    myPosts,
    initials,
    totalViews,
    totalComments,
    totalReactions,
  } = useProfile();

  const inputCls =
    "w-full px-3.5 py-2.5 font-body text-sm bg-parchment border border-parchment-dark rounded-xl text-ink placeholder-ink-ghost outline-none focus:border-gold-pale focus:ring-2 focus:ring-gold/10 transition-all";

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      {/* ── Profile card ── */}
      <div className="bg-parchment border border-parchment-dark rounded-2xl overflow-hidden mb-6">
        {/* ── Banner ── */}
        <div className="h-36 relative overflow-hidden">
          {form.bannerImg ? (
            <img
              src={form.bannerImg}
              alt="Banner"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-ink" />
          )}

          {/* Ruled lines texture */}
          <div
            className="absolute inset-0 opacity-40 pointer-events-none"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg,transparent,transparent 20px,rgba(184,125,44,0.06) 20px,rgba(184,125,44,0.07) 21px)",
            }}
          />

          {/* Banner edit overlay — only in edit mode */}
          {editing && (
            <button
              onClick={() => bannerInputRef.current?.click()}
              disabled={uploadingBanner}
              className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-ink/40 hover:bg-ink/55 transition-colors cursor-pointer"
            >
              {uploadingBanner ? (
                <Loader2 size={22} className="text-parchment animate-spin" />
              ) : (
                <ImageIcon size={22} className="text-parchment" />
              )}
              <span className="font-body text-xs text-parchment font-medium">
                {uploadingBanner
                  ? "Uploading…"
                  : form.bannerImg
                    ? "Change banner photo"
                    : "Add a banner photo"}
              </span>
            </button>
          )}

          <input
            ref={bannerInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleBannerFile}
          />
        </div>

        <div className="px-6 pb-6">
          {/* ── Avatar + action buttons row ── */}
          <div className="flex items-end justify-between -mt-10 mb-5 gap-3">
            {/* Avatar */}
            <div className="shrink-0 relative">
              <div className="w-20 h-20 rounded-2xl overflow-hidden border-4 border-parchment shadow-warm-md bg-gold-bg">
                {form.profileImg ? (
                  <img
                    src={form.profileImg}
                    alt={user?.firstName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-display text-2xl font-bold text-gold">
                    {initials}
                  </div>
                )}

                {/* Camera overlay — edit mode */}
                {editing && !uploadingAvatar && (
                  <button
                    onClick={() => avatarInputRef.current?.click()}
                    className="absolute inset-0 flex flex-col items-center justify-center gap-0.5 bg-ink/50 hover:bg-ink/65 transition-colors cursor-pointer rounded-[14px]"
                    title="Change profile photo"
                  >
                    <Camera size={17} className="text-parchment" />
                    <span className="font-body text-[9px] text-parchment font-medium leading-none">
                      Change
                    </span>
                  </button>
                )}

                {/* Upload spinner overlay */}
                {editing && uploadingAvatar && (
                  <div className="absolute inset-0 flex items-center justify-center bg-ink/50 rounded-[14px]">
                    <Loader2
                      size={18}
                      className="text-parchment animate-spin"
                    />
                  </div>
                )}
              </div>

              <input
                ref={avatarInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleAvatarFile}
              />
            </div>

            {/* Save / Cancel  or  Edit button */}
            {editing ? (
              <div className="flex items-center gap-2 self-start mt-11">
                <button
                  onClick={() => updateMutation.mutate()}
                  disabled={!canSave || updateMutation.isPending}
                  className="inline-flex items-center gap-1.5 font-body text-sm font-medium bg-ink text-parchment px-4 py-1.5 rounded-lg hover:bg-ink-medium disabled:opacity-50 transition-all"
                >
                  {updateMutation.isPending ? (
                    <span className="w-3.5 h-3.5 border-2 border-parchment/30 border-t-parchment rounded-full animate-spin" />
                  ) : (
                    <Check size={13} />
                  )}
                  Save changes
                </button>
                <button
                  onClick={cancelEdit}
                  className="p-1.5 text-ink-ghost hover:text-ink border border-parchment-dark rounded-lg transition-colors"
                  title="Cancel"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setEditing(true)}
                className="self-start mt-11 inline-flex items-center gap-1.5 font-body text-sm text-ink-faint border border-parchment-dark px-3.5 py-1.5 rounded-lg hover:bg-parchment-deep hover:text-ink transition-all"
              >
                <Pencil size={12} /> Edit profile
              </button>
            )}
          </div>

          {/* ── Name / username / bio — view or edit ── */}
          {editing ? (
            <div className="space-y-4">
              {/* Name row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-body text-xs font-medium text-ink-faint mb-1.5">
                    First name
                  </label>
                  <input
                    value={form.firstName}
                    onChange={(e) =>
                      setForm({ ...form, firstName: e.target.value })
                    }
                    className={inputCls}
                    placeholder="Ada"
                  />
                </div>
                <div>
                  <label className="block font-body text-xs font-medium text-ink-faint mb-1.5">
                    Last name
                  </label>
                  <input
                    value={form.lastName}
                    onChange={(e) =>
                      setForm({ ...form, lastName: e.target.value })
                    }
                    className={inputCls}
                    placeholder="Lovelace"
                  />
                </div>
              </div>

              {/* Username */}
              <div>
                <label className="block font-body text-xs font-medium text-ink-faint mb-1.5">
                  Username
                </label>
                <div className="relative">
                  {/* @ prefix */}
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-ghost pointer-events-none">
                    <AtSign size={14} />
                  </span>
                  <input
                    value={form.username}
                    onChange={(e) => handleUsernameChange(e.target.value)}
                    className={[
                      inputCls,
                      "pl-9 pr-9",
                      usernameBorder[usernameState],
                      usernameState === "taken" || usernameState === "invalid"
                        ? "focus:border-red-400 focus:ring-red-100"
                        : usernameState === "available"
                          ? "focus:border-emerald-400 focus:ring-emerald-100"
                          : "",
                    ].join(" ")}
                    placeholder="your_username"
                    maxLength={30}
                    spellCheck={false}
                    autoCapitalize="none"
                    autoCorrect="off"
                  />
                  {/* Status icon */}
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <UsernameStatusIcon />
                  </span>
                </div>
                {/* Hint text */}
                {usernameState !== "idle" && (
                  <p
                    className={[
                      "font-body text-[11px] mt-1.5",
                      usernameState === "available"
                        ? "text-emerald-600"
                        : usernameState === "taken" ||
                            usernameState === "invalid"
                          ? "text-red-500"
                          : "text-ink-ghost",
                    ].join(" ")}
                  >
                    {usernameHint[usernameState]}
                  </p>
                )}
              </div>

              {/* Bio */}
              <div>
                <label className="block font-body text-xs font-medium text-ink-faint mb-1.5">
                  Bio
                </label>
                <textarea
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  rows={3}
                  maxLength={300}
                  placeholder="Tell the community about yourself and your writing…"
                  className={`${inputCls} resize-none`}
                />
                <p className="font-body text-[11px] text-ink-ghost mt-1">
                  {form.bio.length}/300
                </p>
              </div>

              {/* Remove banner */}
              {form.bannerImg && (
                <button
                  type="button"
                  onClick={() => setForm({ ...form, bannerImg: "" })}
                  className="font-body text-xs text-red-500 hover:text-red-600 transition-colors"
                >
                  Remove banner image
                </button>
              )}
            </div>
          ) : (
            /* ── View mode ── */
            <div>
              <h1 className="font-display text-2xl font-bold text-ink tracking-tight">
                {user?.firstName} {user?.lastName}
              </h1>
              <p className="font-body text-sm text-ink-ghost mt-0.5 flex items-center gap-1">
                <AtSign size={12} className="opacity-60" />
                {user?.username ?? user?.email?.split("@")[0]}
              </p>
              {user?.bio ? (
                <p className="font-body text-sm text-ink-faint mt-3 leading-relaxed max-w-lg">
                  {user.bio}
                </p>
              ) : (
                <p className="font-body text-sm text-ink-ghost mt-3 italic">
                  No bio yet.{" "}
                  <button
                    onClick={() => setEditing(true)}
                    className="text-gold hover:underline not-italic"
                  >
                    Add one
                  </button>
                </p>
              )}
              {user?.createdAt && (
                <p className="font-body text-xs text-ink-ghost mt-3">
                  Writing since {fmtLong(user.createdAt)}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-4 gap-3 mb-8">
        {[
          { label: "Posts", value: myPosts.length, icon: FileText },
          { label: "Views", value: totalViews.toLocaleString(), icon: Eye },
          {
            label: "Reactions",
            value: totalReactions.toLocaleString(),
            icon: Heart,
          },
          {
            label: "Comments",
            value: totalComments.toLocaleString(),
            icon: MessageCircle,
          },
        ].map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="bg-parchment border border-parchment-dark rounded-2xl p-4 text-center"
          >
            <Icon size={14} className="text-gold mx-auto mb-1.5" />
            <p className="font-display text-xl font-bold text-ink tracking-tight leading-none">
              {value}
            </p>
            <p className="font-body text-[11px] text-ink-ghost mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* ── Posts list ── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg font-semibold text-ink">
            Published posts
          </h2>
          <Link
            href="/drafts"
            className="font-body text-xs text-gold hover:underline"
          >
            View drafts →
          </Link>
        </div>

        {myPosts.length === 0 ? (
          <div className="text-center py-12 bg-parchment border border-parchment-dark rounded-2xl">
            <FileText size={32} className="mx-auto text-parchment-dark mb-3" />
            <p className="font-body text-sm text-ink-ghost mb-3">
              No published posts yet.
            </p>
            <Link
              href="/new"
              className="font-body text-sm text-gold hover:underline"
            >
              Write your first post →
            </Link>
          </div>
        ) : (
          <div className="bg-parchment border border-parchment-dark rounded-2xl divide-y divide-parchment-dark overflow-hidden">
            {allPosts.slice(0, 10).map((post) => (
              <Link
                key={post.id}
                href={`/posts/${post.slug}`}
                className="group flex items-center justify-between px-5 py-3.5 hover:bg-parchment-deep transition-colors gap-4"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-body text-sm font-medium text-ink group-hover:text-gold transition-colors line-clamp-1">
                    {post.title}
                  </p>
                  <p className="font-body text-[11px] text-ink-ghost mt-0.5">
                    {post._count?.comments ?? 0} comments ·{" "}
                    {post._count?.reactions ?? 0} reactions
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={[
                      "font-body text-[11px] font-medium px-2.5 py-0.5 rounded-full",
                      post.status === "PUBLISHED"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : post.status === "ARCHIVED"
                          ? "bg-parchment-deep text-ink-ghost border border-parchment-dark"
                          : "bg-amber-50 text-amber-700 border border-amber-200",
                    ].join(" ")}
                  >
                    {post.status}
                  </span>
                  <span className="font-body text-xs text-ink-ghost">
                    {(post.viewCount ?? 0).toLocaleString()} views
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
