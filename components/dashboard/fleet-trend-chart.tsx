"use client";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export interface TrendPoint {
  tick: number;
  avgHealth: number;
}

export function FleetTrendChart({ data }: { data: TrendPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 8, right: 12, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="grad-fleet-trend" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2FD9C4" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#2FD9C4" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
        <XAxis dataKey="tick" hide />
        <YAxis domain={[0, 100]} tick={{ fill: "#8A90A0", fontSize: 11 }} width={28} />
        <Tooltip
          contentStyle={{
            background: "#14161C",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 8,
            fontSize: 11,
          }}
          labelFormatter={() => ""}
          formatter={(value) => [`${value}/100`, "Avg. fleet health"]}
        />
        <Area
          type="monotone"
          dataKey="avgHealth"
          stroke="#2FD9C4"
          strokeWidth={2}
          fill="url(#grad-fleet-trend)"
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}