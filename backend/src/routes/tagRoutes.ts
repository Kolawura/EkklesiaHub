// ═══════════════════════════════════════════════════════════════
// tagFollowRoutes.ts  —  save as backend/src/routes/tagFollowRoutes.ts
// ═══════════════════════════════════════════════════════════════
import { Router } from "express";
import * as ctrl from "../controllers/tagController";
import { protectRoute } from "../middlewares/authMiddleware";

const router = Router();
router.get("/", protectRoute, ctrl.getAllTags);
router.post("/", protectRoute, ctrl.createTag);
router.get("/following", protectRoute, ctrl.getFollowed);
router.get("/feed", protectRoute, ctrl.getFeed);
router.get("/:tagId/following", protectRoute, ctrl.checkFollowing);
router.post("/:tagId/follow", protectRoute, ctrl.follow);
router.delete("/:tagId/unfollow", protectRoute, ctrl.unfollow);

export default router;
