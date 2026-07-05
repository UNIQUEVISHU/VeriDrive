"use client";
import { useMemo, useState } from "react";
import { useFleetContext } from "@/app/providers";
import { Topbar } from "@/components/dashboard/topbar";
import { VehicleCard } from "@/components/dashboard/vehicle-card";
import { Input } from "@/components/ui/primitives";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";
import { Severity } from "@/lib/types";

export default function FleetPage() {
  const { vehicles } = useFleetContext();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | Severity>("all");

  const filtered = useMemo(
    () =>
      vehicles.filter((v) => {
const matchesQuery =
  v.name.toLowerCase().includes(query.toLowerCase()) ||
  v.id.toLowerCase().includes(query.toLowerCase()) ||
  v.driver.toLowerCase().includes(query.toLowerCase()) ||
  v.location.toLowerCase().includes(query.toLowerCase());
        const matchesFilter = filter === "all" || v.severity === filter;
        return matchesQuery && matchesFilter;
      }),
    [vehicles, query, filter]
  );

  return (
    <div>
      <Topbar
  title="Fleet Management"
  subtitle={`${vehicles.length} Tata vehicles connected to Edge AI monitoring`}
/>

      <div className="flex flex-col gap-4 px-6 py-6 sm:flex-row sm:items-center sm:justify-between lg:px-10">
        <div className="relative w-full max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by vehicle name, ID, location or driver..."
            className="pl-9"
          />
        </div>
        <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="normal">Normal</TabsTrigger>
            <TabsTrigger value="warning">Warning</TabsTrigger>
            <TabsTrigger value="critical">Critical</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 gap-4 px-6 pb-14 sm:grid-cols-2 lg:grid-cols-3 lg:px-10">
        {filtered.map((v) => (
          <VehicleCard key={v.id} vehicle={v} />
        ))}
        {filtered.length === 0 && (
          <p className="col-span-full py-10 text-center text-sm text-neutral-500">
            No Tata vehicles matched your search criteria.
          </p>
        )}
      </div>
    </div>
  );
}
