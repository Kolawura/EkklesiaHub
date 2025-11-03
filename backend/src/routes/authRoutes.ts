import { Router } from "express";
const router = Router();
import {
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/authController";
import { protectRoute } from "../middlewares/authMiddleware";

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/me", protectRoute, getCurrentUser);

export default router;
