"use client";
import { useSidebarStore } from "@/store/useSideBarStore";
import { Search, Plus } from "lucide-react";
import React from "react";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "./ui/button";

export default function NavBar() {
  const { activeView } = useSidebarStore();
  return (
    <header className="w-full border-b border-gray-200 dark:border-gray-700 px-8 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-50 capitalize">
            {activeView}
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <Button
            // onClick={() => setShowEditor(true)}
            variant="outline"
            size="icon"
            className="bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            {/* <span>New Post</span> */}
          </Button>
        </div>
      </div>
    </header>
  );
}
