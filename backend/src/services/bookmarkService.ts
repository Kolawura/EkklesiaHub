import { prisma } from "../db/prisma";

export const addBookmark = async (userId: string, postId: string) => {
  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) throw new Error("Post not found");

  const existing = await prisma.bookmark.findUnique({
    where: { userId_postId: { userId, postId } },
  });
  if (existing) throw new Error("Already bookmarked");

  return prisma.bookmark.create({ data: { userId, postId } });
};

export const removeBookmark = async (userId: string, postId: string) => {
  const bookmark = await prisma.bookmark.findUnique({
    where: { userId_postId: { userId, postId } },
  });
  if (!bookmark) throw new Error("Bookmark not found");

  return prisma.bookmark.delete({
    where: { userId_postId: { userId, postId } },
  });
};

export const getUserBookmarks = async (userId: string) => {
  return prisma.bookmark.findMany({
    where: { userId },
    include: {
      post: {
        select: {
          id: true,
          title: true,
          slug: true,
          content: true,
          coverImage: true,
          createdAt: true,
          author: { select: { id: true, username: true } },
          tags: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

export const isPostBookmarked = async (userId: string, postId: string) => {
  const bookmark = await prisma.bookmark.findUnique({
    where: { userId_postId: { userId, postId } },
  });
  return !!bookmark;
};
