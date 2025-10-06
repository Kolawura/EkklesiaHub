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
  // GET THE COMMENT POST
  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) throw new Error("Post not found");

  // CHECK FOR PARENT COMMENT
  if (parentId) {
    const parentComment = await prisma.comment.findUnique({
      where: { id: parentId },
    });
    if (!parentComment) throw new Error("Parent comment not found");
  }
  // CHECK IF POST BELONG TO A COMMUNITY
  if (post.communityId) {
    const membership = await prisma.communityMembership.findFirst({
      where: { communityId: post.communityId, userId: authorId },
    });

    if (!membership)
      throw new Error("You must be a member of the community to comment");
  }

  const comment = prisma.comment.create({
    data: {
      content,
      authorId,
      postId,
      parentId,
    },
    include: {
      author: { select: { id: true, username: true } },
    },
  });
  return comment;
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

  const updatedComment = prisma.comment.update({
    where: { id: commentId },
    data: { content },
  });
  return updatedComment;
};

export const deleteComment = async (commentId: string, userId: string) => {
  const comment = await prisma.comment.findUnique({ where: { id: commentId } });
  if (!comment) throw new Error("Comment not found");
  if (comment.authorId !== userId) throw new Error("Unauthorized");

  return prisma.comment.delete({ where: { id: commentId } });
};
