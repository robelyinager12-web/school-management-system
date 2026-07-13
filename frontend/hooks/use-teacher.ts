"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

export interface TeacherDetail {
  id: string;
  employeeNo: string;
  qualification: string | null;
  departmentId: string | null;
  joiningDate: string;
  department: { id: string; name: string } | null;
  subjects: { subject: { id: string; name: string } }[];
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    status: string;
    avatarUrl: string | null;
    gender: string | null;
  };
}

export function useTeacher(id: string) {
  return useQuery<TeacherDetail>({
    queryKey: ["teacher", id],
    queryFn: async () => {
      const token = localStorage.getItem("accessToken");
      const res = await apiClient.get(`/teachers/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
    enabled: !!id,
  });
}