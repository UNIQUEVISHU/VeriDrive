"use client";
import { useMemo, useState } from "react";
import { useFleetContext } from "@/app/providers";
import { Topbar } from "@/components/dashboard/topbar";
import { AlertRow } from "@/components/dashboard/alert-row";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { buildAlerts } from "@/lib/simulate";
import { Severity } from "@/lib/types";
import { Card } from "@/components/ui/card";

export default function AlertsPage() {
  const { vehicles } = useFleetContext();
  const [filter, setFilter] = useState<"all" | Severity>("all");
  const alerts = useMemo(() => buildAlerts(vehicles), [vehicles]);
  const filtered = filter === "all" ? alerts : alerts.filter((a) => a.severity === filter);

  return (
    <div>
      <Topbar title="Alerts" subtitle="AI-generated maintenance alerts, ranked by urgency" />

      <div className="px-6 py-6 lg:px-10">
        <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
          <TabsList>
            <TabsTrigger value="all">All ({alerts.length})</TabsTrigger>
            <TabsTrigger value="critical">Critical ({alerts.filter((a) => a.severity === "critical").length})</TabsTrigger>
            <TabsTrigger value="warning">Warning ({alerts.filter((a) => a.severity === "warning").length})</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="flex flex-col gap-3 px-6 pb-14 lg:px-10">
        {filtered.length === 0 && (
          <Card className="p-8 text-center text-sm text-neutral-500">No alerts in this category. Fleet is healthy.</Card>
        )}
        {filtered.map((a, i) => (
          <AlertRow key={a.id} alert={a} index={i} />
        ))}
      </div>
    </div>
  );
}
