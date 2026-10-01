import { z } from "zod";

const scriptureRefSchema = z.object({
  reference: z.string().min(1).max(200),
  text: z.string().min(1).max(2000),
});

export const createCommentSchema = z.object({
  content: z
    .string()
    .min(1, "Comment content cannot be empty")
    .max(5000, "Comment content too long"),
  postId: z.uuid("Invalid post ID format"),
  parentId: z.uuid("Invalid parent comment ID format").optional(),
  // Snapshot of scripture verses attached in the composer. Capped at 10 to
  // keep the JSON payload bounded — comments aren't meant to be verse lists.
  scriptureRefs: z.array(scriptureRefSchema).max(10).optional(),
});
export const updateCommentSchema = z.object({
  content: z
    .string()
    .min(1, "Comment content cannot be empty")
    .max(5000, "Comment content too long"),
});
