// ═══════════════════════════════════════════════════════════════
// readingProgressRoutes.ts  —  mounted at /api/reading-progress
// ═══════════════════════════════════════════════════════════════
import { Router } from "express";
import * as ctrl from "../controllers/readingProgressController";
import { protectRoute } from "../middlewares/authMiddleware";

const router = Router();

router.get("/chapters", protectRoute, ctrl.list);
router.post("/chapters", protectRoute, ctrl.mark);
router.post("/chapters/unmark", protectRoute, ctrl.unmark);

export default router;
