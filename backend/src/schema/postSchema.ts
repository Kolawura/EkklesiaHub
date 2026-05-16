import { z } from "zod";

export const createPostSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  slug: z.string().min(1).max(300),
  content: z.string().min(1, "Content is required"),
  excerpt: z.string().max(500).optional(),
  coverImage: z.string().url().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
  communityId: z.string().optional(),
  tagIds: z.array(z.string()).optional(),
});

export const updatePostSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  content: z.string().min(1).optional(),
  excerpt: z.string().max(500).optional(),
  coverImage: z.string().url().optional().nullable(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
  communityId: z.string().optional().nullable(),
  tagIds: z.array(z.string()).optional(),
}).partial();

export type UpdatePostInput = z.infer<typeof updatePostSchema>;
