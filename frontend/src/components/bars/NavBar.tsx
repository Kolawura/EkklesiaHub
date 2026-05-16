"use client";

import { useState, useRef, useEffect } from "react";
import { Search, Sun, Moon, X } from "lucide-react";
import { NotificationBell } from "@/components/ui/NotificationPanel";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";

export default function NavBar() {
  const { resolvedTheme, setTheme } = useTheme();
  const { user } = useAuth();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [mounted, setMounted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Avoid hydration mismatch on the theme toggle
  useEffect(() => setMounted(true), []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    router.push(`/posts?search=${encodeURIComponent(q)}`);
    setQuery("");
  };

  const initials = user
    ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase()
    : null;

  return (
    <header className="h-13 shrink-0 bg-parchment border-b border-parchment-dark flex items-center px-5 gap-4 z-10">
      {/* Search */}
      <form onSubmit={handleSearch} className="flex-1 max-w-xs">
        <div className="relative">
          <Search
            size={13}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-ghost pointer-events-none"
          />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search posts…"
            className="w-full pl-8 pr-7 py-1.5 font-body text-sm bg-parchment-deep border border-parchment-dark rounded-lg text-ink placeholder-ink-ghost outline-none focus:border-gold-pale focus:ring-2 focus:ring-gold/10 transition-all"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-ghost hover:text-ink-faint transition-colors"
            >
              <X size={11} />
            </button>
          )}
        </div>
      </form>

      <div className="ml-auto flex items-center gap-1">
        {/* Theme toggle */}
        {mounted && (
          <button
            onClick={() =>
              setTheme(resolvedTheme === "dark" ? "light" : "dark")
            }
            className="p-1.5 text-ink-ghost hover:text-ink hover:bg-parchment-deep rounded-lg transition-colors"
            title="Toggle theme"
          >
            {resolvedTheme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
          </button>
        )}

        {/* Notifications */}
        <NotificationBell />

        {/* User avatar — shows profile photo if set, otherwise initials */}
        {user && (
          <Link href="/profile" className="ml-1">
            {user.profileImg ? (
              <img
                src={user.profileImg}
                alt={user.firstName}
                className="w-7 h-7 rounded-full object-cover border border-gold-pale hover:opacity-80 transition-opacity cursor-pointer"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-gold-bg border border-gold-pale flex items-center justify-center font-display text-[10px] font-bold text-gold hover:opacity-80 transition-opacity cursor-pointer">
                {initials}
              </div>
            )}
          </Link>
        )}
      </div>
    </header>
  );
}
