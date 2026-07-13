import { Response } from "express";
import { prisma } from "../config/prisma";
import { AuthRequest } from "../middleware/auth.middleware";

export async function listDepartments(req: AuthRequest, res: Response) {
  const departments = await prisma.department.findMany({
    where: { schoolId: req.user!.schoolId },
    orderBy: { name: "asc" },
  });

  return res.status(200).json(departments);
}