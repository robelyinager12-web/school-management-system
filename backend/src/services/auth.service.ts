import bcrypt from "bcryptjs";
import { prisma } from "../config/prisma";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../utils/jwt";
import { RegisterInput, LoginInput } from "../validators/auth.validator";

export class AuthService {
  async register(input: RegisterInput) {
    const existing = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (existing) {
      throw new Error("Email already registered");
    }

    const passwordHash = await bcrypt.hash(input.password, 10);

    const user = await prisma.user.create({
      data: {
        email: input.email,
        passwordHash,
        firstName: input.firstName,
        lastName: input.lastName,
        role: input.role,
        schoolId: input.schoolId,
        status: "PENDING",
      },
    });

    return this.issueTokens(user.id, user.role, user.schoolId);
  }

  async login(input: LoginInput) {
    const user = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isValid = await bcrypt.compare(input.password, user.passwordHash);
    if (!isValid) {
      throw new Error("Invalid credentials");
    }

    return this.issueTokens(user.id, user.role, user.schoolId);
  }

  async refresh(refreshToken: string) {
    const stored = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
    });

    if (!stored || stored.revoked || stored.expiresAt < new Date()) {
      throw new Error("Invalid or expired refresh token");
    }

    const payload = verifyRefreshToken(refreshToken);

    const accessToken = signAccessToken({
      userId: payload.userId,
      role: payload.role,
      schoolId: payload.schoolId,
    });

    return { accessToken };
  }

  async logout(refreshToken: string) {
    await prisma.refreshToken.updateMany({
      where: { token: refreshToken },
      data: { revoked: true },
    });
  }

  private async issueTokens(userId: string, role: string, schoolId: string) {
    const payload = { userId, role, schoolId };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId,
        expiresAt,
      },
    });

    return { accessToken, refreshToken };
  }
}

export const authService = new AuthService();