"use client";
import Link from "next/link";
import { ChevronRight, MapPin } from "lucide-react";
import { GlowCard } from "@/components/aceternity/glow-card";
import { Badge } from "@/components/ui/badge";
import { MiniHealthBar } from "@/components/dashboard/health-gauge";
import { Vehicle } from "@/lib/types";

const GLOW: Record<Vehicle["severity"], string> = {
  normal: "45,217,196",
  warning: "245,165,36",
  critical: "240,69,92",
};

export function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  const worst = [...vehicle.components].sort((a, b) => a.health - b.health)[0];
  return (
    <Link href={`/vehicle/${vehicle.id}`}>
      <GlowCard glowColor={GLOW[vehicle.severity]} className="h-full p-5 transition-transform hover:-translate-y-0.5">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-display text-sm font-semibold text-neutral-100">{vehicle.name}</p>
            <p className="text-xs text-neutral-500">{vehicle.id} · {vehicle.model}</p>
          </div>
          <Badge variant={vehicle.severity}>{vehicle.severity}</Badge>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <span className="font-mono text-2xl font-semibold text-neutral-50">{vehicle.healthScore}</span>
          <span className="text-xs text-neutral-500">/100 health score</span>
        </div>
        <MiniHealthBar value={vehicle.healthScore} className="mt-2" />

        <div className="mt-4 flex items-center justify-between text-xs text-neutral-500">
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" /> {vehicle.location}
          </span>
        </div>

        <div className="mt-3 rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2 text-xs">
          <span className="text-neutral-500">Weakest link — </span>
          <span className="text-neutral-300">{worst.label}</span>
          <span className="ml-1 text-neutral-500">({worst.health}% · RUL {worst.rul}d)</span>
        </div>

        <div className="mt-3 flex items-center justify-between text-[11px] text-teal-300">
          View diagnostics
          <ChevronRight className="h-3.5 w-3.5" />
        </div>
      </GlowCard>
    </Link>
  );
}
