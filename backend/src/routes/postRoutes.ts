import { Router } from "express";
import * as postController from "../controllers/postController";
import { protectRoute } from "../middlewares/authMiddleware";
import { userIdMiddleware } from "../middlewares/userIdMiddleware";

const router = Router();

router.get("/", protectRoute, postController.getPosts);
router.get("/slug/:slug", userIdMiddleware, postController.getPostBySlug);
router.get(
  "/author/:authorId",
  userIdMiddleware,
  postController.getPostsByAuthor,
);
router.get("/community/:communityId", postController.getPostsByCommunity);
router.post("/:id/view", userIdMiddleware, postController.recordView);

// Protected
router.get("/analytics/me", protectRoute, postController.getAuthorAnalytics);
router.post("/", protectRoute, postController.createPost);
router.get("/:id/edit", protectRoute, postController.getPostForEdit);
router.patch("/:id/publish", protectRoute, postController.publishPost);
router.patch("/:id/archive", protectRoute, postController.archivePost);
router.patch("/:id/remove", protectRoute, postController.adminRemovePost);
router.patch("/:id/pin", protectRoute, postController.pinPost);
router.put("/:id", protectRoute, postController.updatePost);
router.delete("/:id", protectRoute, postController.deletePost);

export default router;
