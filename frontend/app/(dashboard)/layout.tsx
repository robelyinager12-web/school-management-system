"use client";

import { Sidebar } from "@/layouts/dashboard/sidebar";
import { Topbar } from "@/layouts/dashboard/topbar";
import { useAuthGuard } from "@/hooks/use-auth-guard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuthGuard();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <p className="text-white/50">Loading...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-black">
      <div className="aurora-bg pointer-events-none fixed inset-0" />
      <Sidebar />
      <div className="relative ml-64 flex min-h-screen flex-col">
        <Topbar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}