export type Severity = "normal" | "warning" | "critical";

export type ComponentKey =
  | "engine"
  | "battery"
  | "brakes"
  | "transmission"
  | "coolant"
  | "tires";

export interface SensorReading {
  t: number; // seconds since session start
  engineTemp: number; // deg C
  rpm: number;
  vibration: number; // mm/s RMS
  batteryVoltage: number; // V
  brakePadWear: number; // %
  coolantLevel: number; // %
  oilPressure: number; // psi
  tirePressure: number; // psi
  speed: number; // km/h
}

export interface ComponentHealth {
  key: ComponentKey;
  label: string;
  health: number; // 0-100
  rul: number; // remaining useful life, in days
  failureProbability: number; // 0-100 %
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
