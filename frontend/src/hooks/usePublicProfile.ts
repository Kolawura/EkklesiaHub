import { getRequest, deleteRequest, postRequest } from "@/lib/service";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "./useToast";
import { useAuth } from "./useAuth";
import { ApiResponse, Following, UserPost } from "@/lib/type";

export const usePublicProfile = (userId: string) => {
  const queryClient = useQueryClient();
  const { user: currentUser } = useAuth();

  const [page, setPage] = useState(1);
  const isOwnProfile = currentUser?.id === userId;

  const { data: profileData, isLoading: profileLoading } = useQuery({
    queryKey: ["profile", userId],
    queryFn: () => getRequest(`/users/${userId}`),
    enabled: !!userId,
  });

  const { data: postsData, isLoading: postsLoading } = useQuery<
    ApiResponse<UserPost>
  >({
    queryKey: ["user-posts", userId, page],
    queryFn: () => getRequest(`/users/${userId}/posts?page=${page}`),
    enabled: !!userId,
  });

  const { data: followingData } = useQuery<ApiResponse<Following[]>>({
    queryKey: ["following", currentUser?.id],
    queryFn: () => getRequest(`/follow/following/${currentUser?.id}`),
    enabled: !!currentUser?.id && !isOwnProfile,
  });

  const isFollowing =
    followingData?.data?.some((f) => f.following?.id === userId) ?? false;

  const followMutation = useMutation({
    mutationFn: () =>
      isFollowing
        ? deleteRequest(`/follow/unfollow/${userId}`)
        : postRequest(`/follow/follow/${userId}`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["following", currentUser?.id],
      });
      queryClient.invalidateQueries({ queryKey: ["profile", userId] });
      toast({
        title: isFollowing ? "Unfollowed" : "Following!",
        variant: "success",
      });
    },
    onError: () => toast({ title: "Action failed", variant: "destructive" }),
  });

  const profile = profileData?.data;
  const posts = postsData?.data?.posts ?? [];
  const pagination = postsData?.data?.pagination;

  return {
    profile,
    posts,
    pagination,
    page,
    setPage,
    profileLoading,
    postsLoading,
    followMutation,
    isOwnProfile,
    isFollowing,
  };
};
