import { Response, Request } from "express";
import { AuthRequest } from "../utils/Type";
import * as postService from "../services/postService";
import { createPostSchema, updatePostSchema } from "../schema/postSchema";

export const createPost = async (req: AuthRequest, res: Response) => {
  const validated = createPostSchema.safeParse(req.body);
  if (!validated.success)
    return res
      .status(400)
      .json({
        success: false,
        message: "Invalid input",
        error: validated.error.issues,
      });

  try {
    const post = await postService.createPost({
      ...validated.data,
      authorId: req.userId!,
    });
    return res
      .status(201)
      .json({ success: true, message: "Post created", data: post });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const publishPost = async (req: AuthRequest, res: Response) => {
  try {
    const post = await postService.publishPost(req.params.id, req.userId!);
    return res
      .status(200)
      .json({ success: true, message: "Post published", data: post });
  } catch (error: any) {
    return res
      .status(error.message === "Post not found" ? 404 : 403)
      .json({ success: false, message: error.message });
  }
};

export const archivePost = async (req: AuthRequest, res: Response) => {
  try {
    const post = await postService.archivePost(req.params.id, req.userId!);
    return res
      .status(200)
      .json({ success: true, message: "Post archived", data: post });
  } catch (error: any) {
    return res
      .status(error.message === "Post not found" ? 404 : 403)
      .json({ success: false, message: error.message });
  }
};

export const adminRemovePost = async (req: AuthRequest, res: Response) => {
  try {
    const { reason } = req.body;
    if (!reason?.trim())
      return res
        .status(400)
        .json({ success: false, message: "A removal reason is required" });
    const post = await postService.adminRemovePost(
      req.params.id,
      req.userId!,
      reason,
    );
    return res
      .status(200)
      .json({ success: true, message: "Post removed", data: post });
  } catch (error: any) {
    return res.status(403).json({ success: false, message: error.message });
  }
};

export const pinPost = async (req: AuthRequest, res: Response) => {
  try {
    const post = await postService.pinPost(req.params.id, req.userId!);
    return res.status(200).json({ success: true, data: post });
  } catch (error: any) {
    return res.status(403).json({ success: false, message: error.message });
  }
};

export const getPosts = async (req: AuthRequest, res: Response) => {
  try {
    const { search, tagId, communityId, authorId, page, limit, status } =
      req.query;
    const result = await postService.getAllPosts(
      {
        search: search as string,
        tagId: tagId as string,
        communityId: communityId as string,
        authorId: authorId as string,
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined,
        status: status as string,
      },
      req.userId,
    );
    return res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    const status = error.message.includes("private") ? 403 : 500;
    return res.status(status).json({ success: false, message: error.message });
  }
};

export const getPostBySlug = async (req: AuthRequest, res: Response) => {
  try {
    const post = await postService.getPostBySlug(req.params.slug, req.userId);
    return res.status(200).json({ success: true, data: post });
  } catch (error: any) {
    const status =
      error.message.includes("private") || error.message.includes("member")
        ? 403
        : 404;
    return res.status(status).json({ success: false, message: error.message });
  }
};

export const recordView = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as AuthRequest).userId;
    const ip =
      req.headers["x-forwarded-for"]?.toString().split(",")[0] ||
      req.socket.remoteAddress ||
      "";
    await postService.recordView(id, userId, ip);
    return res.status(200).json({ success: true });
  } catch {
    return res.status(200).json({ success: true }); // never fail a view call
  }
};

export const updatePost = async (req: AuthRequest, res: Response) => {
  const validated = updatePostSchema.safeParse(req.body);
  if (!validated.success)
    return res
      .status(400)
      .json({
        success: false,
        message: "Invalid input",
        error: validated.error.issues,
      });
  try {
    const updated = await postService.updatePost(
      req.params.id,
      validated.data,
      req.userId!,
    );
    return res.status(200).json({ success: true, data: updated });
  } catch (error: any) {
    return res
      .status(error.message === "Post not found" ? 404 : 403)
      .json({ success: false, message: error.message });
  }
};

export const deletePost = async (req: AuthRequest, res: Response) => {
  try {
    await postService.deletePost(req.params.id, req.userId!);
    return res.status(200).json({ success: true, message: "Post deleted" });
  } catch (error: any) {
    return res
      .status(error.message === "Post not found" ? 404 : 403)
      .json({ success: false, message: error.message });
  }
};

export const getPostsByAuthor = async (req: AuthRequest, res: Response) => {
  try {
    const { authorId } = req.params;
    const isOwn = req.userId === authorId;
    const posts = await postService.getPostsByAuthor(authorId, isOwn);
    return res.status(200).json({ success: true, data: posts });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getPostsByCommunity = async (req: AuthRequest, res: Response) => {
  try {
    const posts = await postService.getPostsByCommunity(req.params.communityId);
    return res.status(200).json({ success: true, data: posts });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getPostForEdit = async (req: AuthRequest, res: Response) => {
  try {
    const post = await postService.getPostForEdit(req.params.id, req.userId!);
    return res.status(200).json({ success: true, data: post });
  } catch (error: any) {
    return res
      .status(error.message === "Post not found" ? 404 : 403)
      .json({ success: false, message: error.message });
  }
};

export const getAuthorAnalytics = async (req: AuthRequest, res: Response) => {
  try {
    const analytics = await postService.getAuthorAnalytics(req.userId!);
    return res.status(200).json({ success: true, data: analytics });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
