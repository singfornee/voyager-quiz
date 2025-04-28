"use client"

import { motion } from "framer-motion"
import { useLanguage } from "@/contexts/language-context"
import { ArrowRight, Clock } from "lucide-react"

interface QuizStartProps {
  onStart: () => void
}

export default function QuizStart({ onStart }: QuizStartProps) {
  const { language, t } = useLanguage()

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-8">
      <motion.div
        className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header image */}
        <div className="relative h-48 sm:h-64 md:h-80 bg-gradient-to-r from-violet-500 to-purple-600 overflow-hidden">
          <div className="absolute inset-0 bg-[url('/travel-collage-gen-z.png')] bg-cover bg-center opacity-40 mix-blend-overlay"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white text-center px-4 drop-shadow-lg">
              {t.start.discoverYourTravelPersonality}
            </h1>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8">
          <div className="flex items-center justify-center mb-6 bg-violet-50 rounded-full py-2 px-4 w-fit mx-auto">
            <Clock className="h-4 w-4 text-violet-600 mr-2" />
            <span className="text-sm font-medium text-violet-700">
              {language === "zh" ? "只需 1 分鐘 • 6 個問題" : "Just 1 minute • 6 questions"}
            </span>
          </div>

          <p className="text-gray-600 text-center mb-8 max-w-lg mx-auto">{t.start.quizDescription}</p>

          <div className="flex justify-center">
            <motion.button
              onClick={onStart}
              className="px-8 py-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl font-medium text-lg flex items-center justify-center hover:opacity-90 transition-opacity"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {t.start.startQuiz} <ArrowRight className="ml-2 h-5 w-5" />
            </motion.button>
          </div>

          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="p-3 bg-violet-50 rounded-xl">
              <div className="text-2xl mb-1">🧭</div>
              <div className="text-sm font-medium text-violet-800">{t.start.feature1}</div>
            </div>
            <div className="p-3 bg-violet-50 rounded-xl">
              <div className="text-2xl mb-1">🌍</div>
              <div className="text-sm font-medium text-violet-800">{t.start.feature2}</div>
            </div>
            <div className="p-3 bg-violet-50 rounded-xl">
              <div className="text-2xl mb-1">💡</div>
              <div className="text-sm font-medium text-violet-800">{t.start.feature3}</div>
            </div>
            <div className="p-3 bg-violet-50 rounded-xl">
              <div className="text-2xl mb-1">🎯</div>
              <div className="text-sm font-medium text-violet-800">{t.start.feature4}</div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
