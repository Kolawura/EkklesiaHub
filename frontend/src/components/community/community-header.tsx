"use client";

import Image from "next/image";
import { useState } from "react";

const mockCommunity = {
  id: "1",
  name: "React Developers",
  description:
    "A community for React developers to share knowledge, best practices, and discuss the latest in React ecosystem.",
  members: 2847,
  posts: 542,
  createdAt: "2023-06-15",
  banner: "/react-community-banner.jpg",
  avatar: "/react-logo.jpg",
  role: "MEMBER",
};

export function CommunityHeader({ communityId }: { communityId: string }) {
  const [isMember, setIsMember] = useState(mockCommunity.role === "MEMBER");
  console.log(communityId);
  return (
    <div className="w-full">
      <div className="relative h-64 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-xl overflow-hidden">
        <Image
          width={40}
          height={40}
          src={mockCommunity.banner || "/placeholder.svg"}
          alt={mockCommunity.name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="px-6 pb-6">
        <div className="flex items-end gap-6 -mt-16 mb-6 relative z-10">
          <div className="w-32 h-32 bg-card border-4 border-background rounded-xl overflow-hidden shadow-lg">
            <Image
              width={4}
              height={4}
              src={mockCommunity.avatar || "/placeholder.svg"}
              alt={mockCommunity.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className=" flex-1 pb-4">
            <h1 className="text-4xl font-bold text-foreground mb-2">
              {mockCommunity.name}
            </h1>
            <p className="text-muted-foreground text-lg">
              {mockCommunity.description}
            </p>
          </div>

          <button
            onClick={() => setIsMember(!isMember)}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              isMember
                ? "bg-muted text-foreground hover:bg-muted/80"
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            }`}
          >
            {isMember ? "Leave Community" : "Join Community"}
          </button>
        </div>

        <div className="flex gap-8 text-sm">
          <div>
            <p className="text-muted-foreground">Members</p>
            <p className="text-2xl font-bold text-foreground">
              {mockCommunity.members.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Posts</p>
            <p className="text-2xl font-bold text-foreground">
              {mockCommunity.posts}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Created</p>
            <p className="text-2xl font-bold text-foreground">
              {new Date(mockCommunity.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
