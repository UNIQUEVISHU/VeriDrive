"use client";
import { useEffect, useRef, useState } from "react";
import { FLEET_SEED, anomalyScore, buildVehicle, generateReading } from "@/lib/simulate";
import { SensorReading, Vehicle } from "@/lib/types";

const HISTORY_LEN = 40;

export function useFleet(intervalMs = 2200) {
  const [tick, setTick] = useState(0);
  const [vehicles, setVehicles] = useState<Vehicle[]>(() =>
    FLEET_SEED.map((seed) => buildVehicle(seed, 0, 0))
  );
  const [histories, setHistories] = useState<Record<string, SensorReading[]>>({});
  const tRef = useRef(0);

  useEffect(() => {
    const id = setInterval(() => {
      tRef.current += 1;
      const t = tRef.current;
      const jitter = Math.sin(t / 5) * 0.4 + Math.random() * 0.3;

      setVehicles(() => FLEET_SEED.map((seed) => buildVehicle(seed, jitter, t)));

      setHistories((prev) => {
        const next: Record<string, SensorReading[]> = { ...prev };
        FLEET_SEED.forEach((seed) => {
          const driftAvg =
            (seed.drifts.engine + seed.drifts.brakes + seed.drifts.coolant) / 3;
          const reading = generateReading(t, driftAvg);
          const arr = [...(next[seed.id] ?? []), reading];
          next[seed.id] = arr.slice(-HISTORY_LEN);
        });
        return next;
      });

      setTick(t);
    }, intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  return { vehicles, histories, tick, anomalyScore };
}
