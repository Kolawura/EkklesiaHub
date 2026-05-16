import { Response } from "express";
import { AuthRequest } from "../utils/Type";
import * as bookmarkService from "../services/bookmarkService";

export const addBookmark = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { postId } = req.body;
    if (!postId) return res.status(400).json({ success: false, message: "postId is required" });
    const bookmark = await bookmarkService.addBookmark(userId, postId);
    return res.status(201).json({ success: true, data: bookmark });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const removeBookmark = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { postId } = req.params;
    await bookmarkService.removeBookmark(userId, postId);
    return res.status(200).json({ success: true, message: "Bookmark removed" });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const getUserBookmarks = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const bookmarks = await bookmarkService.getUserBookmarks(userId);
    return res.status(200).json({ success: true, data: bookmarks });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const checkBookmark = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { postId } = req.params;
    const bookmarked = await bookmarkService.isPostBookmarked(userId, postId);
    return res.status(200).json({ success: true, data: { bookmarked } });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
