import { api } from "@/lib/api";
import { getRequest, postRequest } from "@/lib/service";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useAuth } from "./useAuth";
import { toast } from "./useToast";
import { Post } from "@/lib/type";

export const usePostDetails = (slug: string) => {
  const queryClient = useQueryClient();
  const { user, isAuthenticated } = useAuth();
  const [commentText, setCommentText] = useState("");
  const [replyTo, setReplyTo] = useState<{
    id: string;
    username: string;
  } | null>(null);
  /* Scripture references attached to the comment being composed */
  const [attachedVerses, setAttachedVerses] = useState<
    { reference: string; text: string }[]
  >([]);

  /* ── Queries ── */
  const { data, isLoading, isError } = useQuery({
    queryKey: ["post", slug],
    queryFn: () => getRequest(`/posts/slug/${slug}`),
    enabled: !!slug,
  });

  const post = data?.data as Post;

  useEffect(() => {
    if (post?.id) api.post(`/posts/${post.id}/view`).catch(() => {});
  }, [post?.id]);

  const { data: reactionData } = useQuery({
    queryKey: ["reactions", post?.id],
    queryFn: () => getRequest(`/reactions/count?postId=${post?.id}`),
    enabled: !!post?.id,
  });

  const { data: bookmarkData } = useQuery({
    queryKey: ["bookmark", post?.id],
    queryFn: () => getRequest(`/bookmarks/check/${post?.id}`),
    enabled: !!post?.id && isAuthenticated,
  });

  /* ── Mutations ── */
  const reactionMutation = useMutation({
    mutationFn: (type: string) =>
      postRequest("/reactions", { type, postId: post.id }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["reactions", post?.id] }),
    onError: () => toast({ title: "Failed to react", variant: "destructive" }),
  });

  const bookmarkMutation = useMutation({
    mutationFn: () => postRequest("/bookmarks", { postId: post.id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookmark", post?.id] });
      toast({
        title: bookmarkData?.data?.bookmarked
          ? "Bookmark removed"
          : "Bookmarked!",
        variant: "success",
      });
    },
    onError: () =>
      toast({ title: "Failed to bookmark", variant: "destructive" }),
  });

  const commentMutation = useMutation({
    mutationFn: (payload: {
      content: string;
      postId: string;
      parentId?: string;
      scriptureRefs?: { reference: string; text: string }[];
    }) => postRequest("/comments", payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post", slug] });
      setCommentText("");
      setReplyTo(null);
      setAttachedVerses([]);
      toast({ title: "Comment posted!", variant: "success" });
    },
    onError: () =>
      toast({ title: "Failed to post comment", variant: "destructive" }),
  });

  const handleComment = () => {
    if (!commentText.trim()) return;
    if (!isAuthenticated) {
      toast({ title: "Please sign in to comment", variant: "destructive" });
      return;
    }
    commentMutation.mutate({
      content: commentText,
      postId: post.id,
      parentId: replyTo?.id,
      scriptureRefs: attachedVerses.length > 0 ? attachedVerses : undefined,
    });
  };

  const counts = reactionData?.data ?? {};
  const isBookmarked = bookmarkData?.data?.bookmarked ?? false;
  const totalReactions = Object.values(counts as Record<string, number>).reduce(
    (a, b) => a + b,
    0,
  );
  const isAuthor = user?.id === post?.author.id;

  return {
    post,
    isLoading,
    isError,
    counts,
    isBookmarked,
    totalReactions,
    isAuthor,
    handleComment,
    commentText,
    setCommentText,
    replyTo,
    setReplyTo,
    attachedVerses,
    setAttachedVerses,
    reactionMutation,
    commentMutation,
    bookmarkMutation,
  };
};
