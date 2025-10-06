// src/routes/bookmarkRoutes.ts
import express from "express";
import {
  addBookmark,
  getUserBookmarks,
  removeBookmark,
} from "../controllers/bookmarkController";
import { protectRoute } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/", protectRoute, addBookmark);
router.delete("/:postId", protectRoute, removeBookmark);
router.get("/", protectRoute, getUserBookmarks);

export default router;
