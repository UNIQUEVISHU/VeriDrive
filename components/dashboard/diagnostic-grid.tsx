"use client";
import { cn } from "@/lib/utils";

export function DiagnosticGrid({ className }: { className?: string }) {
  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "42px 42px",
        }}
      />
      <div className="absolute -top-40 right-[-10%] h-[520px] w-[520px] rounded-full border border-teal-400/10">
        <div className="absolute inset-6 rounded-full border border-teal-400/10" />
        <div className="absolute inset-12 rounded-full border border-teal-400/10" />
        <div className="radar-sweep absolute inset-0 rounded-full" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-neutral-950" />
    </div>
  );
}
