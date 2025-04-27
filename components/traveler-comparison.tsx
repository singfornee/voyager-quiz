"use client"

import { useRef } from "react"
import type { TravelProfile } from "./quiz-container"
import { useLanguage } from "@/contexts/language-context"
import { getTravelerIllustration } from "./traveler-illustrations"

interface TravelerComparisonProps {
  profile: TravelProfile
  onGenerated?: (imageUrl: string) => void
}

export default function TravelerComparison({ profile, onGenerated }: TravelerComparisonProps) {
  const canvasRef = useRef<HTMLDivElement>(null)
  const { language } = useLanguage()

  // Get traveler type emoji
  const getTravelerEmoji = (type: string) => {
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

    return typeEmojis[type] || "✈️"
  }

  // Get opposite traveler type for comparison
  const getOppositeType = () => {
    const opposites: Record<string, string> = {
      "Adventurous Explorer": "Luxury Traveler",
      "Cultural Nomad": "Beach Bum",
      "Luxury Traveler": "Backpacker",
      "Digital Explorer": "Adventurous Explorer",
      "Urban Adventurer": "Beach Bum",
      "Beach Bum": "Urban Adventurer",
      Backpacker: "Luxury Traveler",
      "Foodie Traveler": "Digital Explorer",
      "Aesthetic Adventurer": "Cultural Nomad",
      "Social Explorer": "Digital Explorer",
      "Luxury Nomad": "Backpacker",
    }

    return opposites[profile.travelerType] || "Beach Bum"
  }

  // Get background gradient based on traveler type
  const getTypeGradient = (type: string) => {
    const typeColors: Record<string, string> = {
      "Adventurous Explorer": "from-orange-500 to-rose-500",
      "Cultural Nomad": "from-emerald-500 to-green-500",
      "Luxury Traveler": "from-indigo-500 to-sky-500",
      "Digital Explorer": "from-violet-500 to-fuchsia-500",
      "Urban Adventurer": "from-slate-500 to-zinc-500",
      "Beach Bum": "from-cyan-500 to-indigo-500",
      Backpacker: "from-green-500 to-teal-500",
      "Foodie Traveler": "from-amber-500 to-orange-500",
      "Aesthetic Adventurer": "from-fuchsia-500 to-rose-500",
      "Social Explorer": "from-blue-500 to-cyan-500",
      "Luxury Nomad": "from-purple-500 to-fuchsia-500",
    }

    return typeColors[type] || "from-violet-600 to-pink-500"
  }

  // Get traveler characteristics
  const getTravelerCharacteristics = (type: string) => {
    const characteristics: Record<string, string[]> = {
      "Adventurous Explorer": [
        language === "zh" ? "喜歡冒險和刺激" : "Loves adventure and thrills",
        language === "zh" ? "偏好戶外活動" : "Prefers outdoor activities",
        language === "zh" ? "尋找獨特體驗" : "Seeks unique experiences",
      ],
      "Cultural Nomad": [
        language === "zh" ? "熱愛歷史和藝術" : "Loves history and art",
        language === "zh" ? "尋找真實文化體驗" : "Seeks authentic cultural experiences",
        language === "zh" ? "喜歡與當地人交流" : "Enjoys connecting with locals",
      ],
      "Luxury Traveler": [
        language === "zh" ? "優先考慮舒適和便利" : "Prioritizes comfort and convenience",
        language === "zh" ? "享受高端體驗" : "Enjoys premium experiences",
        language === "zh" ? "願意為品質付費" : "Willing to pay for quality",
      ],
      "Digital Explorer": [
        language === "zh" ? "保持連接和分享" : "Stays connected and shares",
        language === "zh" ? "尋找適合遠程工作的地點" : "Looks for remote work-friendly spots",
        language === "zh" ? "重視良好的網絡連接" : "Values good internet connectivity",
      ],
      "Urban Adventurer": [
        language === "zh" ? "喜歡城市能量" : "Loves city energy",
        language === "zh" ? "尋找時尚和潮流" : "Seeks fashion and trends",
        language === "zh" ? "享受夜生活和美食" : "Enjoys nightlife and dining",
      ],
      "Beach Bum": [
        language === "zh" ? "優先考慮放鬆和休息" : "Prioritizes relaxation and rest",
        language === "zh" ? "喜歡陽光和海灘" : "Loves sunshine and beaches",
        language === "zh" ? "尋找平靜的環境" : "Seeks peaceful environments",
      ],
      Backpacker: [
        language === "zh" ? "預算意識強" : "Budget-conscious",
        language === "zh" ? "喜歡自由行" : "Loves independent travel",
        language === "zh" ? "尋找真實體驗" : "Seeks authentic experiences",
      ],
      "Foodie Traveler": [
        language === "zh" ? "旅行以美食為中心" : "Centers travel around food",
        language === "zh" ? "尋找當地美食" : "Seeks local cuisine",
        language === "zh" ? "享受烹飪體驗" : "Enjoys culinary experiences",
      ],
      "Aesthetic Adventurer": [
        language === "zh" ? "尋找完美照片機會" : "Seeks perfect photo opportunities",
        language === "zh" ? "注重視覺體驗" : "Focuses on visual experiences",
        language === "zh" ? "喜歡分享美麗景點" : "Loves sharing beautiful locations",
      ],
      "Social Explorer": [
        language === "zh" ? "喜歡與他人一起旅行" : "Loves traveling with others",
        language === "zh" ? "尋找社交機會" : "Seeks social opportunities",
        language === "zh" ? "享受團體活動" : "Enjoys group activities",
      ],
      "Luxury Nomad": [
        language === "zh" ? "結合奢華與冒險" : "Combines luxury with adventure",
        language === "zh" ? "尋找獨特的高端體驗" : "Seeks unique premium experiences",
        language === "zh" ? "享受舒適但真實的旅行" : "Enjoys comfortable yet authentic travel",
      ],
    }

    return (
      characteristics[type] || [
        language === "zh" ? "熱愛旅行" : "Loves traveling",
        language === "zh" ? "尋找新體驗" : "Seeks new experiences",
        language === "zh" ? "享受探索" : "Enjoys exploration",
      ]
    )
  }

  // Get tags from profile or generate based on traveler type
  const getTags = (type: string) => {
    // Fallback tags based on traveler type
    const fallbackTags: Record<string, string[]> = {
      "Adventurous Explorer": ["#Adventure", "#Outdoors", "#Exploration"],
      "Cultural Nomad": ["#Culture", "#History", "#LocalExperience"],
      "Luxury Traveler": ["#Luxury", "#Comfort", "#Exclusive"],
      "Digital Explorer": ["#Remote", "#Connected", "#Flexible"],
      "Urban Adventurer": ["#CityLife", "#Urban", "#Nightlife"],
      "Beach Bum": ["#Beach", "#Relaxation", "#Ocean"],
      Backpacker: ["#Budget", "#Authentic", "#Freedom"],
      "Foodie Traveler": ["#Cuisine", "#Flavors", "#LocalFood"],
      "Aesthetic Adventurer": ["#Photography", "#Scenic", "#Instagrammable"],
      "Social Explorer": ["#Community", "#Connections", "#Experiences"],
    }

    return fallbackTags[type] || ["#Travel", "#Adventure", "#Discover"]
  }

  const oppositeType = getOppositeType()
  const yourCharacteristics = getTravelerCharacteristics(profile.travelerType)
  const oppositeCharacteristics = getTravelerCharacteristics(oppositeType)
  const yourTags = getTags(profile.travelerType)
  const oppositeTags = getTags(oppositeType)

  return (
    <div
      ref={canvasRef}
      className="w-full rounded-3xl overflow-hidden shadow-2xl border-0 relative bg-white"
      style={{ maxWidth: "600px", margin: "0 auto" }}
    >
      <div className="p-6">
        <div className="text-center mb-6">
          <div className="text-sm text-gray-500 mb-1">{language === "zh" ? "我是" : "I'm a"}</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-1">{profile.travelerType}</h2>
          <div className="flex justify-center gap-2">
            {yourTags.slice(0, 2).map((tag, index) => (
              <div key={index} className="text-xs text-gray-500">
                {tag}
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          {/* Your traveler type */}
          <div className="flex-1">
            <div
              className={`bg-gradient-to-br ${getTypeGradient(
                profile.travelerType,
              )} rounded-xl p-4 text-white h-64 flex flex-col`}
            >
              <div className="flex items-center mb-3">
                <span className="text-3xl mr-2">{getTravelerEmoji(profile.travelerType)}</span>
                <h3 className="text-lg font-bold">{language === "zh" ? "你的風格" : "Your Style"}</h3>
              </div>
              <div className="flex-1 flex items-center justify-center">
                <div className="h-40 relative">{getTravelerIllustration(profile.travelerType, "h-full w-full")}</div>
              </div>
            </div>

            <div className="mt-4 bg-gray-50 rounded-xl p-4">
              <h4 className="font-medium text-gray-700 mb-2">{language === "zh" ? "特點" : "Traits"}</h4>
              <ul className="space-y-2">
                {yourCharacteristics.map((trait, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-lg mr-2 text-green-500">✓</span>
                    <span className="text-sm text-gray-600">{trait}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* VS divider */}
          <div className="flex items-center justify-center">
            <div className="bg-gray-200 rounded-full w-10 h-10 flex items-center justify-center font-bold text-gray-500">
              VS
            </div>
          </div>

          {/* Opposite traveler type */}
          <div className="flex-1">
            <div
              className={`bg-gradient-to-br ${getTypeGradient(
                oppositeType,
              )} rounded-xl p-4 text-white h-64 flex flex-col`}
            >
              <div className="flex items-center mb-3">
                <span className="text-3xl mr-2">{getTravelerEmoji(oppositeType)}</span>
                <h3 className="text-lg font-bold">{language === "zh" ? "對比風格" : "Opposite"}</h3>
              </div>
              <div className="flex-1 flex items-center justify-center">
                <div className="h-40 relative">{getTravelerIllustration(oppositeType, "h-full w-full")}</div>
              </div>
            </div>

            <div className="mt-4 bg-gray-50 rounded-xl p-4">
              <h4 className="font-medium text-gray-700 mb-2">{language === "zh" ? "特點" : "Traits"}</h4>
              <ul className="space-y-2">
                {oppositeCharacteristics.map((trait, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-lg mr-2 text-blue-500">✓</span>
                    <span className="text-sm text-gray-600">{trait}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <div className="text-sm text-gray-500">
            {language === "zh" ? "發現你的旅行風格" : "Discover your travel style at"}
          </div>
          <div className="font-bold text-violet-600">play.voyagerai.io</div>
        </div>
      </div>
    </div>
  )
}
