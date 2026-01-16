"use client";

import Image from "next/image";
import { useState } from "react";

const mockCommunities = [
  {
    id: "1",
    name: "React Developers",
    description: "Share knowledge and discuss React best practices",
    members: 2847,
    posts: 542,
    avatar:
      "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg",
    isMember: true,
  },
  {
    id: "2",
    name: "Next.js Community",
    description: "Build amazing web applications with Next.js",
    members: 1923,
    posts: 387,
    avatar:
      "https://upload.wikimedia.org/wikipedia/commons/archive/8/8e/20230404233502%21Nextjs-logo.svg",
    isMember: false,
  },
  {
    id: "3",
    name: "TypeScript Enthusiasts",
    description: "Master TypeScript and write type-safe code",
    members: 1654,
    posts: 298,
    avatar:
      "https://upload.wikimedia.org/wikipedia/commons/4/4c/Typescript_logo_2020.svg",
    isMember: true,
  },
  {
    id: "4",
    name: "Web Design & UX",
    description: "Discuss design trends and UX best practices",
    members: 3124,
    posts: 612,
    avatar:
      "https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg",
    isMember: false,
  },
];

export function CommunitiesList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"all" | "joined">("all");

  const filteredCommunities = mockCommunities.filter((community) => {
    const matchesSearch =
      community.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      community.description.toLowerCase().includes(searchTerm.toLowerCase());

    if (filter === "joined") {
      return matchesSearch && community.isMember;
    }
    return matchesSearch;
  });

  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Communities</h1>
        <p className="text-muted-foreground">
          Discover and join communities of like-minded writers and developers
        </p>
      </div>

      <div className="flex gap-4 flex-col sm:flex-row">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search communities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-card border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as "all" | "joined")}
          className="px-4 py-2 rounded-lg bg-card border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="all">All Communities</option>
          <option value="joined">My Communities</option>
        </select>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredCommunities.map((community) => (
          <div
            key={community.id}
            className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-all cursor-pointer group"
          >
            <div className="flex items-start justify-between mb-4">
              <Image
                width={40}
                height={40}
                src={community.avatar || "/placeholder.svg"}
                alt={community.name}
                className="w-16 h-16 rounded-lg bg-white"
              />
              <button
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  community.isMember
                    ? "bg-muted text-foreground hover:bg-muted/80"
                    : "bg-primary text-primary-foreground hover:bg-primary/90"
                }`}
              >
                {community.isMember ? "Joined" : "Join"}
              </button>
            </div>

            <h3 className="text-xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
              {community.name}
            </h3>
            <p className="text-muted-foreground text-sm mb-4">
              {community.description}
            </p>

            <div className="flex gap-4 text-sm text-muted-foreground border-t border-border pt-4">
              <span>{community.members.toLocaleString()} members</span>
              <span>{community.posts} posts</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
