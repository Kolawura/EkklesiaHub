import axios from "axios";
import { useAuthStore } from "@/store/useAuthStore";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
  // 15-second timeout — prevents hung requests from stalling the UI forever.
  // Increase if your server is on a slow connection, but never leave it open-ended.
  timeout: 15_000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ── Response interceptor ────────────────────────────────────────────────────
// Globally handle 401s by clearing local auth state rather than letting
// individual pages each handle it differently.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // The cookie is gone / expired. Clear any local state and redirect to
      // the auth page so the user can log back in.
      // We import dynamically to avoid a circular dep with useAuthStore.
      if (typeof window !== "undefined") {
        useAuthStore.getState().logout();
      }

      // Keep in sync with PUBLIC_EXACT / PUBLIC_PREFIXES in src/proxy.ts.
      // (/communities is NOT public — it is an app route.)
      const current = window.location.pathname;
      const isPublic =
        ["/", "/landing", "/features", "/about", "/bible", "/terms", "/privacy", "/login"].includes(
          current,
        ) || current.startsWith("/auth");

      if (!isPublic) {
        const from = current + window.location.search;
        window.location.href = `/auth?from=${encodeURIComponent(from)}`;
      }
    }

    return Promise.reject(error);
  },
);
