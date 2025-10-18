import { Heart, Bookmark, Calendar, MessageCircle } from "lucide-react";

export default function SinglePostView() {
  //   if (!selectedPost) return null;
  const selectedPost = {
    id: "1",
    title: "Understanding React Hooks: A Comprehensive Guide",
    content: `React Hooks have revolutionized the way we write React components. Introduced in React 16.8, hooks allow you to use state and other React features without writing a class.

In this guide, we will explore the most commonly used hooks, including useState, useEffect, useContext, and custom hooks. We will also look at best practices for using hooks in your applications.

### useState

The useState hook allows you to add state to functional components. It returns an array with two elements: the current state value and a function to update it.

### useEffect

The useEffect hook lets you perform side effects in your components, such as fetching data or subscribing to events. It runs after every render by default but can be configured to run only when certain values change.

### Conclusion

Hooks have made it easier to manage state and side effects in React applications. By using hooks, you can write cleaner and more maintainable code. Experiment with different hooks and see how they can improve your React development experience.`,
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
  };
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            // onClick={() => setSelectedPost(null)}
            className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
          >
            ← Back to Posts
          </button>
          <div className="flex items-center gap-2">
            <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
              <Heart size={20} />
            </button>
            <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
              <Bookmark size={20} />
            </button>
          </div>
        </div>
      </header>

      <article className="max-w-4xl mx-auto px-6 py-12">
        {selectedPost.coverImage && (
          <div className="aspect-video bg-gray-200 rounded-2xl overflow-hidden mb-8">
            <img
              src={selectedPost.coverImage}
              alt={selectedPost.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="flex items-center gap-2 mb-4">
          {selectedPost.tags.map((tag) => (
            <span
              key={tag.id}
              className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full"
            >
              {tag.name}
            </span>
          ))}
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
          {selectedPost.title}
        </h1>

        <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-200">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
            {selectedPost.author.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>
          <div className="flex-1">
            <p className="font-semibold text-gray-900">
              {selectedPost.author.name}
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Calendar size={14} />
                {formatDate(selectedPost.createdAt)}
              </span>
            </div>
          </div>
        </div>

        <div className="prose prose-lg max-w-none">
          {selectedPost.content.split("\n").map((paragraph, idx) => (
            <p key={idx} className="text-gray-700 leading-relaxed mb-4">
              {paragraph}
            </p>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <Heart size={20} />
              <span className="font-medium">Like</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <MessageCircle size={20} />
              <span className="font-medium">Comment</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <Bookmark size={20} />
              <span className="font-medium">Save</span>
            </button>
          </div>
        </div>
      </article>
    </div>
  );
}
