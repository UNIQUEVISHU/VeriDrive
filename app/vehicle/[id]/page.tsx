"use client";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, MapPin, Gauge as GaugeIcon, User, Route } from "lucide-react";
import { useFleetContext } from "@/app/providers";
import { Topbar } from "@/components/dashboard/topbar";
import { HealthGauge } from "@/components/dashboard/health-gauge";
import { SensorChart } from "@/components/dashboard/sensor-chart";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export default function VehicleDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { vehicles, histories } = useFleetContext();
  const vehicle = vehicles.find((v) => v.id === params.id);
  const history = histories[params.id] ?? [];

  if (!vehicle) {
    return (
      <div className="p-10">
        <p className="text-sm text-neutral-400">Vehicle not found.</p>
        <Button variant="outline" className="mt-4" onClick={() => router.push("/fleet")}>
          Back to fleet
        </Button>
      </div>
    );
  }

  return (
    <div>
      <Topbar
  title={vehicle.name}
  subtitle={`${vehicle.id} • ${vehicle.location}`}
/>

      <div className="px-6 pt-6 lg:px-10">
        <Button variant="ghost" size="sm" onClick={() => router.push("/fleet")} className="gap-1.5 px-2">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to fleet
        </Button>
      </div>

      <section className="grid grid-cols-1 gap-6 px-6 py-6 lg:grid-cols-3 lg:px-10">
        <Card className="flex flex-col items-center justify-center gap-4 p-6 lg:col-span-1">
          <HealthGauge score={vehicle.healthScore} size={190} label="VEHICLE HEALTH" />
          <Badge variant={vehicle.severity} className="text-xs">
            {vehicle.severity === "normal" ? "Operating normally" : `${vehicle.severity} condition detected`}
          </Badge>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Vehicle Information</CardTitle>

<CardDescription>
Live fleet telemetry synchronized from Edge AI device
</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
            <ProfileStat icon={User} label="Driver" value={vehicle.driver} />
            <ProfileStat icon={Route} label="Odometer" value={`${vehicle.odometer.toLocaleString()} km`} />
            <ProfileStat icon={MapPin} label="Location" value={vehicle.location} />
            <ProfileStat
  icon={GaugeIcon}
  label="Last Seen"
  value={vehicle.lastSeen}
/>
          </CardContent>
        </Card>
        <Card className="mt-6">
  <CardHeader>
    <CardTitle>Battery Health</CardTitle>
    <CardDescription>
      Real-time battery diagnostics
    </CardDescription>
  </CardHeader>

  <CardContent>
    <div className="flex items-center justify-between">
      <span className="text-neutral-400">
        Current Health
      </span>

      <span className="text-2xl font-bold text-emerald-400">
        {vehicle.batteryHealth}%
      </span>
    </div>

    <Progress
      className="mt-4"
      value={vehicle.batteryHealth}
    />

    <p className="mt-3 text-xs text-neutral-500">
      Estimated battery condition based on live telemetry
      and charging cycles.
    </p>
  </CardContent>
</Card>
      </section>

      <section className="px-6 pb-6 lg:px-10">
        <h3 className="mb-3 font-display text-sm font-semibold text-neutral-200">Component diagnostics</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {vehicle.components.map((c) => (
            <Card key={c.key} className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-neutral-200">{c.label}</span>
                <Badge variant={c.severity}>{c.severity}</Badge>
              </div>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="font-mono text-xl font-semibold text-neutral-50">{c.health}</span>
                <span className="text-xs text-neutral-500">/ 100</span>
              </div>
              <Progress value={c.health} className="mt-2" />
              <div className="mt-3 flex justify-between text-[11px] text-neutral-500">
                <span>RUL: {c.rul} days</span>
                <span>Failure risk: {c.failureProbability}%</span>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="px-6 pb-14 lg:px-10">
        <Card>
          <CardHeader>
            <CardTitle>Live sensor streams</CardTitle>
            <CardDescription>Raw telemetry feeding the edge inference engine, refreshed every cycle</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <SensorChart data={history} metric="engineTemp" />
            <SensorChart data={history} metric="rpm" />
            <SensorChart data={history} metric="vibration" />
            <SensorChart data={history} metric="batteryVoltage" />
            <SensorChart data={history} metric="brakePadWear" />
            <SensorChart data={history} metric="coolantLevel" />
            <SensorChart data={history} metric="oilPressure" />
            <SensorChart data={history} metric="tirePressure" />
            <SensorChart data={history} metric="speed" />
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function ProfileStat({ icon: Icon, label, value }: { icon: typeof User; label: string; value: string }) {
  return (
    <div>
      <span className="flex items-center gap-1.5 text-[11px] text-neutral-500">
        <Icon className="h-3 w-3" /> {label}
      </span>
      <p className="mt-1 text-sm text-neutral-200">{value}</p>
    </div>
  );
}
