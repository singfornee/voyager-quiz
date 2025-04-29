"use server"

import { storage } from "./storage"

// Define analytics event types
export type AnalyticsEvent =
  | "quiz_started"
  | "question_answered"
  | "quiz_completed"
  | "profile_viewed"
  | "profile_shared"
  | "email_submitted"

// Define event data structure
export interface EventData {
  timestamp: number
  sessionId: string
  questionIndex?: number
  profileId?: string
  shareMethod?: string
  dropoffPoint?: string
}

// Google Analytics event tracking
export async function trackEvent(
  action: string,
  category: string,
  label?: string,
  value?: number,
  nonInteraction?: boolean,
  customDimensions?: Record<string, string | number | boolean>,
) {
  // This is a server action, but it's trying to access window
  // Let's modify this to be server-side only
  // Client-side tracking should be handled separately
  return // Just return for now to avoid errors
}

// Increment a counter
export async function incrementCounter(key: string): Promise<void> {
  try {
    const counterKey = `analytics:counter:${key}`
    const currentValue = (await storage.get<number>(counterKey)) || 0
    await storage.set(counterKey, currentValue + 1)
  } catch (error) {
    console.error(`Error incrementing counter ${key}:`, error)
  }
}

// Get a counter value
export async function getCounter(key: string): Promise<number> {
  try {
    const counterKey = `analytics:counter:${key}`
    return (await storage.get<number>(counterKey)) || 0
  } catch (error) {
    console.error(`Error getting counter ${key}:`, error)
    return 0
  }
}

// Get conversion rates
export async function getConversionRates(): Promise<Record<string, number>> {
  const quizStarted = await getCounter("quiz_started")
  const quizCompleted = await getCounter("quiz_completed")
  const profileViewed = await getCounter("profile_viewed")
  const profileShared = await getCounter("profile_shared")
  const emailSubmitted = await getCounter("email_submitted")

  return {
    completionRate: quizStarted ? (quizCompleted / quizStarted) * 100 : 0,
    shareRate: profileViewed ? (profileShared / profileViewed) * 100 : 0,
    emailConversionRate: profileViewed ? (emailSubmitted / profileViewed) * 100 : 0,
    overallConversionRate: quizStarted ? (emailSubmitted / quizStarted) * 100 : 0,
  }
}

// Get question drop-off rates
export async function getQuestionDropoffRates(): Promise<Record<number, number>> {
  const dropoffRates: Record<number, number> = {}
  const quizStarted = await getCounter("quiz_started")

  if (!quizStarted) return dropoffRates

  for (let i = 0; i < 6; i++) {
    const answered = await getCounter(`question_${i}_answered`)
    const nextAnswered = (await getCounter(`question_${i + 1}_answered`)) || 0

    if (i === 0) {
      // First question drop-off (from quiz start)
      dropoffRates[i] = ((quizStarted - answered) / quizStarted) * 100
    } else if (i < 5) {
      // Middle questions drop-off
      const prevAnswered = await getCounter(`question_${i - 1}_answered`)
      if (prevAnswered) {
        dropoffRates[i] = ((prevAnswered - answered) / prevAnswered) * 100
      }
    } else {
      // Last question to completion drop-off
      dropoffRates[i] = ((answered - (await getCounter("quiz_completed"))) / answered) * 100
    }
  }

  return dropoffRates
}

// Get share method distribution
export async function getShareMethodDistribution(): Promise<Record<string, number>> {
  const methods = ["facebook", "twitter", "linkedin", "email", "copy", "download"]
  const distribution: Record<string, number> = {}
  const totalShares = await getCounter("profile_shared")

  if (!totalShares) return distribution

  for (const method of methods) {
    const count = await getCounter(`share_method_${method}`)
    distribution[method] = totalShares ? (count / totalShares) * 100 : 0
  }

  return distribution
}

// Reset all analytics (for testing)
export async function resetAnalytics(): Promise<void> {
  // This would be implemented with proper authentication in production
  // For now, just a placeholder
  console.warn("Analytics reset functionality would require authentication")
}
