import { Router } from "express";
import * as seriesController from "../controllers/seriesController";
import { protectRoute } from "../middlewares/authMiddleware";
import { userIdMiddleware } from "../middlewares/userIdMiddleware";

const router = Router();

// Public (with optional auth to see unpublished own series)
router.get("/", userIdMiddleware, seriesController.listSeries);
router.get("/:slug", userIdMiddleware, seriesController.getSeriesBySlug);
router.get(
  "/post/:postId",
  userIdMiddleware,
  seriesController.getSeriesForPost,
);

// Protected
router.post("/", protectRoute, seriesController.createSeries);
router.put("/:id", protectRoute, seriesController.updateSeries);
router.delete("/:id", protectRoute, seriesController.deleteSeries);
router.post("/:id/posts", protectRoute, seriesController.addPost);
router.delete("/:id/posts/:postId", protectRoute, seriesController.removePost);
router.patch("/:id/posts/reorder", protectRoute, seriesController.reorderPosts);

export default router;
