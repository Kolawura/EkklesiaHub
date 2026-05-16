import { generateSlug } from "@/lib/format";
import { getRequest, postRequest } from "@/lib/service";
import { EditorData, Community } from "@/lib/type";
import { useQuery, useMutation } from "@tanstack/react-query";
import router from "next/router";
import { useState } from "react";
import { toast } from "./useToast";

export const useCreatePost = () => {
  const [editorData, setEditorData] = useState<EditorData>({
    title: "",
    content: "",
  });
  const [coverImage, setCoverImage] = useState("");
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(
    null,
  );
  const [selectedTags, setSelectedTags] = useState<
    { id: string; name: string }[]
  >([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { data: communitiesData } = useQuery({
    queryKey: ["my-communities"],
    queryFn: () => getRequest("/communities/mine"),
  });
  const { data: tagsData } = useQuery({
    queryKey: ["tags"],
    queryFn: () => getRequest("/tags"),
  });

  const myCommunities: Community[] = communitiesData?.data ?? [];
  const allTags: { id: string; name: string }[] = tagsData?.data ?? [];

  const createMutation = useMutation({
    mutationFn: (payload: EditorData) => postRequest("/posts", payload),
    onSuccess: (data, variables) => {
      if (data?.success) {
        toast({
          title:
            variables.status === "PUBLISHED"
              ? "Post published! 🎉"
              : "Draft saved",
          variant: "success",
        });
        router.push(
          variables.status === "PUBLISHED"
            ? `/posts/${data.data.slug}`
            : "/drafts",
        );
      } else {
        toast({
          title: data?.message ?? "Could not save post",
          variant: "destructive",
        });
      }
    },
    onError: () =>
      toast({ title: "Failed to save post", variant: "destructive" }),
  });

  const handleSubmit = (status: "DRAFT" | "PUBLISHED") => {
    if (!editorData.title.trim())
      return toast({ title: "Title is required", variant: "destructive" });
    if (!editorData.content.trim() || editorData.content === "<p></p>")
      return toast({
        title: "Content cannot be empty",
        variant: "destructive",
      });
    if (selectedTags.length > 5)
      return toast({
        title: "Maximum 5 tags allowed",
        variant: "destructive",
      });

    createMutation.mutate({
      ...editorData,
      slug: generateSlug(editorData.title),
      coverImage: coverImage || undefined,
      communityId: selectedCommunity?.id,
      tagIds: selectedTags.map((t) => t.id),
      status,
    });
  };
  const isPending = createMutation.isPending;
  return {
    setEditorData,
    coverImage,
    setCoverImage,
    selectedCommunity,
    setSelectedCommunity,
    selectedTags,
    setSelectedTags,
    sidebarOpen,
    setSidebarOpen,
    myCommunities,
    allTags,
    handleSubmit,
    isPending,
  };
};
