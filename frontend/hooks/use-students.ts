"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

export interface StudentRow {
  id: string;
  admissionNo: string;
  dateOfBirth: string;
  bloodGroup: string | null;
  section: { name: string; class: { name: string } } | null;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    status: string;
    avatarUrl: string | null;
  };
}

interface StudentsResponse {
  data: StudentRow[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}

export function useStudents(page: number, search: string) {
  return useQuery<StudentsResponse>({
    queryKey: ["students", page, search],
    queryFn: async () => {
      const token = localStorage.getItem("accessToken");
      const res = await apiClient.get("/students", {
        headers: { Authorization: `Bearer ${token}` },
        params: { page, limit: 10, search: search || undefined },
      });
      return res.data;
    },
  });
}
