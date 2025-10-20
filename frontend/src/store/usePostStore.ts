import { create } from "zustand";
import type { Post } from "@/lib/type";

interface PostStore {
  posts: Post[];
  selectedPost: Post | null;
  setPosts: (posts: Post[]) => void;
  addPost: (post: Post) => void;
  updatePost: (updated: Post) => void;
  removePost: (id: string) => void;
  setSelectedPost: (post: Post | null) => void;
}

export const usePostStore = create<PostStore>((set) => ({
  posts: [],
  selectedPost: null,

  setPosts: (posts) => set({ posts }),
  addPost: (post) => set((state) => ({ posts: [post, ...state.posts] })),
  updatePost: (updated) =>
    set((state) => ({
      posts: state.posts.map((p) => (p.id === updated.id ? updated : p)),
    })),
  removePost: (id) =>
    set((state) => ({
      posts: state.posts.filter((p) => p.id !== id),
    })),
  setSelectedPost: (post) => set({ selectedPost: post }),
}));
