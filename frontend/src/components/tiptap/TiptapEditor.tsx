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

interface TiptapEditorProps {
  content?: string;
  title?: string;
  coverImage?: string;
  onChange?: (data: {
    title: string;
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
  onChange,
  editable = true,
  placeholder = "Tell your story...",
}: TiptapEditorProps) {
  const [title, setTitle] = useState(initialTitle);
  const [coverImage, setCoverImage] = useState(initialCoverImage);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const titleRef = useRef<HTMLTextAreaElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
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
        placeholder,
      }),
    ],
    content,
    editable,
    onUpdate: ({ editor }) => {
      const newContent = editor.getHTML();
      onChange?.({ title, content: newContent, coverImage });
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-lg focus:outline-none max-w-none px-8 md:px-16 lg:px-24 py-8 min-h-[500px]",
      },
    },
    immediatelyRender: false,
  });

  const handleTitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    onChange?.({
      title: newTitle,
      content: editor?.getHTML() || "",
      coverImage,
    });

    // Auto-resize textarea
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
      content: editor?.getHTML() || "",
      coverImage: undefined,
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="bg-white">
      {/* Cover Image Section */}
      {coverImage ? (
        <div className="relative w-full h-64 md:h-96 bg-gray-100">
          <img
            src={coverImage}
            alt="Cover"
            className="w-full h-full object-cover"
          />
          {editable && (
            <button
              onClick={removeCoverImage}
              className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
              title="Remove cover image"
            >
              <X size={20} className="text-gray-700" />
            </button>
          )}
        </div>
      ) : (
        editable && (
          <div className="px-8 md:px-16 lg:px-24 pt-12">
            <button
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
          className="w-full text-4xl md:text-5xl font-bold placeholder-gray-300 border-none focus:outline-none resize-none overflow-hidden"
          style={{ minHeight: "60px" }}
        />
      </div>

      {/* Toolbar - Sticky */}
      {editable && (
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
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
