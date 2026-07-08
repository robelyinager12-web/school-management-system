import { Response } from "express";
import { prisma } from "../config/prisma";
import { AuthRequest } from "../middleware/auth.middleware";

export async function getDashboardStats(req: AuthRequest, res: Response) {
  if (!req.user) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const schoolId = req.user.schoolId;

  const [studentCount, teacherCount, parentCount, attendanceToday, revenueAgg] =
    await Promise.all([
      prisma.student.count({
        where: { user: { schoolId } },
      }),
      prisma.teacher.count({
        where: { user: { schoolId } },
      }),
      prisma.parent.count({
        where: { user: { schoolId } },
      }),
      prisma.attendance.count({
        where: {
          student: { user: { schoolId } },
          date: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
          status: "PRESENT",
        },
      }),
      prisma.payment.aggregate({
        where: {
          invoice: { student: { user: { schoolId } } },
        },
        _sum: { amount: true },
      }),
    ]);

  return res.status(200).json({
    students: studentCount,
    teachers: teacherCount,
    parents: parentCount,
    attendanceToday,
    totalRevenue: revenueAgg._sum.amount || 0,
  });
}