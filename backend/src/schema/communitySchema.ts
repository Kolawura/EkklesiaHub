import { z } from "zod";

export const createCommunitySchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").max(100),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(2000),
});

export const updateCommunitySchema = z
  .object({
    name: z.string().min(3).max(100),
    description: z.string().min(10).max(2000),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided to update",
  });

export const updateMembershipSchema = z.object({
  communityId: z.string().min(1, "communityId is required"),
  memberId: z.string().min(1, "memberId is required"),
  newRole: z.enum(["ADMIN", "MEMBER", "CURATED_WRITER"]),
});

export type CreateCommunityInput = z.infer<typeof createCommunitySchema>;
export type UpdateCommunityInput = z.infer<typeof updateCommunitySchema>;
export type MembershipRoleInput = z.infer<typeof updateMembershipSchema>;
