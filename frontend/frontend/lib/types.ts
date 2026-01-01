export interface PumpEvent {
  id: string
  timestamp: Date
  type: "ON" | "OFF"
  waterLevel: number
  duration?: number // in minutes
  initiatedBy: "sensor" | "manual"
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
