"use client"

import { useEffect, useState } from "react"
import { EventHistory } from "@/components/event-history"
import type { PumpEvent } from "@/lib/types"

const BACKEND_URL = "http://localhost:8808"

export function EventHistoryContainer() {
  const [events, setEvents] = useState<PumpEvent[]>([])
  const [loading, setLoading] = useState(true)

  const fetchEvents = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/pump/activity`)
      const data = await res.json()

      const formatted: PumpEvent[] = data.map((e: any) => ({
        id: e._id,
        type: e.state,
        initiatedBy:
          e.source === "MANUAL" ? "manual" : "sensor",
        timestamp: new Date(e.createdAt),
        waterLevel: e.waterLevel,
        duration: e.duration ?? null
      }))

      setEvents(formatted)
    } catch (err) {
      console.error("Failed to fetch pump activity", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEvents()

    // auto refresh every 10s
    const interval = setInterval(fetchEvents, 10000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return <p className="text-sm text-muted-foreground">Loading events…</p>
  }

  return <EventHistory events={events} />
}
