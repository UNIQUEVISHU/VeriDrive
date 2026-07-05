"use client";
import { createContext, useContext } from "react";
import { useFleet } from "@/hooks/use-fleet";
import { SensorReading, Vehicle } from "@/lib/types";

interface FleetContextValue {
  vehicles: Vehicle[];
  histories: Record<string, SensorReading[]>;
  tick: number;
}

const FleetContext = createContext<FleetContextValue | null>(null);

export function FleetProvider({ children }: { children: React.ReactNode }) {
  const { vehicles, histories, tick } = useFleet();
  return (
    <FleetContext.Provider value={{ vehicles, histories, tick }}>
      {children}
    </FleetContext.Provider>
  );
}

export function useFleetContext() {
  const ctx = useContext(FleetContext);
  if (!ctx) throw new Error("useFleetContext must be used within FleetProvider");
  return ctx;
}
