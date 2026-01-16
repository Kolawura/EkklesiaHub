import { Router } from "express";
const router = Router();
import {
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/authController";
import { checkUser } from "../middlewares/authMiddleware";

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/me", checkUser, getCurrentUser);

export default router;
