"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api-client";
import { useAuthStore } from "@/store/auth-store";

export function useAuthGuard() {
  const router = useRouter();
  const { user, isLoading, setUser, setLoading } = useAuthStore();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      setLoading(false);
      router.replace("/login");
      return;
    }

    apiClient
      .get("/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUser(res.data);
      })
      .catch(() => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setLoading(false);
        router.replace("/login");
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { user, isLoading };
}