import sharp from "sharp";
import path from "path";
import fs from "fs/promises";
import { uploadDir } from "../config/multer";

export class UploadService {
  async processAvatar(buffer: Buffer, entityId: string): Promise<string> {
    const filename = `${entityId}-${Date.now()}.webp`;
    const filepath = path.join(uploadDir, filename);

    await sharp(buffer)
      .resize(300, 300, { fit: "cover" })
      .webp({ quality: 85 })
      .toFile(filepath);

    return `/uploads/avatars/${filename}`;
  }

  async deleteAvatar(avatarUrl: string | null) {
    if (!avatarUrl) return;
    const filename = path.basename(avatarUrl);
    const filepath = path.join(uploadDir, filename);
    try {
      await fs.unlink(filepath);
    } catch {
      // file may not exist, ignore
    }
  }
}

export const uploadService = new UploadService();