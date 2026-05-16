import { Router } from "express";
import { protectRoute } from "../middlewares/authMiddleware";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from "../controllers/notificationController";

const router = Router();

router.get("/", protectRoute, getNotifications);
router.patch("/read-all", protectRoute, markAllAsRead);
router.patch("/:id/read", protectRoute, markAsRead);
router.delete("/:id", protectRoute, deleteNotification);

export default router;
