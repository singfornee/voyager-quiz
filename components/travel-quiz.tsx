"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Loader2, ArrowRight, Check } from "lucide-react"
import { useRouter } from "next/navigation"
import { generateProfile } from "@/lib/generate-profile"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { analyticsClient, getSessionId } from "@/lib/analytics-client"
// Add import for trackEvent
import { trackEvent } from "@/lib/analytics"
import { trackQuizInteraction, trackConversion } from "@/lib/ga-utils"

// Restored original questions with full descriptive text
const questions = [
  {
    question: "Which of the following would you choose?",
    options: [
      "🌴 Leave me under a palm tree with no schedule",
      "🗺️ Get me lost in side streets and hidden trails",
      "🎟️ Museum hopping, guided tours, history deep-dives",
      "🏙️ Luxury stays, fine dining, rooftop sunsets",
    ],
    emoji: "🤔",
    illustration: "/travel-illustrations/map.png",
  },
  {
    question: "First 24 hours in a new city — what's your move?",
    options: [
      "🍜 Hunt for the best hole-in-the-wall local food",
      "🧭 Drop the bags, walk 10,000 steps without a plan",
      "🎟️ Stack my day with top-rated attractions",
      "🛏️ Order room service and soak in the view",
    ],
    emoji: "🕒",
    illustration: "/travel-illustrations/suitcase.png",
  },
  {
    question: "Which travel trophy would you brag about?",
    options: [
      "🌋 Summited a volcano or climbed a mountain",
      "🐬 Swam with wild dolphins or snorkeled a reef",
      "🎭 Joined a once-in-a-lifetime local festival or sacred ceremony",
      "🏰 Stayed overnight in a medieval castle or hidden historic village",
    ],
    emoji: "🏆",
    illustration: "/travel-illustrations/passport.png",
  },
  {
    question: "If you could put one thing into your magical backpack, what would it be?",
    options: [
      "🎧 Noise-canceling headphones — to stay in my own world when needed",
      "🥾 Trail shoes — to follow wherever the wild paths lead",
      "📸 Endless camera roll storage — every hidden moment captured",
      "📅 A perfectly crafted travel plan — ready for any twist and turn",
    ],
    emoji: "🎒",
    illustration: "/travel-illustrations/backpack.png",
  },
  {
    question: "You win $1,000 to spend on your trip. Where's it going?",
    options: [
      "🍽️ On tasting menus, street food crawls, and night markets",
      "🏖️ Private beaches, sunset cruises, and tropical escapes",
      "🛍️ Local boutiques, handmade crafts, and once-in-a-lifetime souvenirs",
      "🏞️ Adventure tours — hiking, rafting, zip-lining, you name it",
    ],
    emoji: "💰",
    illustration: "/travel-illustrations/world.png",
  },
  {
    question: "Last night of the trip — what's the vibe?",
    options: [
      "🧘 Spa day or slow beach sunset — total recharge",
      "🚀 One last crazy adventure — night hikes, secret boat rides, no regrets",
      "🎨 Cultural night — traditional performance, night market, or art crawl",
      "🏙️ Dress up and toast the trip with rooftop cocktails and skyline views",
    ],
    emoji: "🌙",
    illustration: "/travel-illustrations/camera.png",
  },
  // Additional question from the screenshot
  {
    question: "You're writing your travel memoir. What's the title?",
    options: [
      "The Art of Getting Wonderfully Lost",
      "No Map Needed: Finding Friends Everywhere",
      "First Class All the Way",
      "The Unplanned Itinerary",
    ],
    emoji: "📚",
    illustration: "/travel-illustrations/map.png",
  },
]

export default function TravelQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [swipeDirection, setSwipeDirection] = useState<string | null>(null)
  const touchStartX = useRef<number | null>(null)
  const touchEndX = useRef<number | null>(null)
  const router = useRouter()
  const [sessionId, setSessionId] = useState<string>("")

  // Generate a session ID on component mount
  useEffect(() => {
    const sid = getSessionId()
    setSessionId(sid)

    // Track quiz started event
    analyticsClient.trackEvent("quiz_started", { sessionId: sid })
  }, [])

  // Update the handleOptionSelect function to track option selection
  const handleOptionSelect = (optionIndex: number) => {
    setSelectedOption(optionIndex)
    console.log(`Selected option ${optionIndex} for question ${currentQuestion}`)

    // Track option selection in Google Analytics
    trackQuizInteraction(currentQuestion + 1, "select_option", {
      question: questions[currentQuestion].question,
      option: questions[currentQuestion].options[optionIndex],
      option_index: optionIndex,
    })

    // Add haptic feedback if available
    if (navigator.vibrate) {
      navigator.vibrate(50)
    }
  }

  // Update the handleNextQuestion function to track question navigation
  const handleNextQuestion = async () => {
    if (selectedOption === null) return

    const newAnswers = [...answers, selectedOption]
    setAnswers(newAnswers)
    console.log(`Current answers: ${newAnswers.join(", ")}`)

    // Track question answered event
    analyticsClient.trackEvent("question_answered", {
      sessionId,
      questionIndex: currentQuestion,
    })

    // Track in Google Analytics
    trackQuizInteraction(currentQuestion + 1, "answer_question", {
      question_index: currentQuestion,
      selected_option: selectedOption,
    })

    if (currentQuestion < questions.length - 1) {
      setSelectedOption(null)
      setSwipeDirection("left")
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1)

        // Track next question view in Google Analytics
        trackQuizInteraction(currentQuestion + 2, "view_question", {
          question: questions[currentQuestion + 1].question,
        })
      }, 300)
    } else {
      // All questions answered, generate profile
      setIsSubmitting(true)

      // Track quiz completion in Google Analytics
      trackConversion("quiz_completed", {
        answers: newAnswers.join(","),
      })

      try {
        console.log(`Submitting final answers: ${newAnswers.join(", ")}`)
        const profileId = await generateProfile(newAnswers)

        // Track quiz completed event
        analyticsClient.trackEvent("quiz_completed", {
          sessionId,
          profileId,
        })

        // Track profile generation in Google Analytics
        trackEvent("generate_profile", "quiz_completion", profileId)

        router.push(`/results/${profileId}`)
      } catch (error) {
        console.error("Error generating profile:", error)
        setIsSubmitting(false)

        // Track drop-off due to error
        analyticsClient.trackEvent("question_answered", {
          sessionId,
          questionIndex: currentQuestion,
          dropoffPoint: "error_generating_profile",
        })

        // Track error in Google Analytics
        trackEvent(
          "error",
          "quiz_error",
          `Profile generation error: ${error instanceof Error ? error.message : String(error)}`,
          undefined,
          true,
        )

        alert("Oops! Our AI had a brain freeze. Try again or contact our tech wizards for help.")
      }
    }
  }

  // Save progress to localStorage
  useEffect(() => {
    if (answers.length > 0) {
      localStorage.setItem(
        "voyabear_quiz_progress",
        JSON.stringify({
          currentQuestion,
          answers,
          timestamp: new Date().getTime(),
          sessionId,
        }),
      )
    }
  }, [answers, currentQuestion, sessionId])

  // Load saved progress on initial load
  useEffect(() => {
    const savedProgress = localStorage.getItem("voyabear_quiz_progress")
    if (savedProgress) {
      try {
        const { currentQuestion, answers, timestamp, sessionId: savedSessionId } = JSON.parse(savedProgress)
        // Only restore if less than 24 hours old
        const isRecent = new Date().getTime() - timestamp < 24 * 60 * 60 * 1000

        if (isRecent && answers.length > 0 && currentQuestion < questions.length) {
          setCurrentQuestion(currentQuestion)
          setAnswers(answers)
          if (savedSessionId) {
            setSessionId(savedSessionId)
          }
        } else {
          // Clear old progress
          localStorage.removeItem("voyabear_quiz_progress")
        }
      } catch (e) {
        console.error("Error loading saved progress:", e)
        localStorage.removeItem("voyabear_quiz_progress")
      }
    }
  }, [])

  // Touch event handlers for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX
  }

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return

    const diff = touchStartX.current - touchEndX.current
    const threshold = 100 // Minimum swipe distance

    // If swipe left and we have a selected option, go to next question
    if (diff > threshold && selectedOption !== null) {
      handleNextQuestion()
    }

    // If swipe right and not on first question, go back
    if (diff < -threshold && currentQuestion > 0) {
      setSwipeDirection("right")
      setCurrentQuestion((prev) => prev - 1)
      // Remove the last answer
      setAnswers((prev) => prev.slice(0, -1))
      setSelectedOption(null)
    }

    // Reset touch coordinates
    touchStartX.current = null
    touchEndX.current = null
  }

  const progress = (currentQuestion / questions.length) * 100

  // Fun progress messages
  const getProgressMessage = () => {
    if (progress < 20) return "Just getting started!"
    if (progress < 40) return "You're crushing it!"
    if (progress < 60) return "Halfway there!"
    if (progress < 80) return "Almost done!"
    return "Final question!"
  }

  // Animation variants based on swipe direction
  const variants = {
    enter: (direction: string | null) => ({
      x: direction === "right" ? -300 : 300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: string | null) => ({
      x: direction === "right" ? 300 : -300,
      opacity: 0,
    }),
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span className="bg-white/70 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
            {currentQuestion + 1}/{questions.length}
          </span>
          <span className="bg-white/70 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">{getProgressMessage()}</span>
        </div>
        <div className="h-3 bg-white/50 backdrop-blur-sm rounded-full overflow-hidden shadow-sm">
          <div className="h-full bg-gradient-voyabear progress-bar-animation" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      <AnimatePresence mode="wait" custom={swipeDirection}>
        <motion.div
          key={currentQuestion}
          custom={swipeDirection}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.3, type: "tween" }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="touch-pan-y"
        >
          <Card className="p-4 sm:p-6 shadow-md border-0 bg-white rounded-xl relative overflow-hidden card-glass">
            <div className="absolute top-0 right-0 p-4 text-4xl opacity-20">{questions[currentQuestion].emoji}</div>
            <div className="absolute -bottom-6 -right-6 w-24 h-24 opacity-10">
              <Image
                src={questions[currentQuestion].illustration || "/placeholder.svg"}
                alt="Question illustration"
                width={96}
                height={96}
                className="animate-float"
              />
            </div>

            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6">
              {questions[currentQuestion].question}
            </h2>

            <div className="space-y-2.5 sm:space-y-3">
              {questions[currentQuestion].options.map((option, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className={`w-full justify-start text-left p-3 sm:p-4 h-auto min-h-[3rem] ${
                    selectedOption === index
                      ? "border-voyabear-primary bg-voyabear-light text-voyabear-primary shadow-sm"
                      : "border border-gray-200 hover:border-voyabear-primary hover:bg-voyabear-light/30 hover:text-voyabear-primary"
                  } transition-all rounded-lg group active:scale-[0.98]`}
                  onClick={() => handleOptionSelect(index)}
                  disabled={isSubmitting}
                >
                  <div className="flex items-start w-full">
                    <span
                      className={`mr-2.5 flex-shrink-0 h-5 w-5 sm:h-6 sm:w-6 flex items-center justify-center rounded-full ${
                        selectedOption === index
                          ? "bg-voyabear-primary text-white shadow-sm"
                          : "border border-voyabear-primary text-voyabear-primary group-hover:bg-voyabear-primary/10"
                      } text-xs sm:text-sm transition-all mt-0.5`}
                    >
                      {selectedOption === index ? <Check className="h-3 w-3" /> : String.fromCharCode(65 + index)}
                    </span>
                    <span className="flex-grow text-xs sm:text-sm md:text-base break-words leading-tight sm:leading-normal whitespace-normal">
                      {option}
                    </span>
                  </div>
                </Button>
              ))}
            </div>

            <div className="mt-5 sm:mt-6 flex justify-end">
              <Button
                className={`bg-gradient-voyabear hover:opacity-90 text-white px-4 sm:px-6 py-2 shadow-md w-full sm:w-auto active:scale-[0.98] ${
                  selectedOption === null ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={handleNextQuestion}
                disabled={selectedOption === null || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Analyzing...
                  </>
                ) : currentQuestion === questions.length - 1 ? (
                  <>
                    Show My Results
                    <span className="ml-2">✨</span>
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>

            {currentQuestion > 0 && <p className="text-xs text-gray-500 text-center mt-3">Swipe right to go back</p>}
            {selectedOption !== null && currentQuestion < questions.length - 1 && (
              <p className="text-xs text-gray-500 text-center mt-1">Swipe left to continue</p>
            )}
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
