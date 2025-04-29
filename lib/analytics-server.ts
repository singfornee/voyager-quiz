"use server"

import { storage } from "./storage"
import { incrementCounter, incrementCounterWithSource } from "./analytics"

// Server-side analytics tracking
export async function trackServerEvent(event: string, data: any): Promise<void> {
  try {
    // Store the event in the database
    const eventKey = `analytics:event:${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
    await storage.set(eventKey, {
      event,
      data,
      timestamp: Date.now(),
    })

    // Check if we have a source for email submissions
    if (event === "email_submitted" && data?.source) {
      // Increment the counter with source
      await incrementCounterWithSource(event, data.source)
    } else {
      // Increment the counter for this event type
      await incrementCounter(event)
    }

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
  } catch (error) {
    console.error("Error tracking server event:", error)
  }
}
