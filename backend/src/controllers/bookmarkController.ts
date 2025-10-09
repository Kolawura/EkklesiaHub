import { Request, Response } from "express";
import * as bookmarkService from "../services/bookmarkService";

export const addBookmark = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { postId } = req.body;

    const bookmark = await bookmarkService.addBookmark(userId, postId);
    return res.status(201).json({ success: true, bookmark });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const removeBookmark = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { postId } = req.params;

    await bookmarkService.removeBookmark(userId, postId);
    return res.status(200).json({ success: true, message: "Bookmark removed" });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const getUserBookmarks = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const bookmarks = await bookmarkService.getUserBookmarks(userId);
    return res.status(200).json({ success: true, bookmarks });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
