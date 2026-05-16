import { getRequest, postRequest } from "@/lib/service";
import { Community } from "@/lib/type";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "./useToast";

export const useCommunity = () => {
  const queryClient = useQueryClient();
  const [showCreate, setShowCreate] = useState(false);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    name: "",
    description: "",
    isPrivate: false,
  });

  const { data, isLoading } = useQuery({
    queryKey: ["communities", search],
    queryFn: () =>
      getRequest(
        `/communities${search ? `?search=${encodeURIComponent(search)}` : ""}`,
      ),
  });

  const joinMutation = useMutation({
    mutationFn: (id: string) => postRequest(`/communities/${id}/join`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["communities"] });
      toast({ title: "Joined!", variant: "success" });
    },
    onError: (e) =>
      toast({
        title: e?.message ?? "Could not join",
        variant: "destructive",
      }),
  });

  const createMutation = useMutation({
    mutationFn: () => postRequest("/communities", form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["communities"] });
      toast({ title: "Community created!", variant: "success" });
      setForm({ name: "", description: "", isPrivate: false });
      setShowCreate(false);
    },
    onError: () =>
      toast({ title: "Failed to create community", variant: "destructive" }),
  });

  return {
    communities: data?.data as Community[] | [],
    showCreate,
    setShowCreate,
    search,
    setSearch,
    form,
    setForm,
    isLoading,
    joinMutation,
    createMutation,
  };
};
