"use client";
import { useEffect, useRef, useState } from "react";
import { Activity } from "lucide-react";
import { useFleetContext } from "@/app/providers";
import { Topbar } from "@/components/dashboard/topbar";
import { DiagnosticGrid } from "@/components/dashboard/diagnostic-grid";
import { Spotlight } from "@/components/aceternity/spotlight";
import { HealthGauge } from "@/components/dashboard/health-gauge";
import { SensorChart } from "@/components/dashboard/sensor-chart";
import { FleetTrendChart, TrendPoint } from "@/components/dashboard/fleet-trend-chart";
import { ComponentRiskChart } from "@/components/dashboard/component-risk-chart";
import { PipelineStrip } from "@/components/dashboard/pipeline-strip";
import { ImpactStats } from "@/components/dashboard/impact-stats";
import { AttentionSpotlight } from "@/components/dashboard/attention-spotlight";
import { SectionHeading } from "@/components/dashboard/section-heading";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { WhyEdgeSection } from "@/components/dashboard/why-edge-section";
import { ExplainabilityPanel } from "@/components/dashboard/explainability-panel";
import { DemoModeBanner } from "@/components/dashboard/demo-mode-banner";

const TREND_LEN = 30;

export default function OverviewPage() {
  const { vehicles, histories, tick } = useFleetContext();
  const avgHealth = vehicles.length
    ? Math.round(vehicles.reduce((s, v) => s + v.healthScore, 0) / vehicles.length)
    : 0;
  const critical = vehicles.filter((v) => v.severity === "critical");
  const warning = vehicles.filter((v) => v.severity === "warning");
  const focusVehicle = critical[0] ?? warning[0] ?? vehicles[0];
  const focusHistory = histories[focusVehicle?.id] ?? [];

  const [trend, setTrend] = useState<TrendPoint[]>([]);
  const lastTick = useRef(-1);
  useEffect(() => {
    if (tick === lastTick.current) return;
    lastTick.current = tick;
    setTrend((prev) => [...prev, { tick, avgHealth }].slice(-TREND_LEN));
  }, [tick, avgHealth]);

  return (
    <div>
      <Topbar title="Fleet Overview" subtitle="Live edge-to-cloud telemetry across all monitored vehicles" />

      <DemoModeBanner />

      {/* HERO */}
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
              Built for large commercial vehicle fleets, VeriDrive is designed around an
              on-device inference pipeline — XGBoost for failure classification, LSTM for
              time-series degradation, and Isolation Forest for anomaly detection — so a
              vehicle&apos;s health score is computed locally and only anomaly summaries sync
              to the cloud when connectivity allows.
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

      {/* IMPACT / ROI */}
      <section className="px-6 py-8 lg:px-10">
        <SectionHeading
          eyebrow="Business impact"
          title="What predictive maintenance is worth, today"
          description="Estimated savings based on issues caught early across the current fleet."
        />
        <ImpactStats
          vehiclesMonitored={vehicles.length}
          criticalCount={critical.length}
          warningCount={warning.length}
        />
      </section>

      {/* CONCRETE AI PREDICTION */}
      {focusVehicle && (
        <section className="px-6 pb-8 lg:px-10">
          <SectionHeading
            eyebrow="Right now"
            title="Highest-priority vehicle"
            description="The model's single most urgent prediction across the fleet, updated live."
          />
          <AttentionSpotlight vehicle={focusVehicle} />
          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
            <ExplainabilityPanel vehicleName={focusVehicle?.name} />
          </div>
        </section>
      )}

      {/* ARCHITECTURE EXPLAINER */}
      <section className="px-6 pb-8 lg:px-10">
        <SectionHeading
          eyebrow="Under the hood"
          title="How the edge pipeline works"
          description="From raw sensor to actionable alert — entirely on-device, cloud-optional."
        />
        <PipelineStrip />
      </section>

      {/* WHY EDGE, WHY NOW */}
      <WhyEdgeSection />

      {/* TRENDS */}
      <section className="px-6 pb-10 lg:px-10">
        <SectionHeading eyebrow="Trends" title="Fleet-wide signals" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Fleet health trend</CardTitle>
              <CardDescription>Average health score across all vehicles, updated every cycle</CardDescription>
            </CardHeader>
            <CardContent>
              <FleetTrendChart data={trend} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Component risk breakdown</CardTitle>
              <CardDescription>Average failure probability by component, across the whole fleet</CardDescription>
            </CardHeader>
            <CardContent>
              <ComponentRiskChart vehicles={vehicles} />
            </CardContent>
          </Card>
        </div>
      </section>

      {/* LIVE TELEMETRY */}
      <section className="px-6 pb-14 lg:px-10">
        <SectionHeading
          eyebrow="Live"
          title="Telemetry stream"
          description={
            focusVehicle
              ? `Simulated sensor data from ${focusVehicle.name}, the vehicle needing attention most.`
              : "No vehicles in fleet yet."
          }
          align="between"
          action={
            focusVehicle ? (
              <Link href={`/vehicle/${focusVehicle.id}`} className="text-xs text-teal-300 hover:underline">
                Full diagnostics →
              </Link>
            ) : undefined
          }
        />
        <Card>
          <CardContent className="grid grid-cols-1 gap-6 pt-6 sm:grid-cols-2 lg:grid-cols-4">
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