"use client";

import { GraduationCap, Users, UserRound, Wallet } from "lucide-react";
import { useDashboardStats } from "@/hooks/use-dashboard-stats";
import { StatCard } from "@/components/cards/stat-card";

export function StatsGrid() {
  const { data, isLoading } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="glass-panel h-28 animate-pulse rounded-2xl"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        label="Total Students"
        value={data?.students || 0}
        icon={GraduationCap}
        gradient="from-purple-500 to-purple-600"
      />
      <StatCard
        label="Total Teachers"
        value={data?.teachers || 0}
        icon={Users}
        gradient="from-pink-500 to-pink-600"
      />
      <StatCard
        label="Total Parents"
        value={data?.parents || 0}
        icon={UserRound}
        gradient="from-blue-500 to-blue-600"
      />
      <StatCard
        label="Revenue Collected"
        value={data?.totalRevenue || 0}
        icon={Wallet}
        gradient="from-emerald-500 to-emerald-600"
        prefix="$"
      />
    </div>
  );
}