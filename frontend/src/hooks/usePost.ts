import {
  deleteRequest,
  getRequest,
  patchRequest,
  putRequest,
} from "@/lib/service";
import { ApiResponse, EditorData, Post } from "@/lib/type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "./useToast";
import { useAuth } from "./useAuth";

type FilterStatus = "ALL" | "DRAFT" | "ARCHIVED";

export const usePost = ({ limit, slug }: { limit?: number; slug?: string }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [page, setPage] = useState(Number(searchParams.get("page") ?? 1));
  const [filter, setFilter] = useState<FilterStatus>("ALL");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [editorData, setEditorData] = useState<EditorData>({
    title: "",
    content: "",
  });
  const [coverImage, setCoverImage] = useState("");
  const [uploadingCover, setUploadingCover] = useState(false);
  const [ready, setReady] = useState(false);
  const [confirmDeleteEditPost, setConfirmDeleteEditPost] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 350);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.set("search", debouncedSearch);
    if (page > 1) params.set("page", String(page));
    router.replace(
      `/posts${params.toString() ? "?" + params.toString() : ""}`,
      {
        scroll: false,
      },
    );
  }, [debouncedSearch, page, router]);

  const {
    data: editPostData,
    isLoading: editPostLoading,
    isError: editPostError,
  } = useQuery<ApiResponse<Post>>({
    queryKey: ["post-slug", slug],
    queryFn: () => getRequest(`/posts/slug/${slug}`),
    enabled: !!slug,
  });

  const post = editPostData?.data;
  const postId = post?.id;

  const { data: editData, isLoading: editLoading } = useQuery({
    queryKey: ["post-edit", postId],
    queryFn: () => getRequest(`/posts/${postId}/edit`),
    enabled: !!postId,
  });

  const editPost = editData?.data;

  useEffect(() => {
    if (editPost && !ready) {
      setEditorData({ title: editPost.title, content: editPost.content });
      setCoverImage(editPost.coverImage ?? "");
      setReady(true);
    }
  }, [editPost, ready]);

  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ["posts", debouncedSearch, page],
    queryFn: () =>
      getRequest(
        `/posts?search=${debouncedSearch}&page=${page}&limit=${limit}`,
      ),
    placeholderData: (prev) => prev,
  });

  const { data: myPosts, isLoading: isMyPostsLoading } = useQuery({
    queryKey: ["my-posts", user?.id],
    queryFn: () => getRequest(`/posts/author/${user?.id}`),
    enabled: !!user?.id,
  });

  const allPosts = (myPosts?.data as Post[]) || [];
  const authorPosts =
    filter === "ALL"
      ? allPosts.filter((p) => p.status !== "PUBLISHED")
      : allPosts.filter((p) => p.status === filter);

  const updateMutation = useMutation({
    mutationFn: (status?: string) =>
      putRequest(`/posts/${postId}`, {
        title: editorData.title,
        content: editorData.content,
        coverImage: coverImage || undefined,
        ...(status ? { status } : {}),
      }),
    onSuccess: (data) => {
      if (data?.success) {
        queryClient.invalidateQueries({ queryKey: ["post", slug] });
        queryClient.invalidateQueries({ queryKey: ["my-posts"] });
        toast({ title: "Post updated!", variant: "success" });
        router.push(`/posts/${slug}`);
      } else {
        toast({
          title: data?.message ?? "Update failed",
          variant: "destructive",
        });
      }
    },
    onError: () =>
      toast({ title: "Failed to update post", variant: "destructive" }),
  });

  const publishMutation = useMutation({
    mutationFn: (id: string) => patchRequest(`/posts/${id}/publish`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-posts"] });
      toast({ title: "Post published! 🎉", variant: "success" });
    },
    onError: () =>
      toast({ title: "Failed to publish", variant: "destructive" }),
  });

  const archiveMutation = useMutation({
    mutationFn: (id: string) => patchRequest(`/posts/${id}/archive`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-posts"] });
      toast({ title: "Post archived", variant: "success" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteRequest(`/posts/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-posts"] });
      toast({ title: "Post deleted", variant: "success" });
      setConfirmDelete(null);
    },
    onError: () => toast({ title: "Failed to delete", variant: "destructive" }),
  });

  const counts: Record<FilterStatus, number> = {
    ALL: allPosts.filter((p) => p.status !== "PUBLISHED").length,
    DRAFT: allPosts.filter((p) => p.status === "DRAFT").length,
    ARCHIVED: allPosts.filter((p) => p.status === "ARCHIVED").length,
  };

  const filterLabels: Record<FilterStatus, string> = {
    ALL: "All unpublished",
    DRAFT: "Drafts",
    ARCHIVED: "Archived",
  };

  const posts: Post[] = data?.data?.posts ?? [];
  const pagination = data?.data?.pagination;
  return {
    posts,
    post,
    postId,
    editPost,
    setEditorData,
    editPostLoading,
    editPostError,
    editLoading,
    authorPosts,
    isMyPostsLoading,
    pagination,
    search,
    debouncedSearch,
    setSearch,
    page,
    setPage,
    isLoading,
    isError,
    isFetching,
    filter,
    setFilter,
    counts,
    filterLabels,
    updateMutation,
    publishMutation,
    archiveMutation,
    deleteMutation,
    confirmDelete,
    confirmDeleteEditPost,
    setConfirmDelete,
    setConfirmDeleteEditPost,
    uploadingCover,
    setUploadingCover,
    coverImage,
    setCoverImage,
    ready,
    setReady,
  };
};
