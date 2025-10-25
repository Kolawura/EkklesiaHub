"use client";

import { useState, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import { MenuBar } from "./MenuBar";
import { ImagePlus, X } from "lucide-react";
import "@/components/tiptap/styles/tiptap.css";
import "highlight.js/styles/github-dark.css";
import { common, createLowlight } from "lowlight";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";

const lowlight = createLowlight(common);

interface TiptapEditorProps {
  content?: string;
  title?: string;
  tags?: string[];
  coverImage?: string;
  onChange?: (data: {
    title: string;
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
  tags: initialTags = [],
  coverImage: initialCoverImage,
  onChange,
  editable = true,
  placeholder,
}: TiptapEditorProps) {
  const [title, setTitle] = useState(initialTitle);
  const [coverImage, setCoverImage] = useState(initialCoverImage);
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const titleRef = useRef<HTMLTextAreaElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-600 underline cursor-pointer hover:text-blue-800",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "max-w-full h-auto rounded-lg",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Placeholder.configure({
        placeholder: ({ node }) => {
          if (node.type.name === "heading") {
            return "Write a heading...";
          }
          return placeholder || "Start writing...";
        },
      }),
      CodeBlockLowlight.configure({
        lowlight,
      }),
    ],
    content,
    editable,
    onUpdate: ({ editor }) => {
      const newContent = editor.getHTML();
      onChange?.({ title, tags, content: newContent, coverImage });
    },
    editorProps: {
      attributes: {
        class:
          "tiptap prose prose-lg focus:outline-none max-w-none px-8 md:px-16 lg:px-24 py-8 min-h-[250px] dark:prose-invert prose-h1:text-4xl prose-h1:font-bold prose-h2:text-3xl prose-h2:font-semibold prose-h3:text-2xl prose-h3:font-medium prose-code:bg-gray-100 prose-code:dark:bg-gray-800 prose-code:px-1 prose-code:rounded prose-pre:bg-gray-100 prose-pre:dark:bg-gray-800 prose-pre:rounded-lg prose-pre:p-4 prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:pl-4 prose-blockquote:italic prose-ul:list-disc prose-ol:list-decimal",
      },
    },
    immediatelyRender: false,
  });

  const handleTitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    onChange?.({
      title: newTitle,
      tags,
      content: editor?.getHTML() || "",
      coverImage,
    });
    if (titleRef.current) {
      titleRef.current.style.height = "auto";
      titleRef.current.style.height = titleRef.current.scrollHeight + "px";
    }
  };

  const handleCoverImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        setCoverImage(imageUrl);
        onChange?.({
          title,
          tags,
          content: editor?.getHTML() || "",
          coverImage: imageUrl,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeCoverImage = () => {
    setCoverImage(undefined);
    onChange?.({
      title,
      tags,
      content: editor?.getHTML() || "",
      coverImage: undefined,
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const newTag = currentTag.trim().toLowerCase();
      if (newTag && !tags.includes(newTag)) {
        const updatedTags = [...tags, newTag];
        setTags(updatedTags);
        onChange?.({
          title,
          tags: updatedTags,
          content: editor?.getHTML() || "",
          coverImage,
        });
      }
      setCurrentTag("");
    } else if (e.key === "Backspace" && !currentTag && tags.length > 0) {
      setTags(tags.slice(0, -1));
    }
  };

  const removeTag = (tag: string) => {
    const updatedTags = tags.filter((t) => t !== tag);
    setTags(updatedTags);
  };

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-md shadow-sm">
      {/* Cover Image Section */}
      {coverImage ? (
        <div className="relative w-full h-64 md:h-96 bg-gray-100 dark:bg-gray-900">
          <img
            src={coverImage}
            alt="Cover"
            className="w-full h-full object-cover"
          />
          {editable && (
            <button
              type="button"
              onClick={removeCoverImage}
              className="absolute top-4 right-4 p-2 rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
              title="Remove cover image"
            >
              <X
                size={20}
                className="text-gray-700 dark:text-gray-700 dark:hover:text-gray-200"
              />
            </button>
          )}
        </div>
      ) : (
        editable && (
          <div className="px-8 md:px-16 lg:px-24 pt-12">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors group"
            >
              <ImagePlus
                size={20}
                className="group-hover:scale-110 transition-transform"
              />
              <span className="text-sm font-medium">Add a cover image</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleCoverImageUpload}
              className="hidden"
            />
          </div>
        )
      )}

      {/* Title Section */}
      <div className="px-8 md:px-16 lg:px-24 pt-8">
        <textarea
          ref={titleRef}
          value={title}
          onChange={handleTitleChange}
          placeholder="Title"
          disabled={!editable}
          rows={1}
          className="w-full text-4xl md:text-5xl font-bold placeholder-gray-300 border-none focus:outline-none resize-none overflow-hidden bg-transparent text-gray-900 dark:text-gray-100 dark:placeholder-gray-500"
          style={{ minHeight: "60px" }}
        />
      </div>

      {/* Tags Input Section */}
      {editable && (
        <div className="px-8 md:px-16 lg:px-24 mt-4 mb-2">
          <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
            {tags.map((tag) => (
              <div
                key={tag}
                className="flex items-center gap-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 px-2 py-1 rounded-full text-sm"
              >
                <span>#{tag}</span>
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="hover:text-red-500"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
            <input
              type="text"
              value={currentTag}
              onChange={(e) => setCurrentTag(e.target.value)}
              onKeyDown={handleTagKeyDown}
              placeholder={tags.length === 0 ? "Add tags..." : ""}
              className="flex-1 bg-transparent border-none focus:outline-none text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400"
            />
          </div>
        </div>
      )}

      {/* Toolbar - Sticky */}
      {editable && (
        <div className="sticky top-0 z-10 border-b border-gray-200 dark:border-gray-700">
          <div className="">
            <MenuBar editor={editor} />
          </div>
        </div>
      )}

      {/* Editor Content */}
      <EditorContent editor={editor} />
    </div>
  );
}
