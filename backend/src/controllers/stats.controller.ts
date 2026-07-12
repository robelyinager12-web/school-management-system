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

export async function getAttendanceTrend(req: AuthRequest, res: Response) {
  if (!req.user) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const schoolId = req.user.schoolId;
  const since = new Date();
  since.setDate(since.getDate() - 14);
  since.setHours(0, 0, 0, 0);

  const records = await prisma.attendance.findMany({
    where: {
      student: { user: { schoolId } },
      date: { gte: since },
    },
    select: { date: true, status: true },
  });

  const grouped: Record<string, { present: number; absent: number; late: number }> = {};

  for (const record of records) {
    const key = record.date.toISOString().split("T")[0];
    if (!grouped[key]) {
      grouped[key] = { present: 0, absent: 0, late: 0 };
    }
    if (record.status === "PRESENT") grouped[key].present++;
    if (record.status === "ABSENT") grouped[key].absent++;
    if (record.status === "LATE") grouped[key].late++;
  }

  const result = Object.entries(grouped)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, counts]) => ({ date, ...counts }));

  return res.status(200).json(result);
}