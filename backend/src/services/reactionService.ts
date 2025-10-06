// src/services/reactionService.ts
import { prisma } from "../db/prisma";

export const Reaction = async (
  userId: string,
  type: "LIKE" | "LOVE" | "CLAP" | "INSIGHTFUL",
  postId: string,
  commentId?: string | null
) => {
  if (!postId && !commentId) {
    throw new Error("postId or commentId is required");
  }

  const existing = await prisma.reaction.findFirst({
    where: {
      userId,
      postId: postId,
      commentId: commentId ?? null,
    },
  });

  if (!existing) {
    const reaction = await prisma.reaction.create({
      data: {
        type,
        userId,
        postId,
        commentId: commentId ?? null,
      },
    });
    return reaction;
  }

  if (existing.type == type) {
    await prisma.reaction.delete({ where: { id: existing.id } });
    return { message: "Reaction removed" };
  }

  const update = await prisma.reaction.update({
    where: { id: existing.id },
    data: { type },
  });
  return update;
};

export const getReactions = async (postId: string, commentId?: string) => {
  const reactions = await prisma.reaction.findMany({
    where: {
      postId: postId ?? undefined,
      commentId: commentId ?? undefined,
    },
    include: { user: true },
  });
  return reactions;
};

export const countReactions = async (postId: string, commentId?: string) => {
  const reactionCounts = await prisma.reaction.groupBy({
    by: ["type"],
    where: {
      postId: postId ?? undefined,
      commentId: commentId ?? undefined,
    },
    _count: {
      type: true,
    },
  });

  const formattedCounts = reactionCounts.reduce((acc, curr) => {
    acc[curr.type] = curr._count.type;
    return acc;
  }, {} as Record<string, number>);
  return formattedCounts;
};
