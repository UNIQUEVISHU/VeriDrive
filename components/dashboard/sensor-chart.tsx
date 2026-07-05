"use client";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { SensorReading } from "@/lib/types";

type MetricKey = keyof Omit<SensorReading, "t">;

const METRIC_META: Record<MetricKey, { label: string; color: string; unit: string }> = {
  engineTemp: { label: "Engine Temp", color: "#F5A524", unit: "°C" },
  rpm: { label: "RPM", color: "#4C8DFF", unit: "" },
  vibration: { label: "Vibration", color: "#F0455C", unit: "mm/s" },
  batteryVoltage: { label: "Battery", color: "#2FD9C4", unit: "V" },
  brakePadWear: { label: "Brake Wear", color: "#F0455C", unit: "%" },
  coolantLevel: { label: "Coolant", color: "#2FD9C4", unit: "%" },
  oilPressure: { label: "Oil Pressure", color: "#4C8DFF", unit: "psi" },
  tirePressure: { label: "Tire Pressure", color: "#8A90A0", unit: "psi" },
  speed: { label: "Speed", color: "#8A90A0", unit: "km/h" },
};

export function SensorChart({
  data,
  metric,
  height = 120,
}: {
  data: SensorReading[];
  metric: MetricKey;
  height?: number;
}) {
  const meta = METRIC_META[metric];
  const gradientId = `grad-${metric}`;

  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between">
        <span className="text-[11px] font-medium tracking-wide text-neutral-400">{meta.label}</span>
        <span className="font-mono text-sm text-neutral-200">
          {data.length ? data[data.length - 1][metric].toFixed(1) : "--"}
          <span className="ml-0.5 text-[10px] text-neutral-500">{meta.unit}</span>
        </span>
      </div>
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={meta.color} stopOpacity={0.35} />
              <stop offset="100%" stopColor={meta.color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
          <XAxis dataKey="t" hide />
          <YAxis hide domain={["auto", "auto"]} />
          <Tooltip
            contentStyle={{
              background: "#14161C",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 8,
              fontSize: 11,
            }}
            labelFormatter={() => ""}
            formatter={(value) => [`${Number(value).toFixed(2)} ${meta.unit}`, meta.label]}
          />
          <Area
            type="monotone"
            dataKey={metric}
            stroke={meta.color}
            strokeWidth={2}
            fill={`url(#${gradientId})`}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
