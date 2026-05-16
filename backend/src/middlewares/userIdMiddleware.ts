import { NextFunction, Response } from "express";
import { AuthRequest } from "../utils/Type";
import { verifyToken } from "../utils/token";
import { JwtPayload } from "jsonwebtoken";

export const userIdMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies?.token;
    const decoded = verifyToken(token) as JwtPayload;
    req.userId = decoded.userId;
  } catch {}
  next();
};
