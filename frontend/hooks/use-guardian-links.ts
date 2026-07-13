"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

export function useLinkGuardian(studentId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ parentId, relation }: { parentId: string; relation: string }) => {
      const token = localStorage.getItem("accessToken");
      const res = await apiClient.post(
        `/students/${studentId}/guardians`,
        { parentId, relation },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student", studentId] });
    },
  });
}

export function useUnlinkGuardian(studentId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (linkId: string) => {
      const token = localStorage.getItem("accessToken");
      const res = await apiClient.delete(`/students/${studentId}/guardians/${linkId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student", studentId] });
    },
  });
}