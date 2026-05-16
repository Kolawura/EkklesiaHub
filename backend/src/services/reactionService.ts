import { prisma } from "../db/prisma";
import { createNotification } from "./notificationService";

type ReactionType = "LIKE" | "LOVE" | "CLAP" | "INSIGHTFUL";

export const toggleReaction = async (
  userId: string,
  type: ReactionType,
  postId?: string | null,
  commentId?: string | null
) => {
  if (!postId && !commentId) {
    throw new Error("Either postId or commentId is required");
  }

  const existing = await prisma.reaction.findFirst({
    where: {
      userId,
      postId: postId ?? null,
      commentId: commentId ?? null,
    },
  });

  if (!existing) {
    const reaction = await prisma.reaction.create({
      data: { type, userId, postId: postId ?? null, commentId: commentId ?? null },
      include: { user: { select: { username: true } } },
    });

    // Notify owner
    if (postId) {
      const post = await prisma.post.findUnique({ where: { id: postId }, select: { authorId: true, slug: true } });
      if (post && post.authorId !== userId) {
        await createNotification(
          post.authorId, "NEW_REACTION",
          `${reaction.user.username} reacted to your post`,
          `/posts/${post.slug}`
        ).catch(() => {});
      }
    } else if (commentId) {
      const comment = await prisma.comment.findUnique({ where: { id: commentId }, select: { authorId: true, post: { select: { slug: true } } } });
      if (comment && comment.authorId !== userId) {
        await createNotification(
          comment.authorId, "NEW_REACTION",
          `${reaction.user.username} reacted to your comment`,
          comment.post ? `/posts/${comment.post.slug}` : undefined
        ).catch(() => {});
      }
    }

    return reaction;
  }

  if (existing.type === type) {
    await prisma.reaction.delete({ where: { id: existing.id } });
    return { message: "Reaction removed" };
  }

  return prisma.reaction.update({
    where: { id: existing.id },
    data: { type },
  });
};

export const getReactions = async (postId?: string, commentId?: string) => {
  return prisma.reaction.findMany({
    where: {
      ...(postId && { postId }),
      ...(commentId && { commentId }),
    },
    include: { user: { select: { id: true, username: true } } },
  });
};

export const countReactions = async (postId?: string, commentId?: string) => {
  const reactionCounts = await prisma.reaction.groupBy({
    by: ["type"],
    where: {
      ...(postId && { postId }),
      ...(commentId && { commentId }),
    },
    _count: { type: true },
  });

  return reactionCounts.reduce((acc, curr) => {
    acc[curr.type] = curr._count.type;
    return acc;
  }, {} as Record<string, number>);
};
