import { Router } from "express";
import * as scriptureController from "../controllers/scriptureController";
import { protectRoute } from "../middlewares/authMiddleware";

const router = Router();

/**
 * All scripture endpoints require authentication.
 * This prevents anonymous abuse of the daily API quota.
 * (Readers who aren't logged in won't see the Bible panel.)
 */
router.get("/lookup", protectRoute, scriptureController.lookupPassage);
router.get("/search", protectRoute, scriptureController.searchScripture);
router.get("/versions", protectRoute, scriptureController.getVersions);

export default router;
