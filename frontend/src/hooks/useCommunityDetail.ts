import { getRequest, postRequest, patchRequest } from "@/lib/service";
import { Tab, Community, Post, CommunityAnalytics, Members } from "@/lib/type";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "./useToast";

export const useCommunityDetail = (id?: string) => {
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<Tab>("posts");
  const [page, setPage] = useState(1);
  const [removeModal, setRemoveModal] = useState<{
    postId: string;
    title: string;
  } | null>(null);
  const [removeReason, setRemoveReason] = useState("");

  const { data: communityData, isLoading: communityLoading } = useQuery({
    queryKey: ["community", id],
    queryFn: () => getRequest(`/communities/${id}`),
    enabled: !!id,
  });
  const community: Community | undefined = communityData?.data;
  const isAdmin = community?.memberRole === "ADMIN";
  const isMember = community?.isMember ?? false;

  const { data: postsData, isLoading: postsLoading } = useQuery({
    queryKey: ["community-posts", id, page],
    queryFn: () => getRequest(`/communities/${id}/posts?page=${page}`),
    enabled: !!id && tab === "posts" && (!community?.isPrivate || isMember),
  });

  const { data: membersData } = useQuery({
    queryKey: ["community-members", id],
    queryFn: () => getRequest(`/communities/${id}/members`),
    enabled: tab === "members" && isMember,
  });

  const { data: analyticsData } = useQuery({
    queryKey: ["community-analytics", id],
    queryFn: () => getRequest(`/communities/${id}/analytics`),
    enabled: tab === "analytics" && isAdmin,
  });

  const joinMutation = useMutation({
    mutationFn: () => postRequest(`/communities/${id}/join`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["community", id] });
      toast({ title: "Joined community!", variant: "success" });
    },
    onError: (e) =>
      toast({
        title: e?.message ?? "Could not join",
        variant: "destructive",
      }),
  });

  const leaveMutation = useMutation({
    mutationFn: () => postRequest(`/communities/${id}/leave`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["community", id] });
      toast({ title: "Left community", variant: "success" });
    },
    onError: (e) =>
      toast({
        title: e?.message ?? "Could not leave",
        variant: "destructive",
      }),
  });

  const removeMutation = useMutation({
    mutationFn: ({ postId, reason }: { postId: string; reason: string }) =>
      patchRequest(`/posts/${postId}/remove`, { reason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["community-posts", id] });
      toast({ title: "Post removed", variant: "success" });
      setRemoveModal(null);
      setRemoveReason("");
    },
    onError: () =>
      toast({ title: "Failed to remove post", variant: "destructive" }),
  });

  const pinMutation = useMutation({
    mutationFn: (postId: string) => patchRequest(`/posts/${postId}/pin`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["community-posts", id] });
      toast({ title: "Post pin updated", variant: "success" });
    },
  });

  const roleChangeMutation = useMutation({
    mutationFn: ({ userId, newRole }: { userId: string; newRole: string }) =>
      patchRequest(`/communities/${id}/members/${userId}`, { newRole }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["community-members", id] });
      toast({ title: "Role updated", variant: "success" });
    },
    onError: (e) =>
      toast({ title: e?.message ?? "Failed", variant: "destructive" }),
  });

  return {
    posts: postsData?.data?.posts as Post[] | [],
    postsLoading,
    community: community,
    communityLoading,
    isAdmin,
    isMember,
    pagination: postsData?.data,
    members: membersData?.data as Members[] | [],
    analytics: analyticsData?.data as CommunityAnalytics,
    joinMutation,
    leaveMutation,
    removeMutation,
    pinMutation,
    roleChangeMutation,
    tab,
    setTab,
    removeModal,
    setRemoveModal,
    page,
    setPage,
    removeReason,
    setRemoveReason,
    queryClient,
  };
};
