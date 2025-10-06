// src/routes/comment.routes.ts
import { Router } from "express";
import * as commentController from "../controllers/commentController";
import { protectRoute } from "../middlewares/authMiddleware";

const router = Router();

// Public
router.get("/post/:postId", commentController.getCommentsByPost);

// Protected
router.post("/", protectRoute, commentController.createComment);
router.put("/update/:id", protectRoute, commentController.updateComment);
router.delete("/delete/:id", protectRoute, commentController.deleteComment);

export default router;
