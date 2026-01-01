"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { PumpControl } from "@/components/pump-control"
import { AnalyticsSection } from "@/components/analytics-section"
import { EventHistory } from "@/components/event-history"
import { generateMockEvents, generateChartData } from "@/lib/mock-data"
import type { PumpEvent, ChartData } from "@/lib/types"

export default function DashboardPage() {
  const [events, setEvents] = useState<PumpEvent[]>([])
  const [chartData, setChartData] = useState<ChartData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate data fetching
    const timer = setTimeout(() => {
      setEvents(generateMockEvents())
      setChartData(generateChartData())
      setIsLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  const lastEvent = events[events.length - 1]
  const currentWaterLevel = lastEvent ? lastEvent.waterLevel : 18.5
  const pumpIsOn = lastEvent?.type === "ON"

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-muted/50 rounded-lg animate-pulse" />
            ))}
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Control Section */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <PumpControl isOn={pumpIsOn} waterLevel={currentWaterLevel} />
            </div>

            {/* Key Metrics */}
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-card border border-border/50 space-y-2">
                <p className="text-sm text-muted-foreground">Current Water Level</p>
                <p className="text-3xl font-bold text-primary">
                  {currentWaterLevel.toFixed(1)} <span className="text-lg text-muted-foreground">cm</span>
                </p>
                <div className="h-1 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full smooth-transition ${
                      currentWaterLevel > 15 ? "bg-amber-500" : currentWaterLevel > 10 ? "bg-green-500" : "bg-blue-500"
                    }`}
                    style={{ width: `${Math.min((currentWaterLevel / 30) * 100, 100)}%` }}
                  />
                </div>
              </div>

              <div className="p-4 rounded-lg bg-card border border-border/50 space-y-2">
                <p className="text-sm text-muted-foreground">Total Events Today</p>
                <p className="text-3xl font-bold text-primary">{events.length}</p>
                <p className="text-xs text-muted-foreground">
                  {events.filter((e) => e.type === "ON").length} cycles •{" "}
                  {events.filter((e) => e.type === "OFF").length} stops
                </p>
              </div>
            </div>
          </section>

          {/* Analytics Section */}
          <section>
            <AnalyticsSection data={chartData} />
          </section>

          {/* Event History */}
          <section>
            <EventHistory events={events} />
          </section>
        </div>
      </main>
    </div>
  )
}
