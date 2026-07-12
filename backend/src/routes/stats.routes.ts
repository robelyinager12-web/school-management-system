import { Router } from "express";
import { getDashboardStats, getAttendanceTrend } from "../controllers/stats.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.get("/dashboard", authenticate, getDashboardStats);
router.get("/attendance-trend", authenticate, getAttendanceTrend);

export default router;