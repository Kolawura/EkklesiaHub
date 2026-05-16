import { getRequest, deleteRequest } from "@/lib/service";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "./useToast";
import { Bookmark } from "@/lib/type";

export const useBookmarks = () => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["bookmarks"],
    queryFn: () => getRequest("/bookmarks"),
  });

  const removeMutation = useMutation({
    mutationFn: (postId: string) => deleteRequest(`/bookmarks/${postId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
      toast({ title: "Bookmark removed", variant: "success" });
    },
    onError: () =>
      toast({ title: "Failed to remove bookmark", variant: "destructive" }),
  });
  const bookmarks = data?.data ?? [];

  return {
    bookmarks: bookmarks as Bookmark[],
    isLoading,
    isPending: removeMutation.isPending,
    removeBookmark: removeMutation.mutate,
  };
};
