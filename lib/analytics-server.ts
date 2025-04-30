"use server"

import { storage } from "./storage"

// Server-side analytics tracking with improved error handling
export async function trackServerEvent(event: string, data: any): Promise<void> {
  try {
    // Check if storage is available before proceeding
    if (!isStorageAvailable()) {
      console.warn("Storage is not available for analytics tracking")
      return
    }

    // Store the event in the database with a timeout
    const eventKey = `analytics:event:${Date.now()}-${Math.random().toString(36).substring(2, 9)}`

    await Promise.race([
      storage.set(eventKey, {
        event,
        data,
        timestamp: Date.now(),
      }),
      new Promise((_, reject) => setTimeout(() => reject(new Error("Storage operation timed out")), 2000)),
    ])

    // Increment the counter for this event type
    const counterKey = `analytics:counter:${event}`
    const currentCount = (await storage.get<number>(counterKey)) || 0
    await storage.set(counterKey, currentCount + 1)

    // If this is a question_answered event, track the question index
    if (event === "question_answered" && data?.questionIndex !== undefined) {
      const questionKey = `analytics:counter:question_${data.questionIndex}_answered`
      const currentQuestionCount = (await storage.get<number>(questionKey)) || 0
      await storage.set(questionKey, currentQuestionCount + 1)
    }

    // If this is a profile_shared event, track the share method
    if (event === "profile_shared" && data?.shareMethod) {
      const shareMethodKey = `analytics:counter:share_method_${data.shareMethod}`
      const currentShareCount = (await storage.get<number>(shareMethodKey)) || 0
      await storage.set(shareMethodKey, currentShareCount + 1)
    }

    // If this is an email_submitted event, track the source
    if (event === "email_submitted" && data?.source) {
      const sourceKey = `analytics:counter:email_source_${data.source}`
      const currentSourceCount = (await storage.get<number>(sourceKey)) || 0
      await storage.set(sourceKey, currentSourceCount + 1)
    }
  } catch (error) {
    // Log the error but don't let it crash the application
    console.error("Error tracking server event:", error instanceof Error ? error.message : "Unknown error")
  }
}

// Helper function to check if storage is available
function isStorageAvailable(): boolean {
  try {
    // Check if we're in a server environment
    if (typeof window !== "undefined") {
      return false // We're on the client side
    }

    // Check if KV environment variables are set
    const hasKvConfig = !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN)

    return hasKvConfig
  } catch (error) {
    console.error("Error checking storage availability:", error)
    return false
  }
}
