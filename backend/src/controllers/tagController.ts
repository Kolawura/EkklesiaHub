import { Request, Response } from "express";
import * as tagService from "../services/tagService";
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
    const existing = await tagService.getTagByName(name);
    if (existing)
      return res.status(409).json({ success: false, message: "Tag already exists" });

    const tag = await tagService.createTag(name);
    return res.status(201).json({ success: true, data: tag });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllTags = async (_req: Request, res: Response) => {
  try {
    const tags = await tagService.getAllTags();
    return res.status(200).json({ success: true, data: tags });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getTagByName = async (req: Request, res: Response) => {
  try {
    const { name } = req.params;
    const tag = await tagService.getTagByName(name);
    if (!tag) return res.status(404).json({ success: false, message: "Tag not found" });
    return res.status(200).json({ success: true, data: tag });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
