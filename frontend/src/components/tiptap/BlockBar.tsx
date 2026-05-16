import { Editor } from "@tiptap/react";
import { Loader2, ImagePlus } from "lucide-react";

export function BlockBar({
  editor,
  onInlineImageUpload,
  uploadingImage,
}: {
  editor: Editor;
  onInlineImageUpload: () => void;
  uploadingImage: boolean;
}) {
  if (!editor) return null;

  const h = (level: 1 | 2 | 3) => editor.isActive("heading", { level });

  const btnCls = (active: boolean) =>
    [
      "px-2.5 py-1.5 rounded-lg text-xs transition-all",
      active
        ? "bg-gold-bg text-gold border border-gold-pale font-medium"
        : "text-ink-ghost hover:text-ink hover:bg-parchment-dark",
    ].join(" ");

  return (
    <div className="flex items-center gap-0.5 flex-wrap">
      {/* Headings */}
      {([1, 2, 3] as const).map((lvl) => (
        <button
          key={lvl}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: lvl }).run()
          }
          title={`Heading ${lvl}`}
          className={`${btnCls(h(lvl))} font-display font-bold`}
        >
          H{lvl}
        </button>
      ))}

      <div className="w-px h-4 bg-parchment-dark mx-1" />

      {/* Block types */}
      {[
        {
          label: "¶",
          active: editor.isActive("paragraph"),
          title: "Paragraph",
          action: () => editor.chain().focus().setParagraph().run(),
        },
        {
          label: "—",
          active: false,
          title: "Divider",
          action: () => editor.chain().focus().setHorizontalRule().run(),
        },
        {
          label: "•—",
          active: editor.isActive("bulletList"),
          title: "Bullet list",
          action: () => editor.chain().focus().toggleBulletList().run(),
        },
        {
          label: "1.",
          active: editor.isActive("orderedList"),
          title: "Numbered list",
          action: () => editor.chain().focus().toggleOrderedList().run(),
        },
        {
          label: "❝",
          active: editor.isActive("blockquote"),
          title: "Blockquote",
          action: () => editor.chain().focus().toggleBlockquote().run(),
        },
        {
          label: "</>",
          active: editor.isActive("codeBlock"),
          title: "Code block",
          action: () => editor.chain().focus().toggleCodeBlock().run(),
        },
      ].map(({ label, active, title, action }) => (
        <button
          key={title}
          onClick={action}
          title={title}
          className={`${btnCls(active)} font-mono`}
        >
          {label}
        </button>
      ))}

      <div className="w-px h-4 bg-parchment-dark mx-1" />

      {/* Text align */}
      {[
        { label: "⇐", align: "left" },
        { label: "⇔", align: "center" },
        { label: "⇒", align: "right" },
      ].map(({ label, align }) => (
        <button
          key={align}
          onClick={() => editor.chain().focus().setTextAlign(align).run()}
          title={`Align ${align}`}
          className={`${btnCls(editor.isActive({ textAlign: align }))} font-mono`}
        >
          {label}
        </button>
      ))}

      <div className="w-px h-4 bg-parchment-dark mx-1" />

      {/* Inline image upload */}
      <button
        onClick={onInlineImageUpload}
        disabled={uploadingImage}
        title="Insert image"
        className="px-2.5 py-1.5 rounded-lg text-ink-ghost hover:text-ink hover:bg-parchment-dark disabled:opacity-40 transition-all"
      >
        {uploadingImage ? (
          <Loader2 size={13} className="animate-spin" />
        ) : (
          <ImagePlus size={13} />
        )}
      </button>

      {/* Undo / Redo */}
      <div className="ml-auto flex items-center gap-0.5">
        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Undo (⌘Z)"
          className="px-2.5 py-1.5 font-mono text-xs text-ink-ghost hover:text-ink hover:bg-parchment-dark rounded-lg disabled:opacity-25 transition-all"
        >
          ↩
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="Redo (⌘⇧Z)"
          className="px-2.5 py-1.5 font-mono text-xs text-ink-ghost hover:text-ink hover:bg-parchment-dark rounded-lg disabled:opacity-25 transition-all"
        >
          ↪
        </button>
      </div>
    </div>
  );
}
