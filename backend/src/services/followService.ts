import { get } from "http";
import { prisma } from "../db/prisma";

export const followUser = async (followerId: string, followingId: string) => {
  if (followerId === followingId) {
    throw new Error("You cannot follow yourself");
  }

  const existing = await prisma.follow.findFirst({
    where: { followerId, followingId },
  });

  if (existing) {
    throw new Error("Already following this user");
  }

  const follow = await prisma.follow.create({
    data: {
      followerId,
      followingId,
    },
  });

  return follow;
};

export const unfollowUser = async (followerId: string, followingId: string) => {
  const follow = await prisma.follow.findFirst({
    where: { followerId, followingId },
  });

  if (!follow) {
    throw new Error("You are not following this user");
  }

  await prisma.follow.delete({ where: { id: follow.id } });
  return { message: "Unfollowed successfully" };
};

// Get followers of a user
export const getFollowers = async (userId: string) => {
  return await prisma.follow.findMany({
    where: { followingId: userId },
    include: {
      follower: {
        select: { id: true, username: true },
      },
    },
  });
};

// Get users someone is following
export const getFollowing = async (userId: string) => {
  return await prisma.follow.findMany({
    where: { followerId: userId },
    include: {
      following: {
        select: { id: true, username: true },
      },
    },
  });
};

export const mutualFollowers = async (userId1: string, userId2: string) => {
  const user1Followers = await getFollowers(userId1);
  const followerIds1 = user1Followers.map((f) => f.followerId);
  if (followerIds1.length === 0) return [];

  const mutual = await prisma.follow.findMany({
    where: {
      followingId: userId2,
      followerId: { in: followerIds1 },
    },
    include: {
      follower: {
        select: { id: true, username: true },
      },
    },
  });

  return mutual.map((f) => f.follower);
};
