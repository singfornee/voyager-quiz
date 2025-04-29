import { NextResponse } from "next/server"
import {
  getCounter,
  getConversionRates,
  getQuestionDropoffRates,
  getShareMethodDistribution,
  getEmailSourceDistribution,
  getCounterWithSource,
} from "@/lib/analytics"

export async function GET() {
  try {
    // Get basic counters with default values of 0
    const quizStarted = (await getCounter("quiz_started")) || 0
    const quizCompleted = (await getCounter("quiz_completed")) || 0
    const profileViewed = (await getCounter("profile_viewed")) || 0
    const profileShared = (await getCounter("profile_shared")) || 0
    const emailSubmitted = (await getCounter("email_submitted")) || 0

    // Get email submissions by source
    const emailSubmittedPopup = (await getCounterWithSource("email_submitted", "loading_modal")) || 0
    const emailSubmittedResults = (await getCounterWithSource("email_submitted", "results_page")) || 0

    // Get conversion rates
    const conversionRates = await getConversionRates()

    // Get question drop-off rates
    const dropoffRates = await getQuestionDropoffRates()

    // Get share method distribution
    const shareMethodDistribution = await getShareMethodDistribution()

    // Get email source distribution
    const emailSourceDistribution = await getEmailSourceDistribution()

    return NextResponse.json({
      counters: {
        quizStarted,
        quizCompleted,
        profileViewed,
        profileShared,
        emailSubmitted,
        emailSubmittedBySource: {
          popup: emailSubmittedPopup,
          resultsPage: emailSubmittedResults,
        },
      },
      conversionRates,
      dropoffRates,
      shareMethodDistribution,
      emailSourceDistribution,
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
        emailSubmittedBySource: {
          popup: 0,
          resultsPage: 0,
        },
      },
      conversionRates: {
        completionRate: 0,
        shareRate: 0,
        emailConversionRate: 0,
        emailPopupConversionRate: 0,
        emailResultsConversionRate: 0,
        overallConversionRate: 0,
      },
      dropoffRates: {},
      shareMethodDistribution: {},
      emailSourceDistribution: {},
    })
  }
}
