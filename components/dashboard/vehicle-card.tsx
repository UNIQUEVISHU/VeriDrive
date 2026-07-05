"use client";

import Link from "next/link";
import { MapPin, Zap } from "lucide-react";
import { GlowCard } from "@/components/aceternity/glow-card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Vehicle } from "@/lib/types";

const GLOW: Record<Vehicle["severity"], string> = {
  normal: "45,217,196",
  warning: "245,165,36",
  critical: "240,69,92",
};

function badgeColor(severity: Vehicle["severity"]) {
  switch (severity) {
    case "normal":
      return "bg-emerald-500/20 text-emerald-400";
    case "warning":
      return "bg-yellow-500/20 text-yellow-400";
    case "critical":
      return "bg-red-500/20 text-red-400";
  }
}

export function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  return (
    <Link href={`/vehicle/${vehicle.id}`}>
      <GlowCard
        glowColor={GLOW[vehicle.severity]}
        className="h-full rounded-2xl border border-white/10 bg-[#0f172a] p-6 transition-all duration-300 hover:scale-[1.02]"
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-semibold text-white">
              {vehicle.name}
            </h3>

            <p className="mt-1 text-sm text-neutral-400">
              {vehicle.id}
            </p>
          </div>

          <Badge
            className={`${badgeColor(vehicle.severity)} border-0 capitalize`}
          >
            {vehicle.severity}
          </Badge>
        </div>

        {/* Score + Mileage */}
        <div className="mt-6 grid grid-cols-2 gap-6">
          <div>
            <p className="text-xs uppercase tracking-wide text-neutral-500">
              Health Score
            </p>

            <h2
              className={`mt-2 text-4xl font-bold ${
                vehicle.healthScore >= 85
                  ? "text-emerald-400"
                  : vehicle.healthScore >= 70
                  ? "text-yellow-400"
                  : vehicle.healthScore >= 50
                  ? "text-orange-400"
                  : "text-red-500"
              }`}
            >
              {vehicle.healthScore}%
            </h2>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wide text-neutral-500">
              Mileage
            </p>

            <h2 className="mt-2 text-3xl font-bold text-white">
              {(vehicle.odometer / 1000).toFixed(1)}K
            </h2>
          </div>
        </div>

        {/* Location */}
        <div className="mt-6 flex items-center gap-2 text-sm text-neutral-400">
          <MapPin size={16} />
          {vehicle.location}
        </div>

        {/* Battery */}
        <div className="mt-6">
          <div className="mb-2 flex justify-between text-sm">
            <span className="text-neutral-400">
              Battery Health
            </span>

            <span className="font-semibold text-white">
              {vehicle.batteryHealth}%
            </span>
          </div>

          <Progress value={vehicle.batteryHealth} />
        </div>

        {/* Footer */}
        <div className="mt-5 flex items-center gap-2 text-sm text-neutral-500">
          <Zap size={14} />

          <span>Last seen {vehicle.lastSeen}</span>
        </div>
      </GlowCard>
    </Link>
  );
}
