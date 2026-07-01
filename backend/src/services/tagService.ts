import { prisma } from "../db/prisma";

// ─────────────────────────────────────────────────────────────────
// Create a new tag (admin only)
// ─────────────────────────────────────────────────────────────────

export const createTag = async (name: string) => {
  return await prisma.tag.create({
    data: { name },
  });
};

// ── Follow / unfollow ──────────────────────────────────────────────────────

export async function followTag(userId: string, tagId: string) {
  const tag = await prisma.tag.findUnique({ where: { id: tagId } });
  if (!tag) throw Object.assign(new Error("Tag not found."), { status: 404 });

  const existing = await prisma.userTagFollow.findUnique({
    where: { userId_tagId: { userId, tagId } },
  });
  if (existing) throw new Error("Already following this tag.");

  return prisma.userTagFollow.create({ data: { userId, tagId } });
}

export async function unfollowTag(userId: string, tagId: string) {
  await prisma.userTagFollow.delete({
    where: { userId_tagId: { userId, tagId } },
  });
}

// ── Get all tags a user follows ────────────────────────────────────────────

export async function getFollowedTags(userId: string) {
  return prisma.userTagFollow.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: {
      tag: {
        select: {
          id: true,
          name: true,
          _count: { select: { posts: true, followers: true } },
        },
      },
    },
  });
}

// ── Check if following a specific tag ─────────────────────────────────────

export async function checkFollowingTag(userId: string, tagId: string) {
  const entry = await prisma.userTagFollow.findUnique({
    where: { userId_tagId: { userId, tagId } },
  });
  return { following: !!entry };
}

// ── Personalised feed — posts tagged with followed tags ────────────────────

export async function getTagFeed(userId: string, page = 1, limit = 12) {
  const skip = (page - 1) * limit;

  // Get the IDs of tags the user follows
  const follows = await prisma.userTagFollow.findMany({
    where: { userId },
    select: { tagId: true },
  });

  if (follows.length === 0)
    return {
      posts: [],
      pagination: { total: 0, page, limit, totalPages: 0 },
    };

  const tagIds = follows.map((f) => f.tagId);

  const where = {
    status: "PUBLISHED" as const,
    tags: { some: { id: { in: tagIds } } },
  };

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      skip,
      take: limit,
      select: {
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
          select: { id: true, name: true, isPrivate: true },
        },
        tags: {
          select: { id: true, name: true },
        },
        _count: { select: { reactions: true, comments: true } },
      },
    }),
    prisma.post.count({ where }),
  ]);

  return {
    posts,
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
}

// ── Get all tags with follower counts (for the tag browser) ───────────────

export async function getAllTagsWithCounts() {
  return prisma.tag.findMany({
    orderBy: { followers: { _count: "desc" } },
    select: {
      id: true,
      name: true,
      _count: { select: { posts: true, followers: true } },
    },
  });
}

export const getTagByName = async (name: string) => {
  return await prisma.tag.findUnique({
    where: { name },
  });
};
