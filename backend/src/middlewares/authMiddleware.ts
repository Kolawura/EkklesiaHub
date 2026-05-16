import { verifyToken } from "../utils/token";
import { Response, NextFunction } from "express";
import { AuthRequest } from "../utils/Type";
import { JwtPayload } from "jsonwebtoken";

export const protectRoute = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: No token provided" });
    }
    const decoded = verifyToken(token) as JwtPayload;
    if (!decoded?.userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Invalid token payload",
      });
    }
    req.userId = decoded.userId;
    next();
  } catch {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized: Invalid token" });
  }
};
