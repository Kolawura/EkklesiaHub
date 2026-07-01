// ═══════════════════════════════════════════════════════════════
// tagFollowController.ts
// ═══════════════════════════════════════════════════════════════
import { Request, Response } from "express";
import * as svc from "../services/tagService";
import { AuthRequest } from "../utils/Type";
import { tagSchema } from "../schema/tagSchema";

export const createTag = async (req: Request, res: Response) => {
  const validated = tagSchema.safeParse(req.body);
  if (!validated.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid input",
      error: validated.error.issues[0],
    });
  }
  try {
    const { name } = validated.data;
    const existing = await svc.getTagByName(name);
    if (existing)
      return res
        .status(409)
        .json({ success: false, message: "Tag already exists" });

    const tag = await svc.createTag(name);
    return res.status(201).json({ success: true, data: tag });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const follow = async (req: AuthRequest, res: Response) => {
  try {
    await svc.followTag(req.userId!, req.params.tagId);
    return res
      .status(201)
      .json({ success: true, message: "Now following tag." });
  } catch (err: any) {
    return res
      .status(err.status ?? 400)
      .json({ success: false, message: err.message });
  }
};

export const unfollow = async (req: AuthRequest, res: Response) => {
  try {
    await svc.unfollowTag(req.userId!, req.params.tagId);
    return res.json({ success: true, message: "Unfollowed tag." });
  } catch (err: any) {
    return res
      .status(err.status ?? 400)
      .json({ success: false, message: err.message });
  }
};

export const getFollowed = async (req: AuthRequest, res: Response) => {
  try {
    const tags = await svc.getFollowedTags(req.userId!);
    return res.json({ success: true, data: tags });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const checkFollowing = async (req: AuthRequest, res: Response) => {
  try {
    const status = await svc.checkFollowingTag(req.userId!, req.params.tagId);
    return res.json({ success: true, data: status });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getFeed = async (req: AuthRequest, res: Response) => {
  try {
    const { page, limit } = req.query as Record<string, string>;
    const result = await svc.getTagFeed(
      req.userId!,
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 12,
    );
    return res.json({ success: true, ...result });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getAllTags = async (_req: AuthRequest, res: Response) => {
  try {
    const tags = await svc.getAllTagsWithCounts();
    return res.json({ success: true, data: tags });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getTagByName = async (req: Request, res: Response) => {
  try {
    const { name } = req.params;
    const tag = await svc.getTagByName(name);
    if (!tag)
      return res.status(404).json({ success: false, message: "Tag not found" });
    return res.status(200).json({ success: true, data: tag });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
