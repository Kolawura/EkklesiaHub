import { Router } from "express";
import { protectRoute } from "../middlewares/authMiddleware";
import { uploadImage } from "../controllers/uploadController";
import { UploadFileMiddleware } from "../middlewares/UploadFileMiddleware";

const router = Router();

// POST /api/upload/image — accepts a single "file" field
router.post("/image", protectRoute, UploadFileMiddleware, uploadImage);

export default router;
