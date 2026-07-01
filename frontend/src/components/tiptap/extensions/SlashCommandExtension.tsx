/**
 * SlashCommandExtension.tsx
 *
 * Type "/" at the start of an empty line to open the command palette.
 * Supports keyboard navigation (↑ ↓ Enter Escape).
 *
 * Requires: npm install @tiptap/suggestion @tiptap/extension-mention
 * (suggestion is already a peer dep of @tiptap/starter-kit in v3)
 */

"use client";

import { Editor, Extension } from "@tiptap/core";
import { ReactRenderer } from "@tiptap/react";
import Suggestion from "@tiptap/suggestion";
import tippy, { type Instance as TippyInstance } from "tippy.js";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import {
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Code2,
  Minus,
  List,
  ListOrdered,
  BookOpen,
  Type,
  LucideIcon,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// Command definitions
// ─────────────────────────────────────────────────────────────────────────────

interface SlashCommand {
  title: string;
  description: string;
  icon: LucideIcon;
  keywords: string[];
  command: (editor: Editor) => void;
}

const COMMANDS: SlashCommand[] = [
  {
    title: "Heading 1",
    description: "Large section heading",
    icon: Heading1,
    keywords: ["h1", "heading", "title", "large"],
    command: (editor) =>
      editor.chain().focus().toggleHeading({ level: 1 }).run(),
  },
  {
    title: "Heading 2",
    description: "Medium section heading",
    icon: Heading2,
    keywords: ["h2", "heading", "subtitle", "medium"],
    command: (editor) =>
      editor.chain().focus().toggleHeading({ level: 2 }).run(),
  },
  {
    title: "Heading 3",
    description: "Small section heading",
    icon: Heading3,
    keywords: ["h3", "heading", "small"],
    command: (editor) =>
      editor.chain().focus().toggleHeading({ level: 3 }).run(),
  },
  {
    title: "Paragraph",
    description: "Plain body text",
    icon: Type,
    keywords: ["p", "paragraph", "text", "body"],
    command: (editor) => editor.chain().focus().setParagraph().run(),
  },
  {
    title: "Blockquote",
    description: "Indented quote or emphasis",
    icon: Quote,
    keywords: ["quote", "blockquote", "cite", "pullquote"],
    command: (editor) => editor.chain().focus().toggleBlockquote().run(),
  },
  {
    title: "Bullet list",
    description: "Unordered list",
    icon: List,
    keywords: ["bullet", "list", "ul", "unordered"],
    command: (editor) => editor.chain().focus().toggleBulletList().run(),
  },
  {
    title: "Numbered list",
    description: "Ordered list",
    icon: ListOrdered,
    keywords: ["numbered", "ordered", "list", "ol"],
    command: (editor) => editor.chain().focus().toggleOrderedList().run(),
  },
  {
    title: "Code block",
    description: "Monospace code block",
    icon: Code2,
    keywords: ["code", "pre", "monospace", "technical"],
    command: (editor) => editor.chain().focus().toggleCodeBlock().run(),
  },
  {
    title: "Divider",
    description: "Horizontal rule",
    icon: Minus,
    keywords: ["divider", "hr", "separator", "rule", "line"],
    command: (editor) => editor.chain().focus().setHorizontalRule().run(),
  },
  {
    title: "Scripture block",
    description: "Insert a Bible verse blockquote",
    icon: BookOpen,
    keywords: ["scripture", "bible", "verse", "reference", "john", "psalm"],
    command: () => {
      // Opens the Bible panel — we emit a custom event the new/edit page listens to
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("ekk:open-bible-panel"));
      }
    },
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Dropdown menu component
// ─────────────────────────────────────────────────────────────────────────────

interface CommandListProps {
  items: SlashCommand[];
  command: (item: SlashCommand) => void;
}

interface CommandListRef {
  onKeyDown: (props: { event: KeyboardEvent }) => boolean;
}

const CommandList = forwardRef<CommandListRef, CommandListProps>(
  function CommandList({ items, command }, ref) {
    const [selected, setSelected] = useState(0);

    // Reset selection when items change
    useEffect(() => setSelected(0), [items]);

    useImperativeHandle(ref, () => ({
      onKeyDown({ event }) {
        if (event.key === "ArrowUp") {
          setSelected((s) => (s - 1 + items.length) % items.length);
          return true;
        }
        if (event.key === "ArrowDown") {
          setSelected((s) => (s + 1) % items.length);
          return true;
        }
        if (event.key === "Enter") {
          if (items[selected]) command(items[selected]);
          return true;
        }
        return false;
      },
    }));

    if (!items.length) {
      return (
        <div className="bg-parchment border border-parchment-dark rounded-xl shadow-warm-lg p-3 w-64">
          <p className="font-body text-xs text-ink-ghost text-center py-1">
            No commands found
          </p>
        </div>
      );
    }

    return (
      <div className="bg-parchment border border-parchment-dark rounded-xl shadow-warm-lg py-1.5 w-72 max-h-80 overflow-y-auto">
        <p className="font-body text-[10px] uppercase tracking-widest text-ink-ghost px-3 py-1.5 pb-1">
          Commands
        </p>
        {items.map((item, i) => {
          const Icon = item.icon;
          return (
            <button
              key={item.title}
              onClick={() => command(item)}
              className={[
                "w-full flex items-center gap-3 px-3 py-2 text-left transition-colors",
                i === selected
                  ? "bg-gold-bg text-gold"
                  : "text-ink hover:bg-parchment-deep",
              ].join(" ")}
            >
              <div
                className={[
                  "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border",
                  i === selected
                    ? "bg-gold-bg border-gold-pale"
                    : "bg-parchment-deep border-parchment-dark",
                ].join(" ")}
              >
                <Icon
                  size={14}
                  className={i === selected ? "text-gold" : "text-ink-faint"}
                />
              </div>
              <div className="min-w-0">
                <p className="font-body text-sm font-medium leading-none">
                  {item.title}
                </p>
                <p className="font-body text-[11px] text-ink-ghost mt-0.5 truncate">
                  {item.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    );
  },
);

// ─────────────────────────────────────────────────────────────────────────────
// Extension
// ─────────────────────────────────────────────────────────────────────────────

export const SlashCommandExtension = Extension.create({
  name: "slashCommand",

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        char: "/",

        // Only trigger at the start of a line (after whitespace or line start)
        allow({ state }) {
          const $from = state.selection.$from;
          const textBefore = $from.parent.textContent.slice(
            0,
            $from.parentOffset - 1,
          );
          return textBefore.trim() === "";
        },

        command({ editor, range, props }) {
          // Delete the "/" trigger character first
          editor.chain().focus().deleteRange(range).run();
          props.command(editor);
        },

        items({ query }: { query: string }) {
          if (!query) return COMMANDS;
          const q = query.toLowerCase();
          return COMMANDS.filter(
            (cmd) =>
              cmd.title.toLowerCase().includes(q) ||
              cmd.keywords.some((k) => k.includes(q)),
          );
        },

        render() {
          let component: ReactRenderer<CommandListRef>;
          let popup: TippyInstance[];

          return {
            onStart(props) {
              component = new ReactRenderer(CommandList, {
                props,
                editor: props.editor,
              });

              popup = tippy("body", {
                getReferenceClientRect: () => {
                  const rect = props.clientRect?.();
                  if (!rect) {
                    return new DOMRect(0, 0, 0, 0);
                  }
                  return rect;
                },
                appendTo: () => document.body,
                content: component.element,
                showOnCreate: true,
                interactive: true,
                trigger: "manual",
                placement: "bottom-start",
                animation: "shift-away",
                duration: 100,
              });
            },

            onUpdate(props) {
              component.updateProps(props);
              popup[0]?.setProps({
                getReferenceClientRect: () => {
                  const rect = props.clientRect?.();

                  if (!rect) {
                    return new DOMRect(0, 0, 0, 0);
                  }
                  return rect;
                },
              });
            },

            onKeyDown(props) {
              if (props.event.key === "Escape") {
                popup[0]?.hide();
                return true;
              }
              return component.ref?.onKeyDown(props) ?? false;
            },

            onExit() {
              popup[0]?.destroy();
              component?.destroy();
            },
          };
        },
      }),
    ];
  },
});
