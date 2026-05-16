import { Response } from "express";
import { AuthRequest } from "../utils/Type";
import { getFileUrl } from "../utils/upload";

export const uploadImage = (req: AuthRequest, res: Response) => {
  if (!req.file) {
    return res
      .status(400)
      .json({ success: false, message: "No file provided" });
  }
  const url = getFileUrl(req.file);
  return res.status(200).json({ success: true, data: { url } });
};
