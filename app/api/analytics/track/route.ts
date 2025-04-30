import { NextResponse } from "next/server"
import { trackServerEvent } from "@/lib/analytics-server"

export async function POST(request: Request) {
  try {
    // Add a timeout for parsing the request body
    const bodyPromise = request.json()
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("Request parsing timed out")), 3000)
    })

    const body = (await Promise.race([bodyPromise, timeoutPromise])) as any
    const { event, data } = body

    if (!event) {
      return NextResponse.json({ error: "Event name is required" }, { status: 400 })
    }

    // Track the event but don't await it to avoid blocking the response
    trackServerEvent(event, data).catch((error) => {
      console.error("Background analytics tracking error:", error)
    })

    // Return success immediately
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in analytics API route:", error instanceof Error ? error.message : "Unknown error")

    // Return a 200 status even on error to prevent client retries
    // This is analytics data, so we prioritize user experience over data accuracy
    return NextResponse.json(
      {
        success: false,
        message: "Analytics recorded with errors",
      },
      { status: 200 },
    )
  }
}
