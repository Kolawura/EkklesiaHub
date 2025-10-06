import { prisma } from "../db/prisma";

export const createPost = async (data: {
  title: string;
  slug: string;
  content: string;
  coverImage?: string;
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  authorId: string;
  communityId?: string;
  tagIds?: string[];
}) => {
  return await prisma.post.create({
    data: {
      title: data.title,
      slug: data.slug,
      content: data.content,
      coverImage: data.coverImage,
      status: data.status ?? "DRAFT",
      authorId: data.authorId,
      communityId: data.communityId,
      tags: data.tagIds
        ? { connect: data.tagIds.map((id) => ({ id })) }
        : undefined,
    },
    include: {
      author: true,
      community: true,
      tags: true,
    },
  });
};

export const publishPost = async (id: string, userId: string) => {
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) throw new Error("Post not found");
  if (post.authorId !== userId) throw new Error("Not authorized");
  // check if post is published
  const check = await prisma.post.findUnique({
    where: { id, status: "PUBLISHED" },
  });
  if (check) throw new Error("Cannot publish an already published post");
  const publishPost = await prisma.post.update({
    where: { id },
    data: { status: "PUBLISHED" },
  });
  return publishPost;
};

export const archivePost = async (id: string, userId: string) => {
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) throw new Error("Post not found");
  if (post.authorId !== userId) throw new Error("Not authorized");
  const archivePost = await prisma.post.update({
    where: { id },
    data: { status: "ARCHIVED" },
  });
  return archivePost;
};

export const getAllPosts = async (params?: {
  search?: string;
  tagId?: string;
  communityId?: string;
  authorId?: string;
  page?: number;
  limit?: number;
  status?: string;
}) => {
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

  const whereCondition: any = {
    status,
    ...(search && {
      OR: [
        { title: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
      ],
    }),
    ...(authorId && { authorId }),
    ...(communityId && { communityId }),
    ...(tagId && {
      tags: { some: { id: tagId } }, // filter posts that have the tag
    }),
  };

  // Fetch posts + total count concurrently
  const [posts, totalCount] = await Promise.all([
    prisma.post.findMany({
      where: whereCondition,
      include: {
        author: { select: { id: true, username: true } },
        community: { select: { id: true, name: true } },
        tags: true,
        comments: {
          where: { parentId: null },
          include: {
            author: { select: { id: true, username: true } },
            replies: {
              include: {
                author: { select: { id: true, username: true } },
              },
            },
          },
        },
        reactions: true,
        bookmarks: true,
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),

    prisma.post.count({ where: whereCondition }),
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

export const getPostBySlug = async (slug: string) => {
  const post = await prisma.post.findUnique({
    where: { slug },
    include: {
      author: true,
      community: true,
      tags: true,
      comments: {
        include: {
          author: true,
          replies: true,
        },
      },
      reactions: true,
      bookmarks: true,
    },
  });
  if (!post) throw new Error("Post not found");
  return post;
};

export const updatePost = async (
  id: string,
  updates: any,
  authorId: string
) => {
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) throw new Error("Post not found");
  if (post.authorId !== authorId) throw new Error("Not authorized");

  const updatedPost = await prisma.post.update({
    where: { id },
    data: {
      ...updates,
      tags: updates.tagIds
        ? { set: updates.tagIds.map((id: string) => ({ id })) }
        : undefined,
    },
    include: { tags: true },
  });
  return updatedPost;
};

export const deletePost = async (id: string, authorId: string) => {
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) throw new Error("Post not found");
  if (post.authorId !== authorId) throw new Error("Not authorized");

  return await prisma.post.delete({ where: { id } });
};
export const getPostsByAuthor = async (authorId: string) => {
  const post = await prisma.post.findMany({
    where: { authorId },
  });
  if (post.length === 0) throw new Error("Posts not found");
  return post;
};

export const getPostsByCommunity = async (communityId: string) => {
  const post = await prisma.post.findMany({
    where: { communityId: communityId },
  });
  if (post.length === 0) throw new Error("no community post available");
  return post;
};
