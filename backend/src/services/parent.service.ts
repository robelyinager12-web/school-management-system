import { prisma } from "../config/prisma";
import { ListParentsQuery } from "../validators/guardian.validator";

export class ParentService {
  async list(schoolId: string, query: ListParentsQuery) {
    const { search } = query;

    return prisma.parent.findMany({
      where: {
        user: {
          schoolId,
          ...(search
            ? {
                OR: [
                  { firstName: { contains: search, mode: "insensitive" as const } },
                  { lastName: { contains: search, mode: "insensitive" as const } },
                  { email: { contains: search, mode: "insensitive" as const } },
                ],
              }
            : {}),
        },
      },
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
      },
      take: 50,
      orderBy: { createdAt: "desc" },
    });
  }

  async linkToStudent(studentId: string, parentId: string, relation: string) {
    const existing = await prisma.parentStudent.findUnique({
      where: { parentId_studentId: { parentId, studentId } },
    });
    if (existing) throw new Error("Guardian already linked to this student");

    return prisma.parentStudent.create({
      data: { studentId, parentId, relation },
      include: {
        parent: {
          include: { user: { select: { firstName: true, lastName: true, email: true } } },
        },
      },
    });
  }

  async unlinkFromStudent(studentId: string, parentStudentId: string) {
    const link = await prisma.parentStudent.findFirst({
      where: { id: parentStudentId, studentId },
    });
    if (!link) throw new Error("Guardian link not found");

    await prisma.parentStudent.delete({ where: { id: parentStudentId } });
  }
}

export const parentService = new ParentService();