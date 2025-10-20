import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createPost,
  getPosts,
  getPostBySlug,
  getPostsByAuthor,
  getPostsByCommunity,
  publishPost,
  archivePost,
  updatePost,
  deletePost,
} from "@/lib/posts";
import type { Post } from "@/lib/type";

export const usePosts = () => {
  return useQuery<Post[]>({
    queryKey: ["posts"],
    queryFn: async () => getPosts(),
  });
};

export const usePostBySlug = (slug: string) => {
  return useQuery<Post>({
    queryKey: ["post", slug],
    queryFn: async () => getPostBySlug(slug),
    enabled: !!slug,
  });
};

export const usePostsByAuthor = (authorId: string) => {
  return useQuery<Post[]>({
    queryKey: ["posts", "author", authorId],
    queryFn: async () => getPostsByAuthor(authorId),
    enabled: !!authorId,
  });
};

export const usePostsByCommunity = (communityId: string) => {
  return useQuery<Post[]>({
    queryKey: ["posts", "community", communityId],
    queryFn: async () => getPostsByCommunity(communityId),
    enabled: !!communityId,
  });
};

// ---------- Mutations ----------

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};

export const useUpdatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: object }) =>
      updatePost(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};

export const usePublishPost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: publishPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};

export const useArchivePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: archivePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};
