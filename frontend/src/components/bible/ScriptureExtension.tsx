/**
 * ScriptureExtension.tsx
 *
 * Custom Tiptap node for scripture blockquotes inside the editor.
 *
 * Stores as:
 *   <div data-scripture="John 3:16" data-version="KJV" class="scripture-block">
 *     <p>…verse text…</p>
 *     <cite>— John 3:16 (KJV)</cite>
 *   </div>
 *
 * The static HTML output is styled by the `.scripture-block` rule in
 * ekk-editor.css — so it renders beautifully both in the editor AND
 * on the published post page.
 *
 * NOTE: This file must be .tsx (not .ts) because the NodeView uses JSX.
 */

import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer, NodeViewWrapper } from "@tiptap/react";
import React from "react";
import { BookOpen, X } from "lucide-react";

/* ── Node definition ─────────────────────────────────────────────────────── */
export const ScriptureNode = Node.create({
  name: "scripture",
  group: "block",
  atom: true, // treated as a single indivisible unit — cursor jumps over it

  addAttributes() {
    return {
      reference: { default: "" },
      text: { default: "" },
      version: { default: "KJV" },
    };
  },

  parseHTML() {
    return [{ tag: "div[data-scripture]" }];
  },

  renderHTML({ HTMLAttributes }) {
    const { reference, text, version } = HTMLAttributes;
    // This is what gets stored in the database and rendered on the post page.
    // The .scripture-block class is styled in ekk-editor.css.
    return [
      "div",
      mergeAttributes(
        { "data-scripture": reference, "data-version": version },
        { class: "scripture-block" },
      ),
      ["p", {}, `"${text}"`],
      ["cite", {}, `— ${reference} (${version})`],
    ];
  },

  // The React node view is only used inside the editor — not on the post page.
  addNodeView() {
    return ReactNodeViewRenderer(ScriptureNodeView);
  },
});

/* ── React node view (editor-only) ──────────────────────────────────────── */
function ScriptureNodeView({
  node,
  deleteNode,
}: {
  node: any;
  deleteNode: () => void;
}) {
  const { reference, text, version } = node.attrs;

  return (
    <NodeViewWrapper>
      <div
        contentEditable={false}
        className="relative group my-6 flex items-start gap-3 pl-5 border-l-4 border-gold rounded-r-xl bg-gold-bg/40 py-4 pr-4 select-none"
      >
        {/* Gold book icon */}
        <BookOpen size={13} className="text-gold mt-0.5 shrink-0" />

        <div className="flex-1 min-w-0">
          {/* Reference label */}
          <p className="font-body text-[11px] font-semibold text-gold mb-1.5 uppercase tracking-widest">
            {reference}
            {version && version !== "KJV" && (
              <span className="ml-1 font-normal normal-case tracking-normal opacity-70">
                · {version}
              </span>
            )}
          </p>
          {/* Verse text */}
          <p className="font-body text-sm italic text-ink-light leading-relaxed">
            &quot;{text}&quot;
          </p>
        </div>

        {/* Delete — appears on hover */}
        <button
          onClick={deleteNode}
          className="shrink-0 p-1 text-ink-ghost hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all rounded"
          title="Remove scripture block"
        >
          <X size={12} />
        </button>
      </div>
    </NodeViewWrapper>
  );
}
