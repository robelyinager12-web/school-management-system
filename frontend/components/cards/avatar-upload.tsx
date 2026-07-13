"use client";

import { useRef, useState } from "react";
import { Camera, Loader2 } from "lucide-react";
import Image from "next/image";
import { useUploadAvatar } from "@/hooks/use-upload-avatar";
import { API_ORIGIN } from "@/lib/config";

export function AvatarUpload({
  studentId,
  avatarUrl,
  initials,
}: {
  studentId: string;
  avatarUrl: string | null;
  initials: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const uploadAvatar = useUploadAvatar(studentId);
  const [preview, setPreview] = useState<string | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    uploadAvatar.mutate(file, {
      onSettled: () => setPreview(null),
    });
  }

  const displaySrc = preview || (avatarUrl ? `${API_ORIGIN}${avatarUrl}` : null);

  return (
    <div className="group relative h-16 w-16 shrink-0">
      <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-xl font-semibold text-white">
        {displaySrc ? (
          <Image
            src={displaySrc}
            alt="Avatar"
            width={64}
            height={64}
            className="h-full w-full object-cover"
            unoptimized
          />
        ) : (
          initials
        )}
      </div>

      <button
        onClick={() => inputRef.current?.click()}
        disabled={uploadAvatar.isPending}
        className="absolute inset-0 flex items-center justify-center rounded-full bg-black/60 opacity-0 transition group-hover:opacity-100"
      >
        {uploadAvatar.isPending ? (
          <Loader2 size={18} className="animate-spin text-white" />
        ) : (
          <Camera size={18} className="text-white" />
        )}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}