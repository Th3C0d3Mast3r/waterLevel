import { NextResponse } from "next/server"
import { generateMockEvents } from "@/lib/mock-data"

export async function GET() {
  try {
    // TODO: Fetch real events from database
    const events = generateMockEvents()

    return NextResponse.json({
      events,
      total: events.length,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 })
  }
}
