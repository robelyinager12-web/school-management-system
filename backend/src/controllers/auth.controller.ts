import { Request, Response } from "express";
import { authService } from "../services/auth.service";
import { registerSchema, loginSchema } from "../validators/auth.validator";

export async function register(req: Request, res: Response) {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  try {
    const tokens = await authService.register(parsed.data);
    return res.status(201).json(tokens);
  } catch (error) {
    return res.status(400).json({ error: (error as Error).message });
  }
}

export async function login(req: Request, res: Response) {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  try {
    const tokens = await authService.login(parsed.data);
    return res.status(200).json(tokens);
  } catch (error) {
    return res.status(401).json({ error: (error as Error).message });
  }
}