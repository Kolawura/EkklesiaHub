"use client";

import { useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import TiptapEditor from "@/components/tiptap/TiptapEditor";
import { BibleDrawer } from "@/components/bible/BibleDrawer";
import { api } from "@/lib/api";
import { toast } from "@/hooks/useToast";
import { useAuth } from "@/hooks/useAuth";
import { usePost } from "@/hooks/usePost";
import {
  Archive,
  ArchiveRestore,
  Undo2,
  Trash2,
  ImagePlus,
  X,
  Loader2,
  Send,
  Save,
} from "lucide-react";
import { TiptapEditorRef } from "@/lib/type";

/* ── Upload helper (same pattern as profile page) ── */
async function uploadPhoto(file: File): Promise<string> {
  if (!file.type.startsWith("image/"))
    throw new Error("Please choose an image file.");
  if (file.size > 5 * 1024 * 1024) throw new Error("Image must be under 5 MB.");
  const form = new FormData();
  form.append("file", file);
  const res = await api.post("/upload/image", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  if (!res.data?.success)
    throw new Error(res.data?.message ?? "Upload failed.");
  return res.data.data.url as string;
}

export default function EditPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const editorRef = useRef<TiptapEditorRef>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const {
    post,
    postId,
    editPost,
    setEditorData,
    editPostLoading: isLoading,
    editPostError: isError,
    editLoading,
    updateMutation,
    archiveMutation,
    unpublishMutation,
    deleteMutation,
    confirmDeleteEditPost: confirmDelete,
    setConfirmDeleteEditPost: setConfirmDelete,
    uploadingCover,
    setUploadingCover,
    coverImage,
    setCoverImage,
    ready,
  } = usePost({ slug });

  /* ── Cover image handler ── */
  const handleCoverFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploadingCover(true);
    try {
      const url = await uploadPhoto(file);
      setCoverImage(url);
    } catch (err: any) {
      toast({ title: err.message ?? "Upload failed", variant: "destructive" });
    } finally {
      setUploadingCover(false);
    }
  };

  /* ── Scripture insert ── */
  const handleScriptureInsert = (
    text: string,
    reference: string,
    version?: string,
  ) => {
    editorRef.current?.insertScripture(text, reference, version);
  };

  /* ── Auth guard ── */
  if (!isLoading && !editLoading && post && post.author?.id !== user?.id) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="font-body text-sm text-ink-faint">
          You don&apos;t have permission to edit this post.
        </p>
      </div>
    );
  }

  /* ── Loading state ── */
  // deleteMutation.isSuccess: show the spinner while redirecting, never a "Post not found" flash
  if (isLoading || editLoading || !ready || deleteMutation.isSuccess) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-7 h-7 border-2 border-parchment-dark border-t-gold rounded-full animate-spin" />
      </div>
    );
  }

  /* ── Error state ── */
  if (isError || !editPost) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="font-body text-sm text-red-600">
          Post not found or you don&apos;t have access.
        </p>
      </div>
    );
  }

  const isPending =
    updateMutation.isPending ||
    archiveMutation.isPending ||
    unpublishMutation.isPending ||
    deleteMutation.isPending;

  const isDraft = editPost.status === "DRAFT";
  const isArchived = editPost.status === "ARCHIVED";

  return (
    <div className="h-full flex flex-col bg-parchment">
      {/* ── Top action bar ── */}
      <div className="shrink-0 flex items-center justify-between gap-2 px-3 sm:px-5 py-2.5 border-b border-parchment-dark bg-parchment/95 sm:backdrop-blur-sm z-30">
        {/* Left: back */}
        <button
          onClick={() => router.push(`/posts/${slug}`)}
          className="shrink-0 py-2 font-body text-sm text-ink-ghost hover:text-ink transition-colors"
        >
          ← <span className="hidden sm:inline">Back to post</span><span className="sm:hidden">Back</span>
        </button>

        {/* Right: actions */}
        <div className="flex min-w-0 items-center gap-1 sm:gap-1.5">
          {/* Bible drawer — inline mode */}
          <BibleDrawer
            mode="inline"
            showInsert
            onInsert={handleScriptureInsert}
          />

          <div className="hidden sm:block w-px h-5 bg-parchment-dark mx-1" />

          {/* Archive */}
          {!isArchived && postId && (
            <button
              onClick={() => archiveMutation.mutate(postId)}
              disabled={isPending}
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-2 sm:py-1.5 font-body text-xs text-ink-ghost hover:text-amber-600 hover:bg-amber-50 rounded-lg disabled:opacity-40 transition-colors"
            >
              <Archive size={13} /> <span className="hidden sm:inline">Archive</span>
            </button>
          )}

          {/* Move archived post back to drafts */}
          {isArchived && postId && (
            <button
              onClick={() => unpublishMutation.mutate(postId)}
              disabled={isPending}
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-2 sm:py-1.5 font-body text-xs text-ink-ghost hover:text-gold hover:bg-gold-bg rounded-lg disabled:opacity-40 transition-colors"
            >
              <Undo2 size={13} /> <span className="hidden sm:inline">Move to drafts</span>
            </button>
          )}

          {/* Delete */}
          {!confirmDelete ? (
            <button
              onClick={() => setConfirmDelete(true)}
              disabled={isPending}
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-2 sm:py-1.5 font-body text-xs text-ink-ghost hover:text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-40 transition-colors"
            >
              <Trash2 size={13} /> <span className="hidden sm:inline">Delete</span>
            </button>
          ) : (
            <div className="flex items-center gap-1.5">
              <span className="hidden sm:inline font-body text-xs text-red-600 font-medium">
                Delete permanently?
              </span>
              {postId && (
                <button
                  onClick={() =>
                    deleteMutation.mutate(postId, {
                      // Leave the page of a post that no longer exists
                      onSuccess: () => router.replace("/posts"),
                    })
                  }
                  disabled={isPending}
                  className="font-body text-xs px-2.5 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                >
                  {deleteMutation.isPending ? (
                    <Loader2 size={11} className="animate-spin" />
                  ) : (
                    "Yes, delete"
                  )}
                </button>
              )}
              <button
                onClick={() => setConfirmDelete(false)}
                className="font-body text-xs px-2.5 py-1.5 border border-parchment-dark text-ink-faint rounded-lg hover:bg-parchment-deep transition-colors"
              >
                No
              </button>
            </div>
          )}

          <div className="w-px h-5 bg-parchment-dark mx-1" />

          {/* Save & Publish (drafts) / Save & Restore (archived) */}
          {(isDraft || isArchived) && (
            <button
              onClick={() => updateMutation.mutate("PUBLISHED")}
              disabled={isPending}
              className="inline-flex items-center gap-1.5 font-body text-sm text-ink-faint bg-parchment-deep border border-parchment-dark px-3 sm:px-4 py-2 sm:py-1.5 rounded-lg hover:bg-parchment-dark disabled:opacity-50 transition-colors"
            >
              {isArchived ? <ArchiveRestore size={13} /> : <Send size={13} />}
              <span className="hidden sm:inline">{isArchived ? "Restore & publish" : "Publish"}</span>
            </button>
          )}

          {/* Save changes */}
          <button
            onClick={() => updateMutation.mutate()}
            disabled={isPending}
            className="inline-flex items-center gap-1.5 font-body text-sm font-medium bg-ink text-parchment px-3.5 sm:px-5 py-2 sm:py-1.5 rounded-lg hover:bg-ink-medium disabled:opacity-50 transition-all"
          >
            {updateMutation.isPending ? (
              <span className="w-3.5 h-3.5 border-2 border-parchment/30 border-t-parchment rounded-full animate-spin" />
            ) : (
              <Save size={13} />
            )}
            <span className="hidden min-[400px]:inline">Save</span><span className="hidden sm:inline">&nbsp;changes</span>
          </button>
        </div>
      </div>

      {/* ── Editor area ── */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 py-6 sm:px-6 sm:py-10">
          {/* ── Cover image — click overlay approach (no drop zone) ── */}
          {coverImage ? (
            /* Existing cover: show preview with change / remove overlay */
            <div className="relative aspect-video rounded-2xl overflow-hidden border border-parchment-dark mb-8 group">
              <img
                src={coverImage}
                alt="Cover"
                className="w-full h-full object-cover"
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-ink/40 hoverable:opacity-0 hoverable:group-hover:opacity-100 touch:bg-transparent touch:items-end touch:justify-end touch:p-3 transition-opacity flex items-center justify-center gap-3">
                <button
                  onClick={() => coverInputRef.current?.click()}
                  disabled={uploadingCover}
                  className="inline-flex items-center gap-1.5 font-body text-sm font-medium bg-parchment text-ink px-4 py-2 rounded-xl hover:bg-parchment-deep transition-colors"
                >
                  {uploadingCover ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <ImagePlus size={14} />
                  )}
                  Change photo
                </button>
                <button
                  onClick={() => setCoverImage("")}
                  className="inline-flex items-center gap-1.5 font-body text-sm font-medium bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700 transition-colors"
                >
                  <X size={14} />
                  Remove
                </button>
              </div>
            </div>
          ) : (
            /* No cover: simple "Add cover" button */
            <button
              onClick={() => coverInputRef.current?.click()}
              disabled={uploadingCover}
              className="flex items-center gap-2 font-body text-sm text-ink-ghost hover:text-ink-faint mb-8 transition-colors group"
            >
              <span className="w-8 h-8 rounded-xl border border-parchment-dark bg-parchment-deep flex items-center justify-center group-hover:border-gold-pale group-hover:bg-gold-bg group-hover:text-gold transition-all">
                {uploadingCover ? (
                  <Loader2 size={13} className="animate-spin text-gold" />
                ) : (
                  <ImagePlus size={13} />
                )}
              </span>
              {uploadingCover ? "Uploading…" : "Add cover image"}
            </button>
          )}

          {/* Hidden file input */}
          <input
            ref={coverInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleCoverFile}
          />

          {/* ── Editor ── */}
          <TiptapEditor
            ref={editorRef}
            key={editPost.id}
            content={editPost.content}
            title={editPost.title}
            onChange={setEditorData}
          />
        </div>
      </div>
    </div>
  );
}
