"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { ArrowRight, Globe, MapPin, Camera } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

interface QuizStartProps {
  onStart: () => void
}

export default function QuizStart({ onStart }: QuizStartProps) {
  const { t, language } = useLanguage()

  return (
    <Card className="w-full rounded-3xl overflow-hidden shadow-2xl border-0 glassmorphism">
      <CardContent className="p-0">
        <div className="flex flex-col items-center">
          <div className="relative w-full h-64 mb-0">
            <Image
              src="/travel-collage-gen-z.png"
              alt="Travel vibes"
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              quality={85}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/90"></div>

            <div className="absolute top-4 left-0 right-0 flex justify-center">
              <div className="bg-gradient-to-r from-violet-500 to-pink-500 text-white px-6 py-2 rounded-full text-lg font-medium shadow-md">
                {language === "en" ? "1-min quiz · Discover your travel style" : "1分鐘測驗 · 探索你的旅行風格"}
              </div>
            </div>

            <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2">
              {["#WanderlustVibes", "#TravelTok", "#MainCharacterEnergy", "#BucketList"].map((tag, i) => (
                <span
                  key={i}
                  className="bg-white/30 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="px-6 py-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-4 gradient-text">
              {language === "en" ? "Find Your Travel Aesthetic" : "發現你的旅行風格"}
            </h2>

            <p className="text-gray-600 mb-8">
              {language === "en"
                ? "9 quick Qs to reveal your perfect travel vibe and dream destinations! ✈️"
                : "9個快速問題，揭示你的完美旅行氛圍和夢想目的地！✈️"}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              {[
                {
                  icon: <Globe className="h-6 w-6" />,
                  text: language === "en" ? "Discover your travel personality" : "發現你的旅行個性",
                },
                {
                  icon: <MapPin className="h-6 w-6" />,
                  text: language === "en" ? "Get personalized destination recs" : "獲取個性化目的地推薦",
                },
                {
                  icon: <Camera className="h-6 w-6" />,
                  text: language === "en" ? "Find your travel aesthetic" : "找到你的旅行美學",
                },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center text-center p-3 rounded-xl bg-violet-50">
                  <div className="bg-violet-100 p-2 rounded-full mb-2 text-violet-600">{item.icon}</div>
                  <p className="text-xs sm:text-sm text-gray-600">{item.text}</p>
                </div>
              ))}
            </div>

            <Button
              onClick={onStart}
              size="lg"
              className="w-full bg-gradient-to-r from-violet-600 to-pink-500 hover:opacity-90 rounded-xl text-lg font-bold h-14"
            >
              {t.quiz.startButton} <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
