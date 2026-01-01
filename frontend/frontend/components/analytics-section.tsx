"use client"

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { ChartData } from "@/lib/types"

interface AnalyticsSectionProps {
  data: ChartData[]
}

export function AnalyticsSection({ data }: AnalyticsSectionProps) {
  const totalCycles = data.reduce((sum, item) => sum + item.cycles, 0)
  const avgDuration = Math.round(data.reduce((sum, item) => sum + item.avgDuration, 0) / data.length)
  const avgWaterLevel = Math.round(data.reduce((sum, item) => sum + item.waterLevel, 0) / data.length)

  const stats = [
    { label: "Total Cycles (24h)", value: totalCycles, unit: "" },
    { label: "Avg Cycle Duration", value: avgDuration, unit: "min" },
    { label: "Avg Water Level", value: avgWaterLevel, unit: "cm" },
  ]

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-border/50">
            <CardContent className="pt-6">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-3xl font-bold text-primary">
                  {stat.value}
                  <span className="text-lg ml-1 text-muted-foreground">{stat.unit}</span>
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Pump Cycles Over Time</CardTitle>
            <CardDescription>24-hour cycle frequency</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="time" stroke="var(--color-muted-foreground)" style={{ fontSize: "12px" }} />
                <YAxis stroke="var(--color-muted-foreground)" style={{ fontSize: "12px" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "var(--color-foreground)" }}
                />
                <Bar dataKey="cycles" fill="var(--color-chart-1)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Cycle Duration & Water Level</CardTitle>
            <CardDescription>Average metrics per time period</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="time" stroke="var(--color-muted-foreground)" style={{ fontSize: "12px" }} />
                <YAxis stroke="var(--color-muted-foreground)" style={{ fontSize: "12px" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "var(--color-foreground)" }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="avgDuration"
                  stroke="var(--color-chart-1)"
                  dot={false}
                  strokeWidth={2}
                  name="Duration (min)"
                />
                <Line
                  type="monotone"
                  dataKey="waterLevel"
                  stroke="var(--color-chart-2)"
                  dot={false}
                  strokeWidth={2}
                  name="Water Level (cm)"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
