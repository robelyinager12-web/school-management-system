"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

export interface TeacherRow {
  id: string;
  employeeNo: string;
  qualification: string | null;
  department: { name: string } | null;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    status: string;
    avatarUrl: string | null;
  };
}

interface TeachersResponse {
  data: TeacherRow[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}

export function useTeachers(page: number, search: string) {
  return useQuery<TeachersResponse>({
    queryKey: ["teachers", page, search],
    queryFn: async () => {
      const token = localStorage.getItem("accessToken");
      const res = await apiClient.get("/teachers", {
        headers: { Authorization: `Bearer ${token}` },
        params: { page, limit: 10, search: search || undefined },
      });
      return res.data;
    },
  });
}