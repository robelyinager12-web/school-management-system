import { Response } from "express";
import { prisma } from "../config/prisma";
import { AuthRequest } from "../middleware/auth.middleware";
import { uploadService } from "../services/upload.service";

export async function uploadStudentAvatar(req: AuthRequest, res: Response) {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const student = await prisma.student.findFirst({
    where: { id: req.params.id, user: { schoolId: req.user!.schoolId } },
  });

  if (!student) {
    return res.status(404).json({ error: "Student not found" });
  }

  try {
    const currentUser = await prisma.user.findUnique({ where: { id: student.userId } });
    await uploadService.deleteAvatar(currentUser?.avatarUrl || null);

    const avatarUrl = await uploadService.processAvatar(req.file.buffer, student.id);

    const updatedUser = await prisma.user.update({
      where: { id: student.userId },
      data: { avatarUrl },
      select: { avatarUrl: true },
    });

    return res.status(200).json(updatedUser);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
}