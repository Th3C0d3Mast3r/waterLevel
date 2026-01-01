import type { PumpEvent, ChartData } from "./types"

export const generateMockEvents = (): PumpEvent[] => {
  const events: PumpEvent[] = []
  const now = new Date()

  for (let i = 0; i < 48; i++) {
    const timeOffset = i * 30 * 60 * 1000 // 30 min intervals
    const isON = i % 2 === 0

    events.push({
      id: `event-${i}`,
      timestamp: new Date(now.getTime() - timeOffset),
      type: isON ? "ON" : "OFF",
      waterLevel: isON ? Math.random() * 20 + 10 : Math.random() * 10 + 5,
      duration: isON ? undefined : Math.random() * 45 + 15,
      initiatedBy: Math.random() > 0.7 ? "manual" : "sensor",
    })
  }

  return events.reverse()
}

export const generateChartData = (): ChartData[] => {
  const data: ChartData[] = []
  const hours = ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00"]

  hours.forEach((hour, idx) => {
    data.push({
      time: hour,
      cycles: Math.floor(Math.random() * 8 + 2),
      avgDuration: Math.floor(Math.random() * 35 + 15),
      waterLevel: Math.random() * 30 + 20,
    })
  })

  return data
}
