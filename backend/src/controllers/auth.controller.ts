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

export async function refresh(req: Request, res: Response) {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ error: "Refresh token is required" });
  }

  try {
    const result = await authService.refresh(refreshToken);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(401).json({ error: (error as Error).message });
  }
}

export async function logout(req: Request, res: Response) {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ error: "Refresh token is required" });
  }

  await authService.logout(refreshToken);
  return res.status(200).json({ message: "Logged out successfully" });
}