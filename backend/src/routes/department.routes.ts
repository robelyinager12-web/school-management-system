import { Router } from "express";
import { listDepartments } from "../controllers/department.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.get("/", authenticate, listDepartments);

export default router;