"use client";

import { useState, useRef } from "react";
import { Search, X, Menu } from "lucide-react";
import { NotificationBell } from "@/components/ui/NotificationPanel";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { ThemeToggle } from "../ui/ThemeToggle";
import { useSidebarStore } from "@/store/useSideBarStore";
import { CrossOrnament } from "@/components/ui/CrossOrnament";
import { cn } from "@/lib/utils";

export default function NavBar() {
  const { user } = useAuth();
  const router = useRouter();
  const { mobileOpen, toggleMobile } = useSidebarStore();
  const [query, setQuery] = useState("");
  // < sm: search is an icon that expands over the bar, so the bar never overflows
  const [searchOpen, setSearchOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    router.push(`/posts?search=${encodeURIComponent(q)}`);
    setQuery("");
    setSearchOpen(false);
  };

  const openSearch = () => {
    setSearchOpen(true);
    // wait for the input to become visible before focusing it
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const initials = user
    ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase()
    : null;

  return (
    <header className="relative z-40 flex h-13 shrink-0 items-center gap-2 border-b border-parchment-dark bg-parchment px-3 pt-[env(safe-area-inset-top)] sm:gap-4 sm:px-5 lg:px-5">
      {/* Menu button — the sidebar is a drawer below lg */}
      <button
        type="button"
        onClick={toggleMobile}
        aria-label={mobileOpen ? "Close menu" : "Open menu"}
        aria-expanded={mobileOpen}
        aria-controls="app-sidebar"
        className="-ml-1 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-ink-faint transition-colors hover:bg-parchment-deep hover:text-ink lg:hidden"
      >
        <Menu size={20} />
      </button>

      {/* Compact brand — only while the sidebar (which carries it) is hidden */}
      <Link
        href="/dashboard"
        className={cn(
          "flex items-center gap-1.5 font-display text-base font-semibold tracking-tight text-ink lg:hidden",
          // on very small screens the brand text yields to search/actions
          searchOpen ? "hidden" : "max-[420px]:hidden",
        )}
      >
        <CrossOrnament className="h-4 w-4 text-gold" />
        <span className="hidden min-[520px]:inline">EkklesiaHub</span>
      </Link>

      {/* Search — full field from sm up; icon-toggle below sm */}
      <form
        onSubmit={handleSearch}
        role="search"
        className={cn(
          "min-w-0 flex-1 sm:max-w-xs",
          searchOpen ? "block" : "hidden sm:block",
        )}
      >
        <div className="relative">
          <Search
            size={14}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-ghost"
          />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onBlur={() => !query && setSearchOpen(false)}
            placeholder="Search posts…"
            aria-label="Search posts"
            className="w-full rounded-lg border border-parchment-dark bg-parchment-deep py-2 pl-8 pr-8 font-body text-sm text-ink outline-none transition-all placeholder-ink-ghost focus:border-gold-pale focus:ring-2 focus:ring-gold/10 sm:py-1.5"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded p-1 text-ink-ghost transition-colors hover:text-ink-faint"
            >
              <X size={12} />
            </button>
          )}
        </div>
      </form>

      <div
        className={cn(
          "ml-auto flex items-center gap-0.5 sm:gap-1",
          searchOpen && "hidden sm:flex",
        )}
      >
        <button
          type="button"
          onClick={openSearch}
          aria-label="Search posts"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-ink-ghost transition-colors hover:bg-parchment-deep hover:text-ink sm:hidden"
        >
          <Search size={17} />
        </button>

        {/* Theme picker */}
        <ThemeToggle />

        {/* Notifications */}
        <NotificationBell />

        {/* User avatar */}
        {user && (
          <Link href="/profile" className="ml-1" aria-label="Your profile">
            {user.profileImg ? (
              <img
                src={user.profileImg}
                alt={user.firstName}
                className="h-7 w-7 cursor-pointer rounded-full border border-gold-pale object-cover transition-opacity hover:opacity-80"
              />
            ) : (
              <div className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border border-gold-pale bg-gold-bg font-display text-[10px] font-bold text-gold transition-opacity hover:opacity-80">
                {initials}
              </div>
            )}
          </Link>
        )}
      </div>
    </header>
  );
}
