import express from "express";
import { createTag, getAllTags } from "../controllers/tagController";

const router = express.Router();

router.post("/", createTag);
router.get("/getall", getAllTags);

export default router;
