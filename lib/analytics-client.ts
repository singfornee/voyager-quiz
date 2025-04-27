/**
 * Client-side analytics tracking utility
 */

// Track an analytics event
export async function trackEvent(eventName: string, eventData: Record<string, any> = {}) {
  try {
    // Don't track events during development if needed
    if (process.env.NODE_ENV === "development" && process.env.NEXT_PUBLIC_DISABLE_ANALYTICS === "true") {
      console.log("Analytics tracking disabled in development")
      return
    }

    // Prepare the event data
    const event = {
      eventName,
      timestamp: new Date().toISOString(),
      ...eventData,
    }

    // Send the event to the analytics API
    const response = await fetch("/api/analytics", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(event),
    })

    if (!response.ok) {
      throw new Error(`Analytics API returned ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    // Fail silently in production, log in development
    if (process.env.NODE_ENV === "development") {
      console.error("Failed to track analytics event:", error)
    }
    return { success: false }
  }
}

// Common event tracking functions
export const Analytics = {
  // Track quiz start
  trackQuizStart: (data = {}) => trackEvent("quiz_start", data),

  // Track quiz completion
  trackQuizCompleted: (travelerType: string, data = {}) => trackEvent("quiz_completed", { travelerType, ...data }),

  // Track question answered
  trackQuestionAnswered: (questionId: number, answer: string, data = {}) =>
    trackEvent("question_answered", { questionId, answer, ...data }),

  // Track result shared
  trackShare: (platform: string, travelerType: string, data = {}) =>
    trackEvent("result_shared", { platform, travelerType, ...data }),

  // Track email subscription
  trackSubscription: (email: string, data = {}) =>
    trackEvent("email_subscribed", { email: email.substring(0, 3) + "***", ...data }),

  // Track challenge sent
  trackChallengeSent: (recipientEmail: string, data = {}) =>
    trackEvent("challenge_sent", { recipient: recipientEmail.substring(0, 3) + "***", ...data }),

  // Track page view
  trackPageView: (page: string, data = {}) => trackEvent("page_view", { page, ...data }),
}
