// lib/pendingScripture.ts
//
// One-shot handoff from "Write a reflection" (Bible page) to the editor.
// sessionStorage keeps it per-tab and clears itself when the tab closes.

const KEY = "ekk:pendingScripture";

export interface PendingScripture {
  text: string;
  reference: string;
  version: string;
}

export function setPendingScripture(p: PendingScripture) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(p));
  } catch {
    /* storage blocked — the editor just opens empty */
  }
}

export function peekPendingScripture(): PendingScripture | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    const p = JSON.parse(raw) as Partial<PendingScripture>;
    if (
      typeof p.text === "string" &&
      typeof p.reference === "string" &&
      typeof p.version === "string"
    ) {
      return { text: p.text, reference: p.reference, version: p.version };
    }
    return null;
  } catch {
    return null;
  }
}

export function clearPendingScripture() {
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}
