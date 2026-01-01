"use client"

import { useEffect, useState } from "react"
import { Wifi, WifiOff } from "lucide-react"

export function ESPStatus() {
  const [isConnected, setIsConnected] = useState(false)
  const [ipAddress, setIpAddress] = useState("")

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch("http://localhost:8808/esp-ack")
        if (res.ok) {
          const data = await res.json()
          if (data.isConnected) {
            setIsConnected(true)
            setIpAddress(data.ipAddress)
          } else {
            setIsConnected(false)
            setIpAddress("")
          }
        } else {
          setIsConnected(false)
          setIpAddress("")
        }
      } catch (err) {
        setIsConnected(false)
        setIpAddress("")
      }
    }

    // Fetch initially
    fetchStatus()

    // Poll every 5 seconds
    const interval = setInterval(fetchStatus, 5000)
    return () => clearInterval(interval)
  }, [])

  if (!isConnected) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50">
        <WifiOff className="h-4 w-4 text-red-600 dark:text-red-400" />
        <span className="text-xs font-medium text-red-700 dark:text-red-300">Disconnected</span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900/50">
      <Wifi className="h-4 w-4 text-green-600 dark:text-green-400" />
      <span className="text-xs font-medium text-green-700 dark:text-green-300">{ipAddress}</span>
    </div>
  )
}
