"use client";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Vehicle } from "@/lib/types";

function colorFor(value: number) {
  if (value >= 60) return "#F0455C";
  if (value >= 30) return "#F5A524";
  return "#2FD9C4";
}

export function ComponentRiskChart({ vehicles }: { vehicles: Vehicle[] }) {
  const totals: Record<string, { label: string; sum: number; count: number }> = {};
  vehicles.forEach((v) =>
    v.components.forEach((c) => {
      if (!totals[c.key]) totals[c.key] = { label: c.label, sum: 0, count: 0 };
      totals[c.key].sum += c.failureProbability;
      totals[c.key].count += 1;
    })
  );
  const data = Object.values(totals)
    .map((t) => ({ label: t.label, risk: Math.round(t.sum / t.count) }))
    .sort((a, b) => b.risk - a.risk);

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 20, left: 8, bottom: 0 }}>
        <CartesianGrid stroke="rgba(255,255,255,0.06)" horizontal={false} />
        <XAxis type="number" domain={[0, 100]} tick={{ fill: "#8A90A0", fontSize: 11 }} />
        <YAxis
          type="category"
          dataKey="label"
          width={90}
          tick={{ fill: "#C4C8D2", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{
            background: "#14161C",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 8,
            fontSize: 11,
          }}
          formatter={(value) => [`${value}% avg. failure risk`, ""]}
        />
        <Bar dataKey="risk" radius={[0, 6, 6, 0]} barSize={14} isAnimationActive={false}>
          {data.map((d, i) => (
            <Cell key={i} fill={colorFor(d.risk)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}