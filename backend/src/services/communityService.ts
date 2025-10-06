import { prisma } from "../db/prisma";

export const createCommunity = async (
  name: string,
  description: string,
  creatorId: string
) => {
  const existing = await prisma.community.findUnique({ where: { name } });
  if (existing) throw new Error("Community already exists");

  const community = await prisma.community.create({
    data: {
      name,
      description,
      memberships: {
        create: {
          userId: creatorId,
          role: "ADMIN",
        },
      },
    },
  });

  return community;
};

export const joinCommunity = async (communityId: string, userId: string) => {
  const existing = await prisma.communityMembership.findFirst({
    where: { communityId, userId },
  });
  if (existing) throw new Error("Already a member");

  const membership = await prisma.communityMembership.create({
    data: {
      communityId,
      userId,
      role: "MEMBER",
    },
  });

  return membership;
};

export const leaveCommunity = async (communityId: string, userId: string) => {
  const membership = await prisma.communityMembership.findFirst({
    where: { communityId, userId },
  });
  if (!membership) throw new Error("Not a member");

  await prisma.communityMembership.delete({
    where: { id: membership.id },
  });

  return { message: "Left community successfully" };
};

export const getAllCommunities = async (search?: string) => {
  const communities = await prisma.community.findMany({
    where: search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
          ],
        }
      : {},
    include: {
      memberships: true,
      posts: true,
    },
    orderBy: { createdAt: "desc" },
  });
  if (communities.length === 0) throw new Error("No community found");

  return communities;
};

export const getCommunityById = async (id: string) => {
  const community = await prisma.community.findUnique({
    where: { id },
    include: {
      memberships: {
        include: {
          user: {
            select: { id: true, username: true, email: true },
          },
        },
      },
      posts: true,
    },
  });

  if (!community) throw new Error("Community not found");
  return community;
};

export const getUserCommunities = async (userId: string) => {
  const memberships = await prisma.communityMembership.findMany({
    where: { userId },
    include: {
      community: {
        include: {
          memberships: true,
        },
      },
    },
  });

  const users = memberships.map((m) => m.community);
  return users;
};

export const getCommunityUsers = async (communityId: string) => {
  const members = await prisma.communityMembership.findMany({
    where: { communityId },
    include: {
      user: {
        select: { id: true, username: true, email: true },
      },
    },
  });

  const users = members.map((m) => m.user);
  return users;
};

export const getCommunityPosts = async (
  communityId: string,
  page = 1,
  limit = 10,
  search?: string
) => {
  const skip = (page - 1) * limit;

  const where: any = {
    communityId,
    ...(search && {
      OR: [
        { title: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
      ],
    }),
  };

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        author: {
          select: { id: true, username: true },
        },
      },
    }),
    prisma.post.count({ where }),
  ]);

  return {
    posts,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
};

export const updateCommunityInfo = async (
  id: string,
  data: any,
  userId: string
) => {
  const membership = await prisma.communityMembership.findFirst({
    where: { communityId: id, userId, role: "ADMIN" },
  });
  if (!membership) throw new Error("Not authorized");

  const community = await prisma.community.update({
    where: { id },
    data,
  });
  return community;
};

export const updateMembershipRole = async (
  communityId: string,
  targetUserId: string,
  newRole: "ADMIN" | "MEMBER" | "CURATED_WRITER",
  AdminId: string
) => {
  const isAdmin = await prisma.communityMembership.findFirst({
    where: { communityId, userId: AdminId, role: "ADMIN" },
  });
  if (!isAdmin)
    throw new Error("Only community admins can update member roles");

  const isMember = await prisma.communityMembership.findFirst({
    where: { communityId, userId: targetUserId },
  });
  if (!isMember) throw new Error("Target user is not a member");

  if (isMember.userId === AdminId)
    throw new Error("Admins cannot change their own role");

  const member = await prisma.communityMembership.update({
    where: { id: isMember.id },
    data: { role: newRole },
  });
  return member;
};

export const deleteCommunity = async (id: string, userId: string) => {
  const membership = await prisma.communityMembership.findFirst({
    where: { communityId: id, userId, role: "ADMIN" },
  });
  if (!membership)
    throw new Error("Only community admins can delete this community");

  await prisma.community.delete({ where: { id } });
  return { message: "Community deleted successfully" };
};
