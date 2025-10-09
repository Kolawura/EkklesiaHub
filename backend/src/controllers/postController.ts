import { Request, Response } from "express";
import * as postService from "../services/postService";

export const createPost = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { title, slug, content, coverImage, status, communityId, tagIds } =
      req.body;

    const post = await postService.createPost({
      title,
      slug,
      content,
      coverImage,
      status,
      authorId: userId,
      communityId,
      tagIds,
    });

    return res
      .status(201)
      .json({ success: true, message: "Post created", post });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const publishPost = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;
    const post = await postService.publishPost(id, userId);
    return res
      .status(200)
      .json({ success: true, message: "Post published", post });
  } catch (error: any) {
    return res.status(403).json({ success: false, message: error.message });
  }
};

export const archivePost = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;
    const post = await postService.archivePost(id, userId);
    return res
      .status(200)
      .json({ success: true, message: "Post archived", post });
  } catch (error: any) {
    return res.status(403).json({ success: false, message: error.message });
  }
};

export const getPosts = async (req: Request, res: Response) => {
  try {
    const { search, tagId, communityId, authorId, page, limit, status } =
      req.query;

    const result = await postService.getAllPosts({
      search: search as string,
      tagId: tagId as string,
      communityId: communityId as string,
      authorId: authorId as string,
      page: Number(page),
      limit: Number(limit),
      status: status as string,
    });

    return res.status(200).json({ success: true, result });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getPostBySlug = async (req: Request, res: Response) => {
  try {
    const post = await postService.getPostBySlug(req.params.slug);
    return res.status(200).json({ success: true, post });
  } catch (error: any) {
    return res.status(404).json({ success: false, message: error.message });
  }
};

export const updatePost = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;
    const updates = req.body;
    const updated = await postService.updatePost(id, updates, userId);
    return res.status(200).json({ success: true, updated });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const deletePost = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;
    await postService.deletePost(id, userId);
    return res.status(200).json({ success: true, message: "Post deleted" });
  } catch (error: any) {
    return res.status(403).json({ success: false, message: error.message });
  }
};

export const getPostsByAuthor = async (req: Request, res: Response) => {
  try {
    const { authorId } = req.params;
    const posts = await postService.getPostsByAuthor(authorId);
    return res.status(200).json({ success: true, posts });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getPostsByCommunity = async (req: Request, res: Response) => {
  try {
    const { communityId } = req.params;
    const posts = await postService.getPostsByCommunity(communityId);
    return res.status(200).json({ success: true, posts });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
