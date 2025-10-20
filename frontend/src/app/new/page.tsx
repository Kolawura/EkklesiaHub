"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import TiptapEditor from "@/components/tiptap/TiptapEditor";
import { useCreatePost } from "@/hooks/usePosts";
import { useAuthStore } from "@/store/useAuthStore";

export default function CreatePostPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState<string | undefined>(undefined);
  const router = useRouter();
  const { mutateAsync: createPost, isPending } = useCreatePost();
  const { user } = useAuthStore();

  type contentType = {
    title: string;
    content: string;
    coverImage?: string | undefined;
  };

  const getContent = (data: contentType) => {
    setTitle(data.title);
    setContent(data.content);
    setCoverImage(data.coverImage);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;
    try {
      const newPost = {
        title,
        content,
        coverImage,
        authorId: user?.id,
      };

      const res: any = await createPost(newPost);
      if (!res.error) {
        const data = res.data;
        router.push(`/posts/${data.id}`);
      }
    } catch (error) {
      console.error("Failed to create post:", error);
    }
  };

  return (
    <div className="py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
          Create New Post
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <TiptapEditor onChange={(data) => getContent(data)} />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isPending}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? "Publishing..." : "Publish Post"}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
