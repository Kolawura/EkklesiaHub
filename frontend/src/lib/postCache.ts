import type { QueryClient } from "@tanstack/react-query";

export type PostStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export type PostChange =
  | { type: "deleted"; id: string }
  | { type: "status"; id: string; status: PostStatus }
  | { type: "edited"; id: string; status?: PostStatus };

/*
 * Query-key roots that can contain posts. Keep in sync when a new
 * post-bearing query key is added.
 *
 * DROP roots: the server only returns PUBLISHED posts here, so an
 *   archived/draft post must disappear from them.
 * PATCH roots: the server returns posts of any status (author views,
 *   bookmarks, series...), so the post stays and only its status is updated.
 * DETAIL roots: single-post queries (detail page, edit page).
 * COUNT roots: aggregates we can't patch; they just refetch.
 */
const DROP_ROOTS = ["posts", "user-posts", "community-posts", "tag-feed"];
const PATCH_ROOTS = [
  "my-posts",
  "myPosts",
  "my-posts-simple",
  "bookmarks",
  "reading-list",
  "series",
  "my-series",
  "post-series",
];
const DETAIL_ROOTS = ["post", "post-slug", "post-edit"];
const COUNT_ROOTS = [
  "reading-list-stats",
  "author-analytics",
  "community-analytics",
];

/* ── tree helpers (cached data is plain JSON, so a generic walk is safe;
 *    ids are UUIDs, so an id match can't hit the wrong record) ── */

const refersTo = (el: any, id: string) =>
  !!el &&
  typeof el === "object" &&
  (el.id === id || el.postId === id || el.post?.id === id);

/** Remove every list element that is, or wraps, the given post. */
function removePost(node: any, id: string): any {
  if (Array.isArray(node)) {
    const kept = node.filter((el) => !refersTo(el, id));
    let changed = kept.length !== node.length;
    const next = kept.map((el) => {
      const r = removePost(el, id);
      if (r !== el) changed = true;
      return r;
    });
    return changed ? next : node;
  }
  if (node && typeof node === "object") {
    let changed = false;
    const out: any = {};
    for (const k of Object.keys(node)) {
      const v = removePost(node[k], id);
      if (v !== node[k]) changed = true;
      out[k] = v;
    }
    return changed ? out : node;
  }
  return node;
}

/** Set `status` on every post object with the given id. */
function patchStatus(node: any, id: string, status: PostStatus): any {
  if (Array.isArray(node)) {
    let changed = false;
    const next = node.map((el) => {
      const r = patchStatus(el, id, status);
      if (r !== el) changed = true;
      return r;
    });
    return changed ? next : node;
  }
  if (node && typeof node === "object") {
    let changed = false;
    const out: any = {};
    for (const k of Object.keys(node)) {
      const v = patchStatus(node[k], id, status);
      if (v !== node[k]) changed = true;
      out[k] = v;
    }
    // a post object (has a slug); don't touch tags, authors, etc.
    if (node.id === id && typeof node.slug === "string") {
      out.status = status;
      changed = true;
    }
    return changed ? out : node;
  }
  return node;
}

const mapRoots = (qc: QueryClient, roots: string[], fn: (old: any) => any) => {
  for (const root of roots) {
    qc.setQueriesData<any>({ queryKey: [root] }, (old: any) =>
      old === undefined ? old : fn(old),
    );
  }
};

/**
 * Call after any change to a post. Two steps:
 *
 *  1. PATCH what's already cached so every screen is correct instantly, with
 *     no loader and no stale flash (deleted posts vanish from every list,
 *     archived posts leave public lists, statuses update everywhere).
 *  2. INVALIDATE so counts, pagination and anything we can't patch are
 *     refetched. Screens on display refetch now; others on their next visit,
 *     showing the already-patched copy while they do.
 */
export function applyPostChange(queryClient: QueryClient, change: PostChange) {
  const { id } = change;

  if (change.type === "deleted") {
    mapRoots(queryClient, [...DROP_ROOTS, ...PATCH_ROOTS], (old) =>
      removePost(old, id),
    );
    // The post itself no longer exists: its detail/edit entries must go.
    for (const root of DETAIL_ROOTS) {
      queryClient.removeQueries({ queryKey: [root] });
    }
  } else {
    const status = change.status;
    if (status) {
      if (status === "PUBLISHED") {
        // Newly public: it will appear in public lists on refetch (position unknown).
        mapRoots(queryClient, [...DROP_ROOTS], (old) => old);
      } else {
        mapRoots(queryClient, DROP_ROOTS, (old) => removePost(old, id));
      }
      mapRoots(queryClient, [...PATCH_ROOTS, ...DETAIL_ROOTS], (old) =>
        patchStatus(old, id, status),
      );
    }
    if (change.type === "edited") {
      // Content changed too, which we can't patch. Drop *unviewed* detail
      // entries so the post page never shows the pre-edit text.
      for (const root of DETAIL_ROOTS) {
        queryClient.removeQueries({ queryKey: [root], type: "inactive" });
      }
    }
  }

  for (const root of [
    ...DROP_ROOTS,
    ...PATCH_ROOTS,
    ...DETAIL_ROOTS,
    ...COUNT_ROOTS,
  ]) {
    queryClient.invalidateQueries({ queryKey: [root] });
  }
}
