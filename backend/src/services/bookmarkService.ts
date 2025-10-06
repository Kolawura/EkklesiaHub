// src/services/bookmarkService.ts
import { prisma } from "../db/prisma";

export const addBookmark = async (userId: string, postId: string) => {
  const bookmark = await prisma.bookmark.create({
    data: {
      userId,
      postId,
    },
  });
  return bookmark;
};

export const removeBookmark = async (userId: string, postId: string) => {
  const bookmark = await prisma.bookmark.delete({
    where: {
      userId_postId: { userId, postId },
    },
  });
  return bookmark;
};

export const getUserBookmarks = async (userId: string) => {
  const bookmark = await prisma.bookmark.findMany({
    where: { userId },
    include: {
      post: {
        select: {
          id: true,
          title: true,
          content: true,
          createdAt: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
  return bookmark;
};

export const isPostBookmarked = async (userId: string, postId: string) => {
  const bookmark = await prisma.bookmark.findUnique({
    where: {
      userId_postId: { userId, postId },
    },
  });
  return !!bookmark;
};
