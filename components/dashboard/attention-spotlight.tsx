"use client";
import Link from "next/link";
import { AlertTriangle, ArrowRight, Gauge } from "lucide-react";
import { Vehicle } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { HoverGlowCard } from "@/components/aceternity/hover-glow-card";

function riskiestComponent(vehicle: Vehicle) {
  return [...vehicle.components].sort((a, b) => b.failureProbability - a.failureProbability)[0];
}

function estimateDaysToFailure(healthScore: number) {
  if (healthScore <= 20) return 1;
  if (healthScore <= 40) return Math.round(3 + (healthScore - 20) / 5);
  if (healthScore <= 60) return Math.round(7 + (healthScore - 40) / 4);
  return Math.round(14 + (healthScore - 60) / 2);
}

export function AttentionSpotlight({ vehicle }: { vehicle: Vehicle }) {
  const comp = riskiestComponent(vehicle);
  const eta = estimateDaysToFailure(vehicle.healthScore);
  const isCritical = vehicle.severity === "critical";

  return (
    <HoverGlowCard
      className="p-6"
      glowColor={isCritical ? "rgba(240,69,92,0.16)" : "rgba(245,165,36,0.16)"}
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-4">
          <div
            className={`relative flex h-11 w-11 flex-none items-center justify-center rounded-xl ${
              isCritical ? "bg-red-500/10 text-red-400" : "bg-amber-500/10 text-amber-400"
            }`}
          >
            {isCritical && (
              <span className="absolute inline-flex h-full w-full animate-ping rounded-xl bg-red-500/20" />
            )}
            <AlertTriangle className="relative h-5 w-5" />
          </div>
          <div>
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                isCritical ? "bg-red-500/10 text-red-400" : "bg-amber-500/10 text-amber-400"
              }`}
            >
              {isCritical ? "Needs attention now" : "Watch closely"}
            </span>
            <h3 className="mt-1.5 font-display text-lg font-semibold text-neutral-50">
              {vehicle.name} — {comp.label} showing {comp.failureProbability}% failure risk
            </h3>
            <p className="mt-1 max-w-xl text-sm leading-relaxed text-neutral-400">
              Based on current sensor drift, our edge model projects a likely{" "}
              <span className="text-neutral-200">
                {comp.label.toLowerCase()} failure within ~{eta} day{eta === 1 ? "" : "s"}
              </span>{" "}
              if no maintenance action is taken. Health score currently at {vehicle.healthScore}/100.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 lg:flex-col lg:items-end">
          <div className="flex items-center gap-1.5 text-sm text-neutral-400">
            <Gauge className="h-4 w-4" />
            {vehicle.healthScore}/100
          </div>
          <Button asChild size="sm">
            <Link href={`/vehicle/${vehicle.id}`}>
              Inspect vehicle <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      </div>
    </HoverGlowCard>
  );
}