import { Request, Response } from "express";
import * as communityService from "../services/communityService";

export const createCommunity = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { name, description } = req.body;
    if (!name || !description)
      return res.status(400).json({ message: "All fields are required" });
    const community = await communityService.createCommunity(
      name,
      description,
      userId
    );
    return res.status(201).json({
      success: true,
      message: "Community created successfully",
      community,
    });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const joinCommunity = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId; // Assuming userId is set in the request by authentication middleware
    const { communityId } = req.params;
    if (!communityId)
      return res.status(400).json({ message: "Community ID is required" });
    const membership = await communityService.joinCommunity(
      communityId,
      userId
    );
    return res.status(200).json({
      success: true,
      message: "Joined community successfully",
      membership,
    });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const leaveCommunity = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { communityId } = req.params;
    if (!communityId)
      return res.status(400).json({ message: "Community ID is required" });
    const result = await communityService.leaveCommunity(communityId, userId);
    return res.status(200).json({ success: true, ...result });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const getAllCommunities = async (req: Request, res: Response) => {
  try {
    const { search } = req.query;
    const communities = await communityService.getAllCommunities(
      search as string
    );
    return res.status(200).json({ success: true, communities });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getCommunityById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const community = await communityService.getCommunityById(id);
    return res.status(200).json({ success: true, community });
  } catch (error: any) {
    return res.status(404).json({ success: false, message: error.message });
  }
};

export const getUserCommunities = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const communities = await communityService.getUserCommunities(userId);
    return res.status(200).json({ success: true, communities });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getCommunityMembers = async (req: Request, res: Response) => {
  try {
    const { communityId } = req.params;
    const users = await communityService.getCommunityMembers(communityId);
    return res.status(200).json({ success: true, users });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getCommunityPosts = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { page = "1", limit = "10", search } = req.query;
    const results = await communityService.getCommunityPosts(
      id,
      parseInt(page as string, 10),
      parseInt(limit as string, 10),
      search as string
    );
    return res.status(200).json({
      success: true,
      message: "Posts fetched successfully",
      ...results,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCommunityInfo = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;
    const data = req.body;
    const updatedCommunity = await communityService.updateCommunityInfo(
      id,
      data,
      userId
    );
    return res.status(200).json({
      success: true,
      message: "Community updated successfully",
      updatedCommunity,
    });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const updateMembershipRole = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { communityId, memberId, newRole } = req.body;
    if (!communityId || !memberId || !newRole)
      return res
        .status(400)
        .json({ message: "communityId, memberId and newRole are required" });
    const updatedMember = await communityService.updateMembershipRole(
      communityId,
      memberId,
      newRole,
      userId
    );
    return res.status(200).json({
      success: true,
      message: "Member role updated successfully",
      updatedMember,
    });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteCommunity = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;
    const result = await communityService.deleteCommunity(id, userId);
    return res.status(200).json({ success: true, ...result });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
