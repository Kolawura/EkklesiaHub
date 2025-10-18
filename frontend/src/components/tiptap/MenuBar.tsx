"use client";

import { Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  Strikethrough,
  Pilcrow as Paragraph,
  Code,
  CodeSquare as CodeBlock,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Link2,
  Image as ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  SeparatorHorizontal as HorizontalRule,
  Underline as UnderlineIcon,
} from "lucide-react";

interface MenuBarProps {
  editor: Editor | null;
}

export function MenuBar({ editor }: MenuBarProps) {
  if (!editor) return null;

  const addLink = () => {
    const url = window.prompt("Enter URL:");
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const addImage = () => {
    const url = window.prompt("Enter image URL:");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const buttons = [
    {
      icon: Bold,
      action: () => editor.chain().focus().toggleBold().run(),
      active: editor.isActive("bold"),
      title: "Bold",
    },
    {
      icon: Italic,
      action: () => editor.chain().focus().toggleItalic().run(),
      active: editor.isActive("italic"),
      title: "Italic",
    },
    {
      icon: UnderlineIcon,
      action: () => editor.chain().focus().toggleUnderline().run(),
      active: editor.isActive("underline"),
      title: "Underline",
    },
    {
      icon: Strikethrough,
      action: () => editor.chain().focus().toggleStrike().run(),
      active: editor.isActive("strike"),
      title: "Strikethrough",
    },
    {
      icon: Code,
      action: () => editor.chain().focus().toggleCode().run(),
      active: editor.isActive("code"),
      title: "Code",
    },
    {
      icon: HorizontalRule,
      action: () => editor.chain().focus().setHorizontalRule().run(),
      active: editor.isActive("horizontalRule"),
      title: "Horizontal Rule",
    },
    { divider: true },
    {
      icon: Paragraph,
      action: () => editor.chain().focus().setParagraph().run(),
      active: editor.isActive("paragraph"),
      title: "Paragraph",
    },
    {
      icon: Heading1,
      action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      active: editor.isActive("heading", { level: 1 }),
      title: "Heading 1",
    },
    {
      icon: Heading2,
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      active: editor.isActive("heading", { level: 2 }),
      title: "Heading 2",
    },
    {
      icon: Heading3,
      action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      active: editor.isActive("heading", { level: 3 }),
      title: "Heading 3",
    },
    { divider: true },
    {
      icon: AlignLeft,
      action: () => editor.chain().focus().setTextAlign("left").run(),
      active: editor.isActive({ textAlign: "left" }),
      title: "Align Left",
    },
    {
      icon: AlignCenter,
      action: () => editor.chain().focus().setTextAlign("center").run(),
      active: editor.isActive({ textAlign: "center" }),
      title: "Align Center",
    },
    {
      icon: AlignRight,
      action: () => editor.chain().focus().setTextAlign("right").run(),
      active: editor.isActive({ textAlign: "right" }),
      title: "Align Right",
    },
    { divider: true },
    {
      icon: List,
      action: () => editor.chain().focus().toggleBulletList().run(),
      active: editor.isActive("bulletList"),
      title: "Bullet List",
    },
    {
      icon: ListOrdered,
      action: () => editor.chain().focus().toggleOrderedList().run(),
      active: editor.isActive("orderedList"),
      title: "Numbered List",
    },
    {
      icon: Quote,
      action: () => editor.chain().focus().toggleBlockquote().run(),
      active: editor.isActive("blockquote"),
      title: "Quote",
    },
    { divider: true },
    {
      icon: Link2,
      action: addLink,
      active: editor.isActive("link"),
      title: "Link",
    },
    {
      icon: ImageIcon,
      action: addImage,
      active: false,
      title: "Image",
    },
    {
      icon: CodeBlock,
      action: () => editor.chain().focus().toggleCodeBlock().run(),
      active: editor.isActive("codeBlock"),
      title: "CodeBlock",
    },
    { divider: true },
    {
      icon: Undo,
      action: () => editor.chain().focus().undo().run(),
      disabled: !editor.can().undo(),
      title: "Undo",
    },
    {
      icon: Redo,
      action: () => editor.chain().focus().redo().run(),
      disabled: !editor.can().redo(),
      title: "Redo",
    },
  ];

  return (
    <div className="flex items-center justify-center gap-1 p-2 border-b border-gray-200 bg-gray-50 flex-wrap">
      {buttons.map((btn, idx) => {
        const Icon = btn.icon;
        return btn.divider ? (
          <div key={idx} className="w-px h-6 bg-gray-300 mx-1" />
        ) : (
          <button
            key={idx}
            onClick={btn.action}
            disabled={btn.disabled}
            title={btn.title}
            className={`p-2 rounded hover:bg-gray-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
              btn.active ? "bg-blue-100 text-blue-600" : "text-gray-700"
            }`}
          >
            {Icon ? <Icon size={18} /> : null}
          </button>
        );
      })}
    </div>
  );
}
