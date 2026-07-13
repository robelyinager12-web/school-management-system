"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

export interface DepartmentOption {
  id: string;
  name: string;
}

export function useDepartments() {
  return useQuery<DepartmentOption[]>({
    queryKey: ["departments"],
    queryFn: async () => {
      const token = localStorage.getItem("accessToken");
      const res = await apiClient.get("/departments", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
  });
}