"use client";

import { useSidebarStore } from "@/store/useSideBarStore";
import {
  Home,
  Compass,
  BookMarked,
  Users,
  Settings,
  LogOut,
  Bell,
  Plus,
} from "lucide-react";
import Link from "next/link";
const navItems = [
  { icon: Home, page: "Home", id: "home", path: "/" },
  { icon: Compass, page: "Explore", id: "explore", path: "/explore" },
  { icon: BookMarked, page: "Bookmarks", id: "bookmarks", path: "/bookmarks" },
  { icon: Users, page: "Communities", id: "communities", path: "/communities" },
];

const moreNavBar = [
  {
    icon: Bell,
    page: "Notifications",
    id: "notifications",
    path: "/notifications",
  },
  { icon: Settings, page: "Settings", id: "settings", path: "/settings" },
];

export function LeftSidebar() {
  const { activeView, setActiveView, isOpen } = useSidebarStore();
  console.log(isOpen);
  return (
    <aside
      className={`${
        isOpen ? "" : "hidden"
      } h-full w-64 bg-sidebar border-r border-sidebar-border flex flex-col`}
    >
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-2">
        {navItems.map((item) => (
          <NavItem
            path={item.path}
            key={item.id}
            icon={item.icon}
            label={item.page}
            active={activeView === item.id}
            onClick={() => setActiveView(item.id)}
          />
        ))}

        <div className="mt-8 pt-4 border-t border-sidebar-border space-y-2">
          <p className="px-4 text-xs font-semibold text-sidebar-foreground/60 uppercase">
            More
          </p>
          {moreNavBar.map((item) => (
            <NavItem
              path={item.path}
              key={item.id}
              icon={item.icon}
              label={item.page}
              active={activeView === item.id}
              onClick={() => setActiveView(item.id)}
            />
          ))}
        </div>
      </nav>
      <div className="border-t border-sidebar-border p-4 space-y-3">
        <button className="w-full bg-sidebar-primary text-sidebar-primary-foreground rounded-lg py-2.5 font-semibold hover:opacity-90 flex items-center justify-center gap-2">
          <Plus className="w-4 h-4" />
          Write
        </button>

        <div className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-sidebar-accent/10 cursor-pointer">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-bold text-accent-foreground">JD</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-sidebar-foreground truncate">
              John Doe
            </p>
            <p className="text-xs text-sidebar-foreground/60 truncate">
              @johndoe
            </p>
          </div>
        </div>

        <button className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sidebar-foreground hover:bg-sidebar-accent/10 rounded-lg text-sm font-medium">
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}

function NavItem({
  path,
  icon: Icon,
  label,
  active,
  onClick,
}: {
  path: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  const baseClass =
    "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all hover:bg-sidebar-accent/10";
  const activeClass = active
    ? "bg-sidebar-primary hover:bg-sidebar-primary/90 text-sidebar-primary-foreground"
    : "text-sidebar-foreground hover:bg-sidebar-accent/90";

  return (
    <Link
      href={path}
      onClick={onClick}
      className={`${baseClass} ${activeClass}`}
    >
      <Icon className="w-5 h-5 flex-shrink-0" />
      <span className="font-medium">{label}</span>
    </Link>
  );
}
