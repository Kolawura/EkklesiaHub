"use client";

import Image from "next/image";

const mockPosts = [
  {
    id: "1",
    title: "Best practices for React 18 Server Components",
    excerpt:
      "Exploring the latest features and how to leverage them in production applications.",
    author: {
      name: "Sarah Chen",
      avatar: "/woman-developer.jpg",
    },
    date: "2 days ago",
    likes: 234,
    comments: 45,
    bookmarks: 89,
  },
  {
    id: "2",
    title: "Performance optimization tips for large React apps",
    excerpt:
      "Learn how to identify bottlenecks and implement effective optimization strategies.",
    author: {
      name: "Alex Rivera",
      avatar: "/man-developer.jpg",
    },
    date: "5 days ago",
    likes: 189,
    comments: 32,
    bookmarks: 67,
  },
  {
    id: "3",
    title: "React Testing Library vs Cypress: When to use each",
    excerpt:
      "A comprehensive comparison to help you choose the right testing tool for your project.",
    author: {
      name: "Jordan Kim",
      avatar: "/developer-working.png",
    },
    date: "1 week ago",
    likes: 312,
    comments: 78,
    bookmarks: 145,
  },
];

export function CommunityFeed({ communityId }: { communityId: string }) {
  console.log(communityId);
  return (
    <div className="space-y-4">
      {mockPosts.map((post) => (
        <div
          key={post.id}
          className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-all cursor-pointer"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex gap-3">
              <Image
                width={40}
                height={40}
                src={post.author.avatar || "/placeholder.svg"}
                alt={post.author.name}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="font-semibold text-foreground">
                  {post.author.name}
                </p>
                <p className="text-sm text-muted-foreground">{post.date}</p>
              </div>
            </div>
          </div>

          <h3 className="text-xl font-bold text-foreground mb-2">
            {post.title}
          </h3>
          <p className="text-muted-foreground mb-4">{post.excerpt}</p>

          <div className="flex gap-6 text-sm text-muted-foreground">
            <button className="flex items-center gap-2 hover:text-accent transition-colors">
              ❤️ {post.likes}
            </button>
            <button className="flex items-center gap-2 hover:text-accent transition-colors">
              💬 {post.comments}
            </button>
            <button className="flex items-center gap-2 hover:text-accent transition-colors">
              🔖 {post.bookmarks}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
