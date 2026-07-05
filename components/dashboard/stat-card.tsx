import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatCard({
  icon: Icon,
  label,
  value,
  suffix,
  tone = "default",
}: {
  icon: LucideIcon;
  label: string;
  value: string | number;
  suffix?: string;
  tone?: "default" | "normal" | "warning" | "critical";
}) {
  const toneColor = {
    default: "text-neutral-300 bg-white/5",
    normal: "text-teal-300 bg-teal-400/10",
    warning: "text-amber-300 bg-amber-400/10",
    critical: "text-red-300 bg-red-400/10",
  }[tone];

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium tracking-wide text-neutral-500">{label}</span>
        <div className={cn("flex h-7 w-7 items-center justify-center rounded-md", toneColor)}>
          <Icon className="h-3.5 w-3.5" />
        </div>
      </div>
      <div className="mt-3 flex items-baseline gap-1">
        <span className="font-mono text-2xl font-semibold text-neutral-50">{value}</span>
        {suffix && <span className="text-xs text-neutral-500">{suffix}</span>}
      </div>
    </Card>
  );
}
