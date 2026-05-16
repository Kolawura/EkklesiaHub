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

      const current = window.location.pathname;
      const isPublic =
        current === "/" ||
        current.startsWith("/auth") ||
        current.startsWith("/features") ||
        current.startsWith("/about");

      if (!isPublic) {
        window.location.href = `/auth?from=${encodeURIComponent(current)}`;
      }
    }

    return Promise.reject(error);
  },
);
