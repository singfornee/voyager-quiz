"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import QuizStart from "./quiz-start"
import QuizQuestion from "./quiz-question"
import QuizResults from "./quiz-results"
import { generateTravelProfile } from "@/app/actions/generate-profile"
import { AnimatePresence, motion } from "framer-motion"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { analytics } from "@/lib/analytics"
import { useRouter, useSearchParams } from "next/navigation"
import { useLanguage } from "@/contexts/language-context"
import { getQuestions } from "@/lib/quiz-translations"
import { scrollToTop } from "@/lib/scroll-utils"

export type Answer = {
  questionId: number
  question: string
  answer: string
}

export type TravelProfile = {
  travelerType: string
  description: string
  traits: string[]
  destinations: string[]
  tips: string[]
  preferences?: {
    spontaneity: number
    exploration: number
    luxury: number
    activity: number
    aesthetics: number
    // Environment preferences
    environment: {
      beach: number
      city: number
      mountains: number
      countryside: number
    }
    // Activity preferences (replacing climate)
    activities: {
      cultural: number
      nightlife: number
      adventure: number
      culinary: number
    }
    social?: {
      solo: number
      couple: number
      group: number
      family: number
    }
  }
}

interface QuizContainerProps {
  skipIntro?: boolean
}

export default function QuizContainer({ skipIntro = false }: QuizContainerProps) {
  const { language } = useLanguage()
  const containerRef = useRef<HTMLDivElement>(null)

  // This effect will run when the component is mounted with a new key
  useEffect(() => {
    // If the component is remounted with a new key, we should reset the state
    if (started) {
      setStarted(false)
      setCurrentQuestion(0)
      setAnswers([])
      setProfile(null)
      setPreferences({
        spontaneity: 0,
        exploration: 0,
        luxury: 0,
        activity: 0,
        aesthetics: 0,
        environment: {
          beach: 0,
          city: 0,
          mountains: 0,
          countryside: 0,
        },
        activities: {
          cultural: 0,
          nightlife: 0,
          adventure: 0,
          culinary: 0,
        },
        social: {
          solo: 0,
          couple: 0,
          group: 0,
          family: 0,
        },
      })
    }
  }, [])

  // Get questions based on current language
  const questions = getQuestions(language)

  const [started, setStarted] = useLocalStorage<boolean>("quiz_started", skipIntro)
  const [currentQuestion, setCurrentQuestion] = useLocalStorage<number>("quiz_current_question", 0)
  const [answers, setAnswers] = useLocalStorage<Answer[]>("quiz_answers", [])
  const [profile, setProfile] = useLocalStorage<TravelProfile | null>("quiz_profile", null)
  const [loading, setLoading] = useState(false)
  const [resultKey, setResultKey] = useState(0) // Add a key to force re-render of results
  const [preferences, setPreferences] = useState({
    spontaneity: 0,
    exploration: 0,
    luxury: 0,
    activity: 0,
    aesthetics: 0,
    environment: {
      beach: 0,
      city: 0,
      mountains: 0,
      countryside: 0,
    },
    activities: {
      cultural: 0,
      nightlife: 0,
      adventure: 0,
      culinary: 0,
    },
    social: {
      solo: 0,
      couple: 0,
      group: 0,
      family: 0,
    },
  })

  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // If skipIntro is true, make sure we set started to true
    if (skipIntro && !started) {
      setStarted(true)
    }

    const resultId = searchParams.get("result")
    if (resultId) {
      // Try to load the saved result from localStorage
      try {
        const savedResults = localStorage.getItem("quiz_results")
        if (savedResults) {
          const results = JSON.parse(savedResults)
          const matchingResult = results.find((r: any) => r.id === resultId)
          if (matchingResult && matchingResult.profile && !profile) {
            setProfile(matchingResult.profile)
            setStarted(true)
            // Track result viewed from shared link
            analytics.track("quiz_result_viewed", {
              resultId,
              travelerType: matchingResult.profile.travelerType,
            })

            // Scroll to top when loading a shared result
            window.scrollTo({ top: 0, behavior: "smooth" })
          }
        }
      } catch (error) {
        console.error("Error loading shared result", error)
      }
    }
  }, [searchParams, setProfile, setStarted, profile, skipIntro, started])

  useEffect(() => {
    if (started && !localStorage.getItem("quiz_start_time")) {
      localStorage.setItem("quiz_start_time", Date.now().toString())
    }
  }, [started])

  // Scroll to top when showing results
  useEffect(() => {
    if (profile) {
      // Scroll to top of the container
      if (containerRef.current) {
        containerRef.current.scrollIntoView({ behavior: "smooth", block: "start" })
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" })
      }
    }
  }, [profile])

  const handleStart = () => {
    setStarted(true)
    analytics.track("quiz_start")
  }

  const handleAnswer = (answer: string) => {
    // Make sure we have a valid question before proceeding
    if (currentQuestion >= 0 && currentQuestion < questions.length) {
      const question = questions[currentQuestion]
      const optionIndex = question.options.findIndex((option) => option === answer)

      // Track the answer
      analytics.track("question_answered", {
        questionId: question.id,
        questionText: question.question,
        answer,
        questionIndex: currentQuestion,
        totalQuestions: questions.length,
      })

      // Update preferences based on the selected answer
      if (optionIndex !== -1) {
        if (question.id <= 5) {
          // Original preference questions
          const answerPreferences = question.preferences?.[optionIndex]
          if (answerPreferences) {
            setPreferences((prev) => ({
              ...prev,
              spontaneity: prev.spontaneity + answerPreferences.spontaneity,
              exploration: prev.exploration + answerPreferences.exploration,
              luxury: prev.luxury + answerPreferences.luxury,
              activity: prev.activity + answerPreferences.activity,
              aesthetics: prev.aesthetics + answerPreferences.aesthetics,
            }))
          }
        } else if (question.id === 6) {
          // Environment preference question
          const envPreferences = question.environmentPreferences?.[optionIndex]
          if (envPreferences) {
            setPreferences((prev) => ({
              ...prev,
              environment: {
                beach: prev.environment.beach + envPreferences.beach,
                city: prev.environment.city + envPreferences.city,
                mountains: prev.environment.mountains + envPreferences.mountains,
                countryside: prev.environment.countryside + envPreferences.countryside,
              },
            }))
          }
        } else if (question.id === 7) {
          // Activity preference question (replacing climate)
          const activityPreferences = question.activityPreferences?.[optionIndex]
          if (activityPreferences) {
            setPreferences((prev) => ({
              ...prev,
              activities: {
                cultural: prev.activities.cultural + activityPreferences.cultural,
                nightlife: prev.activities.nightlife + activityPreferences.nightlife,
                adventure: prev.activities.adventure + activityPreferences.adventure,
                culinary: prev.activities.culinary + activityPreferences.culinary,
              },
            }))
          }
        } else if (question.id === 8) {
          // Spending preferences question
          const answerPreferences = question.preferences?.[optionIndex]
          if (answerPreferences) {
            setPreferences((prev) => ({
              ...prev,
              spontaneity: prev.spontaneity + answerPreferences.spontaneity,
              exploration: prev.exploration + answerPreferences.exploration,
              luxury: prev.luxury + answerPreferences.luxury,
              activity: prev.activity + answerPreferences.activity,
              aesthetics: prev.aesthetics + answerPreferences.aesthetics,
            }))
          }
        } else if (question.id === 9) {
          // Social preferences question
          const answerPreferences = question.preferences?.[optionIndex]
          const socialPreferences = question.socialPreferences?.[optionIndex]

          if (answerPreferences) {
            setPreferences((prev) => ({
              ...prev,
              spontaneity: prev.spontaneity + answerPreferences.spontaneity,
              exploration: prev.exploration + answerPreferences.exploration,
              luxury: prev.luxury + answerPreferences.luxury,
              activity: prev.activity + answerPreferences.activity,
              aesthetics: prev.aesthetics + answerPreferences.aesthetics,
              social: {
                ...prev.social,
                solo: (prev.social?.solo || 0) + (socialPreferences?.solo || 0),
                couple: (prev.social?.couple || 0) + (socialPreferences?.couple || 0),
                group: (prev.social?.group || 0) + (socialPreferences?.group || 0),
                family: (prev.social?.family || 0) + (socialPreferences?.family || 0),
              },
            }))
          }
        }
      }

      setAnswers([
        ...answers,
        {
          questionId: question.id,
          question: question.question,
          answer,
        },
      ])

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
      } else {
        handleSubmit()
      }
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      // Normalize preferences to percentages
      const totalOriginalQuestions = 5 // First 5 questions
      const maxScorePerCategory = 100 * totalOriginalQuestions

      const normalizedPreferences = {
        spontaneity: Math.round((preferences.spontaneity / maxScorePerCategory) * 100),
        exploration: Math.round((preferences.exploration / maxScorePerCategory) * 100),
        luxury: Math.round((preferences.luxury / maxScorePerCategory) * 100),
        activity: Math.round((preferences.activity / maxScorePerCategory) * 100),
        aesthetics: Math.round((preferences.aesthetics / maxScorePerCategory) * 100),
        environment: {
          beach: Math.round(preferences.environment.beach),
          city: Math.round(preferences.environment.city),
          mountains: Math.round(preferences.environment.mountains),
          countryside: Math.round(preferences.environment.countryside),
        },
        activities: {
          cultural: Math.round(preferences.activities.cultural),
          nightlife: Math.round(preferences.activities.nightlife),
          adventure: Math.round(preferences.activities.adventure),
          culinary: Math.round(preferences.activities.culinary),
        },
        social: {
          solo: Math.round(preferences.social.solo),
          couple: Math.round(preferences.social.couple),
          group: Math.round(preferences.social.group),
          family: Math.round(preferences.social.family),
        },
      }

      // Pass the current language to the generateTravelProfile function
      const result = await generateTravelProfile(normalizedPreferences, language)

      // Add the preferences to the profile
      const profileWithPreferences = {
        ...result,
        preferences: normalizedPreferences,
      }

      // Generate a unique ID for this result
      const resultId = Math.random().toString(36).substring(2, 10)

      // Save the result with the ID
      try {
        const savedResults = localStorage.getItem("quiz_results") || "[]"
        const results = JSON.parse(savedResults)
        results.push({
          id: resultId,
          timestamp: new Date().toISOString(),
          profile: profileWithPreferences,
        })
        localStorage.setItem("quiz_results", JSON.stringify(results))

        // Update the URL with the result ID without refreshing the page
        window.history.replaceState({}, "", `${window.location.pathname}?result=${resultId}`)
      } catch (error) {
        console.error("Error saving result", error)
      }

      // Track quiz completion
      analytics.track("quiz_completed", {
        resultId,
        travelerType: profileWithPreferences.travelerType,
        questionCount: questions.length,
        timeToComplete:
          (Date.now() - Number.parseInt(localStorage.getItem("quiz_start_time") || Date.now().toString())) / 1000,
      })

      setProfile(profileWithPreferences)
      // Increment the key to force a re-render of the results component
      setResultKey((prev) => prev + 1)
    } catch (error) {
      console.error("Error generating profile:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = useCallback(() => {
    setStarted(false)
    setCurrentQuestion(0)
    setAnswers([])
    setProfile(null)
    setPreferences({
      spontaneity: 0,
      exploration: 0,
      luxury: 0,
      activity: 0,
      aesthetics: 0,
      environment: {
        beach: 0,
        city: 0,
        mountains: 0,
        countryside: 0,
      },
      activities: {
        cultural: 0,
        nightlife: 0,
        adventure: 0,
        culinary: 0,
      },
      social: {
        solo: 0,
        couple: 0,
        group: 0,
        family: 0,
      },
    })

    // Track quiz reset
    analytics.track("quiz_reset")

    // Don't remove the saved results, just the current quiz state
    localStorage.removeItem("quiz_started")
    localStorage.removeItem("quiz_current_question")
    localStorage.removeItem("quiz_answers")
    localStorage.removeItem("quiz_profile")
  }, [setStarted, setCurrentQuestion, setAnswers, setProfile])

  const handleShowResults = useCallback(() => {
    // Scroll to top before showing results
    scrollToTop()
  }, [])

  return (
    <div ref={containerRef}>
      <AnimatePresence mode="wait">
        {!started ? (
          <motion.div
            key="start"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <QuizStart onStart={handleStart} />
          </motion.div>
        ) : profile ? (
          <motion.div
            key={`results-${resultKey}`} // Use the key to force re-render
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <QuizResults profile={profile} onReset={handleReset} />
          </motion.div>
        ) : (
          <motion.div
            key={`question-${currentQuestion}`}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            {/* Add a check to ensure we have a valid question */}
            {currentQuestion >= 0 && currentQuestion < questions.length ? (
              <QuizQuestion
                question={questions[currentQuestion]}
                onAnswer={handleAnswer}
                progress={(currentQuestion / questions.length) * 100}
                loading={loading}
              />
            ) : (
              <div className="p-6 text-center">
                <div className="bg-red-50 text-red-800 p-4 rounded-lg mb-4">
                  <p>Error loading question. Please try again.</p>
                </div>
                <button
                  onClick={handleReset}
                  className="px-6 py-3 bg-violet-600 text-white rounded-lg font-medium hover:bg-violet-700 transition-colors"
                >
                  Restart Quiz
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
