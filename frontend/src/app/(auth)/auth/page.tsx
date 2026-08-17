"use client";

import { useState } from "react";
import { Mail, User } from "lucide-react";
import { DEFAULT_POST_LOGIN, useAuth } from "@/hooks/useAuth";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CrossOrnament } from "@/components/ui/CrossOrnament";
import { QUOTES } from "@/components/Auth/Quotes";
import { Field } from "@/components/Auth/Field";
import { PasswordField } from "@/components/Auth/PasswordField";
import { Suspense } from "react";

export default function AuthPageWrapper() {
  return (
    <Suspense>
      <AuthPage />
    </Suspense>
  );
}

function AuthPage() {
  const searchParams = useSearchParams();

  /*
   * getRedirectPath
   * If middleware added a ?from= param (e.g. user tried to visit
   * /communities/xyz while logged out), honour it so they land
   * on the page they originally wanted.
   * Otherwise fall back to the feed (/posts).
   * Never redirect back to /auth itself or public marketing pages.
   */
  const getRedirectPath = (): string => {
    try {
      const from = searchParams?.get("from");
      if (
        from &&
        from !== "/auth" &&
        from !== "/" &&
        from !== "/features" &&
        from !== "/about" &&
        from.startsWith("/")
      ) {
        return from;
      }
    } catch {
      // searchParams not available (SSR context) — fall through
    }
    return DEFAULT_POST_LOGIN;
  };
  const {
    isAuthenticated,
    loginMutation,
    registerMutation,
    isPending,
    error,
    handleLogin,
    handleRegister,
  } = useAuth(getRedirectPath);
  const [showPassword, setShowPassword] = useState(false);

  // Set initial tab from ?tab=signup query param (used by landing page CTAs)
  const initialTab = searchParams?.get("tab") === "signup" ? "signup" : "login";
  const [tab, setTab] = useState<"login" | "signup">(initialTab);

  const quoteInx = parseInt((Math.random() * QUOTES.length).toPrecision());
  const quote = QUOTES[quoteInx];

  // Don't flash the form while redirecting
  if (isAuthenticated) return null;

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      {/* ── LEFT: Illuminated panel ── */}
      <div className="hidden md:flex flex-col justify-between bg-ink px-12 py-14 relative overflow-hidden">
        <div aria-hidden className="absolute inset-0 bg-ruled opacity-100" />

        <div className="relative z-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-display text-lg font-semibold text-parchment mb-16"
          >
            <CrossOrnament className="w-5 h-5 text-gold-light" />
            EkklesiaHub
          </Link>

          <blockquote className="space-y-3">
            <p className="font-display text-2xl italic font-light text-parchment leading-[1.45] max-w-sm">
              &quot;{quote.text}&quot;
            </p>
            <footer className="font-body text-sm tracking-wide text-parchment/35">
              — {quote.ref}
            </footer>
          </blockquote>
        </div>

        <div aria-hidden className="relative z-10 space-y-2 opacity-10">
          {[80, 110, 65, 95, 75].map((w, i) => (
            <div key={i} className="h-px bg-parchment" style={{ width: w }} />
          ))}
        </div>
      </div>

      {/* ── RIGHT: Form ── */}
      <div className="flex items-center justify-center px-8 py-14 bg-parchment">
        <div className="w-full max-w-sm space-y-6">
          {/* Mobile logo */}
          <Link
            href="/"
            className="md:hidden inline-flex items-center gap-2 font-display text-lg font-semibold text-ink mb-2"
          >
            <CrossOrnament className="w-5 h-5 text-gold" />
            EkklesiaHub
          </Link>

          <div>
            <h1 className="font-display text-3xl font-bold text-ink tracking-tight">
              {tab === "login" ? "Welcome back" : "Begin writing"}
            </h1>
            <p className="font-body text-sm text-ink-faint mt-1">
              {tab === "login"
                ? "Sign in to your account to continue."
                : "Join thousands of faith-driven writers."}
            </p>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-parchment-dark">
            {(["login", "signup"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={[
                  "flex-1 py-2.5 font-body text-sm transition-all border-b-2 -mb-px",
                  tab === t
                    ? "text-gold border-gold font-medium"
                    : "text-ink-ghost border-transparent hover:text-ink-faint",
                ].join(" ")}
              >
                {t === "login" ? "Sign In" : "Create Account"}
              </button>
            ))}
          </div>

          {/* Error */}
          {error && (
            <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg font-body text-sm">
              {error}
            </div>
          )}

          {/* Login form */}
          {tab === "login" ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <Field
                id="email"
                name="email"
                type="email"
                label="Email address"
                placeholder="you@example.com"
                icon={<Mail size={14} />}
              />
              <PasswordField
                id="password"
                name="password"
                label="Password"
                placeholder="Enter your password"
                show={showPassword}
                onToggle={() => setShowPassword(!showPassword)}
              />
              <button
                type="submit"
                disabled={isPending}
                className="w-full font-body text-sm font-medium bg-ink text-parchment py-2.5 rounded-lg hover:bg-ink-medium disabled:opacity-50 transition-all mt-1 flex items-center justify-center gap-2"
              >
                {loginMutation.isPending && (
                  <span className="w-4 h-4 border-2 border-parchment/30 border-t-parchment rounded-full animate-spin" />
                )}
                Sign In
              </button>
              <p className="font-body text-xs text-ink-ghost text-center">
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  onClick={() => setTab("signup")}
                  className="text-gold hover:underline"
                >
                  Create one
                </button>
              </p>
            </form>
          ) : (
            /* Register form */
            <form onSubmit={handleRegister} className="space-y-4">
              <Field
                id="name"
                name="name"
                type="text"
                label="Full name"
                placeholder="Ada Lovelace"
                icon={<User size={14} />}
              />
              <Field
                id="email"
                name="email"
                type="email"
                label="Email address"
                placeholder="you@example.com"
                icon={<Mail size={14} />}
              />
              <PasswordField
                id="password"
                name="password"
                label="Password"
                placeholder="Min 8 chars with number & symbol"
                show={showPassword}
                onToggle={() => setShowPassword(!showPassword)}
              />
              <button
                type="submit"
                disabled={isPending}
                className="w-full font-body text-sm font-medium bg-ink text-parchment py-2.5 rounded-lg hover:bg-ink-medium disabled:opacity-50 transition-all mt-1 flex items-center justify-center gap-2"
              >
                {registerMutation.isPending && (
                  <span className="w-4 h-4 border-2 border-parchment/30 border-t-parchment rounded-full animate-spin" />
                )}
                Create Account
              </button>
              <p className="font-body text-xs text-ink-ghost text-center">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setTab("login")}
                  className="text-gold hover:underline"
                >
                  Sign in
                </button>
              </p>
            </form>
          )}

          <p className="font-body text-xs text-ink-ghost text-center leading-relaxed">
            By continuing, you agree to our{" "}
            <Link href="/terms" className="text-gold hover:underline">
              Terms
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-gold hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
