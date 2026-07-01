"use client";

import {
  LayoutDashboard,
  FileText,
  PenLine,
  FileEdit,
  Users,
  Bookmark,
  BarChart2,
  Settings,
  LogOut,
  BookMarked,
  Library,
  BookOpen,
  Rss,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { CrossOrnament } from "@/components/ui/CrossOrnament";
import { cn } from "@/lib/utils";

const NAV = [
  // Core
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  { id: "posts", label: "Posts", icon: FileText, href: "/posts" },
  { id: "drafts", label: "Drafts", icon: FileEdit, href: "/drafts" },

  // Separator — writing
  { id: "sep-writing", label: "Writing", separator: true },
  { id: "new", label: "Write", icon: PenLine, href: "/new" },
  { id: "series", label: "Series", icon: BookMarked, href: "/series" },

  // Separator — discover
  { id: "sep-discover", label: "Discover", separator: true },
  { id: "bible", label: "Bible", icon: BookOpen, href: "/bible" }, // ← ADD THIS
  { id: "feed", label: "Tag Feed", icon: Rss, href: "/feed" },
  {
    id: "communities",
    label: "Communities",
    icon: Users,
    href: "/communities",
  },

  // Separator — library
  { id: "sep-library", label: "Library", separator: true },
  {
    id: "reading-list",
    label: "Reading List",
    icon: Library,
    href: "/reading-list",
  },
  { id: "bookmarks", label: "Bookmarks", icon: Bookmark, href: "/bookmarks" },

  // Separator — account
  { id: "sep-account", label: "Account", separator: true },
  { id: "analytics", label: "Analytics", icon: BarChart2, href: "/analytics" },
  { id: "settings", label: "Settings", icon: Settings, href: "/settings" },
];

export const SideBar = () => {
  const pathname = usePathname();
  const { user, logoutMutation } = useAuth();

  const initials = user
    ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase()
    : "?";

  return (
    <aside className="w-56 h-screen bg-parchment-deep border-r border-parchment-dark flex flex-col shrink-0">
      {/* Brand */}
      <div className="px-4 py-4 border-b border-parchment-dark">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 font-display text-[1.0625rem] font-semibold text-ink tracking-tight"
        >
          <CrossOrnament className="w-4 h-4 text-gold" />
          EkklesiaHub
        </Link>
        <p className="font-body text-[10px] uppercase tracking-widest text-ink-ghost mt-0.5 pl-0.5">
          Writers Community
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-2 overflow-y-auto space-y-0">
        {NAV.map((item) => {
          // Section separator
          if ("separator" in item) {
            return (
              <div key={item.id} className="pt-3 pb-1 px-2">
                <p className="font-body text-[9px] uppercase tracking-widest text-ink-ghost font-medium">
                  {item.label}
                </p>
              </div>
            );
          }

          const Icon = item.icon!;
          const active =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href!);

          return (
            <Link
              key={item.id}
              href={item.href!}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-lg font-body text-sm transition-all",
                active
                  ? "bg-gold-bg text-gold border border-gold-pale font-medium"
                  : "text-ink-faint hover:bg-parchment-dark hover:text-ink",
              )}
            >
              <Icon size={14} className="shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="px-3 py-3 border-t border-parchment-dark">
        <div className="flex items-center gap-2.5">
          <Link href="/profile" className="shrink-0">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-gold-bg border border-gold-pale flex items-center justify-center font-display text-[10px] font-bold text-gold hover:opacity-80 transition-opacity cursor-pointer">
              {user?.profileImg ? (
                <img
                  src={user.profileImg}
                  alt={user.firstName}
                  className="w-full h-full object-cover"
                />
              ) : (
                initials
              )}
            </div>
          </Link>
          <div className="flex-1 min-w-0">
            <p className="font-body text-xs font-medium text-ink truncate">
              {user ? `${user.firstName} ${user.lastName}` : "Guest"}
            </p>
            <p className="font-body text-[10px] text-ink-ghost truncate">
              {user?.email ?? ""}
            </p>
          </div>
          <button
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
            title="Sign out"
            className="text-ink-ghost hover:text-red-700 transition-colors disabled:opacity-40 shrink-0"
          >
            <LogOut size={13} />
          </button>
        </div>
      </div>
    </aside>
  );
};
