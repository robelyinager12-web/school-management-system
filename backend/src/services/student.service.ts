import bcrypt from "bcryptjs";
import { prisma } from "../config/prisma";
import {
  CreateStudentInput,
  UpdateStudentInput,
  ListStudentsQuery,
} from "../validators/student.validator";

export class StudentService {
  async list(schoolId: string, query: ListStudentsQuery) {
    const { page, limit, search, sectionId } = query;
    const skip = (page - 1) * limit;

    const where = {
      user: { schoolId },
      ...(sectionId ? { sectionId } : {}),
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

    const [students, total] = await Promise.all([
      prisma.student.findMany({
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
          section: { include: { class: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.student.count({ where }),
    ]);

    return {
      data: students,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getById(schoolId: string, id: string) {
    const student = await prisma.student.findFirst({
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
        section: { include: { class: true } },
        guardians: {
          include: {
            parent: {
              include: {
                user: {
                  select: { firstName: true, lastName: true, email: true, phone: true },
                },
              },
            },
          },
        },
      },
    });

    if (!student) throw new Error("Student not found");
    return student;
  }

  async create(schoolId: string, input: CreateStudentInput) {
    const existing = await prisma.user.findUnique({ where: { email: input.email } });
    if (existing) throw new Error("Email already registered");

    const existingAdmission = await prisma.student.findUnique({
      where: { admissionNo: input.admissionNo },
    });
    if (existingAdmission) throw new Error("Admission number already in use");

    const passwordHash = await bcrypt.hash(input.password, 10);

    const student = await prisma.student.create({
      data: {
        admissionNo: input.admissionNo,
        dateOfBirth: new Date(input.dateOfBirth),
        bloodGroup: input.bloodGroup,
        sectionId: input.sectionId,
        user: {
          create: {
            email: input.email,
            passwordHash,
            firstName: input.firstName,
            lastName: input.lastName,
            gender: input.gender,
            role: "STUDENT",
            status: "ACTIVE",
            schoolId,
          },
        },
      },
      include: { user: true },
    });

    return student;
  }

  async update(schoolId: string, id: string, input: UpdateStudentInput) {
    const student = await prisma.student.findFirst({
      where: { id, user: { schoolId } },
    });
    if (!student) throw new Error("Student not found");

    const updated = await prisma.student.update({
      where: { id },
      data: {
        admissionNo: input.admissionNo,
        dateOfBirth: input.dateOfBirth ? new Date(input.dateOfBirth) : undefined,
        bloodGroup: input.bloodGroup,
        sectionId: input.sectionId,
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
    const student = await prisma.student.findFirst({
      where: { id, user: { schoolId } },
    });
    if (!student) throw new Error("Student not found");

    await prisma.user.delete({ where: { id: student.userId } });
  }
}

export const studentService = new StudentService();