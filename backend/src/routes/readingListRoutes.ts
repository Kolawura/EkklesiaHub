// ═══════════════════════════════════════════════════════════════
// readingListRoutes.ts
// ═══════════════════════════════════════════════════════════════
import { Router } from "express";
import * as ctrl from "../controllers/readingListController";
import { protectRoute } from "../middlewares/authMiddleware";

const router = Router();

router.get("/", protectRoute, ctrl.getList);
router.get("/stats", protectRoute, ctrl.getStats);
router.get("/check/:postId", protectRoute, ctrl.checkStatus);
router.post("/", protectRoute, ctrl.add);
router.delete("/:postId", protectRoute, ctrl.remove);
router.patch("/:postId/read", protectRoute, ctrl.markRead);
router.patch("/:postId/unread", protectRoute, ctrl.markUnread);

export default router;
