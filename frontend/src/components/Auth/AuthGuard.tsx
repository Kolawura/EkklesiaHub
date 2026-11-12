"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "@/lib/auth";
import { useAuthStore } from "@/store/useAuthStore";
import { ApiResponse, User } from "@/lib/type";
import { CrossOrnament } from "@/components/ui/CrossOrnament";

/**
 * Wraps the whole authenticated app (see app/(app)/layout.tsx).
 *
 * proxy.ts can only check that a token cookie EXISTS. This guard asks the
 * server whether the session is actually valid (GET /auth/me) and:
 *   • renders a neutral splash — never the app chrome or page content —
 *     until the session is confirmed, so an expired/forged cookie can't
 *     flash the interface;
 *   • hydrates the auth store even when localStorage was cleared but the
 *     cookie is still good (previously the sidebar showed "Guest");
 *   • sends the visitor to /auth?from=<path> when the session is invalid.
 */
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const setUser = useAuthStore((s) => s.setUser);
  const clearUser = useAuthStore((s) => s.logout);
  const storeUser = useAuthStore((s) => s.user);

  // Deliberate sign-out: the store user goes from set → null (useAuth's
  // logout clears it, then clears the query cache and navigates to "/").
  // Without this, clearing the cache would make the query below refetch
  // /auth/me, get a 401, and the axios interceptor would yank the user to
  // /auth?from=… instead of letting the navigation to "/" finish.
  const wasSignedIn = useRef(false);
  if (storeUser) wasSignedIn.current = true;
  const signedOut = wasSignedIn.current && !storeUser;

  const { data, isError, isPending } = useQuery<ApiResponse<User>>({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
    // One quiet retry so a momentary network blip doesn't sign anyone out.
    // (A real 401 is also handled instantly by the axios interceptor.)
    retry: 1,
    retryDelay: 800,
    enabled: !signedOut,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true,
  });

  const verified = !!(data?.success && data?.data);
  const rejected = !signedOut && (isError || (!isPending && !verified));

  useEffect(() => {
    if (verified && data?.data) setUser(data.data);
  }, [verified, data, setUser]);

  useEffect(() => {
    if (!rejected) return;
    clearUser();
    const from = pathname + (typeof window !== "undefined" ? window.location.search : "");
    router.replace(`/auth?from=${encodeURIComponent(from)}`);
  }, [rejected, clearUser, router, pathname]);

  if (!verified) {
    return (
      <div
        className="flex h-dvh w-full items-center justify-center bg-parchment"
        role="status"
        aria-live="polite"
      >
        <div className="flex flex-col items-center gap-3 text-ink-ghost">
          <CrossOrnament className="h-6 w-6 text-gold animate-pulse" />
          <span className="font-body text-xs tracking-widest uppercase">
            {signedOut
              ? "Signing out…"
              : rejected
                ? "Redirecting to sign in…"
                : "Loading…"}
          </span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
