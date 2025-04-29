import { NextResponse } from "next/server"
import { getCounter, getConversionRates, getQuestionDropoffRates, getShareMethodDistribution } from "@/lib/analytics"

export async function GET() {
  try {
    // Get basic counters with default values of 0
    const quizStarted = (await getCounter("quiz_started")) || 0
    const quizCompleted = (await getCounter("quiz_completed")) || 0
    const profileViewed = (await getCounter("profile_viewed")) || 0
    const profileShared = (await getCounter("profile_shared")) || 0
    const emailSubmitted = (await getCounter("email_submitted")) || 0

    // Get email sources
    const emailFromModal = (await getCounter("email_source_loading_modal")) || 0
    const emailFromResults = (await getCounter("email_source_results_page")) || 0
    const emailFromOther = emailSubmitted - (emailFromModal + emailFromResults)

    // Get conversion rates
    const conversionRates = await getConversionRates()

    // Get question drop-off rates
    const dropoffRates = await getQuestionDropoffRates()

    // Get share method distribution
    const shareMethodDistribution = await getShareMethodDistribution()

    return NextResponse.json({
      counters: {
        quizStarted,
        quizCompleted,
        profileViewed,
        profileShared,
        emailSubmitted,
      },
      emailSources: {
        modal: emailFromModal,
        results: emailFromResults,
        other: emailFromOther > 0 ? emailFromOther : 0,
      },
      conversionRates,
      dropoffRates,
      shareMethodDistribution,
    })
  } catch (error) {
    console.error("Error fetching analytics:", error)
    // Return empty data structure instead of error
    return NextResponse.json({
      counters: {
        quizStarted: 0,
        quizCompleted: 0,
        profileViewed: 0,
        profileShared: 0,
        emailSubmitted: 0,
      },
      emailSources: {
        modal: 0,
        results: 0,
        other: 0,
      },
      conversionRates: {
        completionRate: 0,
        shareRate: 0,
        emailConversionRate: 0,
        overallConversionRate: 0,
      },
      dropoffRates: {},
      shareMethodDistribution: {},
    })
  }
}
