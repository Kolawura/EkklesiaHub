import { create } from "zustand";

interface SidebarState {
  activeView: string;
  isOpen: boolean;
  OpenMobileMenu: boolean;
  setActiveView: (view: string) => void;
  setIsOpen: (open: boolean) => void;
  setOpenMobileMenu: (open: boolean) => void;
}

export const useSidebarStore = create<SidebarState>((set) => ({
  activeView: "home",
  isOpen: true,
  OpenMobileMenu: false,
  setActiveView: (view) => set({ activeView: view }),
  setIsOpen: (open) => set({ isOpen: !open }),
  setOpenMobileMenu: (open) => set({ OpenMobileMenu: !open }),
}));
