"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getRequest, postRequest, deleteRequest } from "@/lib/service";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/useToast";
import { BookOpen, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReadingListButtonProps {
  postId: string;
  /** "icon" = just the icon (for PostCard footer), "pill" = icon + label (for post detail) */
  variant?: "icon" | "pill";
  className?: string;
}

export function ReadingListButton({
  postId,
  variant = "icon",
  className,
}: ReadingListButtonProps) {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const { data, isLoading: checkLoading } = useQuery({
    queryKey: ["reading-list-check", postId],
    queryFn: () => getRequest(`/reading-list/check/${postId}`),
    enabled: !!postId && isAuthenticated,
    staleTime: 1000 * 60 * 2,
  });

  const inList = data?.data?.inList ?? false;
  const isRead = !!data?.data?.readAt;

  const addMutation = useMutation({
    mutationFn: () => postRequest("/reading-list", { postId }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["reading-list-check", postId],
      });
      queryClient.invalidateQueries({ queryKey: ["reading-list"] });
      queryClient.invalidateQueries({ queryKey: ["reading-list-stats"] });
      toast({ title: "Added to reading list", variant: "success" });
    },
    onError: (e: any) =>
      toast({
        title: e?.response?.data?.message ?? "Failed to add",
        variant: "destructive",
      }),
  });

  const removeMutation = useMutation({
    mutationFn: () => deleteRequest(`/reading-list/${postId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["reading-list-check", postId],
      });
      queryClient.invalidateQueries({ queryKey: ["reading-list"] });
      queryClient.invalidateQueries({ queryKey: ["reading-list-stats"] });
      toast({ title: "Removed from reading list", variant: "success" });
    },
  });

  if (!isAuthenticated) return null;

  const isPending =
    addMutation.isPending || removeMutation.isPending || checkLoading;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isPending) return;
    if (inList) {
      removeMutation.mutate();
    } else {
      addMutation.mutate();
    }
  };

  /* ── Icon-only variant (used in PostCard footer) ── */
  if (variant === "icon") {
    return (
      <button
        onClick={handleClick}
        disabled={isPending}
        title={inList ? "Remove from reading list" : "Save to reading list"}
        className={cn(
          "inline-flex items-center justify-center transition-colors disabled:opacity-40",
          inList ? "text-gold" : "text-ink-ghost hover:text-gold",
          className,
        )}
      >
        {isPending ? (
          <Loader2 size={12} className="animate-spin" />
        ) : (
          <BookOpen size={12} fill={inList ? "currentColor" : "none"} />
        )}
      </button>
    );
  }

  /* ── Pill variant (used on post detail page) ── */
  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className={cn(
        "inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border font-body text-sm transition-all disabled:opacity-40",
        inList
          ? "border-gold-pale bg-gold-bg text-gold"
          : "border-parchment-dark text-ink-faint hover:border-gold-pale hover:text-gold hover:bg-gold-bg",
        className,
      )}
    >
      {isPending ? (
        <Loader2 size={14} className="animate-spin" />
      ) : (
        <BookOpen size={14} fill={inList ? "currentColor" : "none"} />
      )}
      {inList ? (isRead ? "Read ✓" : "In reading list") : "Read later"}
    </button>
  );
}
