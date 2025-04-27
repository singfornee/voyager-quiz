"use client"
import { Card, CardContent } from "@/components/ui/card"
import type React from "react"

import { Progress } from "@/components/ui/progress"
import { useState } from "react"
import { motion } from "framer-motion"
import { useLanguage } from "@/contexts/language-context"
// First, let's add imports for the icons we'll need for questions 1-4
import {
  Calendar,
  Compass,
  Map,
  Camera,
  Globe,
  Zap,
  Sparkles,
  MapPin,
  Palette,
  BookOpen,
  Hotel,
  Home,
  Search,
  Clock,
  CameraIcon,
  Coffee,
} from "lucide-react"

interface QuizQuestionProps {
  question: {
    id: number
    question: string
    options: string[]
  }
  onAnswer: (answer: string) => void
  progress: number
  loading: boolean
}

export default function QuizQuestion({ question, onAnswer, progress, loading }: QuizQuestionProps) {
  const { t, language } = useLanguage()
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)

  // Add error handling for undefined question
  if (!question || !question.id) {
    return (
      <Card className="w-full rounded-3xl overflow-hidden shadow-2xl border-0 glassmorphism">
        <CardContent className="p-6 text-center">
          <div className="bg-red-50 text-red-800 p-4 rounded-lg mb-4">
            <p>{language === "zh" ? "加載問題時出錯。請再試一次。" : "Error loading question. Please try again."}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const handleSelect = (index: number, option: string) => {
    setSelectedOption(index)
    // Add a small delay for better UX
    setTimeout(() => {
      onAnswer(option)
      setSelectedOption(null)
    }, 400)
  }

  // Loading messages that cycle through
  const loadingMessages =
    language === "zh"
      ? [
          { title: "分析你的旅行風格", subtitle: "尋找最適合你的目的地" },
          { title: "探索你的個性特點", subtitle: "匹配理想的旅行體驗" },
          { title: "創建你的旅行檔案", subtitle: "精心策劃個性化推薦" },
          { title: "繪製你的偏好地圖", subtitle: "為你解鎖隱藏的寶藏" },
          { title: "即將完成", subtitle: "最終確定你的旅行檔案" },
        ]
      : [
          { title: "Analyzing your travel style", subtitle: "Finding your perfect destinations" },
          { title: "Discovering your personality", subtitle: "Matching with ideal experiences" },
          { title: "Creating your profile", subtitle: "Curating personalized recommendations" },
          { title: "Mapping your preferences", subtitle: "Unlocking hidden gems for you" },
          { title: "Almost there", subtitle: "Finalizing your travel profile" },
        ]

  // Check if this is the activity question (question 7)
  const isActivityQuestion = question.id === 7
  // Check if this is the environment question (question 6)
  const isEnvironmentQuestion = question.id === 6
  // Check if this is the spending question (question 8)
  const isSpendingQuestion = question.id === 8
  // Check if this is the social question (question 9)
  const isSocialQuestion = question.id === 9

  // Translated environment types for display
  const environmentTypes = {
    en: ["Beach", "Urban", "Mountains", "Countryside"],
    zh: ["海灘", "城市", "山脈", "鄉村"],
  }

  // Translated activity types for display
  const activityTypes = {
    en: ["Museums & Culture", "Bars & Nightlife", "Adventure & Sports", "Food & Dining"],
    zh: ["博物館和文化", "酒吧和夜生活", "冒險和運動", "美食和餐飲"],
  }

  // Spending types for display
  const spendingTypes = {
    en: ["Accommodations", "Food & Dining", "Activities", "Shopping"],
    zh: ["住宿", "美食餐飲", "活動體驗", "購物"],
  }

  // Social types for display
  const socialTypes = {
    en: ["Solo", "Couple", "Friends", "Family"],
    zh: ["獨自", "伴侶", "朋友", "家人"],
  }

  // Icons for spending types
  const spendingIcons = ["🏨", "🍽️", "🎭", "🛍️"]

  // Icons for social types
  const socialIcons = ["🧳", "💑", "👯", "👨‍👩‍👧"]

  // Background images for spending types
  const bgImagesSpending = [
    "bg-gradient-to-br from-blue-500/90 to-indigo-600/90",
    "bg-gradient-to-br from-amber-500/90 to-orange-600/90",
    "bg-gradient-to-br from-emerald-500/90 to-green-600/90",
    "bg-gradient-to-br from-pink-500/90 to-rose-600/90",
  ]

  // Background images for social types
  const bgImagesSocial = [
    "bg-gradient-to-br from-violet-500/90 to-purple-600/90",
    "bg-gradient-to-br from-rose-500/90 to-pink-600/90",
    "bg-gradient-to-br from-amber-500/90 to-yellow-600/90",
    "bg-gradient-to-br from-teal-500/90 to-emerald-600/90",
  ]

  // NEW: Define icons, backgrounds, and display text for questions 1-4
  const getQuestionData = (questionId: number, index: number) => {
    // Icons for each question's options
    const icons: Record<number, React.ReactNode[]> = {
      1: [
        <Calendar className="h-5 w-5" key={index} />,
        <Zap className="h-5 w-5" key={index} />,
        <Compass className="h-5 w-5" key={index} />,
        <Camera className="h-5 w-5" key={index} />,
      ],
      2: [
        <Hotel className="h-5 w-5" key={index} />,
        <Home className="h-5 w-5" key={index} />,
        <Palette className="h-5 w-5" key={index} />,
        <MapPin className="h-5 w-5" key={index} />,
      ],
      3: [
        <Search className="h-5 w-5" key={index} />,
        <Compass className="h-5 w-5" key={index} />,
        <Map className="h-5 w-5" key={index} />,
        <Globe className="h-5 w-5" key={index} />,
      ],
      4: [
        <Clock className="h-5 w-5" key={index} />,
        <Coffee className="h-5 w-5" key={index} />,
        <Sparkles className="h-5 w-5" key={index} />,
        <Zap className="h-5 w-5" key={index} />,
      ],
      5: [
        <CameraIcon className="h-5 w-5" key={index} />,
        <BookOpen className="h-5 w-5" key={index} />,
        <Palette className="h-5 w-5" key={index} />,
        <Sparkles className="h-5 w-5" key={index} />,
      ],
    }

    // Emojis for each question's options
    const emojis: Record<number, string[]> = {
      1: ["📅", "⚡", "🧭", "📱"],
      2: ["🏨", "🛏️", "📸", "🏙️"],
      3: ["⭐", "🔍", "🗺️", "📱"],
      4: ["⏱️", "☕", "✨", "🌊"],
      5: ["🗿", "🌆", "📸", "🤳"],
    }

    // Background gradients for each question's options
    const gradients: Record<number, string[]> = {
      1: [
        "bg-gradient-to-br from-blue-500/90 to-indigo-600/90",
        "bg-gradient-to-br from-orange-500/90 to-amber-600/90",
        "bg-gradient-to-br from-violet-500/90 to-purple-600/90",
        "bg-gradient-to-br from-pink-500/90 to-rose-600/90",
      ],
      2: [
        "bg-gradient-to-br from-indigo-500/90 to-blue-600/90",
        "bg-gradient-to-br from-emerald-500/90 to-green-600/90",
        "bg-gradient-to-br from-fuchsia-500/90 to-pink-600/90",
        "bg-gradient-to-br from-amber-500/90 to-yellow-600/90",
      ],
      3: [
        "bg-gradient-to-br from-sky-500/90 to-blue-600/90",
        "bg-gradient-to-br from-lime-500/90 to-green-600/90",
        "bg-gradient-to-br from-amber-500/90 to-orange-600/90",
        "bg-gradient-to-br from-rose-500/90 to-pink-600/90",
      ],
      4: [
        "bg-gradient-to-br from-red-500/90 to-orange-600/90",
        "bg-gradient-to-br from-teal-500/90 to-cyan-600/90",
        "bg-gradient-to-br from-violet-500/90 to-indigo-600/90",
        "bg-gradient-to-br from-amber-500/90 to-yellow-600/90",
      ],
      5: [
        "bg-gradient-to-br from-blue-500/90 to-sky-600/90",
        "bg-gradient-to-br from-emerald-500/90 to-green-600/90",
        "bg-gradient-to-br from-fuchsia-500/90 to-pink-600/90",
        "bg-gradient-to-br from-amber-500/90 to-orange-600/90",
      ],
    }

    return {
      icon: icons[questionId]?.[index] || <Globe className="h-5 w-5" />,
      emoji: emojis[questionId]?.[index] || "✈️",
      gradient: gradients[questionId]?.[index] || "bg-gradient-to-br from-violet-500/90 to-purple-600/90",
      displayText: question.options[index],
    }
  }

  return (
    <Card className="w-full rounded-3xl overflow-hidden shadow-2xl border-0 glassmorphism">
      <CardContent className="p-6">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-medium text-violet-600">
              {t.quiz.questionPrefix} {question.id} {t.quiz.ofQuestions} 9
            </p>
            <p className="text-sm font-medium text-violet-600">
              {Math.round(progress)}% {t.quiz.complete}
            </p>
          </div>
          <Progress value={progress} className="h-3 bg-violet-100 rounded-full">
            <div className="h-full bg-gradient-to-r from-violet-600 to-pink-500 rounded-full"></div>
          </Progress>
        </div>

        <h2 className="text-2xl font-bold mb-8">{question.question}</h2>

        {/* Use card-based format for ALL questions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {question.options.map((option, index) => {
            const isSelected = selectedOption === index
            const isHovered = hoverIndex === index

            // Get the appropriate data based on question type
            let displayText = ""
            let displayIcon = ""
            let bgClass = ""

            if (isEnvironmentQuestion) {
              displayText = environmentTypes[language === "zh" ? "zh" : "en"][index]
              displayIcon = ["🏝️", "🏙️", "⛰️", "🌄"][index]
              bgClass =
                [
                  "bg-[url('/golden-beach-twilight.png')]",
                  "bg-[url('/vibrant-cityscape.png')]",
                  "bg-[url('/majestic-peaks.png')]",
                  "bg-[url('/rolling-farm-fields.png')]",
                ][index] + " bg-cover bg-center"
            } else if (isActivityQuestion) {
              displayText = activityTypes[language === "zh" ? "zh" : "en"][index]
              displayIcon = option.split(" ")[0]
              bgClass =
                [
                  "bg-[url('/museum-cultural.png')]",
                  "bg-[url('/nightlife-bars.png')]",
                  "bg-[url('/adventure-sports.png')]",
                  "bg-[url('/food-dining.png')]",
                ][index] + " bg-cover bg-center"
            } else if (isSpendingQuestion) {
              displayText = spendingTypes[language === "zh" ? "zh" : "en"][index]
              displayIcon = spendingIcons[index]
              bgClass = bgImagesSpending[index]
            } else if (isSocialQuestion) {
              displayText = socialTypes[language === "zh" ? "zh" : "en"][index]
              displayIcon = socialIcons[index]
              bgClass = bgImagesSocial[index]
            } else {
              // For questions 1-5, use the new data
              const data = getQuestionData(question.id, index)
              displayText = data.displayText
              displayIcon = data.emoji
              bgClass = data.gradient
            }

            return (
              <motion.button
                key={index}
                onClick={() => handleSelect(index, option)}
                onMouseEnter={() => setHoverIndex(index)}
                onMouseLeave={() => setHoverIndex(null)}
                disabled={loading || selectedOption !== null}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className={`relative flex flex-col items-center justify-center p-4 sm:p-6 rounded-xl transition-all duration-300 border-2 h-28 sm:h-36
                  ${
                    isSelected
                      ? "border-white shadow-inner"
                      : isHovered
                        ? "border-white/70 shadow-lg"
                        : "border-transparent hover:border-white/50 shadow-md"
                  } ${bgClass} overflow-hidden`}
              >
                {(isEnvironmentQuestion || isActivityQuestion) && (
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${
                      isActivityQuestion
                        ? [
                            "from-indigo-500/80 to-purple-600/80",
                            "from-pink-500/80 to-rose-600/80",
                            "from-orange-500/80 to-amber-600/80",
                            "from-emerald-500/80 to-teal-600/80",
                          ][index]
                        : isEnvironmentQuestion
                          ? [
                              "from-cyan-500/80 to-blue-600/80",
                              "from-slate-600/80 to-gray-700/80",
                              "from-violet-500/80 to-purple-600/80",
                              "from-green-500/80 to-emerald-600/80",
                            ][index]
                          : ""
                    } backdrop-blur-[1px] transition-opacity ${isHovered ? "opacity-90" : "opacity-80"}`}
                  ></div>
                )}

                <motion.div
                  className="relative z-10 flex flex-col items-center"
                  animate={isSelected ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 0.4 }}
                >
                  <span className="text-5xl mb-3">{displayIcon}</span>
                  <span className="text-white font-semibold text-center text-lg">
                    {/* For questions 1-5, show the full option text */}
                    {!isEnvironmentQuestion && !isActivityQuestion && !isSpendingQuestion && !isSocialQuestion
                      ? option
                      : displayText}
                  </span>
                </motion.div>

                {isSelected && (
                  <motion.div
                    className="absolute bottom-3 right-3 bg-white rounded-full p-1 z-20"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M20 6L9 17L4 12"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </motion.div>
                )}
              </motion.button>
            )
          })}
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center mt-8">
            {/* Sleeker loading animation */}
            <div className="relative w-full max-w-xs mx-auto h-24 mb-8">
              {/* Horizontal progress bar with gradient */}
              <div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{
                    duration: 3,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                />
              </div>

              {/* Animated globe that moves along the bar */}
              <motion.div
                className="absolute top-1/2 -translate-y-1/2 z-10"
                initial={{ left: "0%" }}
                animate={{ left: "100%" }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
                style={{ translateX: "-50%" }}
              >
                <div className="bg-white p-3 rounded-full shadow-lg flex items-center justify-center">
                  <span className="text-2xl">✈️</span>
                </div>
              </motion.div>

              {/* Subtle pulsing circles in the background */}
              <motion.div
                className="absolute top-1/2 left-1/4 w-16 h-16 rounded-full bg-violet-200 opacity-20 -z-10"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.2, 0.3, 0.2],
                }}
                transition={{
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
                style={{ translateY: "-50%" }}
              />

              <motion.div
                className="absolute top-1/2 right-1/4 w-12 h-12 rounded-full bg-pink-200 opacity-20 -z-10"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.2, 0.3, 0.2],
                }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                  delay: 0.5,
                }}
                style={{ translateY: "-50%" }}
              />
            </div>

            {/* Improved loading message display - one sentence at a time */}
            <div className="h-16 relative w-full max-w-xs mx-auto">
              {loadingMessages.map((message, index) => {
                // Calculate if this message should be shown based on time
                // We'll show each message for 2 seconds before moving to the next
                const currentMessageIndex = Math.floor((Date.now() / 2000) % loadingMessages.length)
                const isActive = index === currentMessageIndex

                return (
                  <motion.div
                    key={index}
                    className="absolute inset-x-0 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{
                      opacity: isActive ? 1 : 0,
                      y: isActive ? 0 : 20,
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    <motion.p
                      className="text-violet-600 font-semibold mb-1"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: isActive ? 1 : 0 }}
                      transition={{ duration: 0.3, delay: isActive ? 0 : 0 }}
                    >
                      {message.title}
                    </motion.p>
                    <motion.p
                      className="text-sm text-violet-400"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: isActive ? 1 : 0 }}
                      transition={{ duration: 0.3, delay: isActive ? 0.4 : 0 }}
                    >
                      {message.subtitle}
                    </motion.p>
                  </motion.div>
                )
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
