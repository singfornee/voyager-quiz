"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import QuizContainer from "@/components/quiz-container"
import { useLanguage } from "@/contexts/language-context"
import LanguageSwitcher from "@/components/language-switcher"
import { analytics } from "@/lib/analytics"
import Image from "next/image"
import { motion } from "framer-motion"
import { Sparkles, ArrowRight } from "lucide-react"

export default function Home() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { language } = useLanguage()
  const [isLoaded, setIsLoaded] = useState(false)

  // Check if quiz should be started (from URL parameter or localStorage)
  const startParam = searchParams.get("start")
  const [quizStarted, setQuizStarted] = useState(false)

  // State to force quiz container to reset
  const [resetKey, setResetKey] = useState(0)

  useEffect(() => {
    setIsLoaded(true)

    // Check if quiz is already started in localStorage
    const quizInProgress = localStorage.getItem("quiz_started") === "true"
    setQuizStarted(startParam === "true" || quizInProgress)

    analytics.track("page_view", { page: "landing" })
  }, [startParam])

  // Function to handle reset when Voyager AI is clicked
  const handleReset = useCallback(() => {
    // Clear quiz state from localStorage
    localStorage.removeItem("quiz_started")
    localStorage.removeItem("quiz_current_question")
    localStorage.removeItem("quiz_answers")
    localStorage.removeItem("quiz_profile")

    // Force re-render of QuizContainer with a new key
    setResetKey((prev) => prev + 1)
    setQuizStarted(false)
  }, [])

  const handleStartQuiz = () => {
    analytics.track("quiz_start", { source: "landing_page" })
    setQuizStarted(true)
    localStorage.setItem("quiz_started", "true")

    // Set current question to 0 to skip the start screen
    localStorage.setItem("quiz_current_question", "0")
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-violet-500 via-purple-400 to-pink-500 overflow-hidden">
      <div className="container max-w-4xl mx-auto px-4 py-6 relative">
        <header className="mb-4">
          <div className="flex justify-between items-center mb-4">
            <div
              className="inline-block animate-float cursor-pointer hover:scale-105 transition-transform"
              onClick={handleReset}
              title="Restart Quiz"
            >
              <div className="flex items-center justify-center bg-white/20 backdrop-blur-sm p-2 sm:p-3 rounded-full">
                <Sparkles className="h-5 w-5 text-white mr-2" />
                <span className="text-white font-bold">Voyager AI</span>
              </div>
            </div>
            <LanguageSwitcher />
          </div>

          {!quizStarted ? (
            // Compact landing page optimized for mobile
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              {/* Main card - much more compact */}
              <motion.div
                initial={{ y: 10 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white/10 backdrop-blur-md rounded-3xl overflow-hidden shadow-xl border border-white/20"
              >
                {/* Top section with image and headline */}
                <div className="relative">
                  {/* Background image */}
                  <div className="relative h-48 overflow-hidden rounded-t-3xl">
                    <Image
                      src="/travel-collage-gen-z.png"
                      alt="Travel collage"
                      fill
                      className="object-cover brightness-75"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-purple-500/30 to-pink-500/70" />
                  </div>

                  {/* Overlay content */}
                  <div className="absolute inset-0 flex flex-col justify-between p-4">
                    {/* Top hashtags */}
                    <div className="flex flex-wrap gap-2 justify-center">
                      <div className="bg-purple-600/80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-center text-sm font-medium shadow-md">
                        #WanderlustVibes
                      </div>
                      <div className="bg-pink-500/80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-center text-sm font-medium shadow-md">
                        #TravelTok
                      </div>
                    </div>

                    {/* Center title */}
                    <div className="text-center">
                      <h1 className="text-white font-bold text-2xl md:text-3xl drop-shadow-md">
                        {language === "zh" ? "找到你的旅行美学" : "Find Your Travel Aesthetic"}
                      </h1>
                      <p className="text-white text-sm md:text-base mt-1 drop-shadow-md">
                        {language === "zh" ? "1分钟测验 · 发现你的旅行风格" : "1-min quiz · Discover your travel style"}
                      </p>
                    </div>

                    {/* Bottom stats */}
                    <div className="flex justify-center items-center">
                      <div className="flex -space-x-2 mr-2">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="w-6 h-6 rounded-full bg-white/30 border border-white/50" />
                        ))}
                      </div>
                      <p className="text-white text-xs">{language === "zh" ? "10,000+ 人已完成" : "10,000+ people"}</p>
                    </div>
                  </div>
                </div>

                {/* Bottom section with CTA */}
                <div className="p-4 bg-white/20 backdrop-blur-md">
                  {/* Quick benefits */}
                  <div className="flex justify-between mb-4">
                    {[
                      { emoji: "🌎", text: language === "zh" ? "旅行个性" : "Travel Style" },
                      { emoji: "📍", text: language === "zh" ? "目的地推荐" : "Top Destinations" },
                      { emoji: "⏱️", text: language === "zh" ? "仅需1分钟" : "Just 1 Minute" },
                    ].map((item, i) => (
                      <div key={i} className="flex flex-col items-center">
                        <div className="text-xl mb-1">{item.emoji}</div>
                        <p className="text-white text-xs">{item.text}</p>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button - prominent and visible without scrolling */}
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleStartQuiz}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all duration-300 text-lg relative overflow-hidden group"
                  >
                    <span className="relative z-10 flex items-center justify-center">
                      {language === "zh" ? "开始测验" : "Start Quiz"}
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <motion.div
                      className="absolute inset-0 bg-white/10"
                      animate={{
                        x: ["100%", "-100%"],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "loop",
                        ease: "linear",
                      }}
                    />
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          ) : (
            // Quiz container - only shown when quiz is started
            <QuizContainer key={resetKey} skipIntro={true} />
          )}
        </header>
      </div>
    </main>
  )
}
