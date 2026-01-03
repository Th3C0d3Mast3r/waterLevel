"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { PumpControl } from "@/components/pump-control"
import { AnalyticsSection } from "@/components/analytics-section"
import { EventHistoryContainer } from "@/components/eventHistoryContainer"
import { generateMockEvents, generateChartData } from "@/lib/mock-data"
import type { PumpEvent, ChartData } from "@/lib/types"

export default function DashboardPage() {
  // existing mock states
  const [events,setEvents]=useState<PumpEvent[]>([])
  const [chartData,setChartData]=useState<ChartData[]>([])
  const [isLoading,setIsLoading]=useState(true)

  // NEW: real water level states
  const [currentWaterLevel,setCurrentWaterLevel]=useState<number|null>(null)
  const [isFetchingWater,setIsFetchingWater]=useState(true)

  // mock data loading (unchanged)
  useEffect(()=>{
    const timer=setTimeout(()=>{
      setEvents(generateMockEvents())
      setChartData(generateChartData())
      setIsLoading(false)
    },500)

    return()=>clearTimeout(timer)
  },[])

  // NEW: fetch real water level from backend
  useEffect(()=>{
    const fetchWaterLevel=async()=>{
      try{
        const res=await fetch("http://localhost:8808/water-level")
        if(!res.ok) throw new Error("Backend not reachable")

        const data=await res.json()

        if(typeof data.distance==="number"){
          setCurrentWaterLevel(data.distance)
          setIsFetchingWater(false)
        }else{
          setIsFetchingWater(true)
        }
      }catch(err){
        setIsFetchingWater(true)
      }
    }

    fetchWaterLevel()
    const interval=setInterval(fetchWaterLevel,5000)
    return()=>clearInterval(interval)
  },[])

  const lastEvent=events[events.length-1]
  const pumpIsOn=lastEvent?.type==="ON"

  if(isLoading){
    return(
      <div className="min-h-screen bg-background">
        <Header/>
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(3)].map((_,i)=>(
              <div key={i} className="h-32 bg-muted/50 rounded-lg animate-pulse"/>
            ))}
          </div>
        </main>
      </div>
    )
  }

  return(
    <div className="min-h-screen bg-background">
      <Header/>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Control Section */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <PumpControl
                isOn={pumpIsOn}
                waterLevel={currentWaterLevel??0}
              />
            </div>

            {/* Key Metrics */}
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-card border border-border/50 space-y-2">
                <p className="text-sm text-muted-foreground">
                  Current Water Level
                </p>

                <p className="text-3xl font-bold text-primary">
                  {isFetchingWater||currentWaterLevel===null ? (
                    <span className="text-lg text-muted-foreground">
                      Trying to Fetch Water
                    </span>
                  ) : (
                    <>
                      {currentWaterLevel.toFixed(1)}{" "}
                      <span className="text-lg text-muted-foreground">cm</span>
                    </>
                  )}
                </p>

                <div className="h-1 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full smooth-transition ${
                      currentWaterLevel!==null&&currentWaterLevel>15
                        ?"bg-amber-500"
                        :currentWaterLevel!==null&&currentWaterLevel>10
                        ?"bg-green-500"
                        :"bg-blue-500"
                    }`}
                    style={{
                      width:currentWaterLevel!==null
                        ?`${Math.min((currentWaterLevel/30)*100,100)}%`
                        :"0%"
                    }}
                  />
                </div>
              </div>

              <div className="p-4 rounded-lg bg-card border border-border/50 space-y-2">
                <p className="text-sm text-muted-foreground">
                  Total Events Today
                </p>
                <p className="text-3xl font-bold text-primary">
                  {events.length}
                </p>
                <p className="text-xs text-muted-foreground">
                  {events.filter(e=>e.type==="ON").length} cycles •{" "}
                  {events.filter(e=>e.type==="OFF").length} stops
                </p>
              </div>
            </div>
          </section>

          {/* Analytics Section */}
          <section>
            <AnalyticsSection data={chartData}/>
          </section>

          {/* Event History */}
          <section>
            <EventHistoryContainer/>
          </section>
        </div>
      </main>
    </div>
  )
}
