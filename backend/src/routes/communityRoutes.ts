import express from "express";
import {
  createCommunity,
  joinCommunity,
  leaveCommunity,
  getAllCommunities,
  getCommunityById,
  getUserCommunities,
  getCommunityUsers,
  getCommunityPosts,
  updateCommunityInfo,
  updateMembershipRole,
  deleteCommunity,
} from "../controllers/communityController";
import { protectRoute } from "../middlewares/authMiddleware";

const router = express.Router();

// Public
router.get("/", getAllCommunities);
router.get("/:id", getCommunityById);
router.get("/:id/posts", getCommunityPosts);

// Protected
router.post("/", protectRoute, createCommunity);
router.post("/:id/join", protectRoute, joinCommunity);
router.post("/:id/leave", protectRoute, leaveCommunity);
router.get("/user/me", protectRoute, getUserCommunities);
router.get("/:id/members", protectRoute, getCommunityUsers);
router.put("/:id", protectRoute, updateCommunityInfo);
router.put("/:id/members/role", protectRoute, updateMembershipRole);
router.delete("/:id", protectRoute, deleteCommunity);

export default router;
