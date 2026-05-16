import { prisma } from "../db/prisma";

type NotificationType =
  | "NEW_COMMENT"
  | "NEW_REACTION"
  | "NEW_FOLLOWER"
  | "NEW_REPLY"
  | "COMMUNITY_INVITE";

export const createNotification = async (
  userId: string,
  type: NotificationType,
  message: string,
  link?: string
) => {
  // Don't notify users about their own actions
  return prisma.notification.create({
    data: { userId, type, message, link },
  });
};

export const getUserNotifications = async (userId: string, page = 1, limit = 20) => {
  const skip = (page - 1) * limit;
  const [notifications, total, unreadCount] = await Promise.all([
    prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.notification.count({ where: { userId } }),
    prisma.notification.count({ where: { userId, read: false } }),
  ]);
  return {
    notifications,
    unreadCount,
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
};

export const markAsRead = async (notificationId: string, userId: string) => {
  return prisma.notification.updateMany({
    where: { id: notificationId, userId },
    data: { read: true },
  });
};

export const markAllAsRead = async (userId: string) => {
  return prisma.notification.updateMany({
    where: { userId, read: false },
    data: { read: true },
  });
};

export const deleteNotification = async (notificationId: string, userId: string) => {
  return prisma.notification.deleteMany({
    where: { id: notificationId, userId },
  });
};
