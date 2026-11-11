import { LucideIcon, Users, BarChart2, Settings } from "lucide-react";
import { Tab } from "./type";

export type TabDef = {
  id: Tab;
  label: string;
  icon?: LucideIcon;
  adminOnly?: boolean;
};

const BASE_TABS: TabDef[] = [
  { id: "posts", label: "Posts" },
  { id: "members", label: "Members", icon: Users },
  { id: "about", label: "About" },
];

const ADMIN_TABS: TabDef[] = [
  { id: "analytics", label: "Analytics", icon: BarChart2, adminOnly: true },
  { id: "settings", label: "Settings", icon: Settings, adminOnly: true },
];

/** Tabs for a community page; admins also get Analytics and Settings. */
export const getTabs = (isAdmin: boolean): TabDef[] =>
  isAdmin ? [...BASE_TABS, ...ADMIN_TABS] : BASE_TABS;
