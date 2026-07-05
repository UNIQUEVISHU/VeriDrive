"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Gauge,
  Truck,
  Siren,
  Bot,
  Activity,
  Radio,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useFleetContext } from "@/app/providers";

const NAV = [
  { href: "/", label: "Overview", icon: Gauge },
  { href: "/fleet", label: "Fleet", icon: Truck },
  { href: "/alerts", label: "Alerts", icon: Siren },
  { href: "/assistant", label: "AI Assistant", icon: Bot },
];

export function Sidebar() {
  const pathname = usePathname();
  const { vehicles } = useFleetContext();
  const criticalCount = vehicles.filter((v) => v.severity === "critical").length;

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 flex-col border-r border-white/10 bg-neutral-950/80 px-4 py-5 backdrop-blur-xl lg:flex">
      <div className="flex items-center gap-2 px-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-400/10 text-teal-300">
          <Activity className="h-4 w-4" />
        </div>
        <div>
          <p className="font-display text-sm font-semibold leading-tight text-neutral-100">
            VeriDrive
          </p>
          <p className="text-[10px] tracking-wide text-neutral-500">Edge AI Diagnostics</p>
        </div>
      </div>

      <nav className="mt-8 flex flex-1 flex-col gap-1">
        {NAV.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-white/[0.07] text-neutral-50"
                  : "text-neutral-400 hover:bg-white/[0.04] hover:text-neutral-200"
              )}
            >
              <Icon className={cn("h-4 w-4", active ? "text-teal-300" : "text-neutral-500 group-hover:text-neutral-300")} />
              {item.label}
              {item.href === "/alerts" && criticalCount > 0 && (
                <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500/20 px-1 text-[10px] font-semibold text-red-300">
                  {criticalCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
        <div className="flex items-center gap-2 text-[11px] text-teal-300">
          <Radio className="h-3.5 w-3.5 animate-pulse" />
          Edge node synced
        </div>
        <p className="mt-1 text-[10px] leading-relaxed text-neutral-500">
          Running XGBoost + LSTM + Isolation Forest inference on-device, syncing to cloud every cycle.
        </p>
      </div>
    </aside>
  );
}
