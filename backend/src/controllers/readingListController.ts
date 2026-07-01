import { Response } from "express";
import * as svc from "../services/readingListService";
import { AuthRequest } from "../utils/Type";

export const add = async (req: AuthRequest, res: Response) => {
  try {
    await svc.addToReadingList(req.userId!, req.body.postId);
    return res
      .status(201)
      .json({ success: true, message: "Added to reading list." });
  } catch (err: any) {
    return res
      .status(err.status ?? 400)
      .json({ success: false, message: err.message });
  }
};

export const remove = async (req: AuthRequest, res: Response) => {
  try {
    await svc.removeFromReadingList(req.userId!, req.params.postId);
    return res.json({ success: true, message: "Removed from reading list." });
  } catch (err: any) {
    return res
      .status(err.status ?? 400)
      .json({ success: false, message: err.message });
  }
};

export const getList = async (req: AuthRequest, res: Response) => {
  try {
    const { filter, page, limit } = req.query as Record<string, string>;
    const result = await svc.getReadingList(
      req.userId!,
      (filter as any) ?? "unread",
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 12,
    );
    return res.json({ success: true, ...result });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const markRead = async (req: AuthRequest, res: Response) => {
  try {
    await svc.markAsRead(req.userId!, req.params.postId);
    return res.json({ success: true, message: "Marked as read." });
  } catch (err: any) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

export const markUnread = async (req: AuthRequest, res: Response) => {
  try {
    await svc.markAsUnread(req.userId!, req.params.postId);
    return res.json({ success: true, message: "Marked as unread." });
  } catch (err: any) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

export const checkStatus = async (req: AuthRequest, res: Response) => {
  try {
    const status = await svc.checkInReadingList(req.userId!, req.params.postId);
    return res.json({ success: true, data: status });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getStats = async (req: AuthRequest, res: Response) => {
  try {
    const stats = await svc.getReadingListStats(req.userId!);
    return res.json({ success: true, data: stats });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
