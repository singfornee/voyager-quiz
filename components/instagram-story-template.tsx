"use client"

import { useRef } from "react"
import type { TravelProfile } from "./quiz-container"
import { motion } from "framer-motion"
import { useLanguage } from "@/contexts/language-context"
import QRCode from "react-qr-code"

interface InstagramStoryTemplateProps {
  profile: TravelProfile
  onGenerated?: (imageUrl: string) => void
}

export default function InstagramStoryTemplate({ profile, onGenerated }: InstagramStoryTemplateProps) {
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
      美學冒險家: "📸",
      文化探索者: "🏛️",
      奢華漫遊者: "💎",
      數位探險家: "💻",
      城市冒險家: "🏙️",
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

  // Get tags from profile or generate based on traveler type
  const getTags = () => {
    if (profile.tags && profile.tags.length > 0) {
      return profile.tags.slice(0, 3)
    }

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

    return fallbackTags[profile.travelerType] || ["#Travel", "#Adventure", "#Discover"]
  }

  // Get a top destination recommendation
  const getTopDestination = () => {
    if (profile.destinations && profile.destinations.length > 0) {
      // Extract just the location name, removing any descriptions
      let destination = profile.destinations[0]
      if (destination.includes(" - ")) {
        destination = destination.split(" - ")[0]
      } else if (destination.includes(" (")) {
        destination = destination.split(" (")[0]
      }
      return destination
    }
    return null
  }

  // Add a function to get the animal emoji
  const getAnimalEmoji = () => {
    const animalMap: Record<string, string> = {
      "Adventurous Explorer": "🦊",
      "Cultural Nomad": "🦉",
      "Luxury Traveler": "🦢",
      "Digital Explorer": "🐬",
      "Urban Adventurer": "🦝",
      "Beach Bum": "🐢",
      Backpacker: "🦅",
      "Foodie Traveler": "🦊",
      "Aesthetic Adventurer": "🦚",
      "Social Explorer": "🐬",
    }

    // Default to fox if not found
    return animalMap[profile.travelerType] || "🦊"
  }

  // Add a function to get the travel superpower
  const getSuperpower = () => {
    if (profile.superpower) {
      return profile.superpower
    }

    // Fallback superpowers based on traveler type
    const fallbackSuperpowers: Record<string, string> = {
      "Adventurous Explorer": "Finding hidden gems",
      "Cultural Nomad": "Cultural adaptation",
      "Luxury Traveler": "VIP access",
      "Digital Explorer": "Working from anywhere",
      "Urban Adventurer": "City navigation",
      "Beach Bum": "Finding perfect beaches",
      Backpacker: "Budget stretching",
      "Foodie Traveler": "Finding local cuisine",
      "Aesthetic Adventurer": "Perfect photo spots",
      "Social Explorer": "Making friends anywhere",
    }

    return fallbackSuperpowers[profile.travelerType] || "Spontaneous planning"
  }

  // Add a function to get the trip role
  const getTripRole = () => {
    if (profile.tripRole) {
      return profile.tripRole
    }

    // Fallback roles based on traveler type
    const fallbackRoles: Record<string, string> = {
      "Adventurous Explorer": "The Trailblazer",
      "Cultural Nomad": "The Historian",
      "Luxury Traveler": "The Concierge",
      "Digital Explorer": "The Tech Guru",
      "Urban Adventurer": "The City Guide",
      "Beach Bum": "The Relaxation Expert",
      Backpacker: "The Budget Master",
      "Foodie Traveler": "The Taste Tester",
      "Aesthetic Adventurer": "The Photographer",
      "Social Explorer": "The Party Planner",
    }

    return fallbackRoles[profile.travelerType] || "The Organizer"
  }

  const tags = getTags()
  const topDestination = getTopDestination()

  return (
    <div
      ref={canvasRef}
      className="w-full aspect-[9/16] rounded-3xl overflow-hidden shadow-2xl border-0 relative"
      style={{ maxWidth: "400px", margin: "0 auto" }}
    >
      {/* Background with gradient */}
      <div className={`w-full h-full bg-gradient-to-br ${getTypeGradient()} p-6 flex flex-col relative`}>
        {/* Enhanced decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
          <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-white/30 blur-xl"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 rounded-full bg-white/20 blur-xl"></div>
          <div className="absolute top-1/2 left-1/4 w-24 h-24 rounded-full bg-white/20 blur-xl"></div>
          <div className="absolute bottom-1/3 right-1/4 w-16 h-16 rounded-full bg-white/30 blur-lg"></div>
        </div>

        {/* Header */}
        <div className="flex justify-between items-start mb-2 z-10">
          <div className="bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full text-white text-sm font-medium">
            Voyager AI
          </div>
          <div className="text-5xl">{getTravelerEmoji()}</div>
        </div>

        {/* Main content - OPTIMIZED FOR "I'M A XXX" */}
        <div className="flex-1 flex flex-col justify-center items-center text-center z-10">
          {/* Prominent "I'm a" text */}
          <div className="text-white text-3xl font-medium mb-2 bg-white/10 backdrop-blur-md px-6 py-2 rounded-full">
            {language === "zh" ? "我是" : "I'm a"}
          </div>

          {/* Extra large traveler type */}
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-6 drop-shadow-lg max-w-[90%] leading-tight">
            {profile.travelerType}
          </h2>

          {/* Animal emoji with label */}
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: -3 }}
            transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
            className="bg-white/30 backdrop-blur-md px-5 py-2.5 rounded-full text-white font-bold text-xl mb-3 flex items-center transform -rotate-3 shadow-lg"
          >
            <span className="mr-2">{getAnimalEmoji()}</span>
            <span>{language === "zh" ? "旅行動物精神" : "Travel Spirit Animal"}</span>
          </motion.div>

          {/* Trip role */}
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: 3 }}
            transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
            className="bg-white/30 backdrop-blur-md px-5 py-2.5 rounded-full text-white font-bold text-xl mb-3 transform rotate-3 shadow-lg"
          >
            {getTripRole()}
          </motion.div>

          {/* Superpower */}
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: -2 }}
            transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
            className="bg-white/30 backdrop-blur-md px-5 py-2.5 rounded-full text-white font-bold text-xl mb-3 flex items-center transform -rotate-2 shadow-lg"
          >
            <span className="mr-2">⚡</span>
            <span>{getSuperpower()}</span>
          </motion.div>

          {/* Tags displayed prominently with improved visibility */}
          <div className="flex flex-col items-center gap-3 mb-4">
            {tags.map((tag, index) => (
              <motion.div
                key={index}
                initial={{ rotate: 0 }}
                animate={{ rotate: index % 2 === 0 ? -3 : 3 }}
                transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
                className={`bg-white/30 backdrop-blur-md px-5 py-2.5 rounded-full text-white font-bold text-xl shadow-lg transform ${
                  index % 2 === 0 ? "-rotate-3" : "rotate-3"
                }`}
              >
                {tag}
              </motion.div>
            ))}
          </div>

          {topDestination && (
            <div className="bg-white/30 backdrop-blur-md px-5 py-3 rounded-xl text-white mb-6 w-full max-w-[80%] transform rotate-2 shadow-lg">
              <div className="text-sm mb-1">{language === "zh" ? "推薦目的地" : "Perfect for"}</div>
              <div className="text-xl font-bold">✈️ {topDestination}</div>
            </div>
          )}
        </div>

        {/* Instagram Story Swipe Up Indicator */}
        <div className="flex flex-col items-center z-10 mb-4">
          <div className="text-white text-sm mb-2">
            {language === "zh" ? "向上滑動查看你的旅行風格" : "Swipe up to find your travel style"}
          </div>
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
            className="text-white text-2xl"
          >
            ↑
          </motion.div>
        </div>

        {/* QR Code */}
        <div className="flex justify-center z-10">
          <div className="bg-white p-2 rounded-lg shadow-lg">
            <QRCode size={80} value="https://play.voyagerai.io" viewBox={`0 0 256 256`} />
          </div>
        </div>
      </div>
    </div>
  )
}
