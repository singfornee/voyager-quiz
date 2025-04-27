// lib/analytics.ts

// Simple analytics service for tracking user interactions

type EventData = Record<string, any>
type UserData = Record<string, any>

class Analytics {
  private userId: string | null = null
  private sessionId: string
  private userData: UserData = {}
  private sessionStartTime: number = Date.now()

  constructor() {
    this.sessionId = this.generateSessionId()
    this.setupSessionTracking()
  }

  private generateSessionId(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  }

  private setupSessionTracking(): void {
    // Only run in browser environment
    if (typeof window === "undefined") return

    // Track session start
    this.track("session_start", {
      timestamp: new Date().toISOString(),
      referrer: document.referrer || "direct",
      userAgent: navigator.userAgent,
    })

    // Store session start time
    this.sessionStartTime = Date.now()

    // Create a named handler function that can be removed later if needed
    const handleBeforeUnload = () => {
      this.track("session_end", {
        timestamp: new Date().toISOString(),
        sessionDuration: Date.now() - this.getSessionStartTime(),
      })
    }

    // Track session end on page unload
    window.addEventListener("beforeunload", handleBeforeUnload)
  }

  private getSessionStartTime(): number {
    return this.sessionStartTime
  }

  // Track events
  public track(eventName: string, data: EventData = {}): void {
    // Combine event data with user and session info
    const eventData = {
      ...data,
      eventName,
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      userId: this.userId,
    }

    // Log to console for development
    console.log("Analytics event:", eventData)

    // Send to our API endpoint
    if (typeof window !== "undefined") {
      fetch("/api/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventData),
        // Use keepalive to ensure the request completes even if the page is unloading
        keepalive: true,
      }).catch((err) => console.error("Failed to send analytics:", err))

      // Add Google Analytics tracking
      if (typeof window.gtag === "function") {
        window.gtag("event", eventName, {
          ...data,
          event_category: "quiz",
          event_label: data.travelerType || "",
          value: data.timeToComplete ? Math.round(data.timeToComplete) : undefined,
          non_interaction: eventName === "page_view",
        })
      } else {
        console.warn("Google Analytics not loaded (gtag function not available)")
      }
    }
  }

  // Identify a user
  public identify(userId: string, userData: UserData = {}): void {
    this.userId = userId
    this.userData = { ...this.userData, ...userData }

    // Track the identify event
    this.track("user_identify", {
      ...userData,
      timestamp: new Date().toISOString(),
    })
  }
}

// Create a singleton instance
export const analytics = new Analytics()
