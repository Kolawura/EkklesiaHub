import { Router } from "express";
import {
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
  updateProfile,
  changePassword,
  changeEmail,
  deleteAccount,
} from "../controllers/authController";
import { protectRoute } from "../middlewares/authMiddleware";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/me", protectRoute, getCurrentUser);
router.put("/me", protectRoute, updateProfile);
router.post("/change-password", protectRoute, changePassword);
router.post("/change-email", protectRoute, changeEmail);
router.delete("/account", protectRoute, deleteAccount);

export default router;
