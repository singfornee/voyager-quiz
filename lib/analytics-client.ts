"use client"

// Client-side wrapper for analytics
export const analyticsClient = {
  async trackEvent(event: string, data: any): Promise<void> {
    try {
      await fetch("/api/analytics/track", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          event,
          data,
        }),
      })
    } catch (error) {
      console.error("Error tracking analytics event:", error)
    }
  },
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
