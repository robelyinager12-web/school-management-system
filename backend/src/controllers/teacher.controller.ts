import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { teacherService } from "../services/teacher.service";
import {
  createTeacherSchema,
  updateTeacherSchema,
  listTeachersQuerySchema,
} from "../validators/teacher.validator";

export async function listTeachers(req: AuthRequest, res: Response) {
  const parsed = listTeachersQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const result = await teacherService.list(req.user!.schoolId, parsed.data);
  return res.status(200).json(result);
}

export async function getTeacher(req: AuthRequest, res: Response) {
  try {
    const teacher = await teacherService.getById(req.user!.schoolId, req.params.id);
    return res.status(200).json(teacher);
  } catch (error) {
    return res.status(404).json({ error: (error as Error).message });
  }
}

export async function createTeacher(req: AuthRequest, res: Response) {
  const parsed = createTeacherSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  try {
    const teacher = await teacherService.create(req.user!.schoolId, parsed.data);
    return res.status(201).json(teacher);
  } catch (error) {
    return res.status(400).json({ error: (error as Error).message });
  }
}

export async function updateTeacher(req: AuthRequest, res: Response) {
  const parsed = updateTeacherSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  try {
    const teacher = await teacherService.update(
      req.user!.schoolId,
      req.params.id,
      parsed.data
    );
    return res.status(200).json(teacher);
  } catch (error) {
    return res.status(400).json({ error: (error as Error).message });
  }
}

export async function deleteTeacher(req: AuthRequest, res: Response) {
  try {
    await teacherService.delete(req.user!.schoolId, req.params.id);
    return res.status(200).json({ message: "Teacher deleted successfully" });
  } catch (error) {
    return res.status(404).json({ error: (error as Error).message });
  }
}