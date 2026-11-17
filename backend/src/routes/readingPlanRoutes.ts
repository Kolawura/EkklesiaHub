// ═══════════════════════════════════════════════════════════════
// readingPlanRoutes.ts  —  mounted at /api/reading-plans
// ═══════════════════════════════════════════════════════════════
import { Router } from "express";
import * as ctrl from "../controllers/readingPlanController";
import { protectRoute } from "../middlewares/authMiddleware";

const router = Router();

router.get("/", protectRoute, ctrl.list);
router.post("/", protectRoute, ctrl.start);
router.post("/:id/days/:day/complete", protectRoute, ctrl.completeDay);
router.delete("/:id/days/:day/complete", protectRoute, ctrl.uncompleteDay);
router.delete("/:id", protectRoute, ctrl.leave);

export default router;
