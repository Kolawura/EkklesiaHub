"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import TiptapEditor from "@/components/tiptap/TiptapEditor";
import { BibleDrawer } from "@/components/bible/BibleDrawer";
import { toast } from "@/hooks/useToast";
import { TiptapEditorRef } from "@/lib/type";
import { Users, Tag, ChevronRight, Send, FileEdit } from "lucide-react";
import { cn } from "@/lib/utils";
import { MetaPanel } from "@/components/tiptap/MetaPanel";
import { useCreatePost } from "@/hooks/useCreatePost";

/* ── Main Page ── */
export default function CreatePostPage() {
  const router = useRouter();
  const editorRef = useRef<TiptapEditorRef>(null);
  const {
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
  } = useCreatePost();

  const handleScriptureInsert = (
    text: string,
    reference: string,
    version?: string,
  ) => {
    editorRef.current?.insertScripture(text, reference, version);
  };

  return (
    <div className="h-full flex flex-col bg-parchment">
      {/* Top action bar */}
      <div className="shrink-0 flex items-center justify-between px-5 py-2.5 border-b border-parchment-dark bg-parchment/95 backdrop-blur-sm z-30">
        <button
          onClick={() => router.back()}
          className="font-body text-sm text-ink-ghost hover:text-ink transition-colors"
        >
          ← Discard
        </button>

        <div className="flex items-center gap-2">
          {selectedCommunity && (
            <span className="hidden sm:inline-flex items-center gap-1.5 font-body text-xs text-gold bg-gold-bg border border-gold-pale px-2.5 py-1 rounded-full">
              <Users size={10} />
              {selectedCommunity.name}
            </span>
          )}
          {selectedTags.length > 0 && (
            <span className="hidden sm:inline-flex items-center gap-1 font-body text-xs text-ink-ghost bg-parchment-deep border border-parchment-dark px-2.5 py-1 rounded-full">
              <Tag size={10} />
              {selectedTags.length} tag{selectedTags.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Bible drawer — inline mode, wired to editor */}
          <BibleDrawer
            mode="inline"
            showInsert
            onInsert={handleScriptureInsert}
          />

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={cn(
              "inline-flex items-center gap-1.5 font-body text-sm px-3 py-1.5 rounded-lg border transition-all",
              sidebarOpen
                ? "bg-gold-bg text-gold border-gold-pale"
                : "text-ink-faint border-parchment-dark hover:bg-parchment-deep hover:text-ink",
            )}
          >
            <ChevronRight
              size={13}
              className={cn(
                "transition-transform",
                sidebarOpen ? "rotate-90" : "",
              )}
            />
            <span className="hidden sm:inline">Settings</span>
          </button>

          <div className="w-px h-5 bg-parchment-dark" />

          <button
            onClick={() => handleSubmit("DRAFT")}
            disabled={isPending}
            className="inline-flex items-center gap-1.5 font-body text-sm text-ink-faint border border-parchment-dark px-4 py-1.5 rounded-lg hover:bg-parchment-deep hover:text-ink disabled:opacity-40 transition-all"
          >
            <FileEdit size={13} />
            Save draft
          </button>

          <button
            onClick={() => handleSubmit("PUBLISHED")}
            disabled={isPending}
            className="inline-flex items-center gap-1.5 font-body text-sm font-medium bg-ink text-parchment px-5 py-1.5 rounded-lg hover:bg-ink-medium disabled:opacity-50 transition-all"
          >
            {isPending ? (
              <span className="w-3.5 h-3.5 border-2 border-parchment/30 border-t-parchment rounded-full animate-spin" />
            ) : (
              <Send size={13} />
            )}
            Publish
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-2xl mx-auto px-6 py-10">
            <TiptapEditor
              ref={editorRef}
              onChange={setEditorData}
              placeholder="Begin writing your article…"
            />
          </div>
        </div>

        {/* Settings sidebar */}
        <div
          className={cn(
            "shrink-0 overflow-y-auto border-l border-parchment-dark bg-parchment-deep transition-all duration-300",
            sidebarOpen ? "w-72" : "w-0 border-l-0 overflow-hidden",
          )}
        >
          {sidebarOpen && (
            <div className="p-5 min-w-[18rem]">
              <h2 className="font-display text-sm font-semibold text-ink mb-5 pb-3 border-b border-parchment-dark">
                Post settings
              </h2>
              <MetaPanel
                communities={myCommunities}
                allTags={allTags}
                selectedCommunity={selectedCommunity}
                onSelectCommunity={setSelectedCommunity}
                selectedTags={selectedTags}
                onSelectTag={(t) => {
                  if (selectedTags.length >= 5) {
                    toast({ title: "Maximum 5 tags", variant: "destructive" });
                    return;
                  }
                  setSelectedTags((prev) => [...prev, t]);
                }}
                onRemoveTag={(id) =>
                  setSelectedTags((prev) => prev.filter((t) => t.id !== id))
                }
                coverImage={coverImage}
                onCoverChange={setCoverImage}
                onCoverClear={() => setCoverImage("")}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
