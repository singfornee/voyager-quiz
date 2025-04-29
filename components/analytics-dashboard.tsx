"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Loader2, BarChart, TrendingDown, Users, Share2, Mail } from "lucide-react"

interface AnalyticsData {
  counters: {
    quizStarted: number
    quizCompleted: number
    profileViewed: number
    profileShared: number
    emailSubmitted: number
    emailSubmittedBySource: {
      popup: number
      resultsPage: number
    }
  }
  conversionRates: {
    completionRate: number
    shareRate: number
    emailConversionRate: number
    emailPopupConversionRate: number
    emailResultsConversionRate: number
    overallConversionRate: number
  }
  dropoffRates: Record<number, number>
  shareMethodDistribution: Record<string, number>
  emailSourceDistribution: Record<string, number>
}

export default function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/analytics")
        if (!response.ok) {
          throw new Error("Failed to fetch analytics data")
        }
        const analyticsData = await response.json()
        setData(analyticsData)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-voyabear-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center p-8 bg-red-50 rounded-lg border border-red-200">
        <p className="text-red-500">Error loading analytics: {error}</p>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="text-center p-8">
        <p>No analytics data available</p>
      </div>
    )
  }

  // Format percentage with 1 decimal place
  const formatPercent = (value: number | null | undefined) => {
    if (value === null || value === undefined) return "0.0%"
    return `${value.toFixed(1)}%`
  }

  // Get color based on conversion rate
  const getConversionColor = (rate: number | null | undefined) => {
    if (rate === null || rate === undefined) return "text-gray-500"
    if (rate >= 70) return "text-green-500"
    if (rate >= 40) return "text-yellow-500"
    return "text-red-500"
  }

  // Analyze the funnel and identify issues
  const analyzeFunnel = () => {
    const issues = []
    if (!data || !data.conversionRates) return issues

    const { completionRate, shareRate, emailConversionRate, emailPopupConversionRate } = data.conversionRates

    // Check quiz completion rate
    if (completionRate !== undefined && completionRate < 50) {
      issues.push({
        area: "Quiz Completion",
        issue: "Low quiz completion rate",
        suggestion: "Consider shortening the quiz or making questions more engaging",
      })
    }

    // Check for specific question drop-offs
    if (data.dropoffRates) {
      const highDropoffQuestions = Object.entries(data.dropoffRates)
        .filter(([_, rate]) => rate !== undefined && rate > 20)
        .map(([q, rate]) => Number.parseInt(q))

      if (highDropoffQuestions.length > 0) {
        issues.push({
          area: "Question Drop-off",
          issue: `High drop-off at question(s) ${highDropoffQuestions.map((q) => q + 1).join(", ")}`,
          suggestion: "Review these questions for clarity and engagement",
        })
      }
    }

    // Check sharing rate
    if (shareRate !== undefined && shareRate < 15) {
      issues.push({
        area: "Result Sharing",
        issue: "Low share rate",
        suggestion: "Make results more shareable or add incentives for sharing",
      })
    }

    // Check email conversion
    if (emailConversionRate !== undefined && emailConversionRate < 10) {
      issues.push({
        area: "Email Collection",
        issue: "Low email submission rate",
        suggestion: "Improve the value proposition for joining the mailing list",
      })
    }

    // Check popup email conversion
    if (emailPopupConversionRate !== undefined && emailPopupConversionRate < 20) {
      issues.push({
        area: "Popup Email Collection",
        issue: "Low popup email submission rate",
        suggestion: "Improve the popup design or messaging to increase conversions",
      })
    }

    return issues
  }

  const issues = analyzeFunnel()

  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid grid-cols-5 mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="funnel">Conversion Funnel</TabsTrigger>
          <TabsTrigger value="dropoff">Drop-off Analysis</TabsTrigger>
          <TabsTrigger value="sharing">Sharing Analysis</TabsTrigger>
          <TabsTrigger value="email">Email Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-4 bg-white shadow-sm border-0">
              <div className="flex items-center space-x-2 mb-3">
                <Users className="h-5 w-5 text-voyabear-primary" />
                <h3 className="font-medium">Quiz Started</h3>
              </div>
              <p className="text-3xl font-bold">{data?.counters?.quizStarted || 0}</p>
            </Card>

            <Card className="p-4 bg-white shadow-sm border-0">
              <div className="flex items-center space-x-2 mb-3">
                <BarChart className="h-5 w-5 text-voyabear-secondary" />
                <h3 className="font-medium">Quiz Completed</h3>
              </div>
              <p className="text-3xl font-bold">{data?.counters?.quizCompleted || 0}</p>
              <p className={`text-sm ${getConversionColor(data?.conversionRates?.completionRate)}`}>
                {formatPercent(data?.conversionRates?.completionRate)} completion rate
              </p>
            </Card>

            <Card className="p-4 bg-white shadow-sm border-0">
              <div className="flex items-center space-x-2 mb-3">
                <Share2 className="h-5 w-5 text-voyabear-accent" />
                <h3 className="font-medium">Profiles Shared</h3>
              </div>
              <p className="text-3xl font-bold">{data?.counters?.profileShared || 0}</p>
              <p className={`text-sm ${getConversionColor(data?.conversionRates?.shareRate)}`}>
                {formatPercent(data?.conversionRates?.shareRate)} share rate
              </p>
            </Card>

            <Card className="p-4 bg-white shadow-sm border-0">
              <div className="flex items-center space-x-2 mb-3">
                <Mail className="h-5 w-5 text-voyabear-tertiary" />
                <h3 className="font-medium">Email Signups</h3>
              </div>
              <p className="text-3xl font-bold">{data?.counters?.emailSubmitted || 0}</p>
              <p className={`text-sm ${getConversionColor(data?.conversionRates?.emailConversionRate)}`}>
                {formatPercent(data?.conversionRates?.emailConversionRate)} conversion
              </p>
            </Card>
          </div>

          <Card className="p-6 bg-white shadow-sm border-0">
            <h3 className="text-lg font-medium mb-4">Overall Conversion</h3>
            <div className="flex items-center space-x-4">
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="bg-gradient-voyabear h-4 rounded-full"
                  style={{ width: `${Math.min(data?.conversionRates?.overallConversionRate || 0, 100)}%` }}
                ></div>
              </div>
              <span className={`font-medium ${getConversionColor(data?.conversionRates?.overallConversionRate)}`}>
                {formatPercent(data?.conversionRates?.overallConversionRate)}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-2">Quiz start to email signup conversion rate</p>
          </Card>
        </TabsContent>

        <TabsContent value="funnel" className="space-y-4">
          <Card className="p-6 bg-white shadow-sm border-0">
            <h3 className="text-lg font-medium mb-4">Conversion Funnel</h3>
            <div className="space-y-4">
              <div className="relative pt-1">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-voyabear-light text-voyabear-primary">
                      Quiz Started
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold inline-block text-voyabear-primary">
                      {data?.counters?.quizStarted || 0}
                    </span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-voyabear-primary h-3 rounded-full" style={{ width: "100%" }}></div>
                </div>
              </div>

              <div className="relative pt-1">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-voyabear-light text-voyabear-primary">
                      Quiz Completed
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold inline-block text-voyabear-primary">
                      {data?.counters?.quizCompleted || 0} ({formatPercent(data?.conversionRates?.completionRate)})
                    </span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-voyabear-primary h-3 rounded-full"
                    style={{
                      width: `${((data?.counters?.quizCompleted || 0) / (data?.counters?.quizStarted || 1)) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div className="relative pt-1">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-voyabear-light text-voyabear-tertiary">
                      Email Popup Signup
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold inline-block text-voyabear-tertiary">
                      {data?.counters?.emailSubmittedBySource?.popup || 0} (
                      {formatPercent(data?.conversionRates?.emailPopupConversionRate)})
                    </span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-voyabear-tertiary h-3 rounded-full"
                    style={{
                      width: `${((data?.counters?.emailSubmittedBySource?.popup || 0) / (data?.counters?.quizCompleted || 1)) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div className="relative pt-1">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-voyabear-light text-voyabear-primary">
                      Profile Viewed
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold inline-block text-voyabear-primary">
                      {data?.counters?.profileViewed || 0} (
                      {formatPercent(((data?.counters?.profileViewed || 0) / (data?.counters?.quizStarted || 1)) * 100)}
                      )
                    </span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-voyabear-primary h-3 rounded-full"
                    style={{
                      width: `${((data?.counters?.profileViewed || 0) / (data?.counters?.quizStarted || 1)) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div className="relative pt-1">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-voyabear-light text-voyabear-primary">
                      Profile Shared
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold inline-block text-voyabear-primary">
                      {data?.counters?.profileShared || 0} ({formatPercent(data?.conversionRates?.shareRate)})
                    </span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-voyabear-primary h-3 rounded-full"
                    style={{
                      width: `${((data?.counters?.profileShared || 0) / (data?.counters?.quizStarted || 1)) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div className="relative pt-1">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-voyabear-light text-voyabear-tertiary">
                      Results Page Email
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold inline-block text-voyabear-tertiary">
                      {data?.counters?.emailSubmittedBySource?.resultsPage || 0} (
                      {formatPercent(data?.conversionRates?.emailResultsConversionRate)})
                    </span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-voyabear-tertiary h-3 rounded-full"
                    style={{
                      width: `${((data?.counters?.emailSubmittedBySource?.resultsPage || 0) / (data?.counters?.profileViewed || 1)) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="dropoff" className="space-y-4">
          <Card className="p-6 bg-white shadow-sm border-0">
            <h3 className="text-lg font-medium mb-4">Question Drop-off Analysis</h3>
            <div className="space-y-4">
              {Object.entries(data?.dropoffRates || {}).map(([questionIndex, rate]) => (
                <div key={questionIndex} className="relative pt-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-voyabear-light text-voyabear-primary">
                        Question {Number.parseInt(questionIndex) + 1}
                      </span>
                    </div>
                    <div className="text-right">
                      <span
                        className={`text-xs font-semibold inline-block ${rate > 20 ? "text-red-500" : "text-gray-600"}`}
                      >
                        {formatPercent(rate)} drop-off
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`${rate > 20 ? "bg-red-500" : "bg-amber-500"} h-3 rounded-full`}
                      style={{ width: `${rate}%` }}
                    ></div>
                  </div>
                  {rate > 20 && (
                    <p className="text-xs text-red-500 mt-1">
                      <TrendingDown className="h-3 w-3 inline mr-1" />
                      High drop-off detected! Consider reviewing this question.
                    </p>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="sharing" className="space-y-4">
          <Card className="p-6 bg-white shadow-sm border-0">
            <h3 className="text-lg font-medium mb-4">Share Method Distribution</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(data?.shareMethodDistribution || {}).map(([method, percentage]) => (
                <div key={method} className="relative pt-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-voyabear-light text-voyabear-primary">
                        {method.charAt(0).toUpperCase() + method.slice(1)}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold inline-block text-voyabear-primary">
                        {formatPercent(percentage)}
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-voyabear-secondary h-3 rounded-full" style={{ width: `${percentage}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="email" className="space-y-4">
          <Card className="p-6 bg-white shadow-sm border-0">
            <h3 className="text-lg font-medium mb-4">Email Signup Sources</h3>
            <div className="grid grid-cols-1 gap-4">
              {Object.entries(data?.emailSourceDistribution || {}).map(([source, percentage]) => {
                // Format the source name for display
                const sourceName =
                  source === "loading_modal"
                    ? "Popup Modal"
                    : source === "results_page"
                      ? "Results Page"
                      : source.charAt(0).toUpperCase() + source.slice(1)

                return (
                  <div key={source} className="relative pt-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-voyabear-light text-voyabear-tertiary">
                          {sourceName}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-semibold inline-block text-voyabear-tertiary">
                          {(data?.counters?.emailSubmittedBySource && data.counters.emailSubmittedBySource[source]) ||
                            0}{" "}
                          ({formatPercent(percentage)})
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-voyabear-tertiary h-3 rounded-full" style={{ width: `${percentage}%` }}></div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="mt-6">
              <h4 className="text-md font-medium mb-3">Email Conversion Rates</h4>
              <div className="space-y-4">
                <div className="relative pt-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-voyabear-light text-voyabear-primary">
                        Popup Modal Conversion
                      </span>
                    </div>
                    <div className="text-right">
                      <span
                        className={`text-xs font-semibold inline-block ${getConversionColor(data?.conversionRates?.emailPopupConversionRate)}`}
                      >
                        {formatPercent(data?.conversionRates?.emailPopupConversionRate)}
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`bg-gradient-voyabear h-3 rounded-full`}
                      style={{ width: `${Math.min(data?.conversionRates?.emailPopupConversionRate || 0, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Percentage of users who completed the quiz and submitted their email in the popup
                  </p>
                </div>

                <div className="relative pt-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-voyabear-light text-voyabear-primary">
                        Results Page Conversion
                      </span>
                    </div>
                    <div className="text-right">
                      <span
                        className={`text-xs font-semibold inline-block ${getConversionColor(data?.conversionRates?.emailResultsConversionRate)}`}
                      >
                        {formatPercent(data?.conversionRates?.emailResultsConversionRate)}
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`bg-gradient-voyabear h-3 rounded-full`}
                      style={{ width: `${Math.min(data?.conversionRates?.emailResultsConversionRate || 0, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Percentage of users who viewed their profile and submitted their email on the results page
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {issues.length > 0 && (
        <Card className="p-6 bg-white shadow-sm border-0">
          <h3 className="text-lg font-medium mb-4">Improvement Suggestions</h3>
          <div className="space-y-4">
            {issues.map((issue, index) => (
              <div key={index} className="bg-amber-50 border border-amber-200 rounded-md p-4">
                <h4 className="font-medium text-amber-800 mb-1">
                  {issue.area}: {issue.issue}
                </h4>
                <p className="text-amber-700 text-sm">{issue.suggestion}</p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
