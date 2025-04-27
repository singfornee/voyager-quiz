"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  AlertCircle,
  RefreshCw,
  Calendar,
  BarChart,
  Database,
  HardDrive,
  MemoryStickIcon as Memory,
  Clock,
  Share2,
  Users,
  Mail,
} from "lucide-react"

export default function AnalyticsDashboard() {
  const [analyticsData, setAnalyticsData] = useState<{ events: any[] }>({ events: [] })
  const [summaryData, setSummaryData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [timeframe, setTimeframe] = useState<"all" | "day" | "week" | "month">("week")
  const [storageType, setStorageType] = useState<"kv" | "file" | "memory" | "unknown">("unknown")

  async function fetchAnalytics() {
    setLoading(true)
    setError(null)

    try {
      // Fetch basic analytics
      const res = await fetch("/api/analytics")
      if (!res.ok) {
        throw new Error(`Failed to fetch analytics: ${res.status}`)
      }
      const data = await res.json()
      setAnalyticsData(data)

      // Determine storage type based on response headers
      const storageHeader = res.headers.get("X-Storage-Type")
      if (storageHeader) {
        setStorageType(storageHeader as any)
      }

      // Try to fetch summary data if we're using KV
      if (storageHeader === "kv") {
        try {
          const summaryRes = await fetch(`/api/analytics/summary?period=${timeframe}`)
          if (summaryRes.ok) {
            const summaryData = await summaryRes.json()
            setSummaryData(summaryData)
          }
        } catch (summaryErr) {
          console.warn("Could not fetch summary data:", summaryErr)
        }
      }
    } catch (err: any) {
      console.error("Error fetching analytics:", err)
      setError(err.message || "An unknown error occurred")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalytics()

    // Refresh data every 60 seconds
    const interval = setInterval(fetchAnalytics, 60000)
    return () => clearInterval(interval)
  }, [timeframe])

  // Filter events based on timeframe
  const filteredEvents = analyticsData.events.filter((event) => {
    if (timeframe === "all") return true

    const eventDate = new Date(event.timestamp || event.serverTimestamp)
    const now = new Date()

    if (timeframe === "day") {
      return eventDate.toDateString() === now.toDateString()
    }

    if (timeframe === "week") {
      const weekAgo = new Date()
      weekAgo.setDate(now.getDate() - 7)
      return eventDate >= weekAgo
    }

    if (timeframe === "month") {
      const monthAgo = new Date()
      monthAgo.setMonth(now.getMonth() - 1)
      return eventDate >= monthAgo
    }

    return true
  })

  // Use summary data if available, otherwise calculate from filtered events
  const quizStarts =
    summaryData?.eventCounts?.quiz_start || filteredEvents.filter((event) => event.eventName === "quiz_start").length

  const quizCompletions =
    summaryData?.eventCounts?.quiz_completed ||
    filteredEvents.filter((event) => event.eventName === "quiz_completed").length

  const shares =
    summaryData?.eventCounts?.result_shared ||
    filteredEvents.filter((event) => event.eventName === "result_shared").length

  const subscriptions =
    summaryData?.eventCounts?.email_subscribed ||
    filteredEvents.filter((event) => event.eventName === "email_subscribed").length

  const completionRate =
    summaryData?.completionRate || (quizStarts > 0 ? Math.round((quizCompletions / quizStarts) * 100) : 0)

  // Get traveler types distribution
  const travelerTypes =
    summaryData?.travelerTypes ||
    filteredEvents
      .filter((event) => event.eventName === "quiz_completed" && event.travelerType)
      .reduce((acc: Record<string, number>, event) => {
        const type = event.travelerType
        acc[type] = (acc[type] || 0) + 1
        return acc
      }, {})

  // Get daily activity
  const dailyActivity =
    summaryData?.dailyActivity ||
    Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split("T")[0]

      const count = filteredEvents.filter((event) => {
        const eventDate = new Date(event.timestamp || event.serverTimestamp)
        return eventDate.toISOString().split("T")[0] === dateStr
      }).length

      return {
        date: dateStr,
        display: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        count,
      }
    }).reverse()

  // Storage type icon
  const StorageIcon = () => {
    switch (storageType) {
      case "kv":
        return <Database className="h-4 w-4" />
      case "file":
        return <HardDrive className="h-4 w-4" />
      case "memory":
        return <Memory className="h-4 w-4" />
      default:
        return null
    }
  }

  // Storage type label
  const storageLabel = {
    kv: "Upstash Redis Database",
    file: "Local File Storage",
    memory: "In-Memory Storage",
    unknown: "Storage",
  }[storageType]

  return (
    <div className="container mx-auto p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex rounded-md overflow-hidden border">
            <Button
              variant={timeframe === "all" ? "default" : "ghost"}
              onClick={() => setTimeframe("all")}
              className="rounded-none"
            >
              All Time
            </Button>
            <Button
              variant={timeframe === "day" ? "default" : "ghost"}
              onClick={() => setTimeframe("day")}
              className="rounded-none"
            >
              Today
            </Button>
            <Button
              variant={timeframe === "week" ? "default" : "ghost"}
              onClick={() => setTimeframe("week")}
              className="rounded-none"
            >
              Week
            </Button>
            <Button
              variant={timeframe === "month" ? "default" : "ghost"}
              onClick={() => setTimeframe("month")}
              className="rounded-none"
            >
              Month
            </Button>
          </div>

          <Button onClick={fetchAnalytics} disabled={loading} variant="outline" className="flex items-center gap-2">
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {storageType !== "unknown" && (
        <div className="mb-6 flex items-center gap-2 text-sm text-gray-500">
          <StorageIcon />
          <span>Using {storageLabel}</span>
          {storageType === "kv" && (
            <span className="ml-1 px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-xs">
              Enhanced Analytics Available
            </span>
          )}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6 flex items-start gap-2">
          <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium">Error loading analytics</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      {loading && !error ? (
        <div className="p-8 text-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading analytics data...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Quiz Starts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{quizStarts}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Users className="h-4 w-4 text-green-500" />
                  Completions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{quizCompletions}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Completion Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{completionRate}%</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Share2 className="h-4 w-4" />
                  Shares
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{shares}</div>
                {subscriptions > 0 && (
                  <div className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                    <Mail className="h-3 w-3" />
                    <span>{subscriptions} email subscriptions</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart className="h-5 w-5" />
                  Traveler Types Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                {Object.keys(travelerTypes).length > 0 ? (
                  <ul className="space-y-2">
                    {Object.entries(travelerTypes)
                      .sort((a, b) => b[1] - a[1])
                      .map(([type, count]) => (
                        <li key={type} className="flex justify-between items-center">
                          <span>{type}</span>
                          <div className="flex items-center gap-2">
                            <div
                              className="bg-blue-100 h-4 rounded-full"
                              style={{
                                width: `${Math.max(20, Math.min(200, count * 10))}px`,
                              }}
                            ></div>
                            <span className="font-medium w-8 text-right">{count}</span>
                          </div>
                        </li>
                      ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No traveler type data available yet</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Daily Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] flex items-end justify-between gap-1">
                  {dailyActivity.map((day, i) => (
                    <div key={i} className="flex flex-col items-center flex-1">
                      <div
                        className="bg-blue-500 w-full rounded-t-sm"
                        style={{
                          height: `${Math.max(4, (day.count / Math.max(...dailyActivity.map((d) => d.count), 1)) * 150)}px`,
                        }}
                      ></div>
                      <div className="text-xs mt-2 text-gray-600">{day.display}</div>
                      <div className="text-xs font-medium">{day.count}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredEvents.length > 0 ? (
                <ul className="space-y-2">
                  {filteredEvents
                    .slice(-10)
                    .reverse()
                    .map((event, index) => (
                      <li key={index} className="text-sm flex justify-between">
                        <span className="font-medium">{event.eventName}</span>
                        <span className="text-gray-500">
                          {new Date(event.timestamp || event.serverTimestamp).toLocaleString()}
                        </span>
                      </li>
                    ))}
                </ul>
              ) : (
                <p className="text-gray-500">No activity data available for the selected timeframe</p>
              )}
            </CardContent>
          </Card>
        </>
      )}

      <div className="text-sm text-gray-500 mt-8">
        <p>Note: This dashboard is now powered by Upstash Redis database storage.</p>
        <p>Your analytics data is now reliably stored and can be queried by different time periods.</p>
      </div>
    </div>
  )
}
