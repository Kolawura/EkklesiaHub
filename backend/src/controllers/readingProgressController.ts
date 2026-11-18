import { Response } from "express";
import * as svc from "../services/readingProgressService";
import { chaptersBodySchema } from "../schema/readingProgressSchema";
import { AuthRequest } from "../utils/Type";

const fail = (res: Response, err: unknown) => {
  console.error("reading-progress error:", err);
  return res.status(500).json({ success: false, message: "Something went wrong." });
};

export const list = async (req: AuthRequest, res: Response) => {
  try {
    return res.json({ success: true, data: await svc.listRead(req.userId!) });
  } catch (err) {
    return fail(res, err);
  }
};

export const mark = async (req: AuthRequest, res: Response) => {
  try {
    const body = chaptersBodySchema.safeParse(req.body);
    if (!body.success) {
      return res.status(400).json({ success: false, message: body.error.issues[0].message });
    }
    await svc.markRead(req.userId!, body.data.chapters);
    return res.json({ success: true });
  } catch (err) {
    return fail(res, err);
  }
};

export const unmark = async (req: AuthRequest, res: Response) => {
  try {
    const body = chaptersBodySchema.safeParse(req.body);
    if (!body.success) {
      return res.status(400).json({ success: false, message: body.error.issues[0].message });
    }
    await svc.unmarkRead(req.userId!, body.data.chapters);
    return res.json({ success: true });
  } catch (err) {
    return fail(res, err);
  }
};
