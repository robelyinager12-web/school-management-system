import { z } from "zod";

export const createStudentSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  admissionNo: z.string().min(1),
  dateOfBirth: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date",
  }),
  bloodGroup: z.string().optional(),
  sectionId: z.string().cuid().optional(),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
});

export const updateStudentSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  admissionNo: z.string().min(1).optional(),
  dateOfBirth: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date" })
    .optional(),
  bloodGroup: z.string().optional(),
  sectionId: z.string().cuid().optional(),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
  status: z.enum(["ACTIVE", "SUSPENDED", "PENDING", "DEACTIVATED"]).optional(),
});

export const listStudentsQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  search: z.string().optional(),
  sectionId: z.string().cuid().optional(),
});

export type CreateStudentInput = z.infer<typeof createStudentSchema>;
export type UpdateStudentInput = z.infer<typeof updateStudentSchema>;
export type ListStudentsQuery = z.infer<typeof listStudentsQuerySchema>;