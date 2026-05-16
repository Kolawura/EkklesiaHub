import { api } from "@/lib/api";
import { getRequest, putRequest } from "@/lib/service";
import { uploadImageFile } from "@/lib/uploadImageFile";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { useState, useRef, useEffect, useCallback } from "react";
import { toast } from "./useToast";
import { useAuth } from "./useAuth";
import { ApiResponse, Post, UsernameState } from "@/lib/type";

export const useProfile = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    firstName: user?.firstName ?? "",
    lastName: user?.lastName ?? "",
    username: user?.username ?? "",
    bio: user?.bio ?? "",
    profileImg: user?.profileImg ?? "",
    bannerImg: user?.bannerImg ?? "",
  });

  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [usernameState, setUsernameState] =
    useState<UsernameState>("unchanged");

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const usernameDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  useEffect(() => {
    if (user) {
      setForm({
        firstName: user.firstName ?? "",
        lastName: user.lastName ?? "",
        username: user.username ?? "",
        bio: user.bio ?? "",
        profileImg: user.profileImg ?? "",
        bannerImg: user.bannerImg ?? "",
      });
    }
  }, [user]);

  const cancelEdit = () => {
    setForm({
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
      username: user?.username ?? "",
      bio: user?.bio ?? "",
      profileImg: user?.profileImg ?? "",
      bannerImg: user?.bannerImg ?? "",
    });
    setUsernameState("unchanged");
    setEditing(false);
  };

  /* ── Username live check ── */
  const checkUsername = useCallback(
    (value: string) => {
      const trimmed = value.trim().toLowerCase();
      if (trimmed === (user?.username ?? "").toLowerCase()) {
        setUsernameState("unchanged");
        return;
      }
      const USERNAME_REGEX = /^[a-z0-9_-]{3,30}$/;
      // Validate format first
      if (!USERNAME_REGEX.test(trimmed)) {
        setUsernameState("invalid");
        return;
      }

      setUsernameState("checking");

      if (usernameDebounceRef.current)
        clearTimeout(usernameDebounceRef.current);
      usernameDebounceRef.current = setTimeout(async () => {
        try {
          const res = await api.get("/users/check-username", {
            params: { username: trimmed },
          });
          setUsernameState(res.data?.available ? "available" : "taken");
        } catch {
          setUsernameState("idle");
        }
      }, 500);
    },
    [user?.username],
  );

  const handleUsernameChange = (value: string) => {
    setForm((prev) => ({ ...prev, username: value }));
    checkUsername(value);
  };

  /* ── Photo upload handlers ── */
  const handleAvatarFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploadingAvatar(true);
    try {
      const url = await uploadImageFile(file);
      setForm((prev) => ({ ...prev, profileImg: url }));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast({ title: err.message ?? "Upload failed", variant: "destructive" });
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleBannerFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploadingBanner(true);
    try {
      const url = await uploadImageFile(file);
      setForm((prev) => ({ ...prev, bannerImg: url }));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast({ title: err.message ?? "Upload failed", variant: "destructive" });
    } finally {
      setUploadingBanner(false);
    }
  };

  /* ── Posts query ── */
  const { data: postsData } = useQuery<ApiResponse<Post[]>>({
    queryKey: ["myPosts", user?.id],
    queryFn: () => getRequest(`/posts/author/${user?.id}`),
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 2,
  });

  /* ── Save mutation ── */
  const updateMutation = useMutation({
    mutationFn: () =>
      putRequest("/auth/me", {
        ...form,
        username: form.username.trim().toLowerCase(),
      }),
    onSuccess: (data) => {
      if (data?.success) {
        queryClient.invalidateQueries({ queryKey: ["currentUser"] });
        toast({ title: "Profile updated!", variant: "success" });
        setUsernameState("unchanged");
        setEditing(false);
      } else {
        toast({
          title: data?.message ?? "Update failed",
          variant: "destructive",
        });
      }
    },
    onError: () =>
      toast({ title: "Failed to update profile", variant: "destructive" }),
  });

  const canSave =
    !uploadingAvatar &&
    !uploadingBanner &&
    usernameState !== "taken" &&
    usernameState !== "invalid" &&
    usernameState !== "checking";

  /* ── Derived values ── */
  const allPosts = postsData?.data ?? [];
  const myPosts = allPosts.filter((p) => p.status === "PUBLISHED");
  const initials = user
    ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase()
    : "?";
  const totalViews = myPosts.reduce((a, p) => a + (p.viewCount ?? 0), 0);
  const totalReactions = myPosts.reduce(
    (a, p) => a + (p._count?.reactions ?? 0),
    0,
  );
  const totalComments = myPosts.reduce(
    (a, p) => a + (p._count?.comments ?? 0),
    0,
  );
  return {
    editing,
    setEditing,
    form,
    setForm,
    uploadingAvatar,
    setUploadingAvatar,
    uploadingBanner,
    setUploadingBanner,
    usernameState,
    setUsernameState,
    avatarInputRef,
    bannerInputRef,
    usernameDebounceRef,
    cancelEdit,
    handleAvatarFile,
    handleBannerFile,
    handleUsernameChange,
    updateMutation,
    canSave,
    allPosts,
    myPosts,
    initials,
    totalViews,
    totalComments,
    totalReactions,
  };
};
