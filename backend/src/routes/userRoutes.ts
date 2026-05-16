import { Router } from "express";
import { protectRoute } from "../middlewares/authMiddleware";
import {
  checkUsernameAvailability,
  getPublicProfile,
  getUserPosts,
  searchUsers,
} from "../controllers/userController";

const router = Router();
router.get("/search", protectRoute, searchUsers);
router.get("/check-username", checkUsernameAvailability);

router.get("/:id", getPublicProfile);
router.get("/:id/posts", getUserPosts);

export default router;
