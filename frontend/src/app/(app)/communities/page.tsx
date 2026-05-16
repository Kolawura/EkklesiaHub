"use client";
import { useCommunity } from "@/hooks/useCommunity";
import { Users, Lock, Globe, PlusCircle, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function CommunitiesPage() {
  const {
    communities,
    showCreate,
    setShowCreate,
    search,
    setSearch,
    form,
    setForm,
    isLoading,
    joinMutation,
    createMutation,
  } = useCommunity();

  return (
    <div className="max-w-5xl mx-auto px-6 py-9">
      {/* Header */}
      <div className="flex items-start justify-between mb-7 gap-4">
        <div>
          <h1 className="font-display text-[2rem] font-bold text-ink tracking-tight">
            Communities
          </h1>
          <p className="font-body text-sm text-ink-faint mt-1">
            Join focused spaces for spiritual writing, theology, and faith
            discussion
          </p>
        </div>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="shrink-0 inline-flex items-center gap-1.5 font-body text-sm font-medium bg-ink text-parchment px-4 py-2 rounded-lg hover:bg-ink-medium transition-all hover:-translate-y-px"
        >
          <PlusCircle size={13} /> New community
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search
          size={13}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-ghost pointer-events-none"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search communities…"
          className="w-full pl-9 pr-4 py-2.5 font-body text-sm bg-parchment border border-parchment-dark rounded-xl text-ink placeholder-ink-ghost outline-none focus:border-gold-pale focus:ring-2 focus:ring-gold/10 transition-all"
        />
      </div>

      {/* Create form */}
      {showCreate && (
        <div className="bg-parchment border border-parchment-dark rounded-2xl p-6 mb-7 space-y-4">
          <h2 className="font-display text-lg font-semibold text-ink">
            Create a community
          </h2>

          <div className="space-y-1.5">
            <label className="block font-body text-sm font-medium text-ink-light">
              Name
            </label>
            <input
              type="text"
              placeholder="e.g. Reformed Theology"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3.5 py-2.5 font-body text-sm bg-parchment border border-parchment-dark rounded-lg text-ink placeholder-ink-ghost outline-none focus:border-gold-pale focus:ring-2 focus:ring-gold/10 transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block font-body text-sm font-medium text-ink-light">
              Description
            </label>
            <textarea
              placeholder="What is this community about?"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              rows={3}
              className="w-full px-3.5 py-2.5 font-body text-sm bg-parchment border border-parchment-dark rounded-lg text-ink placeholder-ink-ghost outline-none focus:border-gold-pale focus:ring-2 focus:ring-gold/10 transition-all resize-none"
            />
          </div>

          <div className="flex items-center justify-between py-2 border-t border-parchment-dark">
            <div>
              <p className="font-body text-sm font-medium text-ink">
                Make private
              </p>
              <p className="font-body text-xs text-ink-ghost">
                Only members can see posts
              </p>
            </div>
            <button
              onClick={() => setForm({ ...form, isPrivate: !form.isPrivate })}
              className={[
                "relative w-10 h-5.5 rounded-full transition-colors",
                form.isPrivate ? "bg-gold" : "bg-parchment-dark",
              ].join(" ")}
            >
              <span
                className={[
                  "absolute top-0.5 left-0.5 w-4.5 h-4.5 rounded-full bg-parchment shadow-sm transition-transform",
                  form.isPrivate ? "translate-x-4.5" : "",
                ].join(" ")}
              />
            </button>
          </div>

          <div className="flex gap-2.5">
            <button
              onClick={() => createMutation.mutate()}
              disabled={!form.name.trim() || createMutation.isPending}
              className="inline-flex items-center gap-1.5 font-body text-sm font-medium bg-ink text-parchment px-4 py-2 rounded-lg hover:bg-ink-medium disabled:opacity-50 transition-all"
            >
              {createMutation.isPending && (
                <span className="w-3.5 h-3.5 border-2 border-parchment/30 border-t-parchment rounded-full animate-spin" />
              )}
              Create
            </button>
            <button
              onClick={() => setShowCreate(false)}
              className="font-body text-sm text-ink-faint hover:text-ink px-4 py-2 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center min-h-56">
          <div className="w-8 h-8 border-2 border-parchment-dark border-t-gold rounded-full animate-spin" />
        </div>
      ) : communities.length === 0 ? (
        <div className="text-center py-20 font-body text-sm text-ink-ghost">
          {search
            ? `No communities matching "${search}"`
            : "No communities yet. Create the first one!"}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {communities.map((c) => (
            <div
              key={c.id}
              className="group bg-parchment border border-parchment-dark rounded-2xl overflow-hidden hover:border-gold-pale hover:shadow-warm-md transition-all"
            >
              {/* Cover */}
              <div
                className="h-16 bg-parchment-dark"
                style={
                  c.coverImage
                    ? {
                        backgroundImage: `url(${c.coverImage})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }
                    : {
                        background:
                          "linear-gradient(135deg, var(--color-parchment-dark), var(--color-gold-bg))",
                      }
                }
              />

              <div className="p-4">
                <div className="flex items-start justify-between gap-3 mb-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-gold-bg border border-gold-pale flex items-center justify-center text-gold shrink-0 overflow-hidden">
                      {c.avatar ? (
                        <img
                          src={c.avatar}
                          alt=""
                          className="w-full object-cover"
                        />
                      ) : (
                        <Users size={15} />
                      )}
                    </div>
                    <Link
                      href={`/communities/${c.id}`}
                      className="font-display text-[0.9375rem] font-semibold text-ink hover:text-gold transition-colors flex items-center gap-1.5"
                    >
                      {c.name}
                      {c.isPrivate ? (
                        <Lock size={10} className="text-ink-ghost" />
                      ) : (
                        <Globe size={10} className="text-ink-ghost" />
                      )}
                    </Link>
                  </div>

                  {c.isMember ? (
                    <Link
                      href={`/communities/${c.id}`}
                      className="font-body text-[11px] font-medium px-2.5 py-1 bg-gold-bg text-gold border border-gold-pale rounded-full shrink-0"
                    >
                      {c.memberRole === "ADMIN"
                        ? "Admin"
                        : c.memberRole === "CURATED_WRITER"
                          ? "Writer"
                          : "Member"}
                    </Link>
                  ) : (
                    <button
                      onClick={() => joinMutation.mutate(c.id)}
                      disabled={joinMutation.isPending}
                      className="font-body text-[11px] font-medium px-2.5 py-1 bg-transparent text-gold border border-gold-pale rounded-full hover:bg-gold-bg transition-colors disabled:opacity-50 shrink-0"
                    >
                      Join
                    </button>
                  )}
                </div>

                <p className="font-body text-xs text-ink-faint leading-relaxed line-clamp-2 mb-2.5">
                  {c.description}
                </p>

                <div className="flex items-center gap-2 font-body text-[11px] text-ink-ghost">
                  <span>{c._count.memberships} members</span>
                  <span className="text-parchment-dark">·</span>
                  <span>{c._count.posts} posts</span>
                  {c.isPrivate && (
                    <span className="ml-auto flex items-center gap-0.5 text-gold">
                      <Lock size={9} /> Private
                    </span>
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
