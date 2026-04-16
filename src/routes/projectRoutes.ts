import { Router } from "express";
import { createProject } from "../controllers/projectController";
import { authMiddleware } from "../middleware/authMiddleware";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.post("/", authMiddleware, asyncHandler(createProject));

export default router;