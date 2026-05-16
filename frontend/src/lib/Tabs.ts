import { LucideIcon, Users, BarChart2, Settings } from "lucide-react";
import { Tab } from "./type";

export const TABS: {
  id: Tab;
  label: string;
  icon?: LucideIcon;
  adminOnly?: boolean;
}[] = [
  { id: "posts", label: "Posts" },
  { id: "members", label: "Members", icon: Users },
  { id: "about", label: "About" },
  ...(isAdmin
    ? [
        {
          id: "analytics" as Tab,
          label: "Analytics",
          icon: BarChart2,
          adminOnly: true,
        },
        {
          id: "settings" as Tab,
          label: "Settings",
          icon: Settings,
          adminOnly: true,
        },
      ]
    : []),
];
