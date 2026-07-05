"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

function colorFor(score: number) {
  if (score < 40) return "#F0455C";
  if (score < 70) return "#F5A524";
  return "#2FD9C4";
}

export function HealthGauge({
  score,
  size = 168,
  label = "FLEET HEALTH",
}: {
  score: number;
  size?: number;
  label?: string;
}) {
  const radius = size / 2 - 12;
  const circumference = 2 * Math.PI * radius;
  const startAngle = -220;
  const sweep = 260; // degrees of arc used for the dial
  const pct = Math.max(0, Math.min(100, score)) / 100;
  const dash = (sweep / 360) * circumference;
  const color = colorFor(score);
  const needleAngle = startAngle + sweep * pct;

  const ticks = Array.from({ length: 11 }, (_, i) => i);

  return (
    <div className="relative flex flex-col items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={10}
          strokeDasharray={`${dash} ${circumference}`}
          strokeDashoffset={0}
          transform={`rotate(${startAngle} ${size / 2} ${size / 2})`}
          strokeLinecap="round"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={10}
          strokeDasharray={`${dash} ${circumference}`}
          strokeLinecap="round"
          transform={`rotate(${startAngle} ${size / 2} ${size / 2})`}
          initial={{ strokeDashoffset: dash }}
          animate={{ strokeDashoffset: dash * (1 - pct) }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{ filter: `drop-shadow(0 0 6px ${color}80)` }}
        />
        {ticks.map((i) => {
          const angle = ((startAngle + (sweep * i) / 10) * Math.PI) / 180;
          const x1 = size / 2 + Math.cos(angle) * (radius - 14);
          const y1 = size / 2 + Math.sin(angle) * (radius - 14);
          const x2 = size / 2 + Math.cos(angle) * (radius - 6);
          const y2 = size / 2 + Math.sin(angle) * (radius - 6);
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="rgba(255,255,255,0.25)"
              strokeWidth={1.5}
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="font-mono text-3xl font-semibold tabular-nums text-neutral-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {Math.round(score)}
        </motion.span>
        <span className="mt-1 text-[10px] font-medium tracking-[0.18em] text-neutral-500">
          {label}
        </span>
      </div>
      <div
        className="absolute h-1.5 w-1.5 rounded-full"
        style={{
          left: "50%",
          top: "50%",
          transform: `rotate(${needleAngle}deg) translate(${radius - 2}px, 0) translate(-50%,-50%)`,
          background: color,
          boxShadow: `0 0 8px 2px ${color}`,
        }}
      />
    </div>
  );
}

export function MiniHealthBar({ value, className }: { value: number; className?: string }) {
  const color = colorFor(value);
  return (
    <div className={cn("h-1.5 w-full overflow-hidden rounded-full bg-white/10", className)}>
      <motion.div
        className="h-full rounded-full"
        style={{ background: color }}
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
    </div>
  );
}
