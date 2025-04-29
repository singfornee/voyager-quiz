import { NextResponse } from "next/server"
import { trackEvent } from "@/lib/analytics"

export async function POST(request: Request) {
  try {
    const { event, data } = await request.json()

    if (!event) {
      return NextResponse.json({ error: "Event name is required" }, { status: 400 })
    }

    await trackEvent(event, data)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error tracking analytics event:", error)
    return NextResponse.json({ error: "Failed to track event" }, { status: 500 })
  }
}
