import AnalyticsDashboard from "@/components/analytics-dashboard"

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-3xl font-bold mb-2 text-voyabear-primary">VoyaBear Analytics</h1>
        <p className="text-gray-600 mb-8">Track user engagement and conversion metrics</p>

        <AnalyticsDashboard />
      </div>
    </div>
  )
}
