import { Request, Response } from "express";
import { prisma } from "../db/prisma";
import { AuthRequest } from "../utils/Type";

export const getPublicProfile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        username: true,
        bio: true,
        profileImg: true,
        bannerImg: true,
        createdAt: true,
        _count: {
          select: {
            followers: true,
            following: true,
            posts: true,
          },
        },
      },
    });

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    return res.status(200).json({ success: true, data: user });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserPosts = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const page = req.query.page ? Number(req.query.page) : 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where: { authorId: id, status: "PUBLISHED" },
        include: {
          tags: true,
          _count: { select: { comments: true, reactions: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.post.count({ where: { authorId: id, status: "PUBLISHED" } }),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        posts,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const searchUsers = async (req: Request, res: Response) => {
  const { q, limit } = req.query as { q?: string; limit?: string };
  if (!q?.trim()) return res.json({ success: true, data: [] });

  const users = await prisma.user.findMany({
    where: {
      OR: [
        { username: { contains: q, mode: "insensitive" } },
        { firstName: { contains: q, mode: "insensitive" } },
        { lastName: { contains: q, mode: "insensitive" } },
      ],
    },
    select: { id: true, username: true, profileImg: true },
    take: Math.min(parseInt(limit ?? "8", 10), 20),
  });

  return res.json({ success: true, data: users });
};

export const checkUsernameAvailability = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const { username } = req.query as { username?: string };

    if (!username?.trim()) {
      return res.json({ available: false });
    }

    const trimmed = username.trim().toLowerCase();

    // Validate format
    if (!/^[a-z0-9_-]{3,30}$/.test(trimmed)) {
      return res.json({ available: false, reason: "invalid_format" });
    }

    const existing = await prisma.user.findUnique({
      where: { username: trimmed },
      select: { id: true },
    });

    // If it's the requesting user's own current username, it's "available"
    const isSelf = existing?.id === req.userId;

    return res.json({ available: !existing || isSelf });
  } catch (error: any) {
    return res.status(500).json({ available: false, message: error.message });
  }
};
