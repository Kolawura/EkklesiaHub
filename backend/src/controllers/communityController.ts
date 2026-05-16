import { Response } from "express";
import { AuthRequest } from "../utils/Type";
import * as communityService from "../services/communityService";

export const createCommunity = async (req: AuthRequest, res: Response) => {
  try {
    const { name, description, rules, avatar, coverImage, isPrivate } =
      req.body;
    if (!name?.trim() || !description?.trim())
      return res
        .status(400)
        .json({ success: false, message: "Name and description are required" });
    const community = await communityService.createCommunity(
      name,
      description,
      req.userId!,
      { rules, avatar, coverImage, isPrivate },
    );
    return res
      .status(201)
      .json({ success: true, message: "Community created", data: community });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const joinCommunity = async (req: AuthRequest, res: Response) => {
  try {
    const membership = await communityService.joinCommunity(
      req.params.id,
      req.userId!,
    );
    return res
      .status(200)
      .json({ success: true, message: "Joined community", data: membership });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const leaveCommunity = async (req: AuthRequest, res: Response) => {
  try {
    const result = await communityService.leaveCommunity(
      req.params.id,
      req.userId!,
    );
    return res.status(200).json({ success: true, ...result });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const getAllCommunities = async (req: AuthRequest, res: Response) => {
  try {
    const { search } = req.query;
    const communities = await communityService.getAllCommunities(
      search as string,
      req.userId,
    );
    return res.status(200).json({ success: true, data: communities });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getCommunityById = async (req: AuthRequest, res: Response) => {
  try {
    const community = await communityService.getCommunityById(
      req.params.id,
      req.userId,
    );
    return res.status(200).json({ success: true, data: community });
  } catch (error: any) {
    return res.status(404).json({ success: false, message: error.message });
  }
};

export const getUserCommunities = async (req: AuthRequest, res: Response) => {
  try {
    const communities = await communityService.getUserCommunities(req.userId!);
    return res.status(200).json({ success: true, data: communities });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getCommunityMembers = async (req: AuthRequest, res: Response) => {
  try {
    const members = await communityService.getCommunityMembers(req.params.id);
    return res.status(200).json({ success: true, data: members });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getCommunityPosts = async (req: AuthRequest, res: Response) => {
  try {
    const { page = "1", limit = "10", search } = req.query;
    const results = await communityService.getCommunityPosts(
      req.params.id,
      parseInt(page as string, 10),
      parseInt(limit as string, 10),
      search as string,
      req.userId,
    );
    return res.status(200).json({ success: true, data: results });
  } catch (error: any) {
    const status =
      error.message.includes("private") || error.message.includes("member")
        ? 403
        : 500;
    return res.status(status).json({ success: false, message: error.message });
  }
};

export const updateCommunityInfo = async (req: AuthRequest, res: Response) => {
  try {
    const { name, description, rules, avatar, coverImage, isPrivate } =
      req.body;
    const updated = await communityService.updateCommunityInfo(
      req.params.id,
      { name, description, rules, avatar, coverImage, isPrivate },
      req.userId!,
    );
    return res
      .status(200)
      .json({ success: true, message: "Community updated", data: updated });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const updateMembershipRole = async (req: AuthRequest, res: Response) => {
  try {
    const { id: communityId, userId: targetUserId } = req.params;
    const { newRole } = req.body;
    if (!newRole)
      return res
        .status(400)
        .json({ success: false, message: "newRole is required" });
    const updated = await communityService.updateMembershipRole(
      communityId,
      targetUserId,
      newRole,
      req.userId!,
    );
    return res.status(200).json({ success: true, data: updated });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteCommunity = async (req: AuthRequest, res: Response) => {
  try {
    const result = await communityService.deleteCommunity(
      req.params.id,
      req.userId!,
    );
    return res.status(200).json({ success: true, ...result });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const getCommunityAnalytics = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const analytics = await communityService.getCommunityAnalytics(
      req.params.id,
      req.userId!,
    );
    return res.status(200).json({ success: true, data: analytics });
  } catch (error: any) {
    console.error(error);
    return res.status(403).json({ success: false, message: error.message });
  }
};
