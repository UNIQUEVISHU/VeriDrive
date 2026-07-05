export type Severity = "normal" | "warning" | "critical";

export type ComponentKey =
  | "engine"
  | "battery"
  | "brakes"
  | "transmission"
  | "coolant"
  | "tires";

export interface SensorReading {
  t: number;
  engineTemp: number;
  rpm: number;
  vibration: number;
  batteryVoltage: number;
  brakePadWear: number;
  coolantLevel: number;
  oilPressure: number;
  tirePressure: number;
  speed: number;
}

export interface ComponentHealth {
  key: ComponentKey;
  label: string;
  health: number;
  rul: number;
  failureProbability: number;
  severity: Severity;
}

export interface Vehicle {
  id: string;
  name: string;
  model: string;

  driver: string;

  odometer: number;

  location: string;

  healthScore: number;

  severity: Severity;

  lastSync: string;

  components: ComponentHealth[];

  // NEW FIELDS
  batteryHealth: number;

  lastSeen: string;
}

export interface AlertItem {
  id: string;
  vehicleId: string;
  vehicleName: string;
  component: ComponentKey;
  severity: Severity;
  message: string;
  recommendation: string;
  timestamp: string;
}
