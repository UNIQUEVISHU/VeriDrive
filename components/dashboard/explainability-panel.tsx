import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface FactorProps {
  label: string;
  weight: number; // 0–100
}

const FACTORS: FactorProps[] = [
  { label: "Vibration deviation (bearing wear)", weight: 78 },
  { label: "Engine temp trend (last 6 hrs)", weight: 61 },
  { label: "Battery voltage drop rate", weight: 42 },
  { label: "Harsh braking frequency", weight: 35 },
  { label: "Oil pressure variance", weight: 22 },
];

export function ExplainabilityPanel({ vehicleName }: { vehicleName?: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Why this prediction?</CardTitle>
        <CardDescription>
          Feature contribution to {vehicleName ?? "this vehicle"}&apos;s risk score (XGBoost feature importance)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 pt-2">
        {FACTORS.map((f) => (
          <div key={f.label}>
            <div className="flex justify-between text-xs text-neutral-400">
              <span>{f.label}</span>
              <span>{f.weight}%</span>
            </div>
            <div className="mt-1 h-1.5 w-full rounded-full bg-white/5">
              <div
                className="h-1.5 rounded-full bg-teal-400/70"
                style={{ width: `${f.weight}%` }}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}