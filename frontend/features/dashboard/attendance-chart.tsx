"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useAttendanceTrend } from "@/hooks/use-attendance-trend";

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function AttendanceChart() {
  const { data, isLoading } = useAttendanceTrend();

  if (isLoading) {
    return <div className="glass-panel h-80 animate-pulse rounded-2xl" />;
  }

  const chartData = (data || []).map((d) => ({
    ...d,
    label: formatDate(d.date),
  }));

  return (
    <div className="glass-panel rounded-2xl p-6">
      <h3 className="text-lg font-semibold text-white">
        Attendance Trend
      </h3>
      <p className="text-sm text-white/50">Last 14 days</p>

      <div className="mt-4 h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="presentGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#a78bfa" stopOpacity={0.5} />
                <stop offset="100%" stopColor="#a78bfa" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="absentGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f472b6" stopOpacity={0.5} />
                <stop offset="100%" stopColor="#f472b6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis
              dataKey="label"
              stroke="rgba(255,255,255,0.4)"
              fontSize={12}
              tickLine={false}
            />
            <YAxis stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} />
            <Tooltip
              contentStyle={{
                background: "rgba(20,20,30,0.9)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
                color: "#fff",
              }}
            />
            <Area
              type="monotone"
              dataKey="present"
              stroke="#a78bfa"
              fill="url(#presentGradient)"
              strokeWidth={2}
              name="Present"
            />
            <Area
              type="monotone"
              dataKey="absent"
              stroke="#f472b6"
              fill="url(#absentGradient)"
              strokeWidth={2}
              name="Absent"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}