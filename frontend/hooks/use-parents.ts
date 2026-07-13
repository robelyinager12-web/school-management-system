"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

export interface ParentOption {
  id: string;
  user: { firstName: string; lastName: string; email: string };
}

export function useParents(search: string) {
  return useQuery<ParentOption[]>({
    queryKey: ["parents", search],
    queryFn: async () => {
      const token = localStorage.getItem("accessToken");
      const res = await apiClient.get("/parents", {
        headers: { Authorization: `Bearer ${token}` },
        params: { search: search || undefined },
      });
      return res.data;
    },
  });
}
