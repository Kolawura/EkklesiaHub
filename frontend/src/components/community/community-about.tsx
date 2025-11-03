"use client";

const mockCommunity = {
  description:
    "A vibrant community for React developers to share knowledge, discuss best practices, and collaborate on innovative projects.",
  rules: [
    "Be respectful and inclusive to all members",
    "Share knowledge and help others grow",
    "No spam or self-promotion without permission",
    "Follow the code of conduct",
    "Ask questions and be curious",
  ],
  stats: [
    { label: "Founded", value: "June 15, 2023" },
    { label: "Members", value: "2,847" },
    { label: "Posts", value: "542" },
    { label: "Active Discussions", value: "89" },
  ],
};

export function CommunityAbout({ communityId }: { communityId: string }) {
  console.log(communityId);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-4">
          About this community
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          {mockCommunity.description}
        </p>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-foreground mb-4">
          Community Rules
        </h2>
        <ul className="space-y-3">
          {mockCommunity.rules.map((rule, index) => (
            <li key={index} className="flex gap-3">
              <span className="text-accent font-bold">✓</span>
              <span className="text-muted-foreground">{rule}</span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-foreground mb-4">
          Community Stats
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {mockCommunity.stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-card border border-border rounded-lg p-4"
            >
              <p className="text-muted-foreground text-sm mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
