// src/routes/post.routes.ts
import { Router } from "express";
import * as postController from "../controllers/postController";
import { protectRoute } from "../middlewares/authMiddleware";

const router = Router();

// Public routes
router.get("/", postController.getPosts);
router.get("/:slug", postController.getPostBySlug);
router.get("/:authorId", postController.getPostsByAuthor);
router.get("/:communityId", postController.getPostsByCommunity);

// Protected routes (must be logged in)
router.post("/", protectRoute, postController.createPost);
router.patch("/:id/publish", protectRoute, postController.publishPost);
router.patch("/:id/archive", protectRoute, postController.archivePost);
router.put("/:id", protectRoute, postController.updatePost);
router.delete("/:id", protectRoute, postController.deletePost);

export default router;
