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
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { CrossOrnament } from "@/components/ui/CrossOrnament";
import { cn } from "@/lib/utils";

const NAV = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  { id: "posts", label: "Posts", icon: FileText, href: "/posts" },
  { id: "drafts", label: "Drafts", icon: FileEdit, href: "/drafts" },
  {
    id: "communities",
    label: "Communities",
    icon: Users,
    href: "/communities",
  },
  { id: "bookmarks", label: "Bookmarks", icon: Bookmark, href: "/bookmarks" },
  { id: "analytics", label: "Analytics", icon: BarChart2, href: "/analytics" },
  { id: "settings", label: "Settings", icon: Settings, href: "/settings" },
];

export const SideBar = () => {
  const pathname = usePathname();
  const { user, logoutMutation } = useAuth();

  const initials = user
    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    : "?";

  return (
    <aside className="w-56 h-screen bg-parchment-deep border-r border-parchment-dark flex flex-col shrink-0">
      {/* Brand */}
      <div className="px-4 py-4 border-b border-parchment-dark">
        <Link
          href="/"
          className="flex items-center gap-2 font-display text-[1.0625rem] font-semibold text-ink tracking-tight"
        >
          <CrossOrnament className="w-4 h-4 text-gold" />
          EkklesiaHub
        </Link>
        <p className="font-body text-[10px] uppercase tracking-widest text-ink-ghost mt-0.5 pl-0.5">
          Writers Community
        </p>
      </div>

      {/* Write CTA */}
      <div className="px-2.5 pt-3 pb-1">
        <Link
          href="/new"
          className="flex items-center justify-center gap-1.5 w-full bg-ink text-parchment font-body text-xs font-medium py-2 rounded-lg hover:bg-ink-medium transition-colors"
        >
          <PenLine size={13} />
          New Article
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-2 space-y-0.5 overflow-y-auto">
        {NAV.map(({ id, label, icon: Icon, href }) => {
          const active =
            href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(href);
          return (
            <Link
              key={id}
              href={href}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-lg font-body text-sm transition-all",
                active
                  ? "bg-gold-bg text-gold border border-gold-pale font-medium"
                  : "text-ink-faint hover:bg-parchment-dark hover:text-ink",
              )}
            >
              <Icon size={14} className="shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="px-3 py-3 border-t border-parchment-dark">
        <div className="flex items-center gap-2.5">
          <Link href="/profile" className="shrink-0">
            <div className="w-8 h-8 rounded-full bg-gold-bg border border-gold-pale flex items-center justify-center font-display text-[10px] font-bold text-gold hover:opacity-80 transition-opacity cursor-pointer">
              {initials}
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
