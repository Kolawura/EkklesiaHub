// ═══════════════════════════════════════════════════════════════
// readingListService.ts
// ═══════════════════════════════════════════════════════════════
import { prisma } from "../db/prisma";

const POST_SELECT = {
  id: true,
  title: true,
  slug: true,
  excerpt: true,
  coverImage: true,
  readingTime: true,
  viewCount: true,
  publishedAt: true,
  author: {
    select: { id: true, username: true, profileImg: true },
  },
  community: {
    select: { id: true, name: true },
  },
  tags: {
    select: { id: true, name: true },
  },
  _count: {
    select: { reactions: true, comments: true },
  },
};

export async function addToReadingList(userId: string, postId: string) {
  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) throw Object.assign(new Error("Post not found."), { status: 404 });

  const existing = await prisma.readingListItem.findUnique({
    where: { userId_postId: { userId, postId } },
  });
  if (existing) throw new Error("Already in your reading list.");

  return prisma.readingListItem.create({
    data: { userId, postId },
  });
}

export async function removeFromReadingList(userId: string, postId: string) {
  await prisma.readingListItem.delete({
    where: { userId_postId: { userId, postId } },
  });
}

export async function getReadingList(
  userId: string,
  filter: "unread" | "read" | "all" = "unread",
  page = 1,
  limit = 12,
) {
  const where: any = { userId };
  if (filter === "unread") where.readAt = null;
  if (filter === "read") where.readAt = { not: null };

  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    prisma.readingListItem.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      select: {
        id: true,
        readAt: true,
        createdAt: true,
        post: { select: POST_SELECT },
      },
    }),
    prisma.readingListItem.count({ where }),
  ]);

  return {
    items,
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
}

export async function markAsRead(userId: string, postId: string) {
  return prisma.readingListItem.update({
    where: { userId_postId: { userId, postId } },
    data: { readAt: new Date() },
  });
}

export async function markAsUnread(userId: string, postId: string) {
  return prisma.readingListItem.update({
    where: { userId_postId: { userId, postId } },
    data: { readAt: null },
  });
}

export async function checkInReadingList(userId: string, postId: string) {
  const item = await prisma.readingListItem.findUnique({
    where: { userId_postId: { userId, postId } },
  });
  return { inList: !!item, readAt: item?.readAt ?? null };
}

export async function getReadingListStats(userId: string) {
  const [total, read, unread] = await Promise.all([
    prisma.readingListItem.count({ where: { userId } }),
    prisma.readingListItem.count({ where: { userId, readAt: { not: null } } }),
    prisma.readingListItem.count({ where: { userId, readAt: null } }),
  ]);
  return { total, read, unread };
}
