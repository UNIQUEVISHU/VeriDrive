"use client";
import { Cpu, Radio, Brain, CloudUpload, ArrowRight } from "lucide-react";
import { HoverGlowCard } from "@/components/aceternity/hover-glow-card";

const STAGES = [
  { icon: Radio, title: "1. Sensor capture", desc: "Vibration, temp, voltage, oil pressure read from OBD-II / J1939 bus." },
  { icon: Cpu, title: "2. Edge preprocessing", desc: "Signal cleaning and feature extraction on-device." },
  { icon: Brain, title: "3. On-device inference", desc: "XGBoost + LSTM + Isolation Forest score the vehicle locally." },
  { icon: CloudUpload, title: "4. Cloud sync (optional)", desc: "Only anomaly summaries sync when connectivity is available." },
];

export function PipelineStrip() {
  return (
    <div className="grid grid-cols-1 items-stretch gap-3 sm:grid-cols-4">
      {STAGES.map((s, i) => {
        const Icon = s.icon;
        return (
          <div key={s.title} className="flex items-center gap-3">
            <HoverGlowCard className="flex-1 p-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-400/10 text-teal-300">
                <Icon className="h-5 w-5" />
              </div>
              <p className="mt-3 text-sm font-medium text-neutral-100">{s.title}</p>
              <p className="mt-1 text-xs leading-relaxed text-neutral-500">{s.desc}</p>
            </HoverGlowCard>
            {i < STAGES.length - 1 && (
              <ArrowRight className="hidden h-4 w-4 flex-none text-neutral-600 sm:block" />
            )}
          </div>
        );
      })}
    </div>
  );
}