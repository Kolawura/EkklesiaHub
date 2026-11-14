"use client";

// components/bible/TaggedVerseText.tsx
//
// Renders one KJV verse from the tagged markup:
//   • words of Christ  → <span class="woc"> (coloured by `.woc-on .woc` in globals.css,
//                         so the reader's toggle is just a class on an ancestor)
//   • translator italics → italic
//   • Strong's words   → tappable in study mode (dotted underline, opens the panel)
//
// Everything is rendered as React text nodes: the server's markup is parsed by
// lib/taggedText and never injected as HTML.

import { memo, useMemo } from "react";
import { parseTaggedText } from "@/lib/taggedText";

interface TaggedVerseTextProps {
  text: string;
  /** Make Strong's-tagged words tappable. */
  strongsMode?: boolean;
  /** Emphasise words carrying this Strong's number (used in concordance lists). */
  highlightId?: string | null;
  onWordClick?: (word: string, ids: string[]) => void;
}

const join = (...c: Array<string | false | null | undefined>) =>
  c.filter(Boolean).join(" ");

export const TaggedVerseText = memo(function TaggedVerseText({
  text,
  strongsMode = false,
  highlightId = null,
  onWordClick,
}: TaggedVerseTextProps) {
  const tokens = useMemo(() => parseTaggedText(text), [text]);

  return (
    <>
      {tokens.map((t, i) => {
        const tappable = strongsMode && !!t.strongs?.length && !!onWordClick;
        const highlighted = !!highlightId && !!t.strongs?.includes(highlightId);

        // Plain text with no styling needs no element at all.
        if (!t.woc && !t.em && !tappable && !highlighted) return t.text;

        const className = join(
          t.woc && "woc",
          t.em && "italic",
          tappable &&
            "cursor-pointer border-b border-dotted border-gold/60 hover:border-gold hover:bg-gold/15 rounded-[2px] transition-colors",
          highlighted && "bg-gold/25 rounded-[2px] font-semibold",
        );

        if (!tappable) {
          return (
            <span key={i} className={className}>
              {t.text}
            </span>
          );
        }

        const open = () => onWordClick!(t.text, t.strongs!);
        return (
          <span
            key={i}
            role="button"
            tabIndex={0}
            data-strongs={t.strongs!.join(" ")}
            title={`Strong's ${t.strongs!.join(", ")}`}
            className={className}
            onClick={(e) => {
              e.stopPropagation(); // don't also toggle verse selection
              open();
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                e.stopPropagation();
                open();
              }
            }}
          >
            {t.text}
          </span>
        );
      })}
    </>
  );
});
