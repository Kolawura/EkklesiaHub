import { Response } from "express";
import * as svc from "../services/readingPlanService";
import { startPlanSchema, todayQuerySchema } from "../schema/readingPlanSchema";
import { AuthRequest } from "../utils/Type";

const handle = (res: Response, err: any) => {
  const status = err?.status ?? 500;
  if (status >= 500) {
    console.error("reading-plan error:", err);
    return res.status(500).json({ success: false, message: "Something went wrong." });
  }
  return res.status(status).json({ success: false, message: err.message });
};

export const list = async (req: AuthRequest, res: Response) => {
  try {
    const q = todayQuerySchema.safeParse(req.query);
    if (!q.success) {
      return res.status(400).json({ success: false, message: q.error.issues[0].message });
    }
    const data = await svc.listEnrollments(req.userId!, q.data.today);
    return res.json({ success: true, data });
  } catch (err) {
    return handle(res, err);
  }
};

export const start = async (req: AuthRequest, res: Response) => {
  try {
    const body = startPlanSchema.safeParse(req.body);
    if (!body.success) {
      return res.status(400).json({ success: false, message: body.error.issues[0].message });
    }
    const created = await svc.startPlan(req.userId!, body.data);
    return res.status(201).json({ success: true, data: created });
  } catch (err) {
    return handle(res, err);
  }
};

export const leave = async (req: AuthRequest, res: Response) => {
  try {
    await svc.leavePlan(req.userId!, String(req.params.id));
    return res.json({ success: true });
  } catch (err) {
    return handle(res, err);
  }
};
