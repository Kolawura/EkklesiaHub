import { z } from "zod";

export const createCommentSchema = z.object({
  content: z
    .string()
    .min(1, "Comment content cannot be empty")
    .max(5000, "Comment content too long"),
  postId: z.uuid("Invalid post ID format"),
  parentId: z.uuid("Invalid parent comment ID format").optional(),
});
export const updateCommentSchema = z.object({
  content: z
    .string()
    .min(1, "Comment content cannot be empty")
    .max(5000, "Comment content too long"),
});
