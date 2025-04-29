"use client"

import { Suspense, useState, useEffect } from "react"
import LoadingQuiz from "@/components/loading-quiz"
import OfflineNotice from "@/components/offline-notice"
import { Sparkles } from "lucide-react"
import Image from "next/image"
import dynamic from "next/dynamic"
import LanguagePrompt from "@/components/language-prompt"
import { useTranslation } from "@/lib/i18n"

// Lazy load the TravelQuiz component
const TravelQuiz = dynamic(() => import("@/components/travel-quiz"), {
  loading: () => <LoadingQuiz />,
})

export default function Home() {
  const { language, setLanguage } = useTranslation()
  const [showLanguagePrompt, setShowLanguagePrompt] = useState(false)

  // Check language preference and detect browser language
  useEffect(() => {
    // First check if user has a saved preference
    const savedLanguage = localStorage.getItem("voyabear_language") as "en" | "zh-TW" | null

    if (savedLanguage) {
      // User has a saved preference, use it
      setLanguage(savedLanguage)
    } else {
      // No saved preference, check browser language
      const browserLang = navigator.language.toLowerCase()
      const isMandarin = browserLang.startsWith("zh")

      // Default to English, but show prompt for Mandarin users
      setLanguage("en")

      // Show language prompt for Mandarin users
      if (isMandarin) {
        // Check if user has dismissed the prompt before
        const promptDismissed = localStorage.getItem("voyabear_lang_prompt_dismissed")
        if (!promptDismissed) {
          setShowLanguagePrompt(true)
        }
      }
    }
  }, [setLanguage])

  // Handle language change
  const handleLanguageChange = (newLanguage: "en" | "zh-TW") => {
    setLanguage(newLanguage)
    localStorage.setItem("voyabear_language", newLanguage)
    setShowLanguagePrompt(false)
  }

  // Handle prompt dismissal
  const handlePromptDismiss = () => {
    setShowLanguagePrompt(false)
    localStorage.setItem("voyabear_lang_prompt_dismissed", "true")
  }

  return (
    <main className="min-h-screen bg-voyabear-light bg-travel-pattern overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-voyabear-primary/10 to-transparent pointer-events-none" />
      <div className="hidden sm:block absolute top-20 left-10 w-16 h-16 opacity-20">
        <Image
          src="/travel-illustrations/airplane.png"
          alt="Airplane"
          width={64}
          height={64}
          className="animate-float"
        />
      </div>
      <div className="hidden sm:block absolute top-40 right-10 w-12 h-12 opacity-20">
        <Image
          src="/travel-illustrations/compass.png"
          alt="Compass"
          width={48}
          height={48}
          className="animate-float-delayed"
        />
      </div>
      <div className="hidden sm:block absolute bottom-20 left-20 w-14 h-14 opacity-20">
        <Image
          src="/travel-illustrations/passport.png"
          alt="Passport"
          width={56}
          height={56}
          className="animate-float"
        />
      </div>
      <div className="hidden sm:block absolute bottom-40 right-20 w-16 h-16 opacity-20">
        <Image src="/travel-illustrations/camera.png" alt="Camera" width={64} height={64} className="animate-float" />
      </div>

      <div className="container mx-auto px-4 py-6 sm:py-12 max-w-4xl relative">
        <div className="absolute -top-6 -left-16 w-32 h-32 bg-voyabear-secondary/20 rounded-full blur-3xl" />
        <div className="absolute top-1/4 -right-20 w-40 h-40 bg-voyabear-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -left-10 w-24 h-24 bg-voyabear-tertiary/20 rounded-full blur-3xl" />

        <header className="text-center mb-8 sm:mb-12 relative">
          <div className="flex justify-center items-center mb-4 sm:mb-6">
            <div className="relative w-24 h-24 sm:w-32 sm:h-32">
              <div className="absolute -inset-4 rounded-full bg-white/50 blur-lg"></div>
              <Image
                src="/voyabear-mascot.png"
                alt="VoyaBear Mascot"
                width={128}
                height={128}
                className="animate-float relative z-10"
              />
              <div className="absolute -bottom-2 w-full h-4 bg-black/10 blur-md rounded-full"></div>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-3 sm:mb-4 relative text-shadow">
            <span className="gradient-text glow-text">
              {language === "zh-TW" ? "找出您的旅行風格" : "Find Your Travel Vibe"}
            </span>
            <span className="absolute -top-6 right-1/4 text-voyabear-primary opacity-20 text-5xl sm:text-7xl animate-float-delayed">
              ✈️
            </span>
            <span className="absolute top-1/2 left-1/4 text-voyabear-secondary opacity-10 text-4xl sm:text-5xl animate-float">
              🧭
            </span>
          </h1>

          <p className="text-base sm:text-lg text-gray-700 mb-4 sm:mb-6 max-w-2xl mx-auto">
            {language === "zh-TW"
              ? "6個快速問題。一個史詩級的旅行檔案。比星座還有趣。😎"
              : "6 quick Qs. One epic travel profile. Way more fun than your horoscope. 😎"}
          </p>

          <div className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white shadow-md text-voyabear-primary text-xs sm:text-sm font-medium mb-6 sm:mb-8 border border-voyabear-primary/10">
            <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 text-voyabear-secondary" />
            <span>{language === "zh-TW" ? "比你前任更聰明的AI" : "AI that's smarter than your ex"}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-10">
            <div className="flex flex-col items-center group">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mb-3 sm:mb-4 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-voyabear-primary/20 to-voyabear-secondary/20 rounded-full blur-lg"></div>
                <div className="relative w-full h-full flex items-center justify-center">
                  <span className="text-4xl sm:text-5xl animate-float">🧠</span>
                </div>
              </div>
              <h3 className="text-sm sm:text-base font-medium text-voyabear-primary mb-1">
                {language === "zh-TW" ? "令人驚嘆的見解" : "Mind-Blowing Insights"}
              </h3>
              <p className="text-xs text-gray-600 text-center max-w-[180px]">
                {language === "zh-TW" ? "發現您獨特的旅行個性" : "Discover your unique travel personality"}
              </p>
            </div>

            <div className="flex flex-col items-center group">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mb-3 sm:mb-4 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-voyabear-secondary/20 to-voyabear-tertiary/20 rounded-full blur-lg"></div>
                <div className="relative w-full h-full flex items-center justify-center">
                  <span className="text-4xl sm:text-5xl animate-float" style={{ animationDelay: "0.2s" }}>
                    🗺️
                  </span>
                </div>
              </div>
              <h3 className="text-sm sm:text-base font-medium text-voyabear-primary mb-1">
                {language === "zh-TW" ? "夢想目的地" : "Dream Destinations"}
              </h3>
              <p className="text-xs text-gray-600 text-center max-w-[180px]">
                {language === "zh-TW" ? "符合您旅行風格的地方" : "Places that match your travel style"}
              </p>
            </div>

            <div className="flex flex-col items-center group">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mb-3 sm:mb-4 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-voyabear-tertiary/20 to-voyabear-primary/20 rounded-full blur-lg"></div>
                <div className="relative w-full h-full flex items-center justify-center">
                  <span className="text-4xl sm:text-5xl animate-float" style={{ animationDelay: "0.4s" }}>
                    ⚡
                  </span>
                </div>
              </div>
              <h3 className="text-sm sm:text-base font-medium text-voyabear-primary mb-1">
                {language === "zh-TW" ? "您的旅行超能力" : "Your Travel Superpower"}
              </h3>
              <p className="text-xs text-gray-600 text-center max-w-[180px]">
                {language === "zh-TW" ? "讓您成為出色旅行者的特質" : "What makes you an amazing traveler"}
              </p>
            </div>
          </div>
        </header>

        <div className="relative z-10">
          <Suspense fallback={<LoadingQuiz />}>
            <TravelQuiz language={language} />
          </Suspense>
        </div>
      </div>

      {/* Language prompt for Mandarin users */}
      {showLanguagePrompt && (
        <LanguagePrompt onAccept={() => handleLanguageChange("zh-TW")} onDismiss={handlePromptDismiss} />
      )}

      <OfflineNotice />
    </main>
  )
}
