import { LucideProps } from "lucide-react";
import { Home, FileText, Users, Settings } from "lucide-react";

import { create } from "zustand";

interface SidebarState {
  activeView: string;
  setActiveView: (view: string) => void;
}

export const useSidebarStore = create<SidebarState>((set) => ({
  activeView: "dashboard",
  setActiveView: (view) => set({ activeView: view }),
}));
