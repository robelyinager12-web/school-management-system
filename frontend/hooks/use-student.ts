"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

export interface StudentDetail {
  id: string;
  admissionNo: string;
  dateOfBirth: string;
  bloodGroup: string | null;
  sectionId: string | null;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    status: string;
    avatarUrl: string | null;
    gender: string | null;
  };
  section: {
    name: string;
    class: { name: string };
  } | null;
  guardians: {
    id: string;
    relation: string;
    parent: {
      id: string;
      user: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string | null;
      };
    };
  }[];
}

export function useStudent(id: string) {
  return useQuery<StudentDetail>({
    queryKey: ["student", id],
    queryFn: async () => {
      const token = localStorage.getItem("accessToken");
      const res = await apiClient.get(`/students/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
    enabled: !!id,
  });
}