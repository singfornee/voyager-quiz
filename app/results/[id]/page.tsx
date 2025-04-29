"use client"

import { notFound } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { analyticsClient, getSessionId } from "@/lib/analytics-client"
import LoadingResults from "@/components/loading-results"
import { useTranslation } from "@/lib/i18n"
import { getResultsTranslations } from "@/lib/results-translations"

export default function ResultsPage({ params }) {
  const { language } = useTranslation()
  const t = getResultsTranslations(language)

  const [profileData, setProfileData] = useState(null)
  const [cityImages, setCityImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [imagesLoading, setImagesLoading] = useState(true)

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch(`/api/profile/${params.id}`)
        if (!response.ok) {
          throw new Error("Profile not found")
        }

        const data = await response.json()
        setProfileData(data)

        analyticsClient.trackEvent("profile_viewed", {
          sessionId: getSessionId(),
          profileId: params.id,
        })
      } catch (error) {
        console.error("Error fetching profile:", error)
        notFound()
      } finally {
        setLoading(false)
      }
    }

    fetchProfileData()
  }, [params.id])

  if (loading) {
    return <LoadingResults />
  }

  if (!profileData) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-voyabear-light py-4 sm:py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        <Link
          href="/"
          className="inline-flex items-center text-voyabear-primary hover:text-voyabear-dark mb-4 sm:mb-6 transition-colors bg-white/50 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full shadow-sm text-sm"
        >
          <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
          {language === "zh-TW" ? "再試一次？" : "Try again?"}
        </Link>

        <header className="text-center mb-6 sm:mb-10">
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-4 sm:mb-5">
            <span className="gradient-text">{t.pageTitle}</span>
          </h1>

          <div className="inline-block bg-gradient-voyabear text-white px-4 py-2 sm:px-6 sm:py-3 rounded-full text-lg sm:text-xl md:text-2xl font-semibold mb-3 sm:mb-4 shadow-lg">
            {profileData.profileName}
          </div>

          <p className="text-gray-700 max-w-2xl mx-auto text-sm sm:text-base">{t.heroText}</p>
        </header>

        <Card className="p-4 sm:p-8 bg-white border-0 shadow-md rounded-xl mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-voyabear-primary mb-4">{t.personalitySection.title}</h2>

          <Separator className="my-4" />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-8">
            <Card className="p-3 sm:p-5 border-0 shadow-sm">
              <h3 className="text-base sm:text-lg font-medium text-voyabear-primary mb-2">
                {t.personalitySection.animalTitle}
              </h3>
              <p className="text-gray-700 text-sm sm:text-base">
                {profileData.animal ? profileData.animal.name : ""}:
                {profileData.animal ? profileData.animal.reason : ""}
              </p>
            </Card>
          </div>
        </Card>

        <footer className="text-center text-gray-600 text-xs sm:text-sm mt-8 sm:mt-12">
          <p>
            © {new Date().getFullYear()} VoyaBear. {t.footer}
          </p>
        </footer>
      </div>
    </main>
  )
}
