// src/components/tiptap/TiptapEditor.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight } from "lowlight";
import "highlight.js/styles/github-dark.css";
import "@/components/tiptap/styles/tiptap.css";
import { MenuBar } from "./MenuBar";
import { ImagePlus, X } from "lucide-react";

const lowlight = createLowlight(common);

// Update these to match your Express server
const UPLOAD_ENDPOINT =
  process.env.NEXT_PUBLIC_UPLOAD_ENDPOINT || "http://localhost:4000/upload";

interface TiptapEditorProps {
  content?: string;
  title?: string;
  coverImage?: string;
  tags?: string[];
  onChange?: (data: {
    title: string;
    slug: string;
    tags: string[];
    content: string;
    coverImage?: string;
  }) => void;
  editable?: boolean;
  placeholder?: string;
}

export default function TiptapEditor({
  content = "",
  title: initialTitle = "",
  coverImage: initialCoverImage,
  tags: initialTags = [],
  onChange,
  editable = true,
  placeholder,
}: TiptapEditorProps) {
  const [title, setTitle] = useState(initialTitle);
  const [coverImage, setCoverImage] = useState<string | undefined>(
    initialCoverImage
  );
  const [tags, setTags] = useState<string[]>(initialTags);
  const [currentTag, setCurrentTag] = useState("");
  // const [filesPreview, setFilesPreview] = useState<
  //   { name: string; dataUrl: string; url?: string }[]
  // >([]);
  const [uploading, setUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const titleRef = useRef<HTMLTextAreaElement | null>(null);
  // const dropRef = useRef<HTMLDivElement | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
        heading: { levels: [1, 2, 3] },
      }),
      CodeBlockLowlight.configure({ lowlight }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: "text-blue-600 underline" },
      }),
      Image.configure({
        HTMLAttributes: { class: "max-w-full h-auto rounded" },
      }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({
        placeholder: ({ node }) =>
          node.type.name === "heading"
            ? "Write a heading..."
            : placeholder || "Start writing...",
      }),
    ],
    content,
    immediatelyRender: false,
    editable,
    onUpdate: ({ editor }) => {
      // propagate onChange to parent for live preview, if desired
      onChange?.({
        title,
        slug: slugify(title),
        tags,
        content: editor.getHTML(),
        coverImage,
      });
    },
    editorProps: {
      attributes: {
        class:
          "tiptap prose prose-lg focus:outline-none max-w-none px-4 md:px-10 lg:px-24 py-4 min-h-[350px] dark:prose-invert prose-h1:text-4xl prose-h1:font-bold prose-h2:text-3xl prose-h2:font-semibold prose-h3:text-2xl prose-h3:font-medium prose-code:bg-gray-100 prose-code:dark:bg-gray-800 prose-code:px-1 prose-code:rounded prose-pre:bg-gray-100 prose-pre:dark:bg-gray-800 prose-pre:rounded-lg prose-pre:p-4 prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:pl-4 prose-blockquote:italic prose-ul:list-disc prose-ol:list-decimal",
      },
    },
  });

  // autosize title
  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.style.height = "auto";
      titleRef.current.style.height = titleRef.current.scrollHeight + "px";
    }
  }, [title]);

  // helper: read file as dataURL
  const readFileAsDataUrl = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  // upload file to express backend (multipart/form-data)
  const uploadFileToServer = async (file: File) => {
    try {
      setUploading(true);
      const form = new FormData();
      form.append("file", file);
      const res = await fetch(UPLOAD_ENDPOINT, { method: "POST", body: form });
      const json = await res.json();
      setUploading(false);
      console.log(uploading);
      return json?.url as string | undefined;
    } catch (err) {
      console.error("upload error", err);
      setUploading(false);
      return undefined;
    }
  };

  // handle files list (drag/drop or input)
  // const handleFiles = async (files: FileList | null) => {
  //   if (!files || files.length === 0) return;
  //   const list = Array.from(files).slice(0, 3); // max 3 previews
  //   // optional size check (5MB)
  //   const filtered = list.filter((f) => {
  //     if (f.size > 5 * 1024 * 1024) {
  //       console.warn("File too large:", f.name);
  //       return false;
  //     }
  //     return true;
  //   });
  //   const previews = await Promise.all(
  //     filtered.map(async (f) => ({
  //       name: f.name,
  //       dataUrl: await readFileAsDataUrl(f),
  //     }))
  //   );
  //   setFilesPreview(previews);

  //   // upload each and store url
  //   const uploaded = await Promise.all(
  //     filtered.map((f) => uploadFileToServer(f))
  //   );
  //   setFilesPreview((prev) => prev.map((p, i) => ({ ...p, url: uploaded[i] })));
  // };

  // drag & drop handlers
  // useEffect(() => {
  //   const el = dropRef.current;
  //   if (!el) return;

  //   const onDragOver = (e: DragEvent) => {
  //     e.preventDefault();
  //     el.classList.add("ring-2", "ring-blue-300");
  //   };
  //   const onDragLeave = () => {
  //     el.classList.remove("ring-2", "ring-blue-300");
  //   };
  //   const onDrop = (e: DragEvent) => {
  //     e.preventDefault();
  //     el.classList.remove("ring-2", "ring-blue-300");
  //     const dt = e.dataTransfer;
  //     if (!dt) return;
  //     handleFiles(dt.files);
  //   };

  //   el.addEventListener("dragover", onDragOver);
  //   el.addEventListener("dragleave", onDragLeave);
  //   el.addEventListener("drop", onDrop);
  //   return () => {
  //     el.removeEventListener("dragover", onDragOver);
  //     el.removeEventListener("dragleave", onDragLeave);
  //     el.removeEventListener("drop", onDrop);
  //   };
  // });

  // tags
  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const newTag = currentTag.trim().toLowerCase();
      if (newTag && !tags.includes(newTag)) {
        const next = [...tags, newTag];
        setTags(next);
        onChange?.({
          title,
          slug: slugify(title),
          tags: next,
          content: editor?.getHTML() || "",
          coverImage,
        });
      }
      setCurrentTag("");
    } else if (e.key === "Backspace" && !currentTag && tags.length > 0) {
      setTags((t) => t.slice(0, -1));
    }
  };
  const removeTag = (tag: string) => {
    const next = tags.filter((t) => t !== tag);
    setTags(next);
    onChange?.({
      title,
      slug: slugify(title),
      tags: next,
      content: editor?.getHTML() || "",
      coverImage,
    });
  };

  // cover image upload
  const handleCoverImageFile = async (file: File | null) => {
    if (!file) return;
    const preview = await readFileAsDataUrl(file);
    setCoverImage(preview);
    const url = await uploadFileToServer(file);
    if (url) setCoverImage(url);
    onChange?.({
      title,
      slug: slugify(title),
      tags,
      content: editor?.getHTML() || "",
      coverImage: url ?? preview,
    });
  };

  const removeCoverImage = () => {
    setCoverImage(undefined);
    onChange?.({
      title,
      slug: slugify(title),
      tags,
      content: editor?.getHTML() || "",
      coverImage: undefined,
    });
  };

  // helper slugify
  function slugify(s: string) {
    return (s || "")
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9\-_]/g, "");
  }

  return (
    <div className="rounded-md border border-gray-200 dark:border-gray-700 shadow-sm">
      {/* Title */}
      <div className="px-8 md:px-16 lg:px-24 pt-8">
        <textarea
          ref={titleRef}
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            onChange?.({
              title: e.target.value,
              slug: slugify(e.target.value),
              tags,
              content: editor?.getHTML() || "",
              coverImage,
            });
          }}
          placeholder="Title"
          rows={1}
          className="w-full text-4xl md:text-5xl font-bold placeholder-gray-400 bg-transparent border-none focus:outline-none resize-none text-gray-900 dark:text-gray-100"
          style={{ minHeight: 60 }}
        />
      </div>

      {/* Tags */}
      <div className="px-8 md:px-16 lg:px-24 mt-4 mb-2">
        <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
          {tags.map((tag) => (
            <div
              key={tag}
              className="flex items-center gap-2 bg-gray-200 dark:bg-gray-800 text-sm px-2 py-1 rounded-full"
            >
              <span className="text-gray-800 dark:text-gray-100">#{tag}</span>
              <button
                onClick={() => removeTag(tag)}
                className="text-gray-600 dark:text-gray-300"
              >
                <X size={14} />
              </button>
            </div>
          ))}
          <input
            value={currentTag}
            onChange={(e) => setCurrentTag(e.target.value)}
            onKeyDown={handleTagKeyDown}
            placeholder={
              tags.length === 0 ? "Add tags (press Enter or comma)..." : ""
            }
            className="flex-1 bg-transparent border-none focus:outline-none text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400"
          />
        </div>
      </div>

      {/* Cover image */}
      <div className="px-8 md:px-16 lg:px-24 pt-4">
        {coverImage ? (
          <div className="relative w-full h-64 md:h-96 bg-gray-100 dark:bg-gray-900 rounded">
            <picture>
              <img
                src={coverImage}
                alt="cover"
                className="w-full h-full object-cover rounded"
              />
            </picture>
            <button
              type="button"
              onClick={removeCoverImage}
              className="absolute top-4 right-4 p-2 bg-white dark:bg-gray-800 rounded-full shadow hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <X size={18} />
            </button>
          </div>
        ) : (
          <div className="mt-2">
            <label className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 cursor-pointer">
              <ImagePlus size={18} />
              <span onClick={() => fileInputRef.current?.click()}>
                Add a cover image
              </span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) =>
                  handleCoverImageFile(e.target.files?.[0] ?? null)
                }
              />
            </label>
          </div>
        )}
      </div>

      {/* Sticky toolbar */}
      <div className="sticky top-0 z-10 mt-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
        <div className="px-4 md:px-8">
          <MenuBar
            editor={editor}
            onAddImageFile={async (cb) => {
              const input = document.createElement("input");
              input.type = "file";
              input.accept = "image/*";
              input.onchange = async () => {
                const f = input.files?.[0];
                if (!f) return;
                const url = await uploadFileInline(f);
                if (url) cb(url);
              };
              input.click();
            }}
          />
        </div>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} />

      {/* Actions */}
      {/* <div className="px-8 md:px-16 lg:px-24 pb-8 flex gap-3">
        <button
          onClick={() => {
            setTitle("");
            setTags([]);
            setFilesPreview([]);
            setCoverImage(undefined);
            editor?.commands.clearContent();
          }}
          className="px-6 py-2 bg-gray-200 dark:bg-gray-800 text-gray-700 rounded-md"
        >
          Cancel
        </button>
      </div> */}
    </div>
  );

  // helper used by toolbar inline image upload
  async function uploadFileInline(file: File) {
    const url = await uploadFileToServer(file);
    return url;
  }
}
