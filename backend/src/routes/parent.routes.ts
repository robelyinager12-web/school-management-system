import { Router } from "express";
import { listParents } from "../controllers/parent.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.get("/", authenticate, listParents);

export default router;
