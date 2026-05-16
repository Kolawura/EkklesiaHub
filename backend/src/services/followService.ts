import { prisma } from "../db/prisma";
import { createNotification } from "./notificationService";

export const followUser = async (followerId: string, followingId: string) => {
  if (followerId === followingId) {
    throw new Error("You cannot follow yourself");
  }

  const existing = await prisma.follow.findFirst({
    where: { followerId, followingId },
  });
  if (existing) throw new Error("Already following this user");

  const follow = await prisma.follow.create({ data: { followerId, followingId } });

  // Notify the followed user
  const follower = await prisma.user.findUnique({ where: { id: followerId }, select: { username: true } });
  if (follower) {
    await createNotification(
      followingId,
      "NEW_FOLLOWER",
      `${follower.username} started following you`,
      `/profile/${followerId}`
    ).catch(() => {});
  }

  return follow;
};

export const unfollowUser = async (followerId: string, followingId: string) => {
  const follow = await prisma.follow.findFirst({
    where: { followerId, followingId },
  });
  if (!follow) throw new Error("You are not following this user");

  await prisma.follow.delete({ where: { id: follow.id } });
  return { message: "Unfollowed successfully" };
};

export const getFollowers = async (userId: string) => {
  return prisma.follow.findMany({
    where: { followingId: userId },
    include: {
      follower: { select: { id: true, username: true, profileImg: true } },
    },
  });
};

export const getFollowing = async (userId: string) => {
  return prisma.follow.findMany({
    where: { followerId: userId },
    include: {
      following: { select: { id: true, username: true, profileImg: true } },
    },
  });
};

export const mutualFollowers = async (userId1: string, userId2: string) => {
  const user1Followers = await prisma.follow.findMany({
    where: { followingId: userId1 },
    select: { followerId: true },
  });
  const followerIds = user1Followers.map((f) => f.followerId);
  if (followerIds.length === 0) return [];

  const mutual = await prisma.follow.findMany({
    where: { followingId: userId2, followerId: { in: followerIds } },
    include: {
      follower: { select: { id: true, username: true, profileImg: true } },
    },
  });

  return mutual.map((f) => f.follower);
};
