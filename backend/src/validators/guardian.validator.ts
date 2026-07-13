import { z } from "zod";

export const linkGuardianSchema = z.object({
  parentId: z.string().cuid(),
  relation: z.string().min(1).default("Guardian"),
});

export const listParentsQuerySchema = z.object({
  search: z.string().optional(),
});

export type LinkGuardianInput = z.infer<typeof linkGuardianSchema>;
export type ListParentsQuery = z.infer<typeof listParentsQuerySchema>;