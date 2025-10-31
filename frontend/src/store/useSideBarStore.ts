import { LucideProps } from "lucide-react";
import { Home, FileText, Users, Settings } from "lucide-react";

import { create } from "zustand";

interface SidebarState {
  activeView: string;
  isOpen: boolean;
  openLandingBar: boolean;
  setActiveView: (view: string) => void;
  setIsOpen: (open: boolean) => void;
  setOpenLandingBar: (open: boolean) => void;
}

export const useSidebarStore = create<SidebarState>((set) => ({
  activeView: "home",
  isOpen: false,
  openLandingBar: false,
  setActiveView: (view) => set({ activeView: view }),
  setIsOpen: (open) => set({ isOpen: !open }),
  setOpenLandingBar: (open) => set({ openLandingBar: !open }),
}));
