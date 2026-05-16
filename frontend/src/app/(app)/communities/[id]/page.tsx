"use client";
import { useParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { PostCard } from "@/components/post/PostCard";
import {
  Users,
  Lock,
  Globe,
  UserPlus,
  UserMinus,
  Shield,
  X,
  BarChart2,
  LucideIcon,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { fmt } from "@/lib/format";
import { Pagination } from "@/lib/Pagination";
import { useCommunityDetail } from "@/hooks/useCommunityDetail";
import { CommunitySettings } from "@/components/Community/CommunitySettings";
import { CommunityAnalytics } from "@/components/Community/CommunityAnalytics";
import { Tab } from "@/lib/type";

/* ── MAIN PAGE ── */
export default function CommunityDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useAuth();
  const {
    posts,
    postsLoading,
    community,
    communityLoading,
    isAdmin,
    isMember,
    pagination,
    members,
    analytics,
    joinMutation,
    leaveMutation,
    removeMutation,
    pinMutation,
    roleChangeMutation,
    tab,
    setTab,
    removeModal,
    setRemoveModal,
    page,
    setPage,
    removeReason,
    setRemoveReason,
    queryClient,
  } = useCommunityDetail(id);

  const TABS: {
    id: Tab;
    label: string;
    icon?: LucideIcon;
    adminOnly?: boolean;
  }[] = [
    { id: "posts", label: "Posts" },
    { id: "members", label: "Members", icon: Users },
    { id: "about", label: "About" },
    ...(isAdmin
      ? [
          {
            id: "analytics" as Tab,
            label: "Analytics",
            icon: BarChart2,
            adminOnly: true,
          },
          {
            id: "settings" as Tab,
            label: "Settings",
            icon: Settings,
            adminOnly: true,
          },
        ]
      : []),
  ];
  console.log("isAdmin", isAdmin);
  const visibleTab = TABS.filter((t) => isAdmin || !t.adminOnly);
  console.log("Visible tabs", visibleTab);

  /* ── Loading ── */
  if (communityLoading)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-7 h-7 border-2 border-parchment-dark border-t-gold rounded-full animate-spin" />
      </div>
    );

  if (!community)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="font-body text-sm text-ink-faint">Community not found.</p>
      </div>
    );

  /* ── Private locked view ── */
  if (community.isPrivate && !isMember) {
    return (
      <div className="max-w-md mx-auto px-6 py-24 text-center">
        <div className="w-16 h-16 rounded-2xl bg-gold-bg border border-gold-pale flex items-center justify-center mx-auto mb-5">
          <Lock size={26} className="text-gold" />
        </div>
        <h1 className="font-display text-2xl font-bold text-ink mb-2">
          {community.name}
        </h1>
        <p className="font-body text-sm text-ink-faint mb-2 leading-relaxed">
          {community.description}
        </p>
        <p className="font-body text-xs text-ink-ghost mb-6">
          This is a private community. Join to see posts and members.
        </p>
        <div className="flex items-center justify-center gap-4 font-body text-xs text-ink-ghost mb-8">
          <span>{community._count.memberships} members</span>
          <span className="text-parchment-dark">·</span>
          <span>{community._count.posts} posts</span>
        </div>
        {isAuthenticated ? (
          <button
            onClick={() => joinMutation.mutate()}
            disabled={joinMutation.isPending}
            className="inline-flex items-center gap-2 font-body text-sm font-medium bg-ink text-parchment px-6 py-2.5 rounded-lg hover:bg-ink-medium disabled:opacity-50 transition-all mx-auto"
          >
            {joinMutation.isPending ? (
              <span className="w-3.5 h-3.5 border-2 border-parchment/30 border-t-parchment rounded-full animate-spin" />
            ) : (
              <UserPlus size={14} />
            )}
            Join community
          </button>
        ) : (
          <Link
            href="/auth"
            className="font-body text-sm text-gold hover:underline"
          >
            Sign in to join
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      {/* Cover + header */}
      <div className="relative h-44 rounded-2xl overflow-hidden mb-6">
        {community.coverImage ? (
          <img
            src={community.coverImage}
            alt=""
            className="w-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-ink" />
        )}
        {/* overlay */}
        <div className="absolute inset-0 bg-ink/50" />
        {/* ruled lines texture */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg,transparent,transparent 20px,rgba(184,125,44,0.08) 20px,rgba(184,125,44,0.08) 21px)",
          }}
        />

        {/* Community identity */}
        <div className="absolute bottom-5 left-6 flex items-end gap-4">
          <div className="w-14 h-14 rounded-xl bg-gold-bg border-2 border-parchment flex items-center justify-center overflow-hidden shadow-warm-md shrink-0">
            {community.avatar ? (
              <img
                src={community.avatar}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              <Users size={22} className="text-gold" />
            )}
          </div>
          <div className="pb-0.5">
            <div className="flex items-center gap-2">
              <h1 className="font-display text-2xl font-bold text-parchment">
                {community.name}
              </h1>
              {community.isPrivate ? (
                <Lock size={13} className="text-parchment/70" />
              ) : (
                <Globe size={13} className="text-parchment/70" />
              )}
            </div>
            <p className="font-body text-sm text-parchment/65">
              {community._count.memberships} members · {community._count.posts}{" "}
              posts
            </p>
          </div>
        </div>

        {/* Join / Leave button */}
        <div className="absolute bottom-5 right-6">
          {isAuthenticated &&
            !isAdmin &&
            (isMember ? (
              <button
                onClick={() => leaveMutation.mutate()}
                disabled={leaveMutation.isPending}
                className="inline-flex items-center gap-1.5 font-body text-sm text-parchment bg-parchment/15 backdrop-blur-sm border border-parchment/25 px-4 py-2 rounded-lg hover:bg-parchment/25 disabled:opacity-50 transition-colors"
              >
                <UserMinus size={13} /> Leave
              </button>
            ) : (
              <button
                onClick={() => joinMutation.mutate()}
                disabled={joinMutation.isPending}
                className="inline-flex items-center gap-1.5 font-body text-sm font-medium bg-parchment text-ink px-4 py-2 rounded-lg hover:bg-parchment-deep disabled:opacity-50 transition-colors"
              >
                <UserPlus size={13} /> Join
              </button>
            ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-0.5 border-b border-parchment-dark mb-8 overflow-x-auto scrollbar-none">
        {visibleTab.map(({ id: tabId, label, icon: Icon }) => (
          <button
            key={tabId}
            onClick={() => setTab(tabId)}
            className={cn(
              "inline-flex items-center gap-1.5 px-4 py-2.5 font-body text-sm font-medium border-b-2 -mb-px transition-colors whitespace-nowrap",
              tab === tabId
                ? "border-gold text-gold"
                : "border-transparent text-ink-faint hover:text-ink",
            )}
          >
            {Icon && <Icon size={13} />}
            {label}
          </button>
        ))}
      </div>

      {/* ── Posts tab ── */}
      {tab === "posts" && (
        <div>
          {postsLoading ? (
            <div className="flex justify-center py-16">
              <div className="w-7 h-7 border-2 border-parchment-dark border-t-gold rounded-full animate-spin" />
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-body text-sm text-ink-ghost mb-3">
                No posts in this community yet.
              </p>
              {isMember && (
                <Link
                  href="/new"
                  className="font-body text-sm text-gold hover:underline"
                >
                  Write the first post →
                </Link>
              )}
            </div>
          ) : (
            <>
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  showAdminActions={isAdmin}
                  onRemove={
                    isAdmin
                      ? (postId) => {
                          const p = posts.find((x) => x.id === postId);
                          setRemoveModal({ postId, title: p?.title ?? "" });
                        }
                      : undefined
                  }
                  onPin={
                    isAdmin ? (postId) => pinMutation.mutate(postId) : undefined
                  }
                />
              ))}
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
      )}

      {/* ── Members tab ── */}
      {tab === "members" && (
        <div className="space-y-2.5">
          {members?.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between bg-parchment border border-parchment-dark rounded-2xl px-5 py-3.5 hover:border-gold-pale/60 transition-colors"
            >
              <Link
                href={`/profile/${member.id}`}
                className="flex items-center gap-3"
              >
                <div className="w-9 h-9 rounded-full bg-gold-bg border border-gold-pale flex items-center justify-center font-display text-xs font-bold text-gold shrink-0">
                  {member.username[0].toUpperCase()}
                </div>
                <div>
                  <p className="font-display text-sm font-semibold text-ink hover:text-gold transition-colors">
                    {member.username}
                  </p>
                  <p className="font-body text-xs text-ink-ghost">
                    Joined {fmt(member.joinedAt)}
                  </p>
                </div>
              </Link>

              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "font-body text-[11px] font-medium px-2.5 py-1 rounded-full",
                    member.role === "ADMIN"
                      ? "bg-gold-bg text-gold border border-gold-pale"
                      : member.role === "CURATED_WRITER"
                        ? "bg-parchment-deep text-ink-faint border border-parchment-dark"
                        : "bg-parchment-deep text-ink-ghost border border-parchment-dark",
                  )}
                >
                  {member.role === "CURATED_WRITER" ? "Writer" : member.role}
                </span>

                {isAdmin && member.id !== user?.id && (
                  <select
                    value={member.role}
                    onChange={(e) =>
                      roleChangeMutation.mutate({
                        userId: member.id,
                        newRole: e.target.value,
                      })
                    }
                    className="font-body text-xs border border-parchment-dark rounded-lg px-2 py-1 bg-parchment text-ink-faint outline-none focus:border-gold-pale transition-colors cursor-pointer"
                  >
                    <option value="MEMBER">Member</option>
                    <option value="CURATED_WRITER">Writer</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── About tab ── */}
      {tab === "about" && (
        <div className="max-w-2xl space-y-4">
          <div className="bg-parchment border border-parchment-dark rounded-2xl p-6">
            <h3 className="font-display text-[1.0625rem] font-semibold text-ink mb-3">
              About this community
            </h3>
            <p className="font-body text-sm text-ink-faint leading-relaxed">
              {community.description || "No description provided."}
            </p>
          </div>
          {community.rules && (
            <div className="bg-parchment border border-parchment-dark rounded-2xl p-6">
              <h3 className="font-display text-[1.0625rem] font-semibold text-ink mb-3 flex items-center gap-2">
                <Shield size={15} className="text-gold" />
                Community rules
              </h3>
              <p className="font-body text-sm text-ink-faint leading-relaxed whitespace-pre-line">
                {community.rules}
              </p>
            </div>
          )}
          <div className="bg-parchment border border-parchment-dark rounded-2xl p-6">
            <h3 className="font-display text-[1.0625rem] font-semibold text-ink mb-4">
              Stats
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Members", value: community._count.memberships },
                { label: "Posts", value: community._count.posts },
                {
                  label: "Visibility",
                  value: community.isPrivate ? "Private" : "Public",
                },
              ].map(({ label, value }) => (
                <div key={label} className="bg-parchment-deep rounded-xl p-3">
                  <p className="font-display text-lg font-bold text-ink leading-none">
                    {value}
                  </p>
                  <p className="font-body text-xs text-ink-ghost mt-0.5">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Analytics tab ── */}
      {tab === "analytics" && isAdmin && analytics && (
        <CommunityAnalytics analytics={analytics} />
      )}

      {/* ── Settings tab ── */}
      {tab === "settings" && isAdmin && (
        <CommunitySettings
          community={community}
          onSaved={() =>
            queryClient.invalidateQueries({ queryKey: ["community", id] })
          }
          id={id}
        />
      )}

      {/* ── Remove post modal ── */}
      {removeModal && (
        <div className="fixed inset-0 bg-ink/50 flex items-center justify-center z-50 p-4">
          <div className="bg-parchment rounded-2xl p-6 w-full max-w-md shadow-warm-lg border border-parchment-dark">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-lg font-semibold text-ink">
                Remove post
              </h3>
              <button
                onClick={() => setRemoveModal(null)}
                className="text-ink-ghost hover:text-ink transition-colors"
              >
                <X size={17} />
              </button>
            </div>
            <p className="font-body text-sm text-ink-faint mb-4 leading-relaxed">
              Removing{" "}
              <strong className="text-ink">
                &quot;{removeModal.title}&quot;
              </strong>
              . The author will be notified.
            </p>
            <textarea
              value={removeReason}
              onChange={(e) => setRemoveReason(e.target.value)}
              placeholder="Reason for removal (required)…"
              rows={3}
              className="w-full px-3.5 py-2.5 font-body text-sm border border-parchment-dark rounded-xl bg-parchment text-ink placeholder-ink-ghost outline-none focus:border-gold-pale focus:ring-2 focus:ring-gold/10 resize-none transition-all mb-4"
            />
            <div className="flex items-center justify-end gap-2.5">
              <button
                onClick={() => setRemoveModal(null)}
                className="font-body text-sm text-ink-faint hover:text-ink transition-colors px-3"
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  removeMutation.mutate({
                    postId: removeModal.postId,
                    reason: removeReason,
                  })
                }
                disabled={!removeReason.trim() || removeMutation.isPending}
                className="inline-flex items-center gap-1.5 font-body text-sm font-medium bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                {removeMutation.isPending && (
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                )}
                Remove post
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
