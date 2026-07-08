import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  schoolId: z.string().cuid(),
  role: z.enum([
    "SUPER_ADMIN",
    "ADMIN",
    "PRINCIPAL",
    "TEACHER",
    "STUDENT",
    "PARENT",
    "ACCOUNTANT",
    "LIBRARIAN",
    "HR",
    "RECEPTIONIST",
  ]),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;