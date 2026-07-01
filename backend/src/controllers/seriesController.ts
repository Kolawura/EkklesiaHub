import { Request, Response } from "express";
import * as seriesService from "../services/seriesService";
import { AuthRequest } from "../utils/Type";

export const createSeries = async (req: AuthRequest, res: Response) => {
  try {
    const series = await seriesService.createSeries(req.userId!, req.body);
    return res.status(201).json({ success: true, data: series });
  } catch (err: any) {
    return res
      .status(err.status ?? 400)
      .json({ success: false, message: err.message });
  }
};

export const getSeriesBySlug = async (req: AuthRequest, res: Response) => {
  try {
    const series = await seriesService.getSeriesBySlug(
      req.params.slug,
      req.userId,
    );
    return res.json({ success: true, data: series });
  } catch (err: any) {
    return res
      .status(err.status ?? 500)
      .json({ success: false, message: err.message });
  }
};

export const listSeries = async (req: AuthRequest, res: Response) => {
  try {
    const { authorId, communityId, page, limit } = req.query as Record<
      string,
      string
    >;
    const result = await seriesService.listSeries({
      authorId,
      communityId,
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 12,
      requestingUserId: req.userId,
    });
    return res.json({ success: true, ...result });
  } catch (err: any) {
    return res
      .status(err.status ?? 500)
      .json({ success: false, message: err.message });
  }
};

export const updateSeries = async (req: AuthRequest, res: Response) => {
  try {
    const series = await seriesService.updateSeries(
      req.params.id,
      req.userId!,
      req.body,
    );
    return res.json({ success: true, data: series });
  } catch (err: any) {
    return res
      .status(err.status ?? 400)
      .json({ success: false, message: err.message });
  }
};

export const deleteSeries = async (req: AuthRequest, res: Response) => {
  try {
    await seriesService.deleteSeries(req.params.id, req.userId!);
    return res.json({ success: true, message: "Series deleted." });
  } catch (err: any) {
    return res
      .status(err.status ?? 400)
      .json({ success: false, message: err.message });
  }
};

export const addPost = async (req: AuthRequest, res: Response) => {
  try {
    const entry = await seriesService.addPostToSeries(
      req.params.id,
      req.body.postId,
      req.userId!,
    );
    return res.status(201).json({ success: true, data: entry });
  } catch (err: any) {
    return res
      .status(err.status ?? 400)
      .json({ success: false, message: err.message });
  }
};

export const removePost = async (req: AuthRequest, res: Response) => {
  try {
    await seriesService.removePostFromSeries(
      req.params.id,
      req.params.postId,
      req.userId!,
    );
    return res.json({ success: true, message: "Post removed from series." });
  } catch (err: any) {
    return res
      .status(err.status ?? 400)
      .json({ success: false, message: err.message });
  }
};

export const reorderPosts = async (req: AuthRequest, res: Response) => {
  try {
    await seriesService.reorderSeriesPosts(
      req.params.id,
      req.body.postIds,
      req.userId!,
    );
    return res.json({ success: true, message: "Series reordered." });
  } catch (err: any) {
    return res
      .status(err.status ?? 400)
      .json({ success: false, message: err.message });
  }
};

export const getSeriesForPost = async (req: Request, res: Response) => {
  try {
    const series = await seriesService.getSeriesForPost(req.params.postId);
    return res.json({ success: true, data: series });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
