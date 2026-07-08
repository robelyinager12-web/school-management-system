"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

interface DashboardStats {
  students: number;
  teachers: number;
  parents: number;
  attendanceToday: number;
  totalRevenue: number;
}

export function useDashboardStats() {
  return useQuery<DashboardStats>({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const token = localStorage.getItem("accessToken");
      const res = await apiClient.get("/stats/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
  });
}