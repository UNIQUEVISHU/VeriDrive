"use client";
import { Activity, Gauge, ShieldAlert, Truck, Wrench } from "lucide-react";
import { useFleetContext } from "@/app/providers";
import { Topbar } from "@/components/dashboard/topbar";
import { DiagnosticGrid } from "@/components/dashboard/diagnostic-grid";
import { Spotlight } from "@/components/aceternity/spotlight";
import { HealthGauge } from "@/components/dashboard/health-gauge";
import { StatCard } from "@/components/dashboard/stat-card";
import { VehicleCard } from "@/components/dashboard/vehicle-card";
import { AlertRow } from "@/components/dashboard/alert-row";
import { SensorChart } from "@/components/dashboard/sensor-chart";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { buildAlerts } from "@/lib/simulate";

export default function OverviewPage() {
  const { vehicles, histories } = useFleetContext();
  const avgHealth = Math.round(vehicles.reduce((s, v) => s + v.healthScore, 0) / vehicles.length);
  const critical = vehicles.filter((v) => v.severity === "critical");
  const warning = vehicles.filter((v) => v.severity === "warning");
  const alerts = buildAlerts(vehicles).slice(0, 4);
  const focusVehicle = critical[0] ?? warning[0] ?? vehicles[0];
  const focusHistory = histories[focusVehicle?.id] ?? [];

  return (
    <div>
      <Topbar title="Fleet Overview" subtitle="Live edge-to-cloud telemetry across all monitored vehicles" />

      <section className="relative overflow-hidden border-b border-white/10 px-6 py-10 lg:px-10">
        <DiagnosticGrid />
        <Spotlight className="left-1/2 top-0 -translate-x-1/2" />
        <div className="relative z-10 flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-400/30 bg-teal-400/10 px-3 py-1 text-[11px] font-medium text-teal-300">
              <Activity className="h-3 w-3" /> PS 3.2.1.3 · Edge AI Predictive Maintenance
            </span>
            <h2 className="mt-4 font-display text-3xl font-semibold leading-tight text-neutral-50 sm:text-4xl">
              Catch failures before the road does.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-neutral-400">
              VeriDrive runs an on-device inference stack — XGBoost for failure classification,
              LSTM for time-series degradation, and Isolation Forest for anomaly detection — to turn
              raw sensor streams into a single, trustworthy health score per vehicle, synced to the
              cloud the moment connectivity returns.
            </p>
            <div className="mt-5 flex gap-3">
              <Button asChild size="lg">
                <Link href="/fleet">View fleet</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/assistant">Ask the AI assistant</Link>
              </Button>
            </div>
          </div>
          <HealthGauge score={avgHealth} size={200} />
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 px-6 py-8 sm:grid-cols-2 lg:grid-cols-4 lg:px-10">
        <StatCard icon={Truck} label="Vehicles monitored" value={vehicles.length} tone="default" />
        <StatCard icon={ShieldAlert} label="Critical alerts" value={critical.length} tone="critical" />
        <StatCard icon={Gauge} label="Warnings" value={warning.length} tone="warning" />
        <StatCard icon={Wrench} label="Avg. fleet health" value={avgHealth} suffix="/ 100" tone="normal" />
      </section>

      <section className="grid grid-cols-1 gap-6 px-6 pb-10 lg:grid-cols-3 lg:px-10">
        <div className="lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-display text-sm font-semibold text-neutral-200">Fleet snapshot</h3>
            <Link href="/fleet" className="text-xs text-teal-300 hover:underline">
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {vehicles.slice(0, 4).map((v) => (
              <VehicleCard key={v.id} vehicle={v} />
            ))}
          </div>
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-display text-sm font-semibold text-neutral-200">Priority alerts</h3>
            <Link href="/alerts" className="text-xs text-teal-300 hover:underline">
              View all →
            </Link>
          </div>
          <div className="flex flex-col gap-3">
            {alerts.length === 0 && (
              <Card className="p-5 text-sm text-neutral-500">All systems nominal — no active alerts.</Card>
            )}
            {alerts.map((a, i) => (
              <AlertRow key={a.id} alert={a} index={i} />
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 pb-14 lg:px-10">
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Live telemetry — {focusVehicle?.name}</CardTitle>
              <CardDescription>Highest-priority vehicle right now, streaming from the edge node</CardDescription>
            </div>
            <Link href={`/vehicle/${focusVehicle?.id}`} className="text-xs text-teal-300 hover:underline">
              Full diagnostics →
            </Link>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <SensorChart data={focusHistory} metric="engineTemp" />
            <SensorChart data={focusHistory} metric="vibration" />
            <SensorChart data={focusHistory} metric="batteryVoltage" />
            <SensorChart data={focusHistory} metric="oilPressure" />
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
