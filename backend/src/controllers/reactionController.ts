// src/controllers/reactionController.ts
import { Request, Response } from "express";
import * as reactionService from "../services/reactionService";

export const Reaction = async (req: Request, res: Response) => {
  try {
    const { type, postId, commentId } = req.body;
    const userId = (req as any).user.id;

    const reaction = await reactionService.Reaction(
      userId,
      type,
      postId,
      commentId
    );
    res.status(201).json({ success: true, reaction });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getReactions = async (req: Request, res: Response) => {
  try {
    const { postId, commentId } = req.query;
    const reactions = await reactionService.getReactions(
      postId as string,
      commentId as string | undefined
    );

    res.status(200).json({ success: true, reactions });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const countReactions = async (req: Request, res: Response) => {
  try {
    const { postId, commentId } = req.query;
    const counts = await reactionService.countReactions(
      postId as string,
      commentId as string | undefined
    );
    res.status(200).json({ success: true, counts });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};
