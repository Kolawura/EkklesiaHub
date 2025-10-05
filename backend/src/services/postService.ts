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

export const getAllPosts = async () => {
  return await prisma.post.findMany({
    where: { status: "PUBLISHED" },
    include: {
      author: true,
      community: true,
      tags: true,
      comments: true,
      reactions: true,
      bookmarks: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

export const getPostBySlug = async (slug: string) => {
  const post = await prisma.post.findUnique({
    where: { slug },
    include: {
      author: true,
      community: true,
      tags: true,
      comments: true,
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
  if (!post) throw new Error("Posts not found");
  return post;
};

export const getPostsByCommunity = async (communityId: string) => {
  const post = await prisma.post.findMany({
    where: { communityId: communityId },
  });
  if (!post) throw new Error("no community post available");
  return post;
};
