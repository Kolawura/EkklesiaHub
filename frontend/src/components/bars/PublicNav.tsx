"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, ArrowRight } from "lucide-react";
import { CrossOrnament } from "@/components/ui/CrossOrnament";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Features", href: "/features" },
  { label: "Communities", href: "/communities" },
  { label: "About", href: "/about" },
];

export function PublicNav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-parchment/95 backdrop-blur-sm border-b border-parchment-dark shadow-warm-sm py-3"
          : "py-5",
      )}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center gap-6">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-display text-xl font-semibold text-ink shrink-0 tracking-tight"
        >
          <CrossOrnament className="w-5 h-5 text-gold" />
          EkklesiaHub
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1 flex-1 justify-center">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="font-body text-sm text-ink-faint hover:text-ink hover:bg-parchment-deep px-3.5 py-1.5 rounded-md transition-all"
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Desktop CTAs — swap based on auth state */}
        <div className="hidden md:flex items-center gap-2 shrink-0">
          {isAuthenticated ? (
            <>
              <span className="font-body text-sm text-ink-faint hidden lg:block">
                Hi, {user?.firstName}
              </span>
              <Link
                href="/posts"
                className="inline-flex items-center gap-1.5 font-body text-sm font-medium bg-ink text-parchment px-4 py-1.5 rounded-md hover:bg-ink-medium transition-all hover:-translate-y-px"
              >
                Go to feed <ArrowRight size={14} />
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/auth"
                className="font-body text-sm text-ink-faint hover:text-ink px-3.5 py-1.5 rounded-md transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="/auth?tab=signup"
                className="font-body text-sm font-medium bg-ink text-parchment px-4 py-1.5 rounded-md hover:bg-ink-medium transition-all hover:-translate-y-px shadow-warm-sm"
              >
                Start writing free
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden ml-auto text-ink-faint hover:text-ink transition-colors p-1"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-parchment border-t border-parchment-dark px-6 py-4 space-y-1">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="block font-body text-sm text-ink-faint hover:text-ink py-2 transition-colors"
            >
              {l.label}
            </Link>
          ))}
          <div className="pt-3 flex flex-col gap-2 border-t border-parchment-dark mt-2">
            {isAuthenticated ? (
              <Link
                href="/posts"
                className="font-body text-sm font-medium text-center bg-ink text-parchment rounded-md py-2 hover:bg-ink-medium transition-colors"
              >
                Go to feed
              </Link>
            ) : (
              <>
                <Link
                  href="/auth"
                  className="font-body text-sm text-center text-ink-faint border border-parchment-dark rounded-md py-2 hover:bg-parchment-deep transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  href="/auth?tab=signup"
                  className="font-body text-sm font-medium text-center bg-ink text-parchment rounded-md py-2 hover:bg-ink-medium transition-colors"
                >
                  Start writing free
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
