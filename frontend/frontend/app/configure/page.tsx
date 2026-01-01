"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { ESPConnectionForm } from "@/components/esp-connection-form"

export default function ConfigurePage() {
  const router = useRouter()
  const [isConnected, setIsConnected] = useState(false)

  const handleConnectionSuccess = () => {
    setIsConnected(true)
    // Route to dashboard after successful connection
    setTimeout(() => {
      router.push("/")
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-12">
          {/* Hero Section */}
          <div className="space-y-4 text-center">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-primary/10 mx-auto">
              <svg className="h-8 w-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-foreground">Configure ESP32</h2>
            <p className="text-base text-muted-foreground max-w-md mx-auto">
              Connect your IoT device to start managing your water system. Enter the IP address of your ESP32 and
              establish a connection.
            </p>
          </div>

          {/* Connection Form */}
          <div className="flex justify-center">
            <div className="w-full max-w-md">
              <ESPConnectionForm isConnected={isConnected} onSuccess={handleConnectionSuccess} />
            </div>
          </div>

          {/* Info Section */}
          {!isConnected && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-8">
              <div className="p-4 rounded-lg bg-card border border-border/50 space-y-3">
                <h3 className="text-sm font-semibold text-foreground">Finding Your ESP32 IP</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Check your router's connected devices list or use a network scanner tool to find your ESP32's local IP
                  address (typically starts with 192.168.x.x).
                </p>
              </div>

              <div className="p-4 rounded-lg bg-card border border-border/50 space-y-3">
                <h3 className="text-sm font-semibold text-foreground">Connection Requirements</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Ensure your ESP32 is powered on and connected to the same network as this device. The device should be
                  running the water management firmware.
                </p>
              </div>
            </div>
          )}

          {/* Success State */}
          {isConnected && (
            <div className="space-y-4 text-center">
              <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-green-100 dark:bg-green-950 mx-auto animate-pulse">
                <svg className="h-10 w-10 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-foreground">Connection Established</h3>
              <p className="text-sm text-muted-foreground">Redirecting to dashboard...</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
