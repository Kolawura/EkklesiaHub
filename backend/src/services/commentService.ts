import { prisma } from "../db/prisma";
import { createNotification } from "./notificationService";

export const createComment = async ({
  content,
  authorId,
  postId,
  parentId,
}: {
  content: string;
  authorId: string;
  postId: string;
  parentId?: string;
}) => {
  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) throw new Error("Post not found");

  if (parentId) {
    const parentComment = await prisma.comment.findUnique({
      where: { id: parentId },
    });
    if (!parentComment) throw new Error("Parent comment not found");
  }

  if (post.communityId) {
    const membership = await prisma.communityMembership.findFirst({
      where: { communityId: post.communityId, userId: authorId },
    });
    if (!membership)
      throw new Error("You must be a member of the community to comment");
  }

  const comment = await prisma.comment.create({
    data: { content, authorId, postId, parentId },
    include: {
      author: { select: { id: true, username: true, profileImg: true } },
    },
  });

  // Notify post author (skip if they are the commenter)
  if (post.authorId !== authorId) {
    await createNotification(
      post.authorId,
      "NEW_COMMENT",
      `${comment.author.username} commented on your post`,
      `/posts/${post.slug}`
    ).catch(() => {}); // swallow — notifications are best-effort
  }

  // Notify parent comment author on reply
  if (parentId) {
    const parent = await prisma.comment.findUnique({ where: { id: parentId } });
    if (parent && parent.authorId !== authorId && parent.authorId !== post.authorId) {
      await createNotification(
        parent.authorId,
        "NEW_REPLY",
        `${comment.author.username} replied to your comment`,
        `/posts/${post.slug}`
      ).catch(() => {});
    }
  }

  return comment;
};

export const getCommentsByPost = async (postId: string) => {
  return prisma.comment.findMany({
    where: { postId, parentId: null },
    include: {
      author: { select: { id: true, username: true, profileImg: true } },
      replies: {
        include: {
          author: { select: { id: true, username: true, profileImg: true } },
        },
        orderBy: { createdAt: "asc" },
      },
      _count: { select: { reactions: true } },
    },
    orderBy: { createdAt: "asc" },
  });
};

export const updateComment = async (
  commentId: string,
  content: string,
  userId: string
) => {
  const comment = await prisma.comment.findUnique({ where: { id: commentId } });
  if (!comment) throw new Error("Comment not found");
  if (comment.authorId !== userId) throw new Error("Unauthorized");

  return prisma.comment.update({
    where: { id: commentId },
    data: { content },
  });
};

export const deleteComment = async (commentId: string, userId: string) => {
  const comment = await prisma.comment.findUnique({ where: { id: commentId } });
  if (!comment) throw new Error("Comment not found");
  if (comment.authorId !== userId) throw new Error("Unauthorized");

  return prisma.comment.delete({ where: { id: commentId } });
};
