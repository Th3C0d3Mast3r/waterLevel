"use client"

import { useState, useEffect } from "react"
import { Power, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

const BACKEND_URL = "http://localhost:8808"

export function PumpControl() {
  const [isOn, setIsOn] = useState(false)
  const [waterLevel, setWaterLevel] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Fetch pump state
  const fetchPumpStatus = async () => {
    const res = await fetch(`${BACKEND_URL}/pump/status`)
    const data = await res.json()
    setIsOn(data.state === "ON")
  }

  // Fetch water level (ESP)
  const fetchWaterLevel = async () => {
    const res = await fetch(`${BACKEND_URL}/waterLevel`)
    const data = await res.json()
    if (typeof data.distance === "number") {
      setWaterLevel(data.distance)
    }
  }

  useEffect(() => {
    fetchPumpStatus()
    fetchWaterLevel()

    const interval = setInterval(() => {
      fetchPumpStatus()
      fetchWaterLevel()
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const handleToggle = async () => {
    setIsLoading(true)
    try {
      const res = await fetch(`${BACKEND_URL}/pump/toggle`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          state: isOn ? "OFF" : "ON",
          source: "MANUAL",
          note: "Manual toggle from dashboard"
        })
      })

      const data = await res.json()
      setIsOn(data.state === "ON")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pump Control</CardTitle>
        <CardDescription>Manual control</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex justify-between">
          <span>Status</span>
          <b>{isOn ? "RUNNING" : "STOPPED"}</b>
        </div>

        <div className="flex justify-between">
          <span>Water Level</span>
          <b>{waterLevel !== null ? `${waterLevel.toFixed(1)} cm` : "--"}</b>
        </div>

        {waterLevel !== null && waterLevel > 15 && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Water level high — consider turning pump ON
            </AlertDescription>
          </Alert>
        )}

        <Button
          onClick={handleToggle}
          disabled={isLoading}
          className="w-full"
        >
          <Power className="mr-2 h-4 w-4" />
          {isOn ? "Turn OFF Pump" : "Turn ON Pump"}
        </Button>
      </CardContent>
    </Card>
  )
}
