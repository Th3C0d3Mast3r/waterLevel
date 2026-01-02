"use client"

import { useState, useEffect } from "react"
import { Power, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

const BACKEND_URL = "http://localhost:8808"

export function PumpControl() {
  const [isOn, setIsOn] = useState(false)
  const [waterLevel, setWaterLevel] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  // Fetch real pump status from backend
  const fetchPumpStatus = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/pump/status`)
      const data = await res.json()

      setIsOn(data.state === "ON")
      setWaterLevel(data.waterLevel)
    } catch (err) {
      console.error("Failed to fetch pump status:", err)
    }
  }

  // Poll so ESP/manual changes reflect
  useEffect(() => {
    fetchPumpStatus()
    const interval = setInterval(fetchPumpStatus, 3000)
    return () => clearInterval(interval)
  }, [])

  // 🔘 Manual toggle (DB logged)
  const handleToggle = async () => {
    setIsLoading(true)

    const newState = isOn ? "OFF" : "ON"

    try {
      const res = await fetch(`${BACKEND_URL}/pump/toggle`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          state: newState,
          source: "MANUAL",
          waterLevel
        })
      })

      const data = await res.json()

      // Trust backend response
      setIsOn(data.state === "ON")
    } catch (err) {
      console.error("Failed to toggle pump:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-border/50 smooth-transition">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Pump Control</CardTitle>
        <CardDescription>Manual pump override from dashboard</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Status */}
        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
            <span className="text-sm font-medium">Current Status</span>
            <div className="flex items-center gap-2">
              <div
                className={`h-3 w-3 rounded-full ${
                  isOn ? "bg-green-500 shadow-lg shadow-green-500/50" : "bg-gray-400"
                }`}
              />
              <span
                className={`text-sm font-semibold ${
                  isOn ? "text-green-600 dark:text-green-400" : "text-gray-600 dark:text-gray-400"
                }`}
              >
                {isOn ? "RUNNING" : "STOPPED"}
              </span>
            </div>
          </div>

          {/* Water Level */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
            <span className="text-sm font-medium">Water Level</span>
            <span className="font-semibold text-primary">
              {typeof waterLevel === "number" ? waterLevel.toFixed(1) : "--"} cm
            </span>
          </div>
        </div>

        {/* Warning */}
        {waterLevel > 15 && (
          <Alert className="border-amber-500/50 bg-amber-50 dark:bg-amber-950/20">
            <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <AlertDescription className="text-amber-600 dark:text-amber-400 text-xs">
              Water level above threshold. Consider turning pump on.
            </AlertDescription>
          </Alert>
        )}

        {/* Toggle */}
        <Button
          onClick={handleToggle}
          disabled={isLoading}
          size="lg"
          className={`w-full font-semibold ${
            isOn
              ? "bg-red-600 hover:bg-red-700 text-white"
              : "bg-green-600 hover:bg-green-700 text-white"
          }`}
        >
          <Power className="mr-2 h-4 w-4" />
          {isLoading ? "Processing..." : isOn ? "Turn Off Pump" : "Turn On Pump"}
        </Button>
      </CardContent>
    </Card>
  )
}
