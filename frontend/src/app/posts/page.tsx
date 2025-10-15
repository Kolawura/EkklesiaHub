import React from "react";

export default function Post() {
  const publishedPosts = [
    {
      id: "1",
      title: "Getting Started with Next.js",
      slug: "getting-started-nextjs",
      content:
        "Next.js is a powerful React framework that makes building full-stack applications a breeze. In this comprehensive guide, we'll explore the fundamentals of Next.js and how to leverage its features for building modern web applications.\n\nNext.js provides an excellent developer experience with features like automatic code splitting, optimized performance, and built-in routing. Whether you're building a simple blog or a complex web application, Next.js has you covered.",
      coverImage:
        "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800",
      status: "PUBLISHED",
      author: { name: "John Doe", id: "user1" },
      authorId: "user1",
      tags: [
        { id: "t1", name: "Next.js" },
        { id: "t2", name: "React" },
      ],
      comments: [],
      reactions: [],
      createdAt: "2024-10-10T10:00:00Z",
      updatedAt: "2024-10-10T10:00:00Z",
    },
    {
      id: "2",
      title: "Modern Web Design Trends",
      slug: "modern-web-design-trends",
      content:
        "The web design landscape is constantly evolving. Let's explore the latest trends that are shaping how we build beautiful and functional websites in 2024.",
      coverImage:
        "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800",
      status: "DRAFT",
      author: { name: "Jane Smith", id: "user2" },
      authorId: "user2",
      tags: [
        { id: "t3", name: "Design" },
        { id: "t4", name: "UI/UX" },
      ],
      comments: [],
      reactions: [],
      createdAt: "2024-10-12T14:30:00Z",
      updatedAt: "2024-10-12T14:30:00Z",
    },
    {
      id: "3",
      title: "Building Scalable APIs",
      slug: "building-scalable-apis",
      content:
        "Learn how to design and build APIs that can scale to millions of users. We'll cover best practices, architecture patterns, and performance optimization techniques.",
      coverImage:
        "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800",
      status: "PUBLISHED",
      author: { name: "John Doe", id: "user1" },
      authorId: "user1",
      tags: [
        { id: "t5", name: "API" },
        { id: "t6", name: "Backend" },
      ],
      comments: [],
      reactions: [],
      createdAt: "2024-10-14T09:15:00Z",
      updatedAt: "2024-10-14T09:15:00Z",
    },
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <main className="max-w-6xl mx-auto px-6 py-12">
      <div className="grid grid-rows-1 md:grid-rows-2 lg:grid-rows-3 gap-8">
        {publishedPosts.map((post) => (
          <article
            key={post.id}
            className="flex flex-row-reverse items-center overflow-hidden cursor-pointer border-b border-gray-100 dark:border-gray-700"
            // onClick={() => handleViewPost(post)}
          >
            {post.coverImage && (
              <div className="w-40 h-40 bg-gray-200 overflow-hidden">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}
            <div className="p-6">
              <div className="flex items-center gap-2 mb-3">
                {post.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag.id}
                    className="text-xs font-medium text-blue-600 dark:text-blue-50 bg-blue-50 dark:bg-blue-600 px-2.5 py-1 rounded-full"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>

              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-50 mb-2 line-clamp-2">
                {post.title}
              </h2>

              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                {post.content}
              </p>

              <div className="flex items-center justify-between pt-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-semibold">
                    {post.author.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-50">
                      {post.author.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDate(post.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
