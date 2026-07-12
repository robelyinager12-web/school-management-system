import { z } from "zod";

export const createStudentFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  admissionNo: z.string().min(1, "Admission number is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  bloodGroup: z.string().optional(),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
});

export type CreateStudentFormValues = z.infer<typeof createStudentFormSchema>;