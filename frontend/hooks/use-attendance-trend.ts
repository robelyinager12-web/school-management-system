"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

interface TrendPoint {
  date: string;
  present: number;
  absent: number;
  late: number;
}

export function useAttendanceTrend() {
  return useQuery<TrendPoint[]>({
    queryKey: ["attendance-trend"],
    queryFn: async () => {
      const token = localStorage.getItem("accessToken");
      const res = await apiClient.get("/stats/attendance-trend", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
  });
}