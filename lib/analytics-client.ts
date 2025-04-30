"use client"

// Client-side wrapper for analytics with improved error handling
export const analyticsClient = {
  async trackEvent(event: string, data: any): Promise<void> {
    try {
      // Add a timeout to the fetch request to prevent hanging
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 3000) // 3 second timeout

      const response = await fetch("/api/analytics/track", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          event,
          data,
        }),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        console.warn(`Analytics tracking failed with status: ${response.status}`)
        // Still consider this non-critical - don't throw
      }
    } catch (error) {
      // Log the error but don't let it affect the user experience
      console.warn("Analytics tracking error (non-critical):", error instanceof Error ? error.message : "Unknown error")

      // Optionally, queue failed events for retry later
      queueFailedEvent(event, data)
    }
  },
}

// Simple in-memory queue for failed events
// In a production app, this could use IndexedDB or localStorage for persistence
const failedEventsQueue: Array<{ event: string; data: any }> = []

function queueFailedEvent(event: string, data: any): void {
  // Only queue important events and limit queue size
  if (failedEventsQueue.length < 20) {
    failedEventsQueue.push({ event, data })
    console.log(`Event queued for retry: ${event}`)
  }
}

// Helper to generate a session ID
export function generateSessionId(): string {
  return Math.random().toString(36).substring(2, 15)
}

// Helper to get or create a session ID
export function getSessionId(): string {
  if (typeof window === "undefined") return "server-side"

  let sessionId = localStorage.getItem("voyabear_session_id")
  if (!sessionId) {
    sessionId = generateSessionId()
    localStorage.setItem("voyabear_session_id", sessionId)
  }
  return sessionId
}

// Retry failed events - could be called periodically or on reconnect
export function retryFailedEvents(): void {
  if (failedEventsQueue.length === 0) return

  console.log(`Retrying ${failedEventsQueue.length} failed analytics events`)

  // Take a copy of the queue and clear it
  const eventsToRetry = [...failedEventsQueue]
  failedEventsQueue.length = 0

  // Try to send each event
  eventsToRetry.forEach(({ event, data }) => {
    analyticsClient.trackEvent(event, data)
  })
}

// Check for online status and retry events when back online
if (typeof window !== "undefined") {
  window.addEventListener("online", () => {
    console.log("Back online, retrying failed analytics events")
    retryFailedEvents()
  })
}
