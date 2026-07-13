import bcrypt from "bcryptjs";
import { prisma } from "../config/prisma";
import {
  CreateTeacherInput,
  UpdateTeacherInput,
  ListTeachersQuery,
} from "../validators/teacher.validator";

export class TeacherService {
  async list(schoolId: string, query: ListTeachersQuery) {
    const { page, limit, search, departmentId } = query;
    const skip = (page - 1) * limit;

    const where = {
      user: { schoolId },
      ...(departmentId ? { departmentId } : {}),
      ...(search
        ? {
            user: {
              schoolId,
              OR: [
                { firstName: { contains: search, mode: "insensitive" as const } },
                { lastName: { contains: search, mode: "insensitive" as const } },
                { email: { contains: search, mode: "insensitive" as const } },
              ],
            },
          }
        : {}),
    };

    const [teachers, total] = await Promise.all([
      prisma.teacher.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              status: true,
              avatarUrl: true,
            },
          },
          department: true,
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.teacher.count({ where }),
    ]);

    return {
      data: teachers,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async getById(schoolId: string, id: string) {
    const teacher = await prisma.teacher.findFirst({
      where: { id, user: { schoolId } },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            status: true,
            avatarUrl: true,
            gender: true,
          },
        },
        department: true,
        subjects: { include: { subject: true } },
      },
    });

    if (!teacher) throw new Error("Teacher not found");
    return teacher;
  }

  async create(schoolId: string, input: CreateTeacherInput) {
    const existing = await prisma.user.findUnique({ where: { email: input.email } });
    if (existing) throw new Error("Email already registered");

    const existingEmployeeNo = await prisma.teacher.findUnique({
      where: { employeeNo: input.employeeNo },
    });
    if (existingEmployeeNo) throw new Error("Employee number already in use");

    const passwordHash = await bcrypt.hash(input.password, 10);

    const teacher = await prisma.teacher.create({
      data: {
        employeeNo: input.employeeNo,
        qualification: input.qualification,
        department: input.departmentId
          ? { connect: { id: input.departmentId } }
          : undefined,
        user: {
          create: {
            email: input.email,
            passwordHash,
            firstName: input.firstName,
            lastName: input.lastName,
            gender: input.gender,
            role: "TEACHER",
            status: "ACTIVE",
            schoolId,
          },
        },
      },
      include: { user: true },
    });

    return teacher;
  }

  async update(schoolId: string, id: string, input: UpdateTeacherInput) {
    const teacher = await prisma.teacher.findFirst({
      where: { id, user: { schoolId } },
    });
    if (!teacher) throw new Error("Teacher not found");

    const updated = await prisma.teacher.update({
      where: { id },
      data: {
        employeeNo: input.employeeNo,
        qualification: input.qualification,
        department: input.departmentId
          ? { connect: { id: input.departmentId } }
          : undefined,
        user: {
          update: {
            firstName: input.firstName,
            lastName: input.lastName,
            gender: input.gender,
            status: input.status,
          },
        },
      },
      include: { user: true },
    });

    return updated;
  }

  async delete(schoolId: string, id: string) {
    const teacher = await prisma.teacher.findFirst({
      where: { id, user: { schoolId } },
    });
    if (!teacher) throw new Error("Teacher not found");

    await prisma.user.delete({ where: { id: teacher.userId } });
  }
}

export const teacherService = new TeacherService();