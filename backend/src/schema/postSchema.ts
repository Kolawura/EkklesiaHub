import { z } from "zod";

export const postStatusEnum = z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]);

export const createPostSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(300),
  slug: z
    .string()
    .min(3, "Slug must be at least 3 characters")
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/i, "Invalid slug format"),
  content: z.string().min(1, "Content is required"),
  coverImage: z.url().optional(),
  status: postStatusEnum.optional().default("DRAFT"),
  communityId: z.string().optional(),
  tagIds: z.array(z.string()).optional(),
});

export const updatePostSchema = z
  .object({
    title: z.string().min(3).max(300).optional(),
    slug: z
      .string()
      .min(3)
      .max(200)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/i)
      .optional(),
    content: z.string().min(1).optional(),
    coverImage: z.url().optional(),
    status: postStatusEnum.optional(),
    communityId: z.string().optional(),
    tagIds: z.array(z.string()).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided to update",
  });

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;
export type PostStatus = z.infer<typeof postStatusEnum>;
