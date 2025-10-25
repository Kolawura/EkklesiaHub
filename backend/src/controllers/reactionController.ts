// src/controllers/reactionController.ts
import { Request, Response } from "express";
import * as reactionService from "../services/reactionService";
import { reactionSchema } from "../schema/reactionSchema";

export const Reaction = async (req: Request, res: Response) => {
  const validateBody = reactionSchema.safeParse(req.body);
  if (!validateBody.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid reaction data",
      error: validateBody.error.issues,
    });
  }

  try {
    const { type } = validateBody.data;
    const { postId, commentId } = req.query;
    const userId = (req as any).user.id;

    const reaction = await reactionService.Reaction(
      userId,
      type,
      postId as string,
      commentId as string | undefined
    );
    return res.status(201).json({ success: true, reaction });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const getReactions = async (req: Request, res: Response) => {
  try {
    const { postId, commentId } = req.query;
    const reactions = await reactionService.getReactions(
      postId as string,
      commentId as string | undefined
    );

    return res.status(200).json({ success: true, reactions });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const countReactions = async (req: Request, res: Response) => {
  try {
    const { postId, commentId } = req.query;
    const counts = await reactionService.countReactions(
      postId as string,
      commentId as string | undefined
    );
    return res.status(200).json({ success: true, counts });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
