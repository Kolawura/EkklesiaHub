"use client";

import { useEffect, useState } from "react";

const ALLOWED_TAGS = [
  "p",
  "br",
  "strong",
  "em",
  "u",
  "s",
  "code",
  "pre",
  "blockquote",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "ul",
  "ol",
  "li",
  "a",
  "img",
  "hr",
  "div",
  "span",
  "cite",
];

const ALLOWED_ATTR = [
  "href",
  "src",
  "alt",
  "title",
  "class",
  "style",
  "target",
  "rel",
  "width",
  "height",
  "data-scripture",
];

/**
 * Renders sanitised post HTML.
 *
 * IMPORTANT: DOMPurify is dynamically imported (it's browser-only), which
 * makes sanitisation asynchronous. We never hand raw `html` to
 * dangerouslySetInnerHTML while waiting for that import to resolve —
 * doing so previously created a real XSS window: a payload like
 * `<img src=x onerror="...">` would fire the instant the raw HTML was
 * painted, before DOMPurify ever ran. Cleaning it up afterwards doesn't
 * undo already-executed JS. Instead we hold rendering entirely until
 * the sanitised string is ready.
 */
export function PostContent({ html }: { html: string }) {
  const [cleanHtml, setCleanHtml] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    if (!html) {
      setFailed(false);
      setCleanHtml("");
      return;
    }

    // Reset while the new content sanitises, so a previous post's
    // (already-clean) HTML never lingers on screen for a different `html`.
    setFailed(false);
    setCleanHtml(null);

    import("dompurify")
      .then(({ default: DOMPurify }) => {
        if (cancelled) return;

        const clean = DOMPurify.sanitize(html, {
          ALLOWED_TAGS,
          ALLOWED_ATTR,
          FORCE_BODY: true,
        });

        const wrapper = document.createElement("div");
        wrapper.innerHTML = clean;
        wrapper.querySelectorAll("a").forEach((a) => {
          a.setAttribute("target", "_blank");
          a.setAttribute("rel", "noopener noreferrer");
        });

        if (!cancelled) setCleanHtml(wrapper.innerHTML);
      })
      .catch((error) => {
        // Fail SAFE, not open: if the sanitiser itself can't load (flaky
        // network, blocked chunk, etc.) we show an error state rather
        // than either hanging forever or falling back to raw HTML.
        if (cancelled) return;
        console.error("Failed to load content sanitiser:", error);
        setFailed(true);
      });

    return () => {
      cancelled = true;
    };
  }, [html]);

  if (failed) {
    return (
      <div className="prose-ekk mb-12 rounded-lg border border-parchment-dark bg-parchment-deep p-6 text-center text-ink-faint">
        This post's content couldn't be displayed safely. Please refresh the
        page to try again.
      </div>
    );
  }

  if (cleanHtml === null) {
    // No raw HTML is ever rendered here — this is a plain, static
    // placeholder shown only until sanitisation finishes.
    return (
      <div className="prose-ekk mb-12 animate-pulse space-y-3">
        <div className="h-4 w-3/4 rounded bg-parchment-dark/60" />
        <div className="h-4 w-full rounded bg-parchment-dark/60" />
        <div className="h-4 w-5/6 rounded bg-parchment-dark/60" />
      </div>
    );
  }

  return (
    <div
      className="prose-ekk mb-12"
      dangerouslySetInnerHTML={{ __html: cleanHtml }}
    />
  );
}
