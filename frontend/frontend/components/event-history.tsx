"use client"

import type { PumpEvent } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Power } from "lucide-react"
import { format, formatDistanceToNow } from "date-fns"

interface EventHistoryProps {
  events: PumpEvent[]
}

export function EventHistory({ events }: EventHistoryProps) {
  const recentEvents = events.slice(-15) // show last 15 events

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Event History</CardTitle>
        <CardDescription>Recent pump on/off events</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 max-h-[500px] overflow-y-auto">
          {recentEvents.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">No events recorded</p>
          ) : (
            recentEvents.map((event) => {
              const createdAtDate = event.createdAt ? new Date(event.createdAt) : null
              return (
                <div
                  key={event.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 smooth-transition"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {/* Icon */}
                    <div
                      className={`p-2 rounded-lg shrink-0 ${
                        event.type === "ON" ? "bg-green-100 dark:bg-green-950" : "bg-red-100 dark:bg-red-950"
                      }`}
                    >
                      <Power
                        className={`h-4 w-4 ${
                          event.type === "ON" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                        }`}
                      />
                    </div>

                    {/* Event Info */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-sm">
                          Pump {event.type === "ON" ? "Turned On" : "Turned Off"}
                        </p>
                        <Badge
                          variant="outline"
                          className={`text-xs whitespace-nowrap ${
                            event.initiatedBy === "sensor"
                              ? "bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800"
                              : "bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800"
                          }`}
                        >
                          {event.initiatedBy === "sensor" ? "Sensor" : "Manual"}
                        </Badge>
                      </div>

                      {/* Time */}
                      <p
                        className="text-xs text-muted-foreground"
                        title={createdAtDate ? format(createdAtDate, "yyyy-MM-dd HH:mm:ss") : ""}
                      >
                        {createdAtDate
                          ? formatDistanceToNow(createdAtDate, { addSuffix: true })
                          : "Unknown time"}
                      </p>
                    </div>
                  </div>

                  {/* Duration & Water Level */}
                  <div className="text-right flex-shrink-0 ml-2">
                    {event.duration != null && (
                      <p className="text-sm font-medium text-primary">{event.duration.toFixed(0)}m</p>
                    )}
                    <p className="text-xs text-muted-foreground">{event.waterLevel.toFixed(1)}cm</p>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </CardContent>
    </Card>
  )
}
export default EventHistory;