import { Request, Response } from "express";
import * as tagService from "../services/tagService";

export const createTag = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const existingTag = await tagService.getTagByName(name);
    if (existingTag)
      return res.status(400).json({ message: "Tag already exists" });

    const tag = await tagService.createTag(name);
    res.status(201).json({ success: true, tag });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllTags = async (req: Request, res: Response) => {
  try {
    const tags = await tagService.getAllTags();
    res.status(200).json({ success: true, tags });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getTagByName = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const tag = await tagService.getTagByName(name);
    res.json({ success: true, tag });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
