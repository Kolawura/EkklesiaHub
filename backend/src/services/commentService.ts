import { prisma } from "../db/prisma";

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
  return prisma.comment.create({
    data: {
      content,
      authorId,
      postId,
      parentId,
    },
    include: {
      author: { select: { id: true } },
    },
  });
};

export const getCommentsByPost = async (postId: string) => {
  return prisma.comment.findMany({
    where: { postId, parentId: null }, // top-level comments only
    include: {
      author: { select: { id: true, username: true } },
      replies: {
        include: {
          author: { select: { id: true, username: true } },
          replies: true, // nested replies
        },
      },
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
