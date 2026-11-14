// lib/taggedText.ts
//
// Parses the KJV markup served by GET /api/bible/tagged/... into tokens that
// React can render safely (as text nodes, never as raw HTML).
//
//   word[[H430]]                 Strong's number(s) belong to the word BEFORE them
//   <em>…</em>                   words the KJV translators added (italics)
//   <span class="woc">…</span>   words of Christ (red letters)
//
// Pure functions only — no React, no DOM — so they are easy to unit-test.

export interface TaggedToken {
  text: string;
  /** inside a words-of-Christ span */
  woc: boolean;
  /** translator-added word (italic) */
  em: boolean;
  /** Strong's numbers for this word, e.g. ["H1254", "H853"] */
  strongs?: string[];
}

// Known markup first; the final alternative swallows any other tag so stray
// HTML can never leak into the page as literal "<b>" text.
const MARKUP_RE =
  /(<span class="woc">|<\/span>|<em>|<\/em>|\[\[[HG]\d+\]\]|<[^>]*>)/;
const STRONGS_RE = /^\[\[([HG])(\d+)\]\]$/;

// prefix | last word (letters/digits, inner ' ’ -) | trailing punctuation/space
const WORD_RE = /^([\s\S]*?)([\p{L}\p{N}][\p{L}\p{N}'’-]*)([^\p{L}\p{N}]*)$/u;

const addId = (token: TaggedToken, id: string) => {
  if (!token.strongs) token.strongs = [];
  if (!token.strongs.includes(id)) token.strongs.push(id);
};

export function parseTaggedText(input: string): TaggedToken[] {
  const tokens: TaggedToken[] = [];
  let woc = false;
  let em = false;
  // Index of the token that just received a tag: directly adjacent tags
  // ("created[[H1254]][[H853]]") join the same word instead of the next one.
  let target: number | null = null;

  const attach = (id: string) => {
    if (target !== null) {
      addId(tokens[target], id);
      return;
    }
    for (let i = tokens.length - 1; i >= 0; i--) {
      const base = tokens[i];
      const m = WORD_RE.exec(base.text);
      if (!m) continue; // whitespace / punctuation only: look further back

      if (base.strongs) {
        // e.g. `God[[H430]],[[H853]]`: the word was already tagged earlier
        addId(base, id);
        target = i;
        return;
      }

      const [, prefix, word, suffix] = m;
      const parts: TaggedToken[] = [];
      if (prefix) parts.push({ text: prefix, woc: base.woc, em: base.em });
      const wordIndex = i + parts.length;
      parts.push({ text: word, woc: base.woc, em: base.em, strongs: [id] });
      if (suffix) parts.push({ text: suffix, woc: base.woc, em: base.em });
      tokens.splice(i, 1, ...parts);
      target = wordIndex;
      return;
    }
  };

  for (const part of String(input ?? "").split(MARKUP_RE)) {
    if (!part) continue;
    if (part === '<span class="woc">') woc = true;
    else if (part === "</span>") woc = false;
    else if (part === "<em>") em = true;
    else if (part === "</em>") em = false;
    else {
      const tag = STRONGS_RE.exec(part);
      if (tag)
        attach(`${tag[1]}${Number(tag[2])}`); // "H0430" -> "H430"
      else if (part.startsWith("<"))
        continue; // unknown tag: ignore
      else {
        tokens.push({ text: part, woc, em });
        target = null;
      }
    }
  }

  // Merge neighbouring untagged tokens that look the same: fewer DOM nodes.
  const merged: TaggedToken[] = [];
  for (const t of tokens) {
    const last = merged[merged.length - 1];
    if (
      last &&
      !last.strongs &&
      !t.strongs &&
      last.woc === t.woc &&
      last.em === t.em
    ) {
      last.text += t.text;
    } else {
      merged.push({ ...t });
    }
  }
  return merged;
}

/** Plain text of a tagged verse: no markup, no Strong's numbers, tidy spaces. */
export function taggedToPlain(input: string): string {
  return parseTaggedText(input)
    .map((t) => t.text)
    .join("")
    .replace(/\s+/g, " ")
    .trim();
}

/** Does this verse contain any words of Christ? */
export const hasWordsOfChrist = (input: string): boolean =>
  String(input ?? "").includes('<span class="woc">');

// ── Strong's definitions ───────────────────────────────────────────

/**
 * Turns the lexicon's raw definition HTML into safe markup for display.
 *
 * `sanitize` MUST be DOMPurify (or equivalent) configured by the caller; it
 * runs first so only plain formatting tags survive. Only afterwards do we add
 * our own static markup: cross-references like <strong>H7218</strong> become
 * buttons, and the source's {curly} formatting markers are dropped.
 */
export function buildDefinitionHtml(
  rawHtml: string,
  sanitize: (html: string) => string,
): string {
  const clean = sanitize(String(rawHtml ?? "")).replace(/[{}]/g, "");
  return clean.replace(
    /<strong>\s*([HG]\d{1,4})\s*<\/strong>/g,
    '<button type="button" class="strongs-ref" data-sref="$1">$1</button>',
  );
}

/** Sanitiser options to use with DOMPurify for lexicon definitions. */
export const DEFINITION_SANITIZE_CONFIG = {
  ALLOWED_TAGS: ["p", "strong", "b", "i", "em", "br", "sup", "sub"],
  ALLOWED_ATTR: [] as string[],
};

/** "H430" -> "hebrew" | "G26" -> "greek" */
export const strongsLanguage = (id: string): "hebrew" | "greek" =>
  id.startsWith("H") ? "hebrew" : "greek";
