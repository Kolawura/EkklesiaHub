import { Request, Response } from "express";
import * as tagService from "../services/tagService";
import { tagSchema } from "../schema/tagSchema";

export const createTag = async (req: Request, res: Response) => {
  const validateBody = tagSchema.safeParse(req.body);
  if (!validateBody.success) {
    return res.status(400).json({
      success: false,
      massage: "Invalid input",
      error: validateBody.error.issues[0],
    });
  }
  try {
    const { name } = validateBody.data;
    const existingTag = await tagService.getTagByName(name);
    if (existingTag)
      return res.status(400).json({ message: "Tag already exists" });

    const tag = await tagService.createTag(name);
    return res.status(201).json({ success: true, tag });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllTags = async (req: Request, res: Response) => {
  try {
    const tags = await tagService.getAllTags();
    return res.status(200).json({ success: true, tags });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const getTagByName = async (req: Request, res: Response) => {
  const validateBody = tagSchema.safeParse(req.body);
  if (!validateBody.success) {
    return res.status(400).json({
      success: false,
      massage: "Invalid input",
      error: validateBody.error.issues[0],
    });
  }
  try {
    const { name } = validateBody.data;
    const tag = await tagService.getTagByName(name);
    return res.json({ success: true, tag });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
