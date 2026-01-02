export interface PumpEvent {
  id: string;
  type: "ON" | "OFF";  // match 'state'
  initiatedBy: "sensor" | "manual" | "frontend"; // match 'source'
  waterLevel: number;
  duration?: number | null;
  note?: string;
  createdAt: string | Date;   // added this
  updatedAt: string | Date;   // optional
}

export interface DashboardStats {
  currentWaterLevel: number
  pumpStatus: "ON" | "OFF"
  totalOnTime: number
  totalCycles: number
  lastEventTime: Date
  averageCycleTime: number
}

export interface ChartData {
  time: string
  cycles: number
  avgDuration: number
  waterLevel: number
}
