"use client";
import { Button } from "@/components/ui/button";
import { Plus, Users, TrendingUp } from "lucide-react";

const joinedCommunities = [
  { id: 1, name: "Tech Writers", icon: "💻", members: 2400, isJoined: true },
  {
    id: 2,
    name: "Design Collective",
    icon: "🎨",
    members: 1850,
    isJoined: true,
  },
  { id: 3, name: "Backend Masters", icon: "⚙️", members: 3200, isJoined: true },
  {
    id: 4,
    name: "React Enthusiasts",
    icon: "⚛️",
    members: 2100,
    isJoined: true,
  },
  { id: 5, name: "Writers Guild", icon: "✍️", members: 1600, isJoined: true },
];

const suggestedCommunities = [
  {
    id: 6,
    name: "AI & Machine Learning",
    icon: "🤖",
    members: 4500,
    isJoined: false,
  },
  { id: 7, name: "DevOps & Cloud", icon: "☁️", members: 2800, isJoined: false },
  {
    id: 8,
    name: "Mobile Development",
    icon: "📱",
    members: 2200,
    isJoined: false,
  },
];

export function Sidebar() {
  return (
    <div className="space-y-6 sticky top-4">
      {/* Joined Communities */}
      <div className="bg-card border border-border rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            My Communities
          </h3>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-2">
          {joinedCommunities.map((community) => (
            <button
              key={community.id}
              className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors text-left group"
            >
              <span className="text-xl">{community.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">
                  {community.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {community.members.toLocaleString()} members
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Suggested Communities */}
      <div className="bg-card border border-border rounded-xl p-6 space-y-4">
        <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-accent" />
          Discover
        </h3>

        <div className="space-y-2">
          {suggestedCommunities.map((community) => (
            <div
              key={community.id}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors group"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <span className="text-xl">{community.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">
                    {community.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {community.members.toLocaleString()} members
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="ml-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
              >
                Join
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Newsletter CTA */}
      <div className="bg-gradient-to-br from-secondary to-secondary/80 rounded-xl p-6 text-secondary-foreground space-y-3">
        <h4 className="font-bold text-sm">Stay Updated</h4>
        <p className="text-xs opacity-90">
          Get the best posts delivered to your inbox every week.
        </p>
        <Button className="w-full bg-secondary-foreground text-secondary hover:bg-secondary-foreground/90 text-xs font-semibold">
          Subscribe
        </Button>
      </div>
    </div>
  );
}
