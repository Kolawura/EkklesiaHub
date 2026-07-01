import { Router } from "express";
import {
  toggleBookmark,
  getUserBookmarks,
  checkBookmark,
} from "../controllers/bookmarkController";
import { protectRoute } from "../middlewares/authMiddleware";

const router = Router();

router.post("/", protectRoute, toggleBookmark);
router.get("/", protectRoute, getUserBookmarks);
router.get("/check/:postId", protectRoute, checkBookmark);

export default router;
