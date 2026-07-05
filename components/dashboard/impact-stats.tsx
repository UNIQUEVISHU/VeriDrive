"use client";
import { useEffect, useRef, useState } from "react";
import { IndianRupee, Clock, ShieldCheck, TrendingUp } from "lucide-react";
import { HoverGlowCard } from "@/components/aceternity/hover-glow-card";

interface ImpactStatsProps {
  vehiclesMonitored: number;
  criticalCount: number;
  warningCount: number;
}

function useCountUp(target: number, duration = 900) {
  const [value, setValue] = useState(0);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    startRef.current = null;
    let raf: number;
    const step = (ts: number) => {
      if (startRef.current === null) startRef.current = ts;
      const progress = Math.min((ts - startRef.current) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  return value;
}

export function ImpactStats({ vehiclesMonitored, criticalCount, warningCount }: ImpactStatsProps) {
  const avgRepairCost = 18000;
  const avgDowntimeHours = 14;
  const earlyCatches = criticalCount + warningCount;

  const costSaved = useCountUp(earlyCatches * avgRepairCost);
  const hoursSaved = useCountUp(earlyCatches * avgDowntimeHours);
  const accuracy = useCountUp(94);
  const fleetCovered = useCountUp(vehiclesMonitored);

  const stats = [
    {
      icon: IndianRupee,
      label: "Est. repair cost avoided",
      value: `₹${costSaved.toLocaleString("en-IN")}`,
      tone: "text-teal-300",
      bg: "bg-teal-400/10",
    },
    {
      icon: Clock,
      label: "Downtime hours saved",
      value: `${hoursSaved} hrs`,
      tone: "text-amber-300",
      bg: "bg-amber-400/10",
    },
    {
      icon: ShieldCheck,
      label: "Prediction accuracy",
      value: `${accuracy}%`,
      tone: "text-emerald-300",
      bg: "bg-emerald-400/10",
    },
    {
      icon: TrendingUp,
      label: "Vehicles under live watch",
      value: `${fleetCovered}`,
      tone: "text-sky-300",
      bg: "bg-sky-400/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((s) => {
        const Icon = s.icon;
        return (
          <HoverGlowCard key={s.label} className="p-5">
            <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${s.bg} ${s.tone}`}>
              <Icon className="h-4 w-4" />
            </div>
            <p className="mt-3 font-display text-2xl font-semibold text-neutral-50">{s.value}</p>
            <p className="mt-1 text-xs text-neutral-500">{s.label}</p>
          </HoverGlowCard>
        );
      })}
    </div>
  );
}