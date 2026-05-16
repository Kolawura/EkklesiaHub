import { prisma } from "../db/prisma";
import { UpdatePostInput } from "../schema/postSchema";
import crypto from "crypto";

// ── helpers ──────────────────────────────────────────────────────────────────

/** Strip HTML tags and calculate reading time (avg 200 wpm) */
export const calcReadingTime = (htmlContent: string): number => {
  const text = htmlContent
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const words = text.split(" ").filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
};

/** Auto-generate excerpt from content if not provided */
const makeExcerpt = (htmlContent: string, maxLen = 160): string => {
  const text = htmlContent
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return text.length <= maxLen
    ? text
    : text.slice(0, maxLen).replace(/\s+\S*$/, "") + "…";
};

const POST_LIST_INCLUDE = {
  author: { select: { id: true, username: true, profileImg: true } },
  community: {
    select: { id: true, name: true, isPrivate: true, avatar: true },
  },
  tags: true,
  _count: {
    select: { comments: true, reactions: true, bookmarks: true, views: true },
  },
};

// ── create ───────────────────────────────────────────────────────────────────

export const createPost = async (data: {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  authorId: string;
  communityId?: string;
  tagIds?: string[];
}) => {
  if (data.communityId) {
    const membership = await prisma.communityMembership.findFirst({
      where: { communityId: data.communityId, userId: data.authorId },
    });
    if (!membership)
      throw new Error("You must be a member of this community to post in it");
  }

  const readingTime = calcReadingTime(data.content);
  const excerpt = data.excerpt || makeExcerpt(data.content);
  const publishedAt = data.status === "PUBLISHED" ? new Date() : null;

  return prisma.$transaction(async (tx) => {
    return tx.post.create({
      data: {
        title: data.title,
        slug: data.slug,
        content: data.content,
        excerpt,
        coverImage: data.coverImage,
        status: data.status ?? "DRAFT",
        readingTime,
        publishedAt,
        authorId: data.authorId,
        communityId: data.communityId,
        tags: data.tagIds
          ? { connect: data.tagIds.map((id) => ({ id })) }
          : undefined,
      },
      include: POST_LIST_INCLUDE,
    });
  });
};

// ── publish / archive ─────────────────────────────────────────────────────────

export const publishPost = async (id: string, userId: string) => {
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) throw new Error("Post not found");
  if (post.authorId !== userId) throw new Error("Not authorized");
  if (post.status === "PUBLISHED") throw new Error("Post is already published");

  return prisma.post.update({
    where: { id },
    data: { status: "PUBLISHED", publishedAt: new Date() },
  });
};

export const archivePost = async (id: string, userId: string) => {
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) throw new Error("Post not found");
  if (post.authorId !== userId) throw new Error("Not authorized");

  return prisma.post.update({ where: { id }, data: { status: "ARCHIVED" } });
};

// ── admin takedown ─────────────────────────────────────────────────────────────

export const adminRemovePost = async (
  postId: string,
  adminId: string,
  reason: string,
) => {
  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: { community: true },
  });
  if (!post) throw new Error("Post not found");
  if (!post.communityId) throw new Error("Post is not in a community");

  const membership = await prisma.communityMembership.findFirst({
    where: { communityId: post.communityId, userId: adminId, role: "ADMIN" },
  });
  if (!membership) throw new Error("Only community admins can remove posts");

  return prisma.$transaction(async (tx) => {
    const updated = await tx.post.update({
      where: { id: postId },
      data: { status: "REMOVED", removedBy: adminId, removalReason: reason },
    });
    // Notify author
    await tx.notification.create({
      data: {
        userId: post.authorId,
        type: "POST_REMOVED",
        message: `Your post "${post.title}" was removed by a community admin. Reason: ${reason}`,
        link: `/communities/${post.communityId}`,
      },
    });
    return updated;
  });
};

// ── pin ───────────────────────────────────────────────────────────────────────

export const pinPost = async (postId: string, adminId: string) => {
  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post || !post.communityId)
    throw new Error("Post not found or not in a community");

  const membership = await prisma.communityMembership.findFirst({
    where: { communityId: post.communityId, userId: adminId, role: "ADMIN" },
  });
  if (!membership) throw new Error("Only community admins can pin posts");

  return prisma.post.update({
    where: { id: postId },
    data: { isPinned: !post.isPinned },
  });
};

// ── list / search ─────────────────────────────────────────────────────────────

export const getAllPosts = async (
  params?: {
    search?: string;
    tagId?: string;
    communityId?: string;
    authorId?: string;
    page?: number;
    limit?: number;
    status?: string;
  },
  requestingUserId?: string,
) => {
  const {
    search = "",
    tagId,
    communityId,
    authorId,
    page = 1,
    limit = 10,
    status = "PUBLISHED",
  } = params || {};

  const skip = (page - 1) * limit;

  // If filtering by community, enforce privacy
  if (communityId) {
    const community = await prisma.community.findUnique({
      where: { id: communityId },
    });
    if (community?.isPrivate) {
      if (!requestingUserId)
        throw new Error("This community is private. Please sign in.");
      const member = await prisma.communityMembership.findFirst({
        where: { communityId, userId: requestingUserId },
      });
      if (!member)
        throw new Error("You must be a member to view this community's posts.");
    }
  }

  const where: any = {
    status: status === "ALL" ? undefined : status,
    ...(search && {
      OR: [
        { title: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
        { excerpt: { contains: search, mode: "insensitive" } },
      ],
    }),
    ...(authorId && { authorId }),
    ...(communityId && { communityId }),
    ...(tagId && { tags: { some: { id: tagId } } }),
    // Exclude posts from private communities unless user is a member
    ...(!communityId && requestingUserId
      ? {
          OR: [
            { communityId: null },
            { community: { isPrivate: false } },
            {
              community: {
                isPrivate: true,
                memberships: { some: { userId: requestingUserId } },
              },
            },
          ],
        }
      : !communityId
        ? { OR: [{ communityId: null }, { community: { isPrivate: false } }] }
        : {}),
  };

  const [posts, totalCount] = await Promise.all([
    prisma.post.findMany({
      where,
      include: POST_LIST_INCLUDE,
      orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
      skip,
      take: limit,
    }),
    prisma.post.count({ where }),
  ]);

  return {
    posts,
    pagination: {
      total: totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
    },
  };
};

// ── single post ───────────────────────────────────────────────────────────────

export const getPostBySlug = async (
  slug: string,
  requestingUserId?: string,
) => {
  const post = await prisma.post.findUnique({
    where: { slug },
    include: {
      author: { select: { id: true, username: true, profileImg: true } },
      community: {
        select: { id: true, name: true, isPrivate: true, avatar: true },
      },
      tags: true,
      comments: {
        where: { parentId: null },
        include: {
          author: { select: { id: true, username: true, profileImg: true } },
          replies: {
            include: {
              author: {
                select: { id: true, username: true, profileImg: true },
              },
            },
            orderBy: { createdAt: "asc" },
          },
          _count: { select: { reactions: true } },
        },
        orderBy: { createdAt: "asc" },
      },
      _count: { select: { reactions: true, bookmarks: true, views: true } },
    },
  });

  if (!post) throw new Error("Post not found");

  // Draft — only the author can see it
  if (post.status === "DRAFT") {
    if (!requestingUserId || post.authorId !== requestingUserId) {
      throw new Error("Post not found");
    }
  }

  // Removed posts show limited info
  if (post.status === "REMOVED") {
    if (
      !requestingUserId ||
      (post.authorId !== requestingUserId &&
        post.removedBy !== requestingUserId)
    ) {
      throw new Error("This post has been removed");
    }
  }

  // Private community gate
  if (post.community?.isPrivate) {
    if (!requestingUserId)
      throw new Error("This post is in a private community. Please sign in.");
    const member = await prisma.communityMembership.findFirst({
      where: { communityId: post.communityId!, userId: requestingUserId },
    });
    if (!member)
      throw new Error(
        "You must be a member of this community to read this post.",
      );
  }

  return post;
};

// ── view tracking ─────────────────────────────────────────────────────────────

export const recordView = async (
  postId: string,
  userId?: string,
  ip?: string,
) => {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  // Deduplicate: one view per user per post per day, or per IP for anonymous
  if (userId) {
    const existing = await prisma.postView.findFirst({
      where: { postId, userId, createdAt: { gte: todayStart } },
    });
    if (existing) return;
    await prisma.postView.create({ data: { postId, userId } });
  } else if (ip) {
    const ipHash = crypto
      .createHash("sha256")
      .update(ip)
      .digest("hex")
      .slice(0, 16);
    const existing = await prisma.postView.findFirst({
      where: { postId, ipHash, createdAt: { gte: todayStart } },
    });
    if (existing) return;
    await prisma.postView.create({ data: { postId, ipHash } });
  }

  // Increment denormalised counter (fast reads)
  await prisma.post.update({
    where: { id: postId },
    data: { viewCount: { increment: 1 } },
  });
};

// ── update ────────────────────────────────────────────────────────────────────

export const updatePost = async (
  id: string,
  updates: UpdatePostInput,
  authorId: string,
) => {
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) throw new Error("Post not found");
  if (post.authorId !== authorId) throw new Error("Not authorized");

  const extra: any = {};
  if (updates.content) {
    extra.readingTime = calcReadingTime(updates.content);
    extra.excerpt = makeExcerpt(updates.content);
  }
  if (updates.status === "PUBLISHED" && post.status !== "PUBLISHED") {
    extra.publishedAt = new Date();
  }

  return prisma.post.update({
    where: { id },
    data: {
      ...updates,
      ...extra,
      tags: updates.tagIds
        ? { set: updates.tagIds.map((id: string) => ({ id })) }
        : undefined,
    },
    include: { tags: true, author: { select: { id: true, username: true } } },
  });
};

// ── delete ────────────────────────────────────────────────────────────────────

export const deletePost = async (id: string, authorId: string) => {
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) throw new Error("Post not found");
  if (post.authorId !== authorId) throw new Error("Not authorized");
  return prisma.post.delete({ where: { id } });
};

// ── by author ──────────────────────────────────────────────────────────────────

export const getPostsByAuthor = async (
  authorId: string,
  includePrivate = false,
) => {
  return prisma.post.findMany({
    where: {
      authorId,
      ...(includePrivate ? {} : { status: "PUBLISHED" }),
    },
    include: {
      tags: true,
      community: { select: { id: true, name: true } },
      _count: { select: { comments: true, reactions: true, views: true } },
    },
    orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
  });
};

// ── by community (respects privacy) ──────────────────────────────────────────

export const getPostsByCommunity = async (communityId: string) => {
  return prisma.post.findMany({
    where: { communityId, status: "PUBLISHED" },
    include: {
      author: { select: { id: true, username: true } },
      tags: true,
      _count: { select: { comments: true, reactions: true } },
    },
    orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
  });
};

// ── edit gate ──────────────────────────────────────────────────────────────────

export const getPostForEdit = async (id: string, authorId: string) => {
  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      tags: { select: { id: true, name: true } },
      community: { select: { id: true, name: true } },
    },
  });
  if (!post) throw new Error("Post not found");
  if (post.authorId !== authorId) throw new Error("Not authorized");
  return post;
};

// ── analytics ────────────────────────────────────────────────────────────────

export const getAuthorAnalytics = async (authorId: string) => {
  const posts = await prisma.post.findMany({
    where: { authorId },
    select: {
      id: true,
      title: true,
      slug: true,
      status: true,
      publishedAt: true,
      viewCount: true,
      isPinned: true,
      readingTime: true,
      _count: { select: { comments: true, reactions: true, bookmarks: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const published = posts.filter((p) => p.status === "PUBLISHED");
  const totalViews = posts.reduce((sum, p) => sum + p.viewCount, 0);
  const totalReactions = posts.reduce((sum, p) => sum + p._count.reactions, 0);
  const totalComments = posts.reduce((sum, p) => sum + p._count.comments, 0);
  const totalBookmarks = posts.reduce((sum, p) => sum + p._count.bookmarks, 0);

  // Views over last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const viewsOverTime = await prisma.postView.groupBy({
    by: ["createdAt"],
    where: {
      post: { authorId },
      createdAt: { gte: thirtyDaysAgo },
    },
    _count: { _all: true },
    orderBy: { createdAt: "asc" },
  });

  // Aggregate by day
  const dailyViews: Record<string, number> = {};
  viewsOverTime.forEach((v) => {
    const day = v.createdAt.toISOString().slice(0, 10);
    dailyViews[day] = (dailyViews[day] ?? 0) + v._count._all;
  });

  // Reaction breakdown across all posts
  const reactionBreakdown = await prisma.reaction.groupBy({
    by: ["type"],
    where: { post: { authorId } },
    _count: { type: true },
  });

  return {
    summary: {
      totalPosts: posts.length,
      publishedPosts: published.length,
      draftPosts: posts.filter((p) => p.status === "DRAFT").length,
      totalViews,
      totalReactions,
      totalComments,
      totalBookmarks,
      avgReadingTime:
        published.length > 0
          ? Math.round(
              published.reduce((s, p) => s + p.readingTime, 0) /
                published.length,
            )
          : 0,
    },
    topPosts: [...posts]
      .sort((a, b) => b.viewCount - a.viewCount)
      .slice(0, 5)
      .map((p) => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        viewCount: p.viewCount,
        reactions: p._count.reactions,
        comments: p._count.comments,
        bookmarks: p._count.bookmarks,
      })),
    dailyViews: Object.entries(dailyViews).map(([date, count]) => ({
      date,
      count,
    })),
    reactionBreakdown: reactionBreakdown.map((r) => ({
      type: r.type,
      count: r._count.type,
    })),
    posts,
  };
};
