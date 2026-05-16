import { Response } from "express";
import { AuthRequest } from "../utils/Type";
import * as followService from "../services/followService";

export const followUser = async (req: AuthRequest, res: Response) => {
  try {
    const followerId = req.userId!;
    const { followingId } = req.params;
    const result = await followService.followUser(followerId, followingId);
    return res.status(201).json({ success: true, data: result });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const unfollowUser = async (req: AuthRequest, res: Response) => {
  try {
    const followerId = req.userId!;
    const { followingId } = req.params;
    const result = await followService.unfollowUser(followerId, followingId);
    return res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const getFollowers = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;
    const followers = await followService.getFollowers(userId);
    return res.status(200).json({ success: true, data: followers });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getFollowing = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;
    const following = await followService.getFollowing(userId);
    return res.status(200).json({ success: true, data: following });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const mutualFollowers = async (req: AuthRequest, res: Response) => {
  try {
    const { userId1, userId2 } = req.params;
    const mutuals = await followService.mutualFollowers(userId1, userId2);
    return res.status(200).json({ success: true, data: mutuals });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
