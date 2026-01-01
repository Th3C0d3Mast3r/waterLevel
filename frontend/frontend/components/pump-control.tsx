"use client"

import { useState } from "react"
import { Power, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface PumpControlProps {
  isOn: boolean
  waterLevel: number
}

export function PumpControl({ isOn: initialIsOn, waterLevel }: PumpControlProps) {
  const [isOn, setIsOn] = useState(initialIsOn)
  const [isLoading, setIsLoading] = useState(false)

  const handleToggle = async () => {
    setIsLoading(true)
    // Simulate API call to ESP32
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsOn(!isOn)
    setIsLoading(false)
  }

  return (
    <Card className="border-border/50 smooth-transition">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Pump Control</CardTitle>
        <CardDescription>Manual pump override from your laptop</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
            <span className="text-sm font-medium">Current Status</span>
            <div className="flex items-center gap-2">
              <div
                className={`h-3 w-3 rounded-full smooth-transition ${
                  isOn ? "bg-green-500 shadow-lg shadow-green-500/50" : "bg-gray-400"
                }`}
              />
              <span
                className={`text-sm font-semibold ${isOn ? "text-green-600 dark:text-green-400" : "text-gray-600 dark:text-gray-400"}`}
              >
                {isOn ? "RUNNING" : "STOPPED"}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
            <span className="text-sm font-medium">Water Level</span>
            <span className="font-semibold text-primary">{waterLevel.toFixed(1)} cm</span>
          </div>
        </div>

        {waterLevel > 15 && (
          <Alert className="border-amber-500/50 bg-amber-50 dark:bg-amber-950/20">
            <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <AlertDescription className="text-amber-600 dark:text-amber-400 text-xs">
              Water level above threshold. Consider turning pump on.
            </AlertDescription>
          </Alert>
        )}

        <Button
          onClick={handleToggle}
          disabled={isLoading}
          size="lg"
          className={`w-full font-semibold smooth-transition ${
            isOn ? "bg-red-600 hover:bg-red-700 text-white" : "bg-green-600 hover:bg-green-700 text-white"
          }`}
        >
          <Power className="mr-2 h-4 w-4" />
          {isLoading ? "Processing..." : isOn ? "Turn Off Pump" : "Turn On Pump"}
        </Button>
      </CardContent>
    </Card>
  )
}
