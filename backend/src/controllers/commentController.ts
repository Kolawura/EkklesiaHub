import { Request, Response } from "express";
import * as commentService from "../services/commentService";
import {
  createCommentSchema,
  updateCommentSchema,
} from "../schema/commentSchema";

export const createComment = async (req: Request, res: Response) => {
  const validatedBody = createCommentSchema.safeParse(req.body);
  if (!validatedBody.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid comment data",
      error: validatedBody.error.issues,
    });
  }

  try {
    const userId = (req as any).userId;
    const { content, postId, parentId } = validatedBody.data;
    const comment = await commentService.createComment({
      content,
      authorId: userId,
      postId,
      parentId,
    });
    res.status(201).json({ success: true, message: "Comment added", comment });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getCommentsByPost = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    const comments = await commentService.getCommentsByPost(postId);
    res.json({ success: true, message: "Comments Gotten", comments });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateComment = async (req: Request, res: Response) => {
  const validateBody = updateCommentSchema.safeParse(req.body);
  if (!validateBody.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid comment data",
      error: validateBody.error.issues,
    });
  }

  try {
    const userId = (req as any).userId;
    const { id } = req.params;
    const { content } = req.body;
    const updated = await commentService.updateComment(id, content, userId);
    return res.json({ success: true, message: "Comment Updated", updated });
  } catch (error: any) {
    return res.status(403).json({ success: false, message: error.message });
  }
};

export const deleteComment = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;
    await commentService.deleteComment(id, userId);
    return res.json({ message: "Comment deleted" });
  } catch (error: any) {
    return res.status(403).json({ success: false, message: error.message });
  }
};
