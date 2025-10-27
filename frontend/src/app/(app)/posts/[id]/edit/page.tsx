"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import TiptapEditor from "@/components/tiptap/TiptapEditor";
import { usePostById, useUpdatePost } from "@/hooks/usePosts";
import { Loader2 } from "lucide-react";
import Loading from "@/components/Loading";
import Error from "@/components/error";

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;

  const { data: post, isLoading, isError, error } = usePostById(postId);

  // Update mutation
  const updatePost = useUpdatePost();

  // Local state for editor data
  const [postData, setPostData] = useState({
    title: "",
    tags: [] as string[],
    content: "",
    coverImage: undefined as string | undefined,
  });

  // Initialize post data when loaded
  useEffect(() => {
    if (post) {
      setPostData({
        title: post.title || "",
        tags: post.tags || [],
        content: post.content || "",
        coverImage: post.coverImage || undefined,
      });
      console.log(post);
    }
  }, [post]);

  const handleEditorChange = (data: {
    title: string;
    tags: string[];
    content: string;
    coverImage?: string;
  }) => {
    setPostData({
      title: data.title,
      tags: data.tags,
      content: data.content,
      coverImage: data.coverImage ?? undefined,
    });
  };

  const handleUpdate = async () => {
    if (!postData.title.trim()) {
      alert("Please add a title");
      return;
    }

    try {
      await updatePost.mutateAsync({
        id: postId,
        data: {
          title: postData.title,
          tags: postData.tags,
          content: postData.content,
          coverImage: postData.coverImage,
        },
      });
      router.push(`/posts/${postId}`);
    } catch (error) {
      console.error("Failed to update post:", error);
    }
  };

  const handleCancel = () => {
    router.push(`/posts/${postId}`);
  };

  // Loading state
  if (isLoading) return <Loading />;

  // Error state
  if (isError || !post || post.error) {
    return <Error error={post as Error} reset={() => router.refresh()} />;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Top Action Bar */}
      <div className="sticky top-0 z-20 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={handleCancel}
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              >
                ← Cancel
              </button>
            </div>

            <div className="flex items-center gap-3">
              {updatePost.isError && (
                <span className="text-sm text-red-600 dark:text-red-400">
                  Failed to update post
                </span>
              )}
              <button
                onClick={handleUpdate}
                disabled={updatePost.isPending}
                className="px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors flex items-center gap-2"
              >
                {updatePost.isPending && (
                  <Loader2 className="animate-spin h-4 w-4" />
                )}
                {updatePost.isPending ? "Updating..." : "Update"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Editor */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <TiptapEditor
          title={postData.title}
          tags={postData.tags}
          content={postData.content}
          coverImage={postData.coverImage}
          onChange={handleEditorChange}
          placeholder="Tell your story..."
          editable={true}
        />
      </div>
    </div>
  );
}
