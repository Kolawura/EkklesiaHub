"use client";

import { useState } from "react";
import { CommunityFeed } from "./community-feed";
import { CommunityMembers } from "./community-members";
import { CommunityAbout } from "./community-about";

type Tab = "posts" | "members" | "about";

export function CommunityTabs({ communityId }: { communityId: string }) {
  const [activeTab, setActiveTab] = useState<Tab>("posts");

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: "posts", label: "Posts", icon: "📝" },
    { id: "members", label: "Members", icon: "👥" },
    { id: "about", label: "About", icon: "ℹ️" },
  ];

  return (
    <div>
      <div className="flex justify-center gap-1 border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 font-medium transition-all border-b-2 ${
              activeTab === tab.id
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {activeTab === "posts" && <CommunityFeed communityId={communityId} />}
        {activeTab === "members" && (
          <CommunityMembers communityId={communityId} />
        )}
        {activeTab === "about" && <CommunityAbout communityId={communityId} />}
      </div>
    </div>
  );
}
