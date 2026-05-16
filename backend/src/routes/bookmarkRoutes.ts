import { Router } from "express";
import {
  addBookmark,
  getUserBookmarks,
  removeBookmark,
  checkBookmark,
} from "../controllers/bookmarkController";
import { protectRoute } from "../middlewares/authMiddleware";

const router = Router();

router.post("/", protectRoute, addBookmark);
router.get("/", protectRoute, getUserBookmarks);
router.get("/check/:postId", protectRoute, checkBookmark);
router.delete("/:postId", protectRoute, removeBookmark);

export default router;
