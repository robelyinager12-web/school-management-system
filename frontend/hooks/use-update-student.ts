"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { UpdateStudentFormValues } from "@/lib/validators/student";

export function useUpdateStudent(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: UpdateStudentFormValues) => {
      const token = localStorage.getItem("accessToken");
      const res = await apiClient.put(`/students/${id}`, values, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      queryClient.invalidateQueries({ queryKey: ["student", id] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
  });
}