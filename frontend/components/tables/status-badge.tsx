import { cn } from "@/lib/utils";

const statusStyles: Record<string, string> = {
  ACTIVE: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  PENDING: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  SUSPENDED: "bg-red-500/15 text-red-400 border-red-500/30",
  DEACTIVATED: "bg-white/10 text-white/50 border-white/20",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium",
        statusStyles[status] || statusStyles.DEACTIVATED
      )}
    >
      {status}
    </span>
  );
}