import { create } from "zustand";

interface SidebarState {
  activeView: string;
  setActiveView: (view: string) => void;
  /** Mobile/tablet (< lg) slide-over drawer. Ignored on desktop where the
   *  sidebar is always visible. */
  mobileOpen: boolean;
  openMobile: () => void;
  closeMobile: () => void;
  toggleMobile: () => void;
}

export const useSidebarStore = create<SidebarState>((set) => ({
  activeView: "dashboard",
  setActiveView: (view) => set({ activeView: view }),
  mobileOpen: false,
  openMobile: () => set({ mobileOpen: true }),
  closeMobile: () => set({ mobileOpen: false }),
  toggleMobile: () => set((s) => ({ mobileOpen: !s.mobileOpen })),
}));
