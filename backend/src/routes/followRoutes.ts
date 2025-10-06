import express from "express";
import {
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  mutualFollowers,
} from "../controllers/followController";
import { protectRoute } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/follow/:followingId", protectRoute, followUser);
router.delete("/unfollow/:followingId", protectRoute, unfollowUser);
router.get("/followers/:userId", getFollowers);
router.get("/following/:userId", getFollowing);
router.get("/mutual/:userId1/:userId2", mutualFollowers);

export default router;
