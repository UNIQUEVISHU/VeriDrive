import {
  AlertItem,
  ComponentHealth,
  ComponentKey,
  SensorReading,
  Severity,
  Vehicle,
} from "./types";

const COMPONENT_LABELS: Record<ComponentKey, string> = {
  engine: "Engine",
  battery: "Battery",
  brakes: "Brake Pads",
  transmission: "Transmission",
  coolant: "Coolant System",
  tires: "Tire Pressure",
};

export function severityFromHealth(health: number): Severity {
  if (health < 40) return "critical";
  if (health < 70) return "warning";
  return "normal";
}

function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

/** Generates one tick of raw sensor telemetry for a vehicle, seeded by t + vehicle drift. */
export function generateReading(t: number, drift: number): SensorReading {
  const rand = rng(Math.floor(t * 1000) + drift * 7919);
  const wobble = Math.sin(t / 6) * 4;
  return {
    t,
    engineTemp: 88 + wobble + drift * 6 + rand() * 3,
    rpm: 1800 + Math.sin(t / 3) * 350 + rand() * 60,
    vibration: 1.2 + Math.max(0, drift) * 1.8 + rand() * 0.6,
    batteryVoltage: 12.6 - drift * 0.4 + Math.sin(t / 20) * 0.15,
    brakePadWear: Math.min(100, 18 + drift * 22 + rand() * 2),
    coolantLevel: Math.max(30, 92 - drift * 10 + rand() * 2),
    oilPressure: 45 - drift * 6 + Math.sin(t / 10) * 2,
    tirePressure: 32 - drift * 3 + Math.sin(t / 15) * 0.8,
    speed: Math.max(0, 60 + Math.sin(t / 8) * 25 + rand() * 5),
  };
}

/** Mock "Isolation Forest" style anomaly score from a reading, 0-1. */
export function anomalyScore(reading: SensorReading): number {
  const tempScore = Math.max(0, (reading.engineTemp - 100) / 30);
  const vibScore = Math.max(0, (reading.vibration - 3) / 4);
  const voltScore = Math.max(0, (12.0 - reading.batteryVoltage) / 2);
  const oilScore = Math.max(0, (35 - reading.oilPressure) / 20);
  return Math.min(1, tempScore * 0.35 + vibScore * 0.3 + voltScore * 0.2 + oilScore * 0.15);
}

/** Mock "XGBoost/LSTM" component health + RUL estimate driven by a drift factor (0 = pristine, 1 = failing). */
export function computeComponentHealth(
  key: ComponentKey,
  drift: number,
  jitter: number
): ComponentHealth {
  const base = 100 - drift * 78 - jitter * 6;
  const health = Math.max(2, Math.min(100, Math.round(base)));
  const rul = Math.max(1, Math.round((health / 100) * 120 - jitter * 4));
  const failureProbability = Math.max(0, Math.min(100, Math.round(100 - health + jitter * 4)));
  return {
    key,
    label: COMPONENT_LABELS[key],
    health,
    rul,
    failureProbability,
    severity: severityFromHealth(health),
  };
}

export function aggregateHealthScore(components: ComponentHealth[]): number {
  const weights: Record<ComponentKey, number> = {
    engine: 0.28,
    battery: 0.14,
    brakes: 0.22,
    transmission: 0.16,
    coolant: 0.1,
    tires: 0.1,
  };
  const score = components.reduce((sum, c) => sum + c.health * weights[c.key], 0);
  return Math.round(score);
}

export function worstSeverity(components: ComponentHealth[]): Severity {
  if (components.some((c) => c.severity === "critical")) return "critical";
  if (components.some((c) => c.severity === "warning")) return "warning";
  return "normal";
}

interface VehicleSeed {
  id: string;
  name: string;
  model: string;
  driver: string;
  odometer: number;
  location: string;
  drifts: Record<ComponentKey, number>;
}

export const FLEET_SEED: VehicleSeed[] = [
  {
    id: "TT-101",
    name: "Signa 4225.TK",
    model: "Heavy Haulage Tractor",
    driver: "R. Meshram",
    odometer: 128430,
    location: "Pune – Mumbai Expressway",
    drifts: { engine: 0.82, battery: 0.35, brakes: 0.6, transmission: 0.3, coolant: 0.5, tires: 0.2 },
  },
  {
    id: "TT-104",
    name: "Ultra T.16",
    model: "ICV Delivery Truck",
    driver: "S. Kulkarni",
    odometer: 76210,
    location: "Chakan Industrial Belt",
    drifts: { engine: 0.32, battery: 0.55, brakes: 0.28, transmission: 0.2, coolant: 0.22, tires: 0.18 },
  },
  {
    id: "TT-109",
    name: "Prima LX 3128",
    model: "Long Haul Tipper",
    driver: "A. Bansal",
    odometer: 201870,
    location: "Nashik Bypass",
    drifts: { engine: 0.18, battery: 0.15, brakes: 0.2, transmission: 0.12, coolant: 0.1, tires: 0.14 },
  },
  {
    id: "TT-113",
    name: "Ace Gold HT",
    model: "Mini Commercial Truck",
    driver: "V. Iyer",
    odometer: 44980,
    location: "Ranjangaon MIDC",
    drifts: { engine: 0.08, battery: 0.12, brakes: 0.1, transmission: 0.06, coolant: 0.07, tires: 0.09 },
  },
  {
    id: "TT-118",
    name: "Yodha 2.0",
    model: "Pickup Fleet Unit",
    driver: "N. Deshpande",
    odometer: 59340,
    location: "Talegaon Depot",
    drifts: { engine: 0.14, battery: 0.2, brakes: 0.16, transmission: 0.1, coolant: 0.12, tires: 0.11 },
  },
];

export function buildVehicle(seed: VehicleSeed, jitter: number, tick: number): Vehicle {
  const components = (Object.keys(seed.drifts) as ComponentKey[]).map((key) =>
    computeComponentHealth(key, seed.drifts[key] + Math.sin(tick / 40 + key.length) * 0.03, jitter)
  );
  const healthScore = aggregateHealthScore(components);
  return {
    id: seed.id,
    name: seed.name,
    model: seed.model,
    driver: seed.driver,
    odometer: seed.odometer,
    location: seed.location,
    healthScore,
    severity: worstSeverity(components),
    lastSync: "just now",
    components,
  };
}

const RECOMMENDATIONS: Record<ComponentKey, string> = {
  engine: "Schedule an engine diagnostic check and inspect for coolant leaks before the next long haul.",
  battery: "Test battery load capacity; replace if voltage stays below 12.2V under load.",
  brakes: "Inspect brake pads and rotors at the next service stop — pad wear is accelerating.",
  transmission: "Check transmission fluid level and clarity; flag for gearbox inspection.",
  coolant: "Top up coolant and pressure-test the radiator cap and hoses for leaks.",
  tires: "Rotate and inspect tires; verify pressure against load rating before departure.",
};

export function buildAlerts(vehicles: Vehicle[]): AlertItem[] {
  const alerts: AlertItem[] = [];
  vehicles.forEach((v) => {
    v.components
      .filter((c) => c.severity !== "normal")
      .forEach((c) => {
        alerts.push({
          id: `${v.id}-${c.key}`,
          vehicleId: v.id,
          vehicleName: v.name,
          component: c.key,
          severity: c.severity,
          message: `${c.label} health at ${c.health}% — failure probability ${c.failureProbability}%.`,
          recommendation: RECOMMENDATIONS[c.key],
          timestamp: "moments ago",
        });
      });
  });
  return alerts.sort((a, b) => (a.severity === "critical" ? -1 : 1));
}

export function assistantReply(question: string, vehicles: Vehicle[]): string {
  const q = question.toLowerCase();
  const critical = vehicles.filter((v) => v.severity === "critical");
  const warning = vehicles.filter((v) => v.severity === "warning");

  if (q.includes("critical") || q.includes("urgent") || q.includes("worst")) {
    if (critical.length === 0) return "No vehicles are in a critical state right now. The fleet is stable.";
    const v = critical[0];
    const worst = [...v.components].sort((a, b) => a.health - b.health)[0];
    return `${v.name} (${v.id}) needs attention first — its ${worst.label.toLowerCase()} is at ${worst.health}% health with a ${worst.failureProbability}% failure probability. Recommended action: ${RECOMMENDATIONS[worst.key].toLowerCase()}`;
  }
  if (q.includes("battery")) {
    const v = [...vehicles].sort(
      (a, b) =>
        (a.components.find((c) => c.key === "battery")?.health ?? 100) -
        (b.components.find((c) => c.key === "battery")?.health ?? 100)
    )[0];
    const c = v.components.find((c) => c.key === "battery")!;
    return `${v.name}'s battery is at ${c.health}% health, estimated RUL of ${c.rul} days. ${RECOMMENDATIONS.battery}`;
  }
  if (q.includes("brake")) {
    const v = [...vehicles].sort(
      (a, b) =>
        (a.components.find((c) => c.key === "brakes")?.health ?? 100) -
        (b.components.find((c) => c.key === "brakes")?.health ?? 100)
    )[0];
    const c = v.components.find((c) => c.key === "brakes")!;
    return `${v.name}'s brake pads are at ${c.health}% health, RUL ${c.rul} days. ${RECOMMENDATIONS.brakes}`;
  }
  if (q.includes("engine")) {
    const v = [...vehicles].sort(
      (a, b) =>
        (a.components.find((c) => c.key === "engine")?.health ?? 100) -
        (b.components.find((c) => c.key === "engine")?.health ?? 100)
    )[0];
    const c = v.components.find((c) => c.key === "engine")!;
    return `${v.name}'s engine is at ${c.health}% health with a ${c.failureProbability}% failure probability over the next service interval. ${RECOMMENDATIONS.engine}`;
  }
  if (q.includes("fleet") || q.includes("overall") || q.includes("summary")) {
    const avg = Math.round(vehicles.reduce((s, v) => s + v.healthScore, 0) / vehicles.length);
    return `Fleet average health score is ${avg}/100. ${critical.length} vehicle(s) critical, ${warning.length} in warning. Prioritize ${critical[0]?.name ?? warning[0]?.name ?? "routine checks"} first.`;
  }
  return "I track live sensor streams, component health, and failure probabilities across your fleet. Ask me about a specific vehicle, component (engine, battery, brakes), or which vehicle needs attention first.";
}
