import { NextResponse } from "next/server"
import { kv } from "@vercel/kv"

// Analytics keys
const EVENTS_KEY = "voyager:analytics:events"

export async function GET(request: Request) {
  try {
    // Check if KV is available
    const isKVAvailable = process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN

    if (!isKVAvailable) {
      return NextResponse.json(
        {
          error: "Advanced analytics require Vercel KV integration",
          summaryAvailable: false,
        },
        { status: 400 },
      )
    }

    // Get all events (limited to 1000 for performance)
    const events = await kv.lrange(EVENTS_KEY, 0, 999)

    // Get URL parameters
    const url = new URL(request.url)
    const period = url.searchParams.get("period") || "week"

    // Calculate date ranges
    const now = new Date()
    let startDate: Date

    switch (period) {
      case "day":
        startDate = new Date(now)
        startDate.setDate(now.getDate() - 1)
        break
      case "month":
        startDate = new Date(now)
        startDate.setMonth(now.getMonth() - 1)
        break
      case "year":
        startDate = new Date(now)
        startDate.setFullYear(now.getFullYear() - 1)
        break
      case "week":
      default:
        startDate = new Date(now)
        startDate.setDate(now.getDate() - 7)
        break
    }

    // Filter events by date
    const filteredEvents = events.filter((event: any) => {
      const eventDate = new Date(event.timestamp || event.serverTimestamp)
      return eventDate >= startDate
    })

    // Calculate summary statistics
    const summary = {
      period,
      totalEvents: filteredEvents.length,
      eventCounts: countEventsByType(filteredEvents),
      travelerTypes: countTravelerTypes(filteredEvents),
      dailyActivity: getDailyActivity(filteredEvents, period),
      completionRate: calculateCompletionRate(filteredEvents),
      averageTimeToComplete: calculateAverageTimeToComplete(filteredEvents),
    }

    return NextResponse.json(summary)
  } catch (error) {
    console.error("Analytics summary error:", error)
    return NextResponse.json({ error: "Failed to generate analytics summary" }, { status: 500 })
  }
}

// Helper functions for analytics calculations

function countEventsByType(events: any[]) {
  return events.reduce((acc: Record<string, number>, event: any) => {
    const type = event.eventName
    acc[type] = (acc[type] || 0) + 1
    return acc
  }, {})
}

function countTravelerTypes(events: any[]) {
  return events
    .filter((event: any) => event.eventName === "quiz_completed" && event.travelerType)
    .reduce((acc: Record<string, number>, event: any) => {
      const type = event.travelerType
      acc[type] = (acc[type] || 0) + 1
      return acc
    }, {})
}

function getDailyActivity(events: any[], period: string) {
  // Determine how many days to show based on period
  let days = 7
  switch (period) {
    case "day":
      days = 1
      break
    case "week":
      days = 7
      break
    case "month":
      days = 30
      break
    case "year":
      days = 365
      break
  }

  // Get dates for the period
  const dates = Array.from({ length: days }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - i)
    return date.toISOString().split("T")[0]
  }).reverse()

  // Count events per day
  return dates.map((date) => {
    const count = events.filter((event: any) => {
      const eventDate = new Date(event.timestamp || event.serverTimestamp)
      return eventDate.toISOString().split("T")[0] === date
    }).length

    return {
      date,
      count,
      display: new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    }
  })
}

function calculateCompletionRate(events: any[]) {
  const starts = events.filter((event: any) => event.eventName === "quiz_start").length
  const completions = events.filter((event: any) => event.eventName === "quiz_completed").length

  return starts > 0 ? Math.round((completions / starts) * 100) : 0
}

function calculateAverageTimeToComplete(events: any[]) {
  // This is a simplified calculation that would need session tracking for accuracy
  const completions = events.filter((event: any) => event.eventName === "quiz_completed")

  if (completions.length === 0) return null

  // For now, return a placeholder value
  // In a real implementation, you would track start and end times per session
  return {
    averageSeconds: 120, // Placeholder
    note: "This is an estimated value. For accurate timing, implement session tracking.",
  }
}
