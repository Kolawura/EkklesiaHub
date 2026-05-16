import { patchRequest } from "@/lib/service";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "./useToast";
import { Community } from "@/lib/type";

export const useCommunitySettings = (
  community: Community,
  onSaved: () => void,
  id: string,
) => {
  const [form, setForm] = useState({
    name: community.name,
    description: community.description ?? "",
    rules: community.rules ?? "",
    avatar: community.avatar ?? "",
    coverImage: community.coverImage ?? "",
    isPrivate: community.isPrivate,
  });

  const updateMutation = useMutation({
    mutationFn: () => patchRequest(`/communities/${id}`, form),
    onSuccess: (data) => {
      if (data?.success) {
        toast({ title: "Community updated!", variant: "success" });
        onSaved();
      } else {
        toast({
          title: data?.message ?? "Update failed",
          variant: "destructive",
        });
      }
    },
    onError: () =>
      toast({ title: "Failed to update community", variant: "destructive" }),
  });
  return {
    form,
    setForm,
    updateCommunity: updateMutation.mutate,
    pending: updateMutation.isPending,
  };
};
