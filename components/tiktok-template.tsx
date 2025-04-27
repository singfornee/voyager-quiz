"use client"

import { useRef } from "react"
import type { TravelProfile } from "./quiz-container"
import { useLanguage } from "@/contexts/language-context"

interface TikTokTemplateProps {
  profile: TravelProfile
  onGenerated?: (imageUrl: string) => void
}

export default function TikTokTemplate({ profile, onGenerated }: TikTokTemplateProps) {
  const canvasRef = useRef<HTMLDivElement>(null)
  const { language } = useLanguage()

  // Get traveler type emoji
  const getTravelerEmoji = () => {
    const typeEmojis: Record<string, string> = {
      "Adventurous Explorer": "🧗‍♀️",
      "Cultural Nomad": "🏛️",
      "Luxury Traveler": "💎",
      "Digital Explorer": "💻",
      "Urban Adventurer": "🏙️",
      "Beach Bum": "🏝️",
      Backpacker: "🎒",
      "Foodie Traveler": "🍜",
      "Aesthetic Adventurer": "📸",
      "Social Explorer": "🤝",
      "Luxury Nomad": "🧳",
    }

    return typeEmojis[profile.travelerType] || "✈️"
  }

  // Get background gradient based on traveler type
  const getTypeGradient = () => {
    const typeColors: Record<string, string> = {
      "Adventurous Explorer": "from-orange-500 via-red-400 to-rose-500",
      "Cultural Nomad": "from-emerald-500 via-teal-400 to-green-500",
      "Luxury Traveler": "from-indigo-500 via-blue-400 to-sky-500",
      "Digital Explorer": "from-violet-500 via-purple-400 to-fuchsia-500",
      "Urban Adventurer": "from-slate-500 via-gray-400 to-zinc-500",
      "Beach Bum": "from-cyan-500 via-blue-400 to-indigo-500",
      Backpacker: "from-green-500 via-emerald-400 to-teal-500",
      "Foodie Traveler": "from-amber-500 via-yellow-400 to-orange-500",
      "Aesthetic Adventurer": "from-fuchsia-500 via-pink-400 to-rose-500",
      "Social Explorer": "from-blue-500 via-sky-400 to-cyan-500",
      "Luxury Nomad": "from-purple-500 via-violet-400 to-fuchsia-500",
    }

    return typeColors[profile.travelerType] || "from-violet-600 via-purple-400 to-pink-500"
  }

  return (
    <div
      ref={canvasRef}
      className="w-full aspect-[9/16] rounded-3xl overflow-hidden shadow-2xl border-0 relative"
      style={{ maxWidth: "400px", margin: "0 auto" }}
    >
      {/* Background with gradient */}
      <div className={`w-full h-full bg-gradient-to-br ${getTypeGradient()} p-6 flex flex-col relative`}>
        {/* TikTok-style overlay */}
        <div className="absolute inset-0 bg-black/10"></div>

        {/* TikTok-style caption area at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 to-transparent">
          <div className="text-white text-lg mb-2">
            {language === "zh" ? "我的旅行風格是..." : "My travel style is..."}
          </div>
          <div className="flex items-center mb-4">
            <div className="text-5xl mr-3">{getTravelerEmoji()}</div>
            <div className="text-3xl font-bold text-white">{profile.travelerType}</div>
          </div>

          <div className="text-white/80 text-sm mb-2">
            {language === "zh" ? "你猜猜你的旅行風格是什麼？👇" : "Guess what your travel style is? 👇"}
          </div>

          <div className="flex items-center">
            <div className="bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full text-white text-sm font-medium">
              #TravelQuiz
            </div>
            <div className="bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full text-white text-sm font-medium ml-2">
              #VoyagerAI
            </div>
            <div className="bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full text-white text-sm font-medium ml-2">
              #{profile.travelerType.replace(/\s+/g, "")}
            </div>
          </div>

          <div className="mt-4 text-white/90 text-sm">play.voyagerai.io</div>
        </div>

        {/* TikTok-style reaction prompt */}
        <div className="absolute top-6 right-6 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full">
          <div className="text-white text-sm font-bold">
            {language === "zh" ? "拍攝你的反應 👀" : "Film your reaction 👀"}
          </div>
        </div>

        {/* Voyager AI logo */}
        <div className="absolute top-6 left-6 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full text-white text-sm font-medium">
          Voyager AI
        </div>
      </div>
    </div>
  )
}
