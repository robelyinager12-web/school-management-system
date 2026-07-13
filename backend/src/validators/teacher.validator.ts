import { z } from "zod";

export const createTeacherSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  employeeNo: z.string().min(1),
  departmentId: z.string().cuid().optional(),
  qualification: z.string().optional(),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
});

export const updateTeacherSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  employeeNo: z.string().min(1).optional(),
  departmentId: z.string().cuid().optional(),
  qualification: z.string().optional(),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
  status: z.enum(["ACTIVE", "SUSPENDED", "PENDING", "DEACTIVATED"]).optional(),
});

export const listTeachersQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  search: z.string().optional(),
  departmentId: z.string().cuid().optional(),
});

export type CreateTeacherInput = z.infer<typeof createTeacherSchema>;
export type UpdateTeacherInput = z.infer<typeof updateTeacherSchema>;
export type ListTeachersQuery = z.infer<typeof listTeachersQuerySchema>;