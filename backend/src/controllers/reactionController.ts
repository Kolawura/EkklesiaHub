import { Response } from "express";
import { AuthRequest } from "../utils/Type";
import * as reactionService from "../services/reactionService";

export const toggleReaction = async (req: AuthRequest, res: Response) => {
  try {
    const { type, postId, commentId } = req.body;
    const userId = req.userId!;

    const reaction = await reactionService.toggleReaction(userId, type, postId, commentId);
    return res.status(200).json({ success: true, data: reaction });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const getReactions = async (req: AuthRequest, res: Response) => {
  try {
    const { postId, commentId } = req.query;
    const reactions = await reactionService.getReactions(
      postId as string | undefined,
      commentId as string | undefined
    );
    return res.status(200).json({ success: true, data: reactions });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const countReactions = async (req: AuthRequest, res: Response) => {
  try {
    const { postId, commentId } = req.query;
    const counts = await reactionService.countReactions(
      postId as string | undefined,
      commentId as string | undefined
    );
    return res.status(200).json({ success: true, data: counts });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
