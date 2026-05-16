"use client";

import {
  useState,
  useRef,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import LinkExt from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import ImageExt from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import CharacterCount from "@tiptap/extension-character-count";
import Typography from "@tiptap/extension-typography"; // smart quotes, em dash, ellipsis
import { AutocorrectExtension } from "./extensions/AutocorrectExtension";
import { SlashCommandExtension } from "./extensions/SlashCommandExtension";
import { MentionExtension } from "./extensions/MentionExtension";
import { ScriptureNode } from "@/components/bible/ScriptureExtension";
import { X } from "lucide-react";
import { uploadImageFile } from "@/lib/uploadImageFile";
import { TiptapEditorRef, TiptapEditorProps } from "@/lib/type";
import { calcReadingTime } from "@/lib/format";
import { BubbleToolbar } from "./BubbleToolBar";
import { BlockBar } from "./BlockBar";

// ─────────────────────────────────────────────────────────────────────────────
// Main editor
// ─────────────────────────────────────────────────────────────────────────────

const TiptapEditor = forwardRef<TiptapEditorRef, TiptapEditorProps>(
  function TiptapEditor(
    {
      content = "",
      title: initialTitle = "",
      onChange,
      editable = true,
      placeholder = "Begin writing… (type / for commands)",
    },
    ref,
  ) {
    const [title, setTitle] = useState(initialTitle);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [imageError, setImageError] = useState<string | null>(null);
    const titleRef = useRef<HTMLTextAreaElement>(null);
    const inlineImageRef = useRef<HTMLInputElement>(null);

    // ── Editor instance ──────────────────────────────────────────────────────
    const editor = useEditor({
      extensions: [
        StarterKit.configure({ heading: { levels: [1, 2, 3] } }),

        Underline,

        LinkExt.configure({
          openOnClick: false,
          HTMLAttributes: {
            class:
              "text-gold underline cursor-pointer hover:text-gold-light transition-colors",
          },
        }),

        ImageExt.configure({
          HTMLAttributes: {
            class:
              "max-w-full h-auto rounded-2xl my-6 shadow-warm-sm border border-parchment-dark",
          },
        }),

        TextAlign.configure({ types: ["heading", "paragraph"] }),

        CharacterCount,

        Placeholder.configure({
          placeholder,
          emptyEditorClass: "is-editor-empty",
        }),

        // Smart typography — curly quotes, em dash, ellipsis, etc.
        // Handles the character-level replacements so AutocorrectExtension
        // only needs to worry about whole-word typo correction.
        Typography,

        // Whole-word typo + theological term corrections
        AutocorrectExtension,

        // "/" slash commands palette
        SlashCommandExtension,

        // "@" mention with user search dropdown
        MentionExtension,

        // Scripture blockquote node (from Bible feature)
        ScriptureNode,
      ],
      content,
      editable,
      onUpdate: ({ editor }) => {
        onChange?.({ title, content: editor.getHTML() });
      },
      editorProps: {
        attributes: { class: "ekk-editor-prose focus:outline-none" },
      },
      immediatelyRender: false,
    });

    // Sync content prop on edit page load
    useEffect(() => {
      if (editor && content && editor.getHTML() !== content) {
        editor.commands.setContent(content);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [content]);

    // Auto-size title textarea on mount
    useEffect(() => {
      if (titleRef.current) {
        titleRef.current.style.height = "auto";
        titleRef.current.style.height = `${titleRef.current.scrollHeight}px`;
      }
    }, []);

    // Expose insertScripture to parent (new/edit page)
    useImperativeHandle(
      ref,
      () => ({
        insertScripture(text: string, reference: string, version = "KJV") {
          if (!editor) return;
          editor
            .chain()
            .focus()
            .insertContent({
              type: "scripture",
              attrs: { reference, text, version },
            })
            .run();
        },
      }),
      [editor],
    );

    // ── Title handler ────────────────────────────────────────────────────────
    const handleTitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const val = e.target.value;
      setTitle(val);
      onChange?.({ title: val, content: editor?.getHTML() ?? "" });
      if (titleRef.current) {
        titleRef.current.style.height = "auto";
        titleRef.current.style.height = `${titleRef.current.scrollHeight}px`;
      }
    };

    // ── Inline image handler ─────────────────────────────────────────────────
    const handleInlineImageFile = async (
      e: React.ChangeEvent<HTMLInputElement>,
    ) => {
      const file = e.target.files?.[0];
      e.target.value = "";
      if (!file) return;
      setImageError(null);
      setUploadingImage(true);
      try {
        const url = await uploadImageFile(file);
        editor?.chain().focus().setImage({ src: url }).run();
      } catch (err: { message: string }) {
        setImageError(err.message ?? "Image upload failed.");
      } finally {
        setUploadingImage(false);
      }
    };

    // ── Derived stats ────────────────────────────────────────────────────────
    const wordCount = editor?.storage.characterCount.words() ?? 0;
    const readTime = editor ? calcReadingTime(editor.getHTML()) : 0;

    // ── Render ───────────────────────────────────────────────────────────────
    return (
      <div className="bg-parchment">
        {/* Title */}
        {editable ? (
          <textarea
            ref={titleRef}
            value={title}
            onChange={handleTitleChange}
            placeholder="Article title"
            rows={1}
            className="w-full font-display font-bold text-[clamp(2rem,4vw,2.75rem)] tracking-tight leading-tight text-ink placeholder-parchment-dark bg-transparent border-none outline-none resize-none overflow-hidden mb-6"
            style={{ minHeight: "3rem" }}
          />
        ) : (
          title && (
            <h1 className="font-display font-bold text-[clamp(2rem,4vw,2.75rem)] tracking-tight leading-tight text-ink mb-6">
              {title}
            </h1>
          )
        )}

        {/* Sticky block toolbar */}
        {editable && editor && (
          <div className="sticky top-0 z-20 bg-parchment/95 backdrop-blur-sm border-y border-parchment-dark py-2 mb-6 -mx-6 px-6">
            <BlockBar
              editor={editor}
              onInlineImageUpload={() => inlineImageRef.current?.click()}
              uploadingImage={uploadingImage}
            />
          </div>
        )}

        {/* Image error */}
        {imageError && (
          <div className="flex items-center justify-between mb-4 px-4 py-2.5 bg-red-50 border border-red-200 rounded-xl text-red-600 font-body text-sm">
            {imageError}
            <button
              onClick={() => setImageError(null)}
              className="text-red-400 hover:text-red-600 ml-3 transition-colors"
            >
              <X size={13} />
            </button>
          </div>
        )}

        {/* Bubble menu on selection */}
        {editable && editor && <BubbleToolbar editor={editor} />}

        {/* Editor content */}
        <EditorContent editor={editor} />

        {/* Hidden file input for inline images */}
        <input
          ref={inlineImageRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={handleInlineImageFile}
        />

        {/* Footer: word count + reading time */}
        {editable && (
          <div className="flex items-center gap-3 pt-6 mt-6 border-t border-parchment-dark">
            <span className="font-body text-xs text-ink-ghost">
              {wordCount.toLocaleString()} word{wordCount !== 1 ? "s" : ""}
            </span>
            <span className="text-parchment-dark">·</span>
            <span className="font-body text-xs text-ink-ghost">
              ~{readTime} min read
            </span>
            <span className="text-parchment-dark">·</span>
            <span className="font-body text-xs text-ink-ghost">
              Type{" "}
              <kbd className="font-mono bg-parchment-dark px-1.5 py-0.5 rounded text-[10px]">
                /
              </kbd>{" "}
              for commands ·{" "}
              <kbd className="font-mono bg-parchment-dark px-1.5 py-0.5 rounded text-[10px]">
                @
              </kbd>{" "}
              to mention
            </span>
          </div>
        )}
      </div>
    );
  },
);

export default TiptapEditor;
