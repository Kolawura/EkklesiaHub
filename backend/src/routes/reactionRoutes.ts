// src/routes/reactionRoutes.ts
import express from "express";
import {
  Reaction,
  countReactions,
  getReactions,
} from "../controllers/reactionController";
import { protectRoute } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/", protectRoute, Reaction);
router.get("/get", getReactions);
router.get("/count", countReactions);

export default router;
