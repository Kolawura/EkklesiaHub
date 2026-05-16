import { Router } from "express";
import {
  createCommunity, joinCommunity, leaveCommunity,
  getAllCommunities, getCommunityById, getUserCommunities,
  getCommunityMembers, getCommunityPosts, updateCommunityInfo,
  updateMembershipRole, deleteCommunity, getCommunityAnalytics,
} from "../controllers/communityController";
import { protectRoute } from "../middlewares/authMiddleware";

const router = Router();

// inject optional userId for privacy checks
const optionalAuth = (req: any, res: any, next: any) => {
  try {
    const jwt = require("jsonwebtoken");
    const token = req.cookies?.token;
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
      req.userId = decoded?.userId;
    }
  } catch {}
  next();
};

router.get("/", optionalAuth, getAllCommunities);
router.get("/mine", protectRoute, getUserCommunities);
router.get("/:id", optionalAuth, getCommunityById);
router.get("/:id/posts", optionalAuth, getCommunityPosts);
router.get("/:id/members", optionalAuth, getCommunityMembers);
router.get("/:id/analytics", protectRoute, getCommunityAnalytics);

router.post("/", protectRoute, createCommunity);
router.post("/:id/join", protectRoute, joinCommunity);
router.post("/:id/leave", protectRoute, leaveCommunity);
router.put("/:id", protectRoute, updateCommunityInfo);
router.patch("/:id", protectRoute, updateCommunityInfo);
router.put("/:id/members/:userId", protectRoute, updateMembershipRole);
router.patch("/:id/members/:userId", protectRoute, updateMembershipRole);
router.delete("/:id", protectRoute, deleteCommunity);

export default router;
