import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { studentService } from "../services/student.service";
import {
  createStudentSchema,
  updateStudentSchema,
  listStudentsQuerySchema,
} from "../validators/student.validator";

export async function listStudents(req: AuthRequest, res: Response) {
  const parsed = listStudentsQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const result = await studentService.list(req.user!.schoolId, parsed.data);
  return res.status(200).json(result);
}

export async function getStudent(req: AuthRequest, res: Response) {
  try {
    const student = await studentService.getById(req.user!.schoolId, req.params.id);
    return res.status(200).json(student);
  } catch (error) {
    return res.status(404).json({ error: (error as Error).message });
  }
}

export async function createStudent(req: AuthRequest, res: Response) {
  const parsed = createStudentSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  try {
    const student = await studentService.create(req.user!.schoolId, parsed.data);
    return res.status(201).json(student);
  } catch (error) {
    return res.status(400).json({ error: (error as Error).message });
  }
}

export async function updateStudent(req: AuthRequest, res: Response) {
  const parsed = updateStudentSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  try {
    const student = await studentService.update(
      req.user!.schoolId,
      req.params.id,
      parsed.data
    );
    return res.status(200).json(student);
  } catch (error) {
    return res.status(400).json({ error: (error as Error).message });
  }
}

export async function deleteStudent(req: AuthRequest, res: Response) {
  try {
    await studentService.delete(req.user!.schoolId, req.params.id);
    return res.status(200).json({ message: "Student deleted successfully" });
  } catch (error) {
    return res.status(404).json({ error: (error as Error).message });
  }
}