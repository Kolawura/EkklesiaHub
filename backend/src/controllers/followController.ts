import { Request, Response } from "express";
import * as followService from "../services/followService";

export const followUser = async (req: Request, res: Response) => {
  try {
    const followerId = (req as any).user?.id;
    const { followingId } = req.params;

    if (!followerId) return res.status(401).json({ message: "Unauthorized" });
    if (!followingId)
      return res.status(400).json({ message: "Following ID is required" });

    const result = await followService.followUser(followerId, followingId);
    return res.status(201).json({ success: true, result });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const unfollowUser = async (req: Request, res: Response) => {
  try {
    const followerId = (req as any).user?.id;
    const { followingId } = req.params;

    if (!followerId) return res.status(401).json({ message: "Unauthorized" });
    if (!followingId)
      return res.status(400).json({ message: "Following ID is required" });

    const result = await followService.unfollowUser(followerId, followingId);
    return res.status(200).json({ success: true, result });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const getFollowers = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const followers = await followService.getFollowers(userId);
    return res.status(200).json({ success: true, followers });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getFollowing = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const following = await followService.getFollowing(userId);
    return res.status(200).json({ success: true, following });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
export const mutualFollowers = async (req: Request, res: Response) => {
  try {
    const { userId1, userId2 } = req.params;

    if (!userId1 || !userId2)
      return res.status(400).json({ message: "Both user IDs are required" });

    const mutuals = await followService.mutualFollowers(userId1, userId2);
    return res.status(200).json({ success: true, mutuals });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
