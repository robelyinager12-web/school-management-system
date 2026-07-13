import { Router } from "express";
import {
  listStudents,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent,
} from "../controllers/student.controller";
import { linkGuardian, unlinkGuardian } from "../controllers/parent.controller";
import { authenticate, authorize } from "../middleware/auth.middleware";

const router = Router();

router.use(authenticate);

router.get("/", listStudents);
router.get("/:id", getStudent);
router.post("/", authorize("SUPER_ADMIN", "ADMIN", "PRINCIPAL"), createStudent);
router.put("/:id", authorize("SUPER_ADMIN", "ADMIN", "PRINCIPAL"), updateStudent);
router.delete("/:id", authorize("SUPER_ADMIN", "ADMIN"), deleteStudent);

router.post(
  "/:id/guardians",
  authorize("SUPER_ADMIN", "ADMIN", "PRINCIPAL"),
  linkGuardian
);
router.delete(
  "/:id/guardians/:linkId",
  authorize("SUPER_ADMIN", "ADMIN", "PRINCIPAL"),
  unlinkGuardian
);

export default router;