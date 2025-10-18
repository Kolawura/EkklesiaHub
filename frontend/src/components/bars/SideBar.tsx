"use client";
import React from "react";
import { Home, FileText, Users, Settings } from "lucide-react";
import { useSidebarStore } from "@/store/useSideBarStore";
import Link from "next/link";

const navItems = [
  { id: "dashboard", page: "Dashboard", icon: Home },
  { id: "posts", page: "Posts", icon: FileText },
  { id: "authors", page: "Authors", icon: Users },
  { id: "settings", page: "Settings", icon: Settings },
];

export const SideBar = ({}) => {
  const { activeView, setActiveView } = useSidebarStore();

  const getActiveIcon = () => {
    const item = navItems.find((i) => i.id === activeView);
    return item ? item.icon : FileText;
  };

  const ActiveIcon = getActiveIcon();

  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      <div className="p-6 border-b border-gray-200 block md:hidden">
        <h1 className="text-2xl font-bold text-gray-900">EkklesiaHub</h1>
        <p className="text-sm text-gray-500 mt-1">
          Christian writers community
        </p>
      </div>
      <div className="flex flex-col justify-between">
        <nav className="flex-1 p-4">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <Link
                href={`/${item.page.toLowerCase()}`}
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors ${
                  activeView === item.id
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <IconComponent size={20} />
                <span className="font-medium">{item.page}</span>
              </Link>
            );
          })}
        </nav>
        <hr className="mx-6" />
        {/* <div className="p-4">
          <div className="flex flex-col">
            <span>Following</span>
            <ul>
              <li>
                <div>
                  <img src="" alt="" />
                  {.map((follower) => (<li>{follower}</li>))}
                  Oluwatosin
                </div>
              </li>
            </ul>
          </div>
        </div> */}

        <div className="p-4">
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
              JD
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">John Doe</p>
              <p className="text-xs text-gray-500">Admin</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
