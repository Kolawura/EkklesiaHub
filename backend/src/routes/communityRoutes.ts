import express from "express";
import {
  createCommunity,
  joinCommunity,
  leaveCommunity,
  getAllCommunities,
  getCommunityById,
  getUserCommunities,
  getCommunityMembers,
  getCommunityPosts,
  updateCommunityInfo,
  updateMembershipRole,
  deleteCommunity,
} from "../controllers/communityController";
import { protectRoute } from "../middlewares/authMiddleware";

const router = express.Router();

// Public
router.get("/get", getAllCommunities);
router.get("/get/:id", getCommunityById);
router.get("/posts/:id", getCommunityPosts);

// Protected
router.post("/", protectRoute, createCommunity);
router.post("/join:id", protectRoute, joinCommunity);
router.post("/leave/:id", protectRoute, leaveCommunity);
router.get("/get/communities", protectRoute, getUserCommunities);
router.get("/get/members/:id", protectRoute, getCommunityMembers);
router.put("/info/update:id", protectRoute, updateCommunityInfo);
router.put("/members/update/:id", protectRoute, updateMembershipRole);
router.delete("/delete/:id", protectRoute, deleteCommunity);

export default router;
