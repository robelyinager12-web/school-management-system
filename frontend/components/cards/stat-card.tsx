import { type LucideIcon } from "lucide-react";
import { AnimatedCounter } from "./animated-counter";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  gradient: string;
  prefix?: string;
}

export function StatCard({ label, value, icon: Icon, gradient, prefix }: StatCardProps) {
  return (
    <div className="glass-panel rounded-2xl p-5 transition hover:-translate-y-0.5 hover:shadow-xl">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-white/50">{label}</p>
          <p className="mt-2 text-3xl font-bold text-white">
            {prefix}
            <AnimatedCounter value={value} />
          </p>
        </div>
        <div
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br",
            gradient
          )}
        >
          <Icon size={20} className="text-white" />
        </div>
      </div>
    </div>
  );
}