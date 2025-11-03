"use client";

import Image from "next/image";

const mockMembers = [
  {
    id: "1",
    name: "Sarah Chen",
    role: "ADMIN",
    avatar: "/woman-developer.jpg",
    joinedDate: "Jun 15, 2023",
    posts: 45,
  },
  {
    id: "2",
    name: "Alex Rivera",
    role: "MODERATOR",
    avatar: "/man-developer.jpg",
    joinedDate: "Jun 20, 2023",
    posts: 32,
  },
  {
    id: "3",
    name: "Jordan Kim",
    role: "MEMBER",
    avatar: "/asian-developer.jpg",
    joinedDate: "Jul 10, 2023",
    posts: 18,
  },
  {
    id: "4",
    name: "Taylor Morgan",
    role: "MEMBER",
    avatar: "/developer-woman.jpg",
    joinedDate: "Aug 5, 2023",
    posts: 12,
  },
];

export function CommunityMembers({ communityId }: { communityId: string }) {
  console.log(communityId);
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "bg-primary/20 text-primary";
      case "MODERATOR":
        return "bg-accent/20 text-accent";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {mockMembers.map((member) => (
        <div
          key={member.id}
          className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-all"
        >
          <div className="flex items-start gap-4 mb-4">
            <Image
              width={40}
              height={40}
              src={member.avatar || "/placeholder.svg"}
              alt={member.name}
              className="w-16 h-16 rounded-full"
            />
            <div className="flex-1">
              <h3 className="font-bold text-foreground">{member.name}</h3>
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-2 ${getRoleBadgeColor(
                  member.role
                )}`}
              >
                {member.role}
              </span>
            </div>
          </div>

          <div className="space-y-2 text-sm text-muted-foreground">
            <p>Joined {member.joinedDate}</p>
            <p>{member.posts} posts</p>
          </div>
        </div>
      ))}
    </div>
  );
}
