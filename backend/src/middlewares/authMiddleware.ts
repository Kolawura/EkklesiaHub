import { verifyToken } from "../utils/token.js";
import { Response, NextFunction } from "express";
import { AuthRequest } from "../utils/Type.js";

export const protectRoute = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.token;
    if (!token)
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized: Invalid token", error });
  }
};
