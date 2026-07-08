"use client";

import { useAuthStore } from "@/store/auth-store";

export default function DashboardHomePage() {
  const { user } = useAuthStore();

  return (
    <div>
      <h1 className="gradient-text text-3xl font-bold">
        Welcome back, {user?.firstName}
      </h1>
      <p className="mt-2 text-white/60">
        Here&apos;s what&apos;s happening at your school today.
      </p>
    </div>
  );
}