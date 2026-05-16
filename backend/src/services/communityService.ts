import { prisma } from "../db/prisma";

const COMMUNITY_LIST_SELECT = {
  id: true,
  name: true,
  description: true,
  rules: true,
  avatar: true,
  coverImage: true,
  isPrivate: true,
  createdAt: true,
  _count: { select: { memberships: true, posts: true } },
};

export const createCommunity = async (
  name: string,
  description: string,
  creatorId: string,
  options?: {
    rules?: string;
    avatar?: string;
    coverImage?: string;
    isPrivate?: boolean;
  },
) => {
  const existing = await prisma.community.findUnique({ where: { name } });
  if (existing) throw new Error("Community name already taken");

  return prisma.$transaction(async (tx) => {
    const community = await tx.community.create({
      data: {
        name,
        description,
        rules: options?.rules,
        avatar: options?.avatar,
        coverImage: options?.coverImage,
        isPrivate: options?.isPrivate ?? false,
      },
    });
    await tx.communityMembership.create({
      data: { communityId: community.id, userId: creatorId, role: "ADMIN" },
    });
    return community;
  });
};

export const joinCommunity = async (communityId: string, userId: string) => {
  const existing = await prisma.communityMembership.findFirst({
    where: { communityId, userId },
  });
  if (existing) throw new Error("Already a member");
  return prisma.communityMembership.create({
    data: { communityId, userId, role: "MEMBER" },
  });
};

export const leaveCommunity = async (communityId: string, userId: string) => {
  const membership = await prisma.communityMembership.findFirst({
    where: { communityId, userId },
  });
  if (!membership) throw new Error("Not a member");
  // Prevent last admin from leaving
  if (membership.role === "ADMIN") {
    const adminCount = await prisma.communityMembership.count({
      where: { communityId, role: "ADMIN" },
    });
    if (adminCount <= 1)
      throw new Error(
        "You are the only admin. Assign another admin before leaving.",
      );
  }
  await prisma.communityMembership.delete({ where: { id: membership.id } });
  return { message: "Left community" };
};

export const getAllCommunities = async (search?: string, userId?: string) => {
  const communities = await prisma.community.findMany({
    where: search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
          ],
        }
      : {},
    select: {
      ...COMMUNITY_LIST_SELECT,
      memberships: userId
        ? { where: { userId }, select: { role: true } }
        : false,
    },
    orderBy: { createdAt: "desc" },
  });

  return communities.map((c: any) => ({
    ...c,
    isMember: userId ? (c.memberships?.length ?? 0) > 0 : false,
    memberRole: userId ? (c.memberships?.[0]?.role ?? null) : null,
    memberships: undefined,
  }));
};

export const getCommunityById = async (id: string, userId?: string) => {
  const community = await prisma.community.findUnique({
    where: { id },
    include: {
      _count: { select: { memberships: true, posts: true } },
      memberships: userId
        ? { where: { userId }, select: { role: true } }
        : false,
    },
  });
  if (!community) throw new Error("Community not found");

  const isMember = userId ? (community.memberships?.length ?? 0) > 0 : false;
  const memberRole = userId
    ? ((community as any).memberships?.[0]?.role ?? null)
    : null;

  // If private and not a member, return minimal info
  if (community.isPrivate && !isMember) {
    return {
      id: community.id,
      name: community.name,
      description: community.description,
      avatar: community.avatar,
      isPrivate: true,
      isMember: false,
      memberRole: null,
      _count: community._count,
    };
  }

  return { ...community, isMember, memberRole, memberships: undefined };
};

export const getUserCommunities = async (userId: string) => {
  const memberships = await prisma.communityMembership.findMany({
    where: { userId },
    include: {
      community: { select: COMMUNITY_LIST_SELECT },
    },
  });
  return memberships.map((m) => ({
    ...m.community,
    role: m.role,
    isMember: true,
  }));
};

export const getCommunityMembers = async (communityId: string) => {
  const members = await prisma.communityMembership.findMany({
    where: { communityId },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          profileImg: true,
          firstName: true,
          lastName: true,
        },
      },
    },
    orderBy: { joinedAt: "asc" },
  });
  return members.map((m) => ({
    ...m.user,
    role: m.role,
    joinedAt: m.joinedAt,
  }));
};

export const getCommunityPosts = async (
  communityId: string,
  page = 1,
  limit = 10,
  search?: string,
  requestingUserId?: string,
) => {
  const community = await prisma.community.findUnique({
    where: { id: communityId },
  });
  if (!community) throw new Error("Community not found");

  if (community.isPrivate) {
    if (!requestingUserId)
      throw new Error("This community is private. Please sign in.");
    const member = await prisma.communityMembership.findFirst({
      where: { communityId, userId: requestingUserId },
    });
    if (!member)
      throw new Error("You must be a member to view this community's posts.");
  }

  const skip = (page - 1) * limit;
  const where: any = {
    communityId,
    status: "PUBLISHED",
    ...(search && {
      OR: [
        { title: { contains: search, mode: "insensitive" } },
        { excerpt: { contains: search, mode: "insensitive" } },
      ],
    }),
  };

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      skip,
      take: limit,
      orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
      include: {
        author: { select: { id: true, username: true, profileImg: true } },
        tags: true,
        _count: { select: { comments: true, reactions: true, views: true } },
      },
    }),
    prisma.post.count({ where }),
  ]);

  return { posts, total, page, limit, totalPages: Math.ceil(total / limit) };
};

export const updateCommunityInfo = async (
  id: string,
  data: {
    name?: string;
    description?: string;
    rules?: string;
    avatar?: string;
    coverImage?: string;
    isPrivate?: boolean;
  },
  userId: string,
) => {
  const membership = await prisma.communityMembership.findFirst({
    where: { communityId: id, userId, role: "ADMIN" },
  });
  if (!membership) throw new Error("Only admins can update community info");
  return prisma.community.update({ where: { id }, data });
};

export const updateMembershipRole = async (
  communityId: string,
  targetUserId: string,
  newRole: "ADMIN" | "MEMBER" | "CURATED_WRITER",
  adminId: string,
) => {
  if (targetUserId === adminId) throw new Error("Cannot change your own role");
  const isAdmin = await prisma.communityMembership.findFirst({
    where: { communityId, userId: adminId, role: "ADMIN" },
  });
  if (!isAdmin) throw new Error("Only admins can update member roles");
  const isMember = await prisma.communityMembership.findFirst({
    where: { communityId, userId: targetUserId },
  });
  if (!isMember) throw new Error("User is not a member");
  return prisma.communityMembership.update({
    where: { id: isMember.id },
    data: { role: newRole },
  });
};

export const deleteCommunity = async (id: string, userId: string) => {
  const membership = await prisma.communityMembership.findFirst({
    where: { communityId: id, userId, role: "ADMIN" },
  });
  if (!membership) throw new Error("Only admins can delete this community");
  await prisma.community.delete({ where: { id } });
  return { message: "Community deleted" };
};

export const getCommunityAnalytics = async (
  communityId: string,
  adminId: string,
) => {
  const membership = await prisma.communityMembership.findFirst({
    where: { communityId, userId: adminId, role: "ADMIN" },
  });
  if (!membership) throw new Error("Only admins can view analytics");

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [
    community,
    totalPosts,
    totalMembers,
    newMembers,
    topPosts,
    dailyViews,
  ] = await Promise.all([
    prisma.community.findUnique({
      where: { id: communityId },
      select: {
        name: true,
        _count: { select: { memberships: true, posts: true } },
      },
    }),
    prisma.post.count({ where: { communityId, status: "PUBLISHED" } }),
    prisma.communityMembership.count({ where: { communityId } }),
    prisma.communityMembership.count({
      where: { communityId, joinedAt: { gte: thirtyDaysAgo } },
    }),
    prisma.post.findMany({
      where: { communityId, status: "PUBLISHED" },
      select: {
        id: true,
        title: true,
        slug: true,
        viewCount: true,
        publishedAt: true,
        _count: { select: { comments: true, reactions: true } },
        author: { select: { username: true } },
      },
      orderBy: { viewCount: "desc" },
      take: 10,
    }),
    prisma.postView.groupBy({
      by: ["createdAt"],
      where: { post: { communityId }, createdAt: { gte: thirtyDaysAgo } },
      _count: { _all: true },
      orderBy: { createdAt: "asc" },
    }),
  ]);

  const dailyViewMap: Record<string, number> = {};
  dailyViews.forEach((v) => {
    const day = v.createdAt.toISOString().slice(0, 10);
    dailyViewMap[day] = (dailyViewMap[day] ?? 0) + v._count._all;
  });

  return {
    community: community?.name,
    summary: { totalPosts, totalMembers, newMembers },
    topPosts,
    dailyViews: Object.entries(dailyViewMap).map(([date, count]) => ({
      date,
      count,
    })),
  };
};
