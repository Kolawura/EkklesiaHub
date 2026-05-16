import { useRef, useEffect } from "react";

export function PostContent({ html }: { html: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !ref.current || !html) return;

    import("dompurify").then(({ default: DOMPurify }) => {
      const clean = DOMPurify.sanitize(html, {
        ALLOWED_TAGS: [
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
        ],
        ALLOWED_ATTR: [
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
        ],
        FORCE_BODY: true,
      });

      const wrapper = document.createElement("div");
      wrapper.innerHTML = clean;
      wrapper.querySelectorAll("a").forEach((a) => {
        a.setAttribute("target", "_blank");
        a.setAttribute("rel", "noopener noreferrer");
      });

      if (ref.current) ref.current.innerHTML = wrapper.innerHTML;
    });
  }, [html]);

  return (
    <div
      ref={ref}
      className="prose-ekk mb-12"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
