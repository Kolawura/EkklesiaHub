import { Router } from "express";
import { toggleReaction, countReactions, getReactions } from "../controllers/reactionController";
import { protectRoute } from "../middlewares/authMiddleware";

const router = Router();

router.post("/", protectRoute, toggleReaction);
router.get("/", getReactions);
router.get("/count", countReactions);

export default router;
