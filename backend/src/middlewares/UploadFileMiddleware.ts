import { Request, Response, NextFunction } from "express";
import { upload } from "../utils/upload";

export const UploadFileMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  upload.single("file")(req, res, (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
    next();
  });
};
