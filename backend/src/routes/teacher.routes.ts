import { Router } from "express";
import {
  listTeachers,
  getTeacher,
  createTeacher,
  updateTeacher,
  deleteTeacher,
} from "../controllers/teacher.controller";
import { authenticate, authorize } from "../middleware/auth.middleware";

const router = Router();

router.use(authenticate);

router.get("/", listTeachers);
router.get("/:id", getTeacher);
router.post("/", authorize("SUPER_ADMIN", "ADMIN", "PRINCIPAL"), createTeacher);
router.put("/:id", authorize("SUPER_ADMIN", "ADMIN", "PRINCIPAL"), updateTeacher);
router.delete("/:id", authorize("SUPER_ADMIN", "ADMIN"), deleteTeacher);

export default router;