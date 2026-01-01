import { NextResponse } from "next/server"

export async function GET() {
  try {
    // TODO: Get real status from ESP32/database
    const status = {
      pumpStatus: "ON",
      waterLevel: 18.5,
      lastUpdate: new Date().toISOString(),
      signalStrength: 95,
    }

    return NextResponse.json(status)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch status" }, { status: 500 })
  }
}
