import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { parentService } from "../services/parent.service";
import { listParentsQuerySchema, linkGuardianSchema } from "../validators/guardian.validator";

export async function listParents(req: AuthRequest, res: Response) {
  const parsed = listParentsQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const parents = await parentService.list(req.user!.schoolId, parsed.data);
  return res.status(200).json(parents);
}

export async function linkGuardian(req: AuthRequest, res: Response) {
  const parsed = linkGuardianSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  try {
    const link = await parentService.linkToStudent(
      req.params.id,
      parsed.data.parentId,
      parsed.data.relation
    );
    return res.status(201).json(link);
  } catch (error) {
    return res.status(400).json({ error: (error as Error).message });
  }
}

export async function unlinkGuardian(req: AuthRequest, res: Response) {
  try {
    await parentService.unlinkFromStudent(req.params.id, req.params.linkId);
    return res.status(200).json({ message: "Guardian unlinked successfully" });
  } catch (error) {
    return res.status(404).json({ error: (error as Error).message });
  }
}
