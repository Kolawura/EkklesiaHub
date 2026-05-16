import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/lib/type";

type AuthState = {
  user: User | null;
  setUser: (user: User) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      logout: () => set({ user: null }),
    }),
    {
      name: "ekklesia-auth",
      // Only persist non-sensitive display fields
      partialize: (state) => ({ user: state.user }),
    }
  )
);
