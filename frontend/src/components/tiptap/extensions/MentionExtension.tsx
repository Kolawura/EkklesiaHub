/**
 * MentionExtension.tsx
 *
 * Type "@" followed by a username prefix to mention another user.
 * Displays a dropdown of matching users fetched from the backend.
 * Inserts a styled @username chip into the document.
 *
 * Requires: npm install @tiptap/extension-mention @tiptap/suggestion
 */

"use client";

import { ReactRenderer } from "@tiptap/react";
import Mention from "@tiptap/extension-mention";
import Suggestion from "@tiptap/suggestion";
import tippy, { type Instance as TippyInstance } from "tippy.js";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { api } from "@/lib/api";

// ─────────────────────────────────────────────────────────────────────────────
// User search — debounced fetch from /api/users/search
// ─────────────────────────────────────────────────────────────────────────────

async function searchUsers(
  query: string,
): Promise<{ id: string; username: string; profileImg?: string }[]> {
  if (!query || query.length < 2) return [];
  try {
    const res = await api.get("/users/search", {
      params: { q: query, limit: 8 },
    });
    return res.data?.data ?? [];
  } catch {
    return [];
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Mention dropdown component
// ─────────────────────────────────────────────────────────────────────────────

interface MentionListProps {
  items: { id: string; username: string; profileImg?: string }[];
  command: (item: { id: string; label: string }) => void;
}

interface MentionListRef {
  onKeyDown: (props: { event: KeyboardEvent }) => boolean;
}

const MentionList = forwardRef<MentionListRef, MentionListProps>(
  function MentionList({ items, command }, ref) {
    const [selected, setSelected] = useState(0);

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
          const item = items[selected];
          if (item) command({ id: item.id, label: item.username });
          return true;
        }
        return false;
      },
    }));

    if (!items.length) {
      return (
        <div className="bg-parchment border border-parchment-dark rounded-xl shadow-warm-lg p-3 w-56">
          <p className="font-body text-xs text-ink-ghost text-center py-1">
            No users found
          </p>
        </div>
      );
    }

    return (
      <div className="bg-parchment border border-parchment-dark rounded-xl shadow-warm-lg py-1.5 w-56 max-h-64 overflow-y-auto">
        <p className="font-body text-[10px] uppercase tracking-widest text-ink-ghost px-3 py-1.5 pb-1">
          Mention
        </p>
        {items.map((user, i) => (
          <button
            key={user.id}
            onClick={() => command({ id: user.id, label: user.username })}
            className={[
              "w-full flex items-center gap-2.5 px-3 py-2 text-left transition-colors",
              i === selected
                ? "bg-gold-bg text-gold"
                : "text-ink hover:bg-parchment-deep",
            ].join(" ")}
          >
            {/* Avatar */}
            <div className="w-7 h-7 rounded-full bg-gold-bg border border-gold-pale flex items-center justify-center font-display text-[10px] font-bold text-gold shrink-0 overflow-hidden">
              {user.profileImg ? (
                <img
                  src={user.profileImg}
                  alt={user.username}
                  className="w-full h-full object-cover"
                />
              ) : (
                user.username.slice(0, 2).toUpperCase()
              )}
            </div>
            <span className="font-body text-sm font-medium truncate">
              @{user.username}
            </span>
          </button>
        ))}
      </div>
    );
  },
);

// ─────────────────────────────────────────────────────────────────────────────
// Extension
// ─────────────────────────────────────────────────────────────────────────────

export const MentionExtension = Mention.configure({
  HTMLAttributes: {
    class: "mention",
  },
  renderHTML({ options, node }) {
    return [
      "span",
      {
        class: "mention",
        "data-id": node.attrs.id,
        "data-label": node.attrs.label,
      },
      `${options.suggestion.char}${node.attrs.label}`,
    ];
  },
  suggestion: {
    items: async ({ query }: { query: string }) => {
      return searchUsers(query);
    },

    render() {
      let component: ReactRenderer<MentionListRef>;
      let popup: TippyInstance[];

      return {
        onStart(props) {
          component = new ReactRenderer(MentionList, {
            props: {
              items: props.items,
              command: props.command,
            },
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
          component.updateProps({
            items: props.items,
            command: props.command,
          });
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
  },
});
