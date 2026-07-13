"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

export interface UpdateTeacherValues {
  firstName: string;
  lastName: string;
  employeeNo: string;
  departmentId?: string;
  qualification?: string;
  gender?: string;
  status: string;
}

export function useUpdateTeacher(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: UpdateTeacherValues) => {
      const token = localStorage.getItem("accessToken");
      const res = await apiClient.put(`/teachers/${id}`, values, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      queryClient.invalidateQueries({ queryKey: ["teacher", id] });
    },
  });
}