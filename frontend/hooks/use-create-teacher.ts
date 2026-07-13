"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

export interface CreateTeacherValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  employeeNo: string;
  departmentId?: string;
  qualification?: string;
  gender?: string;
}

export function useCreateTeacher() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: CreateTeacherValues) => {
      const token = localStorage.getItem("accessToken");
      const res = await apiClient.post("/teachers", values, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
  });
}