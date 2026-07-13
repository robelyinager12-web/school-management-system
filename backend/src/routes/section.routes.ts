import { Router } from "express";
import { listSections } from "../controllers/section.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.get("/", authenticate, listSections);

export default router;