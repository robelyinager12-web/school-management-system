"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

export interface SectionOption {
  id: string;
  name: string;
  class: { name: string };
}

export function useSections() {
  return useQuery<SectionOption[]>({
    queryKey: ["sections"],
    queryFn: async () => {
      const token = localStorage.getItem("accessToken");
      const res = await apiClient.get("/sections", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
  });
}