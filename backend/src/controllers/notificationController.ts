import { Response } from "express";
import { AuthRequest } from "../utils/Type";
import * as notificationService from "../services/notificationService";

export const getNotifications = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const page = req.query.page ? Number(req.query.page) : 1;
    const result = await notificationService.getUserNotifications(userId, page);
    return res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const markAsRead = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { id } = req.params;
    await notificationService.markAsRead(id, userId);
    return res.status(200).json({ success: true, message: "Marked as read" });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const markAllAsRead = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    await notificationService.markAllAsRead(userId);
    return res.status(200).json({ success: true, message: "All notifications marked as read" });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteNotification = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { id } = req.params;
    await notificationService.deleteNotification(id, userId);
    return res.status(200).json({ success: true, message: "Notification deleted" });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
