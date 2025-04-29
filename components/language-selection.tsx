"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { motion } from "framer-motion"

interface LanguageSelectionProps {
  onLanguageSelected: (language: "en" | "zh-TW") => void
}

export default function LanguageSelection({ onLanguageSelected }: LanguageSelectionProps) {
  const [hoveredLanguage, setHoveredLanguage] = useState<string | null>(null)

  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-4">
      <Card className="p-6 sm:p-8 bg-white/90 backdrop-blur-sm border-0 shadow-lg rounded-xl max-w-md w-full">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <div className="relative w-20 h-20">
              <div className="absolute -inset-2 rounded-full bg-white/50 blur-lg"></div>
              <Image
                src="/voyabear-mascot.png"
                alt="VoyaBear Mascot"
                width={80}
                height={80}
                className="animate-float relative z-10"
              />
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-2 text-voyabear-primary">Choose Your Language</h2>
          <p className="text-gray-600 text-sm">請選擇您的語言</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button
            variant="outline"
            className={`h-auto py-6 flex flex-col items-center justify-center transition-all ${
              hoveredLanguage === "en" ? "border-voyabear-primary bg-voyabear-light/50 shadow-md" : "border-gray-200"
            }`}
            onClick={() => onLanguageSelected("en")}
            onMouseEnter={() => setHoveredLanguage("en")}
            onMouseLeave={() => setHoveredLanguage(null)}
          >
            <motion.div
              animate={{ scale: hoveredLanguage === "en" ? 1.1 : 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
              className="text-3xl mb-2"
            >
              🇺🇸
            </motion.div>
            <span className="font-medium text-voyabear-primary">English</span>
          </Button>

          <Button
            variant="outline"
            className={`h-auto py-6 flex flex-col items-center justify-center transition-all ${
              hoveredLanguage === "zh-TW" ? "border-voyabear-primary bg-voyabear-light/50 shadow-md" : "border-gray-200"
            }`}
            onClick={() => onLanguageSelected("zh-TW")}
            onMouseEnter={() => setHoveredLanguage("zh-TW")}
            onMouseLeave={() => setHoveredLanguage(null)}
          >
            <motion.div
              animate={{ scale: hoveredLanguage === "zh-TW" ? 1.1 : 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
              className="text-3xl mb-2"
            >
              🇹🇼
            </motion.div>
            <span className="font-medium text-voyabear-primary">繁體中文</span>
          </Button>
        </div>
      </Card>
    </div>
  )
}
