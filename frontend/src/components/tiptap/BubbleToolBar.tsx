import { Editor } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import {
  Check,
  X,
  Bold,
  Italic,
  UnderlineIcon,
  Strikethrough,
  Code,
  Quote,
  Link2,
} from "lucide-react";
import { useState, useRef } from "react";

export function BubbleToolbar({ editor }: { editor: Editor }) {
  const [linkMode, setLinkMode] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const applyLink = () => {
    const url = linkUrl.trim();
    if (url) {
      editor
        .chain()
        .focus()
        .setLink({ href: url.startsWith("http") ? url : `https://${url}` })
        .run();
    } else {
      editor.chain().focus().unsetLink().run();
    }
    setLinkMode(false);
    setLinkUrl("");
  };

  if (!editor) return null;

  return (
    <BubbleMenu
      editor={editor}
      tippyOptions={{ duration: 150, placement: "top" }}
      shouldShow={({ from, to }) => from !== to}
    >
      <div className="flex items-center gap-0.5 bg-ink rounded-xl shadow-warm-lg px-1.5 py-1.5 border border-ink-medium">
        {linkMode ? (
          <div className="flex items-center gap-1.5 px-1">
            <input
              ref={inputRef}
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") applyLink();
                if (e.key === "Escape") {
                  setLinkMode(false);
                  setLinkUrl("");
                }
              }}
              autoFocus
              placeholder="https://…"
              className="font-body text-xs bg-transparent text-parchment placeholder-ink-ghost outline-none w-44 border-b border-ink-ghost/50 pb-0.5"
            />
            <button
              onClick={applyLink}
              className="p-1 text-gold hover:text-gold-light transition-colors"
            >
              <Check size={13} />
            </button>
            <button
              onClick={() => {
                setLinkMode(false);
                setLinkUrl("");
              }}
              className="p-1 text-ink-ghost hover:text-parchment transition-colors"
            >
              <X size={13} />
            </button>
          </div>
        ) : (
          <>
            {[
              {
                icon: Bold,
                label: "Bold",
                active: editor.isActive("bold"),
                action: () => editor.chain().focus().toggleBold().run(),
              },
              {
                icon: Italic,
                label: "Italic",
                active: editor.isActive("italic"),
                action: () => editor.chain().focus().toggleItalic().run(),
              },
              {
                icon: UnderlineIcon,
                label: "Underline",
                active: editor.isActive("underline"),
                action: () => editor.chain().focus().toggleUnderline().run(),
              },
              {
                icon: Strikethrough,
                label: "Strikethrough",
                active: editor.isActive("strike"),
                action: () => editor.chain().focus().toggleStrike().run(),
              },
              {
                icon: Code,
                label: "Code",
                active: editor.isActive("code"),
                action: () => editor.chain().focus().toggleCode().run(),
              },
              {
                icon: Quote,
                label: "Blockquote",
                active: editor.isActive("blockquote"),
                action: () => editor.chain().focus().toggleBlockquote().run(),
              },
              {
                icon: Link2,
                label: "Link",
                active: editor.isActive("link"),
                action: () => {
                  setLinkUrl(editor.getAttributes("link").href ?? "");
                  setLinkMode(true);
                  setTimeout(() => inputRef.current?.focus(), 10);
                },
              },
            ].map(({ icon: Icon, label, active, action }) => (
              <button
                key={label}
                onClick={action}
                title={label}
                className={[
                  "p-1.5 rounded-lg transition-all",
                  active
                    ? "bg-gold/20 text-gold"
                    : "text-parchment/70 hover:text-parchment hover:bg-parchment/10",
                ].join(" ")}
              >
                <Icon size={14} />
              </button>
            ))}
          </>
        )}
      </div>
    </BubbleMenu>
  );
}
