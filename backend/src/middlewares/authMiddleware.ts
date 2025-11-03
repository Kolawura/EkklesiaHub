import { verifyToken } from "../utils/token";
import { Response, NextFunction } from "express";
import { AuthRequest } from "../utils/Type";
import { findUserById } from "../services/authService";

export const protectRoute = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }
    const decoded = verifyToken(token) as { userId: string };
    const user = await findUserById(decoded.userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized: Invalid token", error });
  }
};
