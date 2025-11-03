"use client";

import { PostCard } from "@/components/Home/components/post-card";
import { FeaturedSection } from "@/components/Home/components/featured-section";
import { CategoryTabs } from "@/components/Home/components/category-tabs";

const mockPosts = [
  {
    id: 1,
    title: "The Future of Web Development: AI-Powered Coding",
    excerpt:
      "Exploring how artificial intelligence is transforming the way we write and maintain code...",
    author: {
      name: "Sarah Chen",
      avatar: "/woman-developer.png",
      handle: "@sarahchen",
    },
    community: {
      name: "Tech Writers",
      icon: "💻",
    },
    image: "/futuristic-code-editor.jpg",
    publishedAt: "2 hours ago",
    likes: 1240,
    comments: 89,
    bookmarks: 342,
    reactions: { "👍": 450, "❤️": 320, "🔥": 200 },
  },
  {
    id: 2,
    title: "Building Scalable Systems: Lessons from Production",
    excerpt:
      "Real-world insights on designing systems that can handle millions of users...",
    author: {
      name: "Alex Rodriguez",
      avatar: "/man-engineer.png",
      handle: "@alexrodriguez",
    },
    community: {
      name: "Backend Masters",
      icon: "⚙️",
    },
    image: "/server-infrastructure.jpg",
    publishedAt: "4 hours ago",
    likes: 2100,
    comments: 156,
    bookmarks: 567,
    reactions: { "👍": 800, "❤️": 450, "🚀": 350 },
  },
  {
    id: 3,
    title: "Design Systems That Scale: A Practical Guide",
    excerpt:
      "How to create and maintain design systems that grow with your organization...",
    author: {
      name: "Maya Patel",
      avatar: "/woman-designer.png",
      handle: "@mayapatel",
    },
    community: {
      name: "Design Collective",
      icon: "🎨",
    },
    image: "/design-system-components.png",
    publishedAt: "6 hours ago",
    likes: 1850,
    comments: 203,
    bookmarks: 612,
    reactions: { "👍": 600, "❤️": 550, "🎯": 280 },
  },
  {
    id: 4,
    title: "Mastering React Hooks: Advanced Patterns",
    excerpt:
      "Deep dive into custom hooks and advanced patterns for managing state...",
    author: {
      name: "James Wilson",
      avatar: "/man-developer.png",
      handle: "@jameswilson",
    },
    community: {
      name: "React Enthusiasts",
      icon: "⚛️",
    },
    image: "/react-code-snippet.png",
    publishedAt: "8 hours ago",
    likes: 1560,
    comments: 124,
    bookmarks: 445,
    reactions: { "👍": 520, "❤️": 380, "🔥": 220 },
  },
  {
    id: 5,
    title: "The Art of Technical Writing",
    excerpt:
      "Tips and tricks for writing clear, engaging technical documentation...",
    author: {
      name: "Emma Thompson",
      avatar: "/woman-writer.jpg",
      handle: "@emmathompson",
    },
    community: {
      name: "Writers Guild",
      icon: "✍️",
    },
    image: "/antique-writing-desk.png",
    publishedAt: "10 hours ago",
    likes: 980,
    comments: 67,
    bookmarks: 234,
    reactions: { "👍": 350, "❤️": 280, "💡": 150 },
  },
];

export function HomePage() {
  return (
    <main className="flex-1 w-full">
      <div className="space-y-8">
        <FeaturedSection />
        <CategoryTabs />
        <div className="space-y-6">
          {mockPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </main>
  );
}
