"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { TravelProfile } from "./quiz-container"
import {
  Share2,
  RotateCcw,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Loader2,
  Mail,
  Map,
  Lightbulb,
  Copy,
  Instagram,
  Users,
} from "lucide-react"
import { useState, useRef, useTransition, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { subscribeToMailchimp } from "@/app/actions/subscribe-email"
import dynamic from "next/dynamic"
import DestinationCard from "./destination-card"
import AnimatedBackground from "./animated-background"
import { analytics } from "@/lib/analytics"
import ProgressiveLoader from "./progressive-loader"
import { useLanguage } from "@/contexts/language-context"
import html2canvas from "html2canvas"
import { scrollToTop } from "@/lib/scroll-utils"

// Dynamically import components that aren't needed immediately
const ShareModal = dynamic(() => import("./share-modal"), {
  loading: () => (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white p-4 rounded-lg">Loading...</div>
    </div>
  ),
  ssr: false,
})

const ChallengeModal = dynamic(() => import("./challenge-friends-modal"), {
  loading: () => (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white p-4 rounded-lg">Loading...</div>
    </div>
  ),
  ssr: false,
})

interface QuizResultsProps {
  profile: TravelProfile
  onReset: () => void
}

// Helper function to get personalized travel hacks
const getPersonalizedTravelHacks = (profile: TravelProfile, language: string) => {
  // If we already have tips from the profile, use those but make them more concise
  if (profile.tips && profile.tips.length > 0) {
    // Ensure tips are gender-neutral and concise
    return profile.tips
      .map((tip) => {
        // Shorten the tip if it's too long
        if (tip.length > 100) {
          return tip.substring(0, 97) + "..."
        }
        return tip.replace(/\bgirl\b/gi, "traveler").replace(/\bgirls\b/gi, "travelers")
      })
      .slice(0, 3) // Limit to 3 tips
  }

  // Otherwise, generate specific hacks based on traveler type and preferences
  const hacks: string[] = []
  const travelerType = profile.travelerType.toLowerCase()
  const prefs = profile.preferences || {}

  // Add traveler type specific hacks - more concise and powerful
  if (travelerType.includes("luxury") || travelerType.includes("奢華")) {
    hacks.push(
      language === "zh"
        ? "WhatsApp禮賓技巧：抵達前24小時發訊息，獲取房間升級和特殊待遇"
        : "WhatsApp hotels 24hrs before check-in requesting upgrades - works 70% of the time",
    )
  }

  if (
    travelerType.includes("adventure") ||
    travelerType.includes("explorer") ||
    travelerType.includes("冒險") ||
    travelerType.includes("探索")
  ) {
    hacks.push(
      language === "zh"
        ? "下載maps.me獲取Google地圖沒有的離線徒步路線"
        : "Download maps.me for secret hiking trails Google Maps doesn't show",
    )
  }

  if (
    travelerType.includes("digital") ||
    travelerType.includes("nomad") ||
    travelerType.includes("數位") ||
    travelerType.includes("漫遊")
  ) {
    hacks.push(
      language === "zh"
        ? "預訂前向Airbnb房東索取speedtest.net截圖確保網速"
        : "Message Airbnb hosts for speedtest.net screenshots before booking",
    )
  }

  // Add preference-specific hacks
  if (prefs.spontaneity > 70) {
    hacks.push(
      language === "zh"
        ? "只預訂第一晚住宿，讓旅程隨心所欲發展"
        : "Only book your first night's stay and let the trip unfold organically",
    )
  }

  if (prefs.luxury > 70) {
    hacks.push(
      language === "zh"
        ? "使用Amex禮賓服務預訂難訂的餐廳和體驗"
        : "Use credit card concierge services for impossible-to-book restaurants",
    )
  }

  if (prefs.exploration > 70) {
    hacks.push(
      language === "zh"
        ? "在Instagram上搜尋地點標籤，發現當地人最愛的隱藏景點"
        : "Search location tags on Instagram to find locals-only hidden gems",
    )
  }

  if (prefs.aesthetics > 70) {
    hacks.push(
      language === "zh"
        ? "黃金時段（日出後/日落前1小時）拍攝，獲得最佳光線"
        : "Shoot during golden hour (1hr after sunrise/before sunset) for perfect lighting",
    )
  }

  // Activity-specific hacks
  if (prefs.activities?.nightlife > 60) {
    hacks.push(
      language === "zh"
        ? "使用Eventbrite和Resident Advisor找到非旅遊指南的地下派對"
        : "Use Eventbrite and Resident Advisor to find underground parties not in guidebooks",
    )
  }

  if (prefs.activities?.culinary > 60) {
    hacks.push(
      language === "zh"
        ? "跟著排隊的當地人找美食，不跟著排隊的遊客"
        : "Follow queues of locals, not tourists, for authentic food finds",
    )
  }

  // Environment-specific hacks
  if (prefs.environment?.beach > 60) {
    hacks.push(
      language === "zh"
        ? "向當地漁民詢問隱秘海灘，提供小費以獲取獨家信息"
        : "Ask local fishermen about secret beaches - tip them for exclusive info",
    )
  }

  if (prefs.environment?.city > 60) {
    hacks.push(
      language === "zh"
        ? "使用CityCapper應用找到免費的城市步行導覽"
        : "Use the CityCapper app to find free walking tours led by passionate locals",
    )
  }

  // Ensure we have at least 3 hacks
  const defaultHacks =
    language === "zh"
      ? [
          "Google航班「探索」功能設置多目的地價格提醒，找到超值機票",
          "一個國際轉換器加一個插線板為所有設備充電",
          "截圖保存登機牌和預訂信息，以便離線訪問",
        ]
      : [
          "Use Google Flights 'Explore' + price alerts to find deals 40% below average",
          "One power strip + one adapter charges all devices in foreign countries",
          "Screenshot boarding passes & bookings for offline access in no-service areas",
        ]

  // Fill in with default hacks if needed
  while (hacks.length < 3) {
    const randomHack = defaultHacks[Math.floor(Math.random() * defaultHacks.length)]
    if (!hacks.includes(randomHack)) {
      hacks.push(randomHack)
    }
  }

  // Return only the first 3 hacks to avoid overwhelming the user
  return hacks.slice(0, 3)
}

export default function QuizResults({ profile, onReset }: QuizResultsProps) {
  const [copied, setCopied] = useState(false)
  const [email, setEmail] = useState("")
  const [subscriptionStatus, setSubscriptionStatus] = useState<{
    success?: boolean
    message?: string
  }>({})
  const [isPending, startTransition] = useTransition()
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false)
  const emailInputRef = useRef<HTMLInputElement>(null)
  const resultRef = useRef<HTMLDivElement>(null)
  const [showShareModal, setShowShareModal] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [showChallengeModal, setShowChallengeModal] = useState(false)
  const [confettiTriggered, setConfettiTriggered] = useState(false)

  const { language, t } = useLanguage()

  // Focus the email input when the component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      if (emailInputRef.current) {
        emailInputRef.current.focus()
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  // Trigger confetti animation when results are displayed
  useEffect(() => {
    // Scroll to top when results are shown
    scrollToTop()

    // Trigger confetti effect
    if (typeof window !== "undefined") {
      import("canvas-confetti").then((confetti) => {
        confetti.default({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        })
      })
    }

    // Track result view in analytics
    analytics.track("view_results", {
      travelerType: profile.travelerType,
    })
  }, [profile.travelerType])

  // Scroll to top when results are displayed
  useEffect(() => {
    if (resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }, [])

  // Update the handleShare function to track shares
  const handleShare = () => {
    // Track the share event
    analytics.track("share_modal_opened", {
      travelerType: profile.travelerType,
    })

    // Force open the share modal directly without any intermediate steps
    setShowShareModal(true)
  }

  const generateShareableImage = async () => {
    if (!resultRef.current) return null

    try {
      // Create a more visually appealing version for sharing
      const element = resultRef.current.querySelector(".share-card") || resultRef.current
      const canvas = await html2canvas(element, {
        scale: 2,
        logging: false,
        useCORS: true,
        backgroundColor: null,
        allowTaint: true,
      })

      return canvas.toDataURL("image/png")
    } catch (error) {
      console.error("Error generating shareable image:", error)
      return null
    }
  }

  // Add this function inside the QuizResults component
  const handleChallenge = () => {
    analytics.track("challenge_modal_opened", {
      travelerType: profile.travelerType,
    })
    setShowChallengeModal(true)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Update the handleSubscribe function to track subscriptions
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !email.includes("@")) {
      setSubscriptionStatus({
        success: false,
        message: language === "zh" ? "請輸入有效的電子郵件地址" : "Please enter a valid email address",
      })
      return
    }

    const formData = new FormData()
    formData.append("email", email)
    formData.append("travelerType", profile.travelerType)

    startTransition(async () => {
      const result = await subscribeToMailchimp(formData)
      setSubscriptionStatus(result)

      if (result.success) {
        // Track successful subscription
        analytics.track("email_subscribed", {
          travelerType: profile.travelerType,
        })

        // Also identify the user with their email
        analytics.identify(email, {
          travelerType: profile.travelerType,
          subscriptionDate: new Date().toISOString(),
        })

        setShowSuccessAnimation(true)
        setTimeout(() => {
          setShowSuccessAnimation(false)
        }, 3000)
        setEmail("")
      }
    })
  }

  // Update the formatDescription function to handle Chinese text better
  const formatDescription = (description: string) => {
    // For Chinese, we'll handle the formatting differently
    if (language === "zh") {
      // Chinese text doesn't need the same sentence splitting as English
      // Just add some styling and emphasis
      return (
        <p
          className={`mb-2 leading-relaxed ${language === "zh" ? "text-base" : ""}`}
          dangerouslySetInnerHTML={{
            __html: description.replace(/(\b你真的是\b|\b你是\b|\b你的\b)/gi, (match) => `<strong>${match}</strong>`),
          }}
        />
      )
    }

    // Original English formatting
    const sentences = description.split(". ")
    return sentences.map((sentence, i) => {
      // Bold any key phrases
      const enhancedSentence = sentence.replace(
        /(\byou're\b|\byou are\b|\byour\b)/gi,
        (match) => `<strong>${match}</strong>`,
      )

      return (
        <p
          key={i}
          className="mb-2"
          dangerouslySetInnerHTML={{ __html: enhancedSentence + (i < sentences.length - 1 ? "." : "") }}
        />
      )
    })
  }

  // Generate a color based on traveler type for consistent theming
  const getTypeColor = () => {
    const typeColors: Record<string, string> = {
      // Original longer names for backward compatibility
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

      // New punchy names
      "Adventure Junkie": "from-orange-500 via-red-400 to-rose-500",
      "Culture Buff": "from-emerald-500 via-teal-400 to-green-500",
      "Luxury Chaser": "from-indigo-500 via-blue-400 to-sky-500",
      "Digital Nomad": "from-violet-500 via-purple-400 to-fuchsia-500",
      "City Slicker": "from-slate-500 via-gray-400 to-zinc-500",
      "Beach Lover": "from-cyan-500 via-blue-400 to-indigo-500",
      "Budget Pro": "from-green-500 via-emerald-400 to-teal-500",
      "Food Hunter": "from-amber-500 via-yellow-400 to-orange-500",
      "Insta Wanderer": "from-fuchsia-500 via-pink-400 to-rose-500",
      "Party Hopper": "from-blue-500 via-sky-400 to-cyan-500",
      "Zen Wanderer": "from-purple-500 via-violet-400 to-fuchsia-500",
    }

    // Default gradient if type not found
    return typeColors[profile.travelerType] || "from-violet-600 via-purple-400 to-pink-500"
  }

  // Get traveler type emoji
  const getTravelerEmoji = () => {
    const typeEmojis: Record<string, string> = {
      // Original longer names for backward compatibility
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

      // New punchy names
      "Adventure Junkie": "🧗‍♀️",
      "Culture Buff": "🏛️",
      "Luxury Chaser": "💎",
      "Digital Nomad": "💻",
      "City Slicker": "🏙️",
      "Beach Lover": "🏝️",
      "Budget Pro": "🎒",
      "Food Hunter": "🍜",
      "Insta Wanderer": "📸",
      "Party Hopper": "🤝",
      "Zen Wanderer": "🧘",
      文化達人: "🏛️",
      奢華控: "💎",
      數位游民: "💻",
      城市客: "🏙️",
      海灘控: "🏝️",
    }

    return typeEmojis[profile.travelerType] || "✈️"
  }

  // Generate a more dynamic and interesting background gradient
  const getDynamicBackground = () => {
    // Get seed from traveler type for consistent randomness
    const seed = profile.travelerType.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)

    // Use the seed to generate pseudo-random values
    const rand = (min: number, max: number) => {
      const x = Math.sin(seed) * 10000
      const r = x - Math.floor(x)
      return Math.floor(r * (max - min + 1)) + min
    }

    // Generate color stops based on traveler type characteristics
    const generateColorStops = () => {
      // Base colors for different traveler types
      const luxuryColors = ["indigo", "purple", "violet", "blue"]
      const adventureColors = ["orange", "amber", "red", "rose"]
      const cultureColors = ["emerald", "green", "teal", "cyan"]
      const urbanColors = ["slate", "gray", "zinc", "neutral"]
      const beachColors = ["sky", "cyan", "blue", "indigo"]
      const foodColors = ["yellow", "amber", "orange", "red"]
      const aestheticColors = ["pink", "fuchsia", "rose", "purple"]

      // Determine which color palette to use based on traveler type
      let primaryPalette
      let secondaryPalette

      if (profile.travelerType.toLowerCase().includes("luxury")) {
        primaryPalette = luxuryColors
        secondaryPalette = aestheticColors
      } else if (profile.travelerType.toLowerCase().includes("adventure")) {
        primaryPalette = adventureColors
        secondaryPalette = cultureColors
      } else if (
        profile.travelerType.toLowerCase().includes("cultural") ||
        profile.travelerType.toLowerCase().includes("nomad")
      ) {
        primaryPalette = cultureColors
        secondaryPalette = luxuryColors
      } else if (profile.travelerType.toLowerCase().includes("urban")) {
        primaryPalette = urbanColors
        secondaryPalette = adventureColors
      } else if (
        profile.travelerType.toLowerCase().includes("beach") ||
        profile.travelerType.toLowerCase().includes("bum")
      ) {
        primaryPalette = beachColors
        secondaryPalette = cultureColors
      } else if (profile.travelerType.toLowerCase().includes("food")) {
        primaryPalette = foodColors
        secondaryPalette = urbanColors
      } else if (profile.travelerType.toLowerCase().includes("aesthetic")) {
        primaryPalette = aestheticColors
        secondaryPalette = luxuryColors
      } else {
        // Default to a mix of palettes
        primaryPalette = [...luxuryColors, ...adventureColors, ...cultureColors].slice(0, 4)
        secondaryPalette = [...beachColors, ...aestheticColors].slice(0, 4)
      }

      // Select colors from palettes
      const color1 = primaryPalette[rand(0, primaryPalette.length - 1)]
      const color2 = secondaryPalette[rand(0, secondaryPalette.length - 1)]
      const color3 = primaryPalette[rand(0, primaryPalette.length - 1)]

      // Generate intensities
      const intensity1 = rand(4, 6) * 100 // 400-600
      const intensity2 = rand(3, 5) * 100 // 300-500
      const intensity3 = rand(4, 6) * 100 // 400-600

      return `from-${color1}-${intensity1} via-${color2}-${intensity2} to-${color3}-${intensity3}`
    }

    // Generate angle for gradient
    const angles = [
      "bg-gradient-to-r",
      "bg-gradient-to-br",
      "bg-gradient-to-b",
      "bg-gradient-to-bl",
      "bg-gradient-to-l",
      "bg-gradient-to-tl",
      "bg-gradient-to-t",
      "bg-gradient-to-tr",
    ]
    const angle = angles[rand(0, angles.length - 1)]

    // Combine angle with color stops
    return `${angle} ${generateColorStops()}`
  }

  // Get personalized CTA based on traveler type
  const getPersonalizedCTA = () => {
    if (language === "zh") {
      const ctas: Record<string, string> = {
        // Original longer names for backward compatibility
        冒險探索者: "發現為你的冒險精神量身定制的隱藏寶地",
        文化探索者: "發掘專為你準備的真實文化體驗",
        奢華旅行者: "獲取獨家奢華體驗和住宿",
        數位探索者: "找到具有良好連接性的完美遠程工作目的地",
        城市冒險家: "像當地人一樣探索世界上最充滿活力的城市",
        海灘愛好者: "發現隱秘的海灘和沿海天堂",
        背包客: "找到經濟實惠的路線和真實體驗",
        美食旅行者: "發現美食熱點和隱藏的美食寶地",
        美學冒險家: "找到世界各地最適合Instagram的地點",
        社交探索者: "在熱門目的地與志同道合的旅行者聯繫",
        奢華漫遊者: "在擁抱自由的同時體驗最優質的住宿",
        // Add more Chinese traveler types here
        文化漫遊者: "探索世界各地的傳統文化和歷史遺產",
        自然探險家: "發現令人驚嘆的自然景觀和野生動物",
        城市文化家: "體驗世界各大城市的藝術和文化場景",
        美食探索者: "品嚐各地道地美食和烹飪傳統",
        攝影愛好者: "捕捉世界上最令人驚嘆的風景和時刻",
        夜生活愛好者: "探索全球最熱門的夜生活和娛樂場所",

        // New punchy names
        文化達人: "發掘專為你準備的真實文化體驗",
        奢華控: "獲取獨家奢華體驗和住宿",
        數位游民: "找到具有良好連接性的完美遠程工作目的地",
        城市客: "像當地人一樣探索世界上最充滿活力的城市",
        海灘控: "發現隱秘的海灘和沿海天堂",
        背包俠: "找到經濟實惠的路線和真實體驗",
        美食獵人: "發現美食熱點和隱藏的美食寶地",
        網紅客: "找到世界各地最適合Instagram的地點",
        派對客: "在熱門目的地與志同道合的旅行者聯繫",
        禪意客: "在擁抱自由的同時體驗最優質的住宿",
      }
      return ctas[profile.travelerType] || "獲取個性化旅行推薦"
    }

    const ctas: Record<string, string> = {
      // Original longer names for backward compatibility
      "Adventurous Explorer": "Discover hidden gems tailored to your adventurous spirit",
      "Cultural Nomad": "Uncover authentic cultural experiences just for you",
      "Luxury Traveler": "Access exclusive luxury experiences and accommodations",
      "Digital Explorer": "Find perfect remote work destinations with great connectivity",
      "Urban Adventurer": "Explore the world's most vibrant cities like a local",
      "Beach Bum": "Discover secluded beaches and coastal paradises",
      Backpacker: "Find budget-friendly routes and authentic experiences",
      "Foodie Traveler": "Discover culinary hotspots and hidden food gems",
      "Aesthetic Adventurer": "Find the most Instagram-worthy spots around the world",
      "Social Explorer": "Connect with like-minded travelers at trending destinations",
      "Luxury Nomad": "Experience the finest accommodations while embracing freedom",

      // New punchy names
      "Adventure Junkie": "Discover hidden gems tailored to your adventurous spirit",
      "Culture Buff": "Uncover authentic cultural experiences just for you",
      "Luxury Chaser": "Access exclusive luxury experiences and accommodations",
      "Digital Nomad": "Find perfect remote work destinations with great connectivity",
      "City Slicker": "Explore the world's most vibrant cities like a local",
      "Beach Lover": "Discover secluded beaches and coastal paradises",
      "Budget Pro": "Find budget-friendly routes and authentic experiences",
      "Food Hunter": "Discover culinary hotspots and hidden food gems",
      "Insta Wanderer": "Find the most Instagram-worthy spots around the world",
      "Party Hopper": "Connect with like-minded travelers at trending destinations",
      "Zen Wanderer": "Experience peaceful retreats while embracing mindfulness",
    }

    return ctas[profile.travelerType] || "Get personalized travel recommendations"
  }

  // Get travel animal based on traveler type
  const getTravelerAnimal = () => {
    // Use preferences to determine the animal personality
    const prefs = profile.preferences || {}
    const travelerType = profile.travelerType.toLowerCase()

    // Create a scoring system based on preferences
    const scores = {
      adventurous: (prefs.spontaneity || 0) * 0.7 + (prefs.exploration || 0) * 0.3,
      cultural: (prefs.exploration || 0) * 0.6 + (prefs.aesthetics || 0) * 0.4,
      luxury: (prefs.luxury || 0) * 0.8 + (prefs.aesthetics || 0) * 0.2,
      social: ((prefs.social?.group || 0) + (prefs.social?.family || 0)) * 0.5,
      independent: (prefs.social?.solo || 0) * 0.8,
      active: (prefs.activity || 0) * 0.9,
      relaxed: 100 - (prefs.activity || 50),
      beachLover: (prefs.environment?.beach || 0) * 0.9,
      cityExplorer: (prefs.environment?.city || 0) * 0.9,
      mountaineer: (prefs.environment?.mountains || 0) * 0.9,
      photographer: (prefs.aesthetics || 0) * 0.9,
    }

    // Find the highest scoring trait
    let dominantTrait = Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0]

    // Override with traveler type if it's very specific
    if (travelerType.includes("digital") || travelerType.includes("nomad")) dominantTrait = "digital"
    if (travelerType.includes("beach")) dominantTrait = "beachLover"
    if (travelerType.includes("city") || travelerType.includes("urban")) dominantTrait = "cityExplorer"
    if (travelerType.includes("luxury")) dominantTrait = "luxury"
    if (travelerType.includes("social")) dominantTrait = "social"
    if (travelerType.includes("aesthetic") || travelerType.includes("insta")) dominantTrait = "photographer"

    // Map traits to animals with fun, personalized descriptions
    const animalMap = {
      adventurous: {
        name: language === "zh" ? "狐狸" : "Fox",
        emoji: "🦊",
        reason:
          language === "zh"
            ? "靈活機智，總能找到隱藏路徑和秘密捷徑，就像你在旅行中的冒險精神"
            : "clever and resourceful, always finding hidden paths and secret shortcuts, just like your adventurous spirit on the road",
      },
      cultural: {
        name: language === "zh" ? "貓頭鷹" : "Owl",
        emoji: "🦉",
        reason:
          language === "zh"
            ? "觀察力敏銳，吸收知識，欣賞當地文化的精髓，正如你對旅行中文化體驗的熱愛"
            : "observant and knowledge-absorbing, appreciating the essence of local cultures, just like your love for cultural experiences",
      },
      luxury: {
        name: language === "zh" ? "孔雀" : "Peacock",
        emoji: "🦚",
        reason:
          language === "zh"
            ? "優雅華麗，享受精緻生活，不會為了舒適而妥協，就像你的高品質旅行標準"
            : "elegant and magnificent, enjoying the finer things and never compromising on comfort, just like your high standards for travel",
      },
      social: {
        name: language === "zh" ? "海豚" : "Dolphin",
        emoji: "🐬",
        reason:
          language === "zh"
            ? "群居友善，喜歡與他人建立聯繫，在社交中找到快樂，正如你享受與他人共享旅行體驗"
            : "social and friendly, thriving on connections with others and finding joy in community, just like how you enjoy sharing travel experiences",
      },
      independent: {
        name: language === "zh" ? "獵豹" : "Cheetah",
        emoji: "🐆",
        reason:
          language === "zh"
            ? "獨立自主，按照自己的節奏行動，不受群體限制，就像你喜歡的自由旅行方式"
            : "independent and self-sufficient, moving at your own pace without being held back, just like your free-spirited travel style",
      },
      active: {
        name: language === "zh" ? "蜂鳥" : "Hummingbird",
        emoji: "🐦",
        reason:
          language === "zh"
            ? "精力充沛，永不停歇，總是在尋找下一個活動，就像你充滿活力的旅行方式"
            : "energetic and always on the move, buzzing from one activity to the next, just like your action-packed travel style",
      },
      relaxed: {
        name: language === "zh" ? "樹懶" : "Sloth",
        emoji: "🦥",
        reason:
          language === "zh"
            ? "悠閒自在，享受當下，不急於趕路，正如你喜歡的放鬆旅行節奏"
            : "taking life at your own pace and savoring every moment without rushing, just like your relaxed travel rhythm",
      },
      beachLover: {
        name: language === "zh" ? "海龜" : "Sea Turtle",
        emoji: "🐢",
        reason:
          language === "zh"
            ? "在海洋中自在游弋，總是被海灘吸引，就像你對海岸線和藍色海水的熱愛"
            : "gliding effortlessly through ocean waters and always drawn to the shore, just like your love for coastlines and blue waters",
      },
      cityExplorer: {
        name: language === "zh" ? "浣熊" : "Raccoon",
        emoji: "🦝",
        reason:
          language === "zh"
            ? "城市中的生存專家，善於發現城市寶藏，就像你在都市叢林中尋找隱藏景點的能力"
            : "thriving in urban environments and finding treasures others miss, just like your talent for discovering hidden city gems",
      },
      mountaineer: {
        name: language === "zh" ? "山羊" : "Mountain Goat",
        emoji: "🐐",
        reason:
          language === "zh"
            ? "攀登高峰，征服困難地形，享受壯麗景色，正如你對山脈和高海拔冒險的熱情"
            : "scaling peaks and conquering difficult terrain with ease, just like your passion for mountains and high-altitude adventures",
      },
      digital: {
        name: language === "zh" ? "章魚" : "Octopus",
        emoji: "🐙",
        reason:
          language === "zh"
            ? "多任務處理的大師，適應各種環境，同時保持連接，就像你平衡工作和旅行的能力"
            : "a master of multitasking and adapting to different environments while staying connected, just like your ability to balance work and travel",
      },
      photographer: {
        name: language === "zh" ? "變色龍" : "Chameleon",
        emoji: "🦎",
        reason:
          language === "zh"
            ? "擁有敏銳的視覺和對美的欣賞，能捕捉周圍環境的精髓，就像你捕捉完美照片的天賦"
            : "with a keen eye for beauty and ability to capture the essence of surroundings, just like your talent for finding the perfect photo",
      },
    }

    // Default if no match (should rarely happen with this system)
    const defaultAnimal = {
      name: language === "zh" ? "變色龍" : "Chameleon",
      emoji: "🦎",
      reason:
        language === "zh"
          ? "適應各種環境，隨時改變以融入周圍，就像你靈活多變的旅行風格"
          : "adapting to any environment and changing to suit your surroundings, just like your flexible travel style",
    }

    return animalMap[dominantTrait] || defaultAnimal
  }

  // Get trip role based on preferences and quiz answers
  const getTripRole = () => {
    const prefs = profile.preferences || {}

    // Create a more nuanced scoring system
    const scores = {
      planner: 100 - (prefs.spontaneity || 50),
      spontaneous: prefs.spontaneity || 0,
      luxuryFocused: prefs.luxury || 0,
      budgetMaster: 100 - (prefs.luxury || 50),
      explorer: prefs.exploration || 0,
      photographer: prefs.aesthetics || 0,
      activityDirector: prefs.activity || 0,
      relaxationGuide: 100 - (prefs.activity || 50),
      foodie: prefs.activities?.culinary || 0,
      culturalGuide: prefs.activities?.cultural || 0,
      partyPlanner: prefs.activities?.nightlife || 0,
      adventureLeader: prefs.activities?.adventure || 0,
    }

    // Find top two traits for more nuanced roles
    const sortedTraits = Object.entries(scores).sort((a, b) => b[1] - a[1])
    const primaryTrait = sortedTraits[0][0]
    const secondaryTrait = sortedTraits[1][0]

    // Combine traits for more specific roles
    const combinedRole = `${primaryTrait}_${secondaryTrait}`

    // Map of roles with fun, engaging descriptions
    const roleMap = {
      // Primary roles
      planner: {
        role: language === "zh" ? "行程規劃大師" : "Itinerary Wizard",
        emoji: "📋",
        description:
          language === "zh"
            ? "你的Google文檔和行程表是旅行聖經，團隊成員總是問「今天我們做什麼？」，而你早已準備好完美答案"
            : "your Google Docs and spreadsheets are the group's travel bible, and when everyone asks 'what are we doing today?' you've already got the perfect answer",
      },
      spontaneous: {
        role: language === "zh" ? "即興冒險家" : "Spontaneity Champion",
        emoji: "🎭",
        description:
          language === "zh"
            ? "「計劃是什麼？」是你的口頭禪，你帶領大家發現意外驚喜，創造最難忘的旅行故事"
            : "'what's a plan?' is your motto as you lead the group to unexpected discoveries that become everyone's favorite travel stories",
      },
      explorer: {
        role: language === "zh" ? "探索先鋒" : "Discovery Scout",
        emoji: "🔍",
        description:
          language === "zh"
            ? "總是第一個發現隱藏景點的人，你的「我聽說這附近有個地方...」總是帶來驚喜"
            : "always the first to find hidden spots, your 'I heard about this place nearby...' leads to everyone's favorite discoveries",
      },

      // Combined roles for more specificity
      planner_explorer: {
        role: language === "zh" ? "秘境獵人" : "Hidden Gem Hunter",
        emoji: "🗺️",
        description:
          language === "zh"
            ? "你精心研究每個目的地的秘密景點，帶領團隊探索遠離旅遊路線的真實體驗"
            : "meticulously researching each destination's secrets and leading the group to authentic experiences far from the tourist trail",
      },
      explorer_photographer: {
        role: language === "zh" ? "視覺故事家" : "Visual Storyteller",
        emoji: "📸",
        description:
          language === "zh"
            ? "你不僅找到最美的地方，還能捕捉完美瞬間，讓每個人的Instagram都充滿讚嘆"
            : "not only finding the most beautiful spots but capturing the perfect moments that make everyone's Instagram followers jealous",
      },
      spontaneous_adventureLeader: {
        role: language === "zh" ? "冒險催化劑" : "Adventure Catalyst",
        emoji: "⚡",
        description:
          language === "zh"
            ? "「要不要試試看？」是你的口頭禪，你的即興決定總是變成旅行中最刺激的回憶"
            : "'why not try it?' is your catchphrase, turning random ideas into the most thrilling memories of the trip",
      },
      luxuryFocused_planner: {
        role: language === "zh" ? "體驗策劃師" : "Experience Curator",
        emoji: "✨",
        description:
          language === "zh"
            ? "你確保每個細節都達到完美，從餐廳預訂到酒店房間，你的品味讓旅行升級為藝術"
            : "ensuring every detail is exquisite, from restaurant reservations to hotel rooms, your taste elevates travel to an art form",
      },
      foodie_explorer: {
        role: language === "zh" ? "美食獵人" : "Culinary Detective",
        emoji: "🍜",
        description:
          language === "zh"
            ? "你有尋找當地最佳美食的超能力，總是知道哪家小店有最道地的料理"
            : "with a superpower for finding the best local eats, you always know which hole-in-the-wall has the most authentic dishes",
      },
      culturalGuide_explorer: {
        role: language === "zh" ? "文化翻譯官" : "Cultural Interpreter",
        emoji: "🏛️",
        description:
          language === "zh"
            ? "你深入了解當地習俗和歷史，為團隊提供背景知識，讓每個景點都更有意義"
            : "diving deep into local customs and history, providing context that makes every site visit more meaningful for the group",
      },
      partyPlanner_spontaneous: {
        role: language === "zh" ? "夜生活指南" : "Nightlife Navigator",
        emoji: "🎉",
        description:
          language === "zh"
            ? "你總能找到最熱門的派對和酒吧，確保旅行的夜晚和白天一樣精彩"
            : "always finding the hottest parties and coolest bars, ensuring the nights are just as memorable as the days",
      },
      photographer_luxuryFocused: {
        role: language === "zh" ? "風格總監" : "Style Director",
        emoji: "🌟",
        description:
          language === "zh"
            ? "你的審美眼光無與倫比，從完美的照片角度到時尚的住宿選擇，你提升整個旅行的品質"
            : "with an unmatched eye for aesthetics, from perfect photo angles to stylish accommodation choices, you elevate the entire trip",
      },
    }

    // Try to get the combined role first, then fall back to primary
    return (
      roleMap[combinedRole] ||
      roleMap[primaryTrait] || {
        role: language === "zh" ? "旅行協調者" : "Travel Harmonizer",
        emoji: "🧭",
        description:
          language === "zh"
            ? "你能平衡不同的旅行風格和喜好，確保每個人都有最佳體驗"
            : "balancing different travel styles and preferences, making sure everyone has their best experience",
      }
    )
  }

  // Get travel superpower based on traveler type and preferences
  const getTravelSuperpower = () => {
    const prefs = profile.preferences || {}
    const travelerType = profile.travelerType.toLowerCase()

    // Create a scoring system for different superpowers
    const scores = {
      terrainSensing: (prefs.exploration || 0) * 0.7 + (prefs.activities?.adventure || 0) * 0.3,
      culturalChameleon: (prefs.activities?.cultural || 0) * 0.8 + (prefs.exploration || 0) * 0.2,
      upgradeCharm: (prefs.luxury || 0) * 0.9,
      wifiWhisperer:
        (prefs.activities?.cultural || 0) * 0.3 +
        (travelerType.includes("digital") || travelerType.includes("nomad") ? 50 : 0),
      cityNavigation:
        (prefs.environment?.city || 0) * 0.8 +
        (travelerType.includes("city") || travelerType.includes("urban") ? 30 : 0),
      weatherIntuition: (prefs.environment?.beach || 0) * 0.6 + (prefs.environment?.mountains || 0) * 0.4,
      friendMagnetism: (prefs.social?.group || 0) * 0.7 + (prefs.social?.couple || 0) * 0.3,
      goldenHourVision: (prefs.aesthetics || 0) * 0.9,
      foodRadar: (prefs.activities?.culinary || 0) * 0.9,
      budgetOptimizer: (100 - (prefs.luxury || 50)) * 0.8,
      partyDetector: (prefs.activities?.nightlife || 0) * 0.9,
      timeWarpAbility: (prefs.spontaneity || 0) * 0.5 + (prefs.activity || 0) * 0.5,
    }

    // Find the highest scoring superpower
    const sortedPowers = Object.entries(scores).sort((a, b) => b[1] - a[1])
    const dominantPower = sortedPowers[0][0]

    // Map of superpowers with fun, engaging descriptions
    const superpowerMap = {
      terrainSensing: {
        power: language === "zh" ? "地形感應" : "Terrain Intuition",
        emoji: "🧭",
        description:
          language === "zh"
            ? "你有著神奇的第六感，總能找到最刺激的徒步路線、最隱秘的海灘和最壯觀的觀景點，彷彿大自然在對你耳語"
            : "your sixth sense for finding the most thrilling hiking trails, secluded beaches, and spectacular viewpoints is uncanny—it's like nature whispers its secrets to you",
      },
      culturalChameleon: {
        power: language === "zh" ? "文化變色龍" : "Cultural Shapeshifting",
        emoji: "🌏",
        description:
          language === "zh"
            ? "你能迅速融入任何文化環境，幾小時內就能掌握關鍵短語，找到當地人最愛的餐廳，並與陌生人成為朋友"
            : "you blend into any cultural setting within hours, picking up key phrases, finding locals-only restaurants, and making friends with strangers like you've lived there forever",
      },
      upgradeCharm: {
        power: language === "zh" ? "升級魔法" : "Upgrade Sorcery",
        emoji: "⭐",
        description:
          language === "zh"
            ? "不知怎的，你總是獲得免費房間升級、意外的香檳和特殊待遇，彷彿你的微笑有著神奇的力量"
            : "somehow, you always score free room upgrades, unexpected champagne, and special treatment—your smile seems to have magical powers at hotel check-ins",
      },
      wifiWhisperer: {
        power: language === "zh" ? "網絡感應" : "WiFi Whispering",
        emoji: "📱",
        description:
          language === "zh"
            ? "無論身在何處，你總能找到最強的WiFi信號和最佳的遠程工作環境，讓你在旅行中保持高效連接"
            : "no matter where you are, you can sense the strongest WiFi signal and perfect remote work spots, keeping you connected and productive while exploring the world",
      },
      cityNavigation: {
        power: language === "zh" ? "城市導航" : "Urban Telepathy",
        emoji: "🏙️",
        description:
          language === "zh"
            ? "你在複雜的城市中從不迷路，總能找到捷徑和隱藏的小巷，彷彿你腦中有一張不斷更新的地圖"
            : "you never get lost in complex cities and always find shortcuts and hidden alleys, as if you have a constantly updating map in your mind",
      },
      weatherIntuition: {
        power: language === "zh" ? "天氣預知" : "Weather Foresight",
        emoji: "🌦️",
        description:
          language === "zh"
            ? "你有著預測天氣變化的神奇能力，總是知道何時去海灘或何時帶傘，讓你的戶外計劃總是完美"
            : "your uncanny ability to predict weather changes means you always know when to hit the beach or pack an umbrella, making your outdoor plans consistently perfect",
      },
      friendMagnetism: {
        power: language === "zh" ? "友誼磁場" : "Friendship Magnetism",
        emoji: "🤝",
        description:
          language === "zh"
            ? "你有著吸引有趣人物的超能力，在每個目的地都能建立聯繫，創造難忘的社交體驗"
            : "your superpower for attracting interesting characters means you create memorable social experiences and connections in every destination",
      },
      goldenHourVision: {
        power: language === "zh" ? "黃金時刻視覺" : "Golden Hour Vision",
        emoji: "📸",
        description:
          language === "zh"
            ? "你總能找到完美的拍攝角度和最佳光線，捕捉令人驚嘆的照片，讓你的社交媒體充滿藝術感"
            : "you always find the perfect photo angles and lighting, capturing breathtaking images that make your social media look like a professional travel magazine",
      },
      foodRadar: {
        power: language === "zh" ? "美食雷達" : "Culinary Radar",
        emoji: "🍽️",
        description:
          language === "zh"
            ? "你能直覺地找到最道地的美食，無論是街頭小吃還是隱藏餐廳，你的味蕾引導你找到令人難忘的美食體驗"
            : "your instinct for finding authentic food is legendary—whether it's street food or hidden restaurants, your taste buds guide you to unforgettable culinary experiences",
      },
      budgetOptimizer: {
        power: language === "zh" ? "預算最佳化" : "Value Optimization",
        emoji: "💰",
        description:
          language === "zh"
            ? "你有著神奇的能力，能用最少的錢獲得最大的體驗價值，找到隱藏的優惠和免費活動"
            : "your magical ability to stretch every dollar means you find hidden deals, free activities, and get maximum experience value while others overspend",
      },
      partyDetector: {
        power: language === "zh" ? "派對雷達" : "Nightlife Navigation",
        emoji: "🎉",
        description:
          language === "zh"
            ? "你總能找到最熱鬧的派對和最酷的夜生活場所，無論在哪個城市，你都知道夜晚該去哪裡"
            : "you can sense where the best parties and coolest nightlife spots are in any city, ensuring you never miss out on the most exciting after-dark experiences",
      },
      timeWarpAbility: {
        power: language === "zh" ? "時間延展" : "Time Bending",
        emoji: "⏱",
        description:
          language === "zh"
            ? "你神奇地能在有限的時間內體驗更多，彷彿能延展每一天，讓短暫的假期感覺像漫長的冒險"
            : "you magically fit more experiences into limited time, making short vacations feel like extended adventures and never wasting a precious travel moment",
      },
    }

    return (
      superpowerMap[dominantPower] || {
        power: language === "zh" ? "旅行適應力" : "Travel Adaptation",
        emoji: "✨",
        description:
          language === "zh"
            ? "你能迅速適應任何旅行情況和挑戰，像變色龍一樣融入不同環境，讓每次旅行都順利無比"
            : "you quickly adapt to any travel situation or challenge, chameleon-like in your ability to thrive in different environments",
      }
    )
  }

  // Generate destination recommendations with match percentages and descriptions
  const getDestinationRecommendations = () => {
    // Define some sample destinations with detailed descriptions
    const sampleDestinations = [
      {
        location: "Shibuya, Tokyo, Japan",
        description: "where neon lights meet endless culture",
        keywords: ["city", "nightlife", "shopping"],
        matchPercentage: 95,
      },
      {
        location: "Shoreditch, London, UK",
        description: "edgy art scenes and sick cafes",
        keywords: ["urban", "culture", "food"],
        matchPercentage: 92,
      },
      {
        location: "Brooklyn, New York City, USA",
        description: "for those classic skyline views",
        keywords: ["city", "nightlife", "art"],
        matchPercentage: 89,
      },
    ]

    // Add this new function inside getDestinationRecommendations
    const getPersonalizedReason = (location: string, description: string, preferences: any) => {
      const locLower = location.toLowerCase()
      const descLower = description.toLowerCase()
      const travelerType = profile.travelerType.toLowerCase()

      // Personalized reasons based on traveler type and preferences
      if (travelerType.includes("luxury") && (locLower.includes("bali") || locLower.includes("maldives"))) {
        return "Perfect for your taste in exclusive resorts and premium experiences"
      }

      if (travelerType.includes("adventure") && (locLower.includes("zealand") || locLower.includes("patagonia"))) {
        return "Matches your adventure-seeking spirit with world-class outdoor activities"
      }

      if (travelerType.includes("digital") && (locLower.includes("bali") || locLower.includes("lisbon"))) {
        return "Ideal for your remote work lifestyle with great wifi and co-working spaces"
      }

      if (travelerType.includes("cultural") && (locLower.includes("kyoto") || locLower.includes("rome"))) {
        return "Aligns with your passion for authentic cultural immersion"
      }

      if (preferences.aesthetics > 70 && (locLower.includes("santorini") || locLower.includes("paris"))) {
        return "Perfect for your eye for beauty and Instagram-worthy moments"
      }

      if (preferences.activities?.nightlife > 70 && (locLower.includes("berlin") || locLower.includes("bangkok"))) {
        return "Matches your love for vibrant nightlife and social scenes"
      }

      if (preferences.activities?.culinary > 70 && (locLower.includes("tokyo") || locLower.includes("lyon"))) {
        return "Ideal for your foodie adventures with world-class cuisine"
      }

      if (preferences.environment?.beach > 70 && (locLower.includes("maldives") || locLower.includes("hawaii"))) {
        return "Perfect for your beach-loving soul and ocean adventures"
      }

      if (preferences.environment?.mountains > 70 && (locLower.includes("swiss") || locLower.includes("nepal"))) {
        return "Matches your mountain-seeking spirit and love for dramatic landscapes"
      }

      if (preferences.environment?.city > 70 && (locLower.includes("york") || locLower.includes("tokyo"))) {
        return "Ideal for your urban exploration style and city energy"
      }

      // Default personalized reason based on traveler type
      return `Perfectly matches your ${travelerType.replace(/er$/, "")} travel style`
    }

    // When returning the destinations, include the personalized reason
    if (profile.destinations && profile.destinations.length > 0) {
      return profile.destinations
        .map((destination, index) => {
          // Extract location and description if possible
          let location = destination
          let description = ""

          // Try to split on common patterns
          if (destination.includes(" - ")) {
            const parts = destination.split(" - ")
            location = parts[0]
            description = parts[1]
          } else if (destination.includes(" for ")) {
            const parts = destination.split(" - ")
            location = parts[0]
            description = "for " + parts[1]
          } else if (destination.includes(" (")) {
            const parts = destination.split(" (")
            location = parts[0]
            description = parts[1].replace(")", "")
          }

          // Add country if not present
          if (!location.includes(",")) {
            // Try to determine country based on city name
            const cityToCountry: Record<string, string> = {
              Tokyo: "Japan",
              Kyoto: "Japan",
              Osaka: "Japan",
              London: "UK",
              Manchester: "UK",
              Edinburgh: "UK",
              "New York": "USA",
              "Los Angeles": "USA",
              "San Francisco": "USA",
              Paris: "France",
              Nice: "France",
              Rome: "Italy",
              Venice: "Italy",
              Florence: "Italy",
              Barcelona: "Spain",
              Madrid: "Spain",
              Berlin: "Germany",
              Amsterdam: "Netherlands",
              Sydney: "Australia",
              Melbourne: "Australia",
              Bangkok: "Thailand",
              Bali: "Indonesia",
            }

            // Check if any key in cityToCountry is included in the location string
            for (const [city, country] of Object.entries(cityToCountry)) {
              if (location.includes(city)) {
                location = `${location}, ${country}`
                break
              }
            }
          }

          // Generate keywords based on the description
          const generateKeywords = (desc: string) => {
            const keywordMap: Record<string, string[]> = {
              nightlife: ["nightlife", "bars", "clubs", "neon", "night"],
              food: ["food", "dining", "restaurants", "culinary", "cafes", "eateries"],
              culture: ["culture", "museums", "history", "art", "galleries", "historic"],
              nature: ["nature", "outdoors", "hiking", "scenery", "landscape"],
              beach: ["beach", "coastal", "ocean", "relaxation", "island"],
              shopping: ["shopping", "markets", "boutiques", "shops", "fashion"],
              adventure: ["adventure", "activities", "sports", "hiking"],
              luxury: ["luxury", "upscale", "exclusive", "chic"],
              hipster: ["hipster", "trendy", "bohemian", "artsy", "indie"],
              city: ["city", "urban", "skyline", "metropolitan"],
            }

            const keywords: string[] = []
            const descLower = desc.toLowerCase()
            const locationLower = location.toLowerCase()

            // Check for location type keywords
            if (
              locationLower.includes("city") ||
              locationLower.includes("urban") ||
              locationLower.includes("tokyo") ||
              locationLower.includes("new york") ||
              locationLower.includes("london")
            ) {
              keywords.push(language === "zh" ? "城市" : "city")
            } else if (
              locationLower.includes("beach") ||
              locationLower.includes("coast") ||
              locationLower.includes("island")
            ) {
              keywords.push(language === "zh" ? "海灘" : "beach")
            } else if (locationLower.includes("mountain") || locationLower.includes("alps")) {
              keywords.push(language === "zh" ? "山脈" : "mountains")
            }

            // Check for activity keywords
            for (const [key, terms] of Object.entries(keywordMap)) {
              for (const term of terms) {
                if (descLower.includes(term) || locationLower.includes(term)) {
                  const translatedKey =
                    language === "zh"
                      ? {
                          nightlife: "夜生活",
                          food: "美食",
                          culture: "文化",
                          nature: "自然",
                          beach: "海灘",
                          shopping: "購物",
                          adventure: "冒險",
                          luxury: "奢華",
                          hipster: "時尚",
                          city: "城市",
                        }[key] || key
                      : key

                  keywords.push(translatedKey)
                  break
                }
              }
            }

            // Add a default if no keywords found
            if (keywords.length === 0) {
              keywords.push(language === "zh" ? "氛圍" : "vibes")
            }

            // Limit to 3 keywords and remove duplicates
            return [...new Set(keywords)].slice(0, 3)
          }

          // Calculate match percentage based on preferences if available
          let matchPercentage = 95 - index * 3 // Fallback

          if (profile.preferences) {
            // This is a simplified algorithm - in a real app, you'd have destination data with tags
            // that could be matched against user preferences
            const preferences = profile.preferences

            // Different destination types would match different preference profiles
            // This is a simplified simulation
            if (index === 0) {
              // First destination is always a great match
              matchPercentage = 95
            } else if (location.toLowerCase().includes("beach") || description.toLowerCase().includes("beach")) {
              // Beach destinations match relaxation preferences
              matchPercentage = 90 - index * 2
            } else if (
              location.toLowerCase().includes("museum") ||
              description.toLowerCase().includes("museum") ||
              location.toLowerCase().includes("cultural") ||
              description.toLowerCase().includes("cultural")
            ) {
              // Cultural destinations match exploration preferences
              matchPercentage = Math.min(95, preferences.exploration + 10) - index * 2
            } else if (
              location.toLowerCase().includes("adventure") ||
              description.toLowerCase().includes("adventure") ||
              location.toLowerCase().includes("hiking") ||
              description.toLowerCase().includes("hiking")
            ) {
              // Adventure destinations match spontaneity and activity preferences
              matchPercentage = Math.min(95, (preferences.spontaneity + preferences.activity) / 2 + 10) - index * 2
            } else if (
              location.toLowerCase().includes("luxury") ||
              description.toLowerCase().includes("luxury") ||
              location.toLowerCase().includes("resort") ||
              description.toLowerCase().includes("resort")
            ) {
              // Luxury destinations match luxury preferences
              matchPercentage = Math.min(95, preferences.luxury + 10) - index * 2
            } else if (
              location.toLowerCase().includes("photo") ||
              description.toLowerCase().includes("photo") ||
              location.toLowerCase().includes("scenic") ||
              description.toLowerCase().includes("scenic")
            ) {
              // Scenic destinations match aesthetics preferences
              matchPercentage = Math.min(95, preferences.aesthetics + 10) - index * 2
            } else {
              // Default match percentage based on position
              matchPercentage = 95 - index * 3
            }
          }

          // Add specific attractions for each destination
          const getSpecificAttractions = (loc: string) => {
            const locLower = loc.toLowerCase()

            // Tokyo
            if (locLower.includes("tokyo") || locLower.includes("japan")) {
              return language === "zh"
                ? ["澀谷十字路口拍照點", "築地外市場美食之旅"]
                : ["Shibuya Crossing photo spots", "Tsukiji Outer Market food tour"]
            }
            // Kyoto
            else if (locLower.includes("kyoto")) {
              return language === "zh"
                ? ["伏見稻荷神社徒步", "傳統茶道體驗"]
                : ["Fushimi Inari Shrine hike", "Traditional tea ceremony"]
            }
            // New York
            else if (locLower.includes("new york") || locLower.includes("nyc")) {
              return language === "zh"
                ? ["中央公園自行車租賃", "屋頂酒吧欣賞天際線"]
                : ["Central Park bike rental", "Rooftop bars with skyline views"]
            }
            // London
            else if (locLower.includes("london")) {
              return language === "zh"
                ? ["波羅市場美食攤位", "隱秘的地下酒吧"]
                : ["Borough Market food stalls", "Secret speakeasy bars"]
            }
            // Paris
            else if (locLower.includes("paris")) {
              return language === "zh"
                ? ["瑪黑區隱藏咖啡館", "塞納河日落遊船"]
                : ["Hidden cafés in Le Marais", "Seine River sunset cruise"]
            }
            // Default
            else {
              return language === "zh"
                ? ["當地隱藏寶地", "正宗文化體驗"]
                : ["Local hidden gems", "Authentic cultural experiences"]
            }
          }

          // Get location-specific attractions
          const locationAttractions = getSpecificAttractions(location)

          // Add this before the return statement
          const personalReason = getPersonalizedReason(location, description, profile.preferences || {})

          return {
            location,
            description:
              description ||
              (language === "zh" ? "令人驚嘆的目的地，提供獨特體驗" : "amazing destination with unique experiences"),
            keywords: generateKeywords(description || location),
            matchPercentage: Math.round(matchPercentage),
            attractions: locationAttractions,
            personalReason, // Add this new field
          }
        })
        .slice(0, 3) // Only return top 3 destinations
    }

    // If no destinations in profile, return sample destinations
    return sampleDestinations
  }

  // Scroll horizontally when mouse wheel is used on the recommendations container
  const handleWheel = (e: React.WheelEvent) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft += e.deltaY
      e.preventDefault()
    }
  }

  const recommendations = getDestinationRecommendations()
  const personalizedHacks = getPersonalizedTravelHacks(profile, language)

  // Get the dynamic background gradient
  const dynamicBackground = getDynamicBackground()

  return (
    <div ref={resultRef}>
      <Card className="w-full rounded-3xl overflow-hidden shadow-2xl border-0 glassmorphism">
        <CardContent className="p-0">
          <div className="flex flex-col items-center">
            {/* Dynamic gradient header with decorative elements */}
            <div className={`relative w-full h-48 sm:h-60 md:h-72 overflow-hidden bg-gradient-to-br ${getTypeColor()}`}>
              {/* Animated background with reduced opacity to show the gradient better */}
              <div className="opacity-70">
                <AnimatedBackground travelerType={profile.travelerType} className="z-0" />
              </div>

              {/* Share button with improved styling and hover effect */}
              <button
                className="absolute top-4 right-4 bg-white/40 backdrop-blur-md p-3 rounded-full z-10 hover:bg-white/60 transition-all hover:scale-110 shadow-lg border border-white/30 animate-pulse"
                onClick={handleShare}
                aria-label="Share your results"
              >
                <Share2 className="h-6 w-6 text-white" />
              </button>

              {/* Centered traveler type display */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 sm:px-6 z-10">
                <div className="inline-flex items-center bg-white/20 backdrop-blur-md px-4 py-2 sm:px-6 sm:py-3 rounded-full">
                  <span className="text-2xl sm:text-3xl mr-2 sm:mr-3">{getTravelerEmoji()}</span>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white">{profile.travelerType}</h2>
                </div>
              </div>
            </div>

            <div className="px-4 sm:px-6 py-6 sm:py-8 w-full">
              {/* NEW: Share CTA right after results */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-r from-violet-50 to-pink-50 rounded-2xl p-5 mb-6 text-center"
              >
                <h3 className="text-lg font-bold text-violet-800 mb-3">{t.results.shareAndChallenge}</h3>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                    onClick={() => {
                      navigator.clipboard.writeText("https://play.voyagerai.io")
                      setCopied(true)
                      setTimeout(() => setCopied(false), 2000)
                    }}
                    className="flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700"
                  >
                    {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {copied ? t.results.copied : t.results.copyLink}
                  </Button>
                  <Button
                    onClick={() => {
                      // Generate and share image
                      setShowShareModal(true)
                    }}
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90"
                  >
                    <Instagram className="h-4 w-4" />
                    {t.results.shareToIG}
                  </Button>
                </div>
              </motion.div>

              {/* Description card with gradient background and decorative elements */}
              <ProgressiveLoader delay={100}>
                <div className="bg-gradient-to-r from-violet-100 to-pink-100 rounded-2xl mb-8 relative overflow-hidden shadow-lg border border-violet-200">
                  {/* Decorative elements */}
                  <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-pink-200 opacity-30 -mr-10 -mt-10"></div>
                  <div className="absolute bottom-0 left-0 w-28 h-28 rounded-full bg-violet-200 opacity-40 -ml-10 -mb-10"></div>

                  {/* Header section with traveler type */}
                  <div className="bg-gradient-to-r from-violet-600 to-purple-600 p-4 flex items-center">
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mr-3">
                      <span className="text-2xl">{getTravelerEmoji()}</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{profile.travelerType}</h3>
                      <p className="text-white/80 text-sm">
                        {language === "zh" ? "你的旅行個性" : "Your Travel Personality"}
                      </p>
                    </div>
                  </div>

                  {/* Description text with enhanced styling */}
                  <div className="p-6">
                    <div className="relative z-10 bg-white/70 backdrop-blur-sm rounded-xl p-5 shadow-sm">
                      <div className="text-gray-800 text-lg leading-relaxed font-medium">
                        {formatDescription(profile.description)}
                      </div>
                    </div>
                  </div>
                </div>
              </ProgressiveLoader>

              {/* Travel Personality Insights - Enhanced with more dynamic content */}
              <ProgressiveLoader delay={200}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-gradient-to-r from-violet-50 to-pink-50 rounded-2xl p-4 sm:p-5 mb-6"
                >
                  <div className="flex items-center mb-3 sm:mb-4">
                    <Lightbulb className="h-6 w-6 mr-2 text-violet-600" />
                    <h3 className="text-xl sm:text-2xl font-bold text-violet-800">
                      {language === "zh" ? "旅行個性解析" : "Travel Personality Insights"}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:gap-5">
                    {/* Traveler Animal - More dynamic */}
                    <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm">
                      <div className="flex items-center mb-3">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-orange-100 flex items-center justify-center mr-3 sm:mr-4">
                          <span className="text-2xl sm:text-3xl">{getTravelerAnimal().emoji}</span>
                        </div>
                        <div>
                          <p className="text-sm sm:text-base text-gray-500">
                            {language === "zh" ? "如果你是一種動物" : "If you were an animal"}
                          </p>
                          <h4 className="font-bold text-gray-800 text-lg sm:text-xl capitalize">
                            {getTravelerAnimal().name}
                          </h4>
                        </div>
                      </div>
                      <p className="text-sm sm:text-base text-gray-700">{getTravelerAnimal().reason}</p>
                    </div>

                    {/* Trip Role - More dynamic */}
                    <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm">
                      <div className="flex items-center mb-3">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-blue-100 flex items-center justify-center mr-3 sm:mr-4">
                          <span className="text-2xl sm:text-3xl">{getTripRole().emoji}</span>
                        </div>
                        <div>
                          <p className="text-sm sm:text-base text-gray-500">
                            {language === "zh" ? "你在旅行團隊中的角色" : "Your role in the trip"}
                          </p>
                          <h4 className="font-bold text-gray-800 text-lg sm:text-xl capitalize">
                            {getTripRole().role}
                          </h4>
                        </div>
                      </div>
                      <p className="text-sm sm:text-base text-gray-700">{getTripRole().description}</p>
                    </div>

                    {/* Travel Superpower - More dynamic */}
                    <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm">
                      <div className="flex items-center mb-3">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-purple-100 flex items-center justify-center mr-3 sm:mr-4">
                          <span className="text-2xl sm:text-3xl">{getTravelSuperpower().emoji}</span>
                        </div>
                        <div>
                          <p className="text-sm sm:text-base text-gray-500">
                            {language === "zh" ? "你的旅行超能力" : "Your travel superpower"}
                          </p>
                          <h4 className="font-bold text-gray-800 text-lg sm:text-xl capitalize">
                            {getTravelSuperpower().power}
                          </h4>
                        </div>
                      </div>
                      <p className="text-sm sm:text-base text-gray-700">{getTravelSuperpower().description}</p>
                    </div>
                  </div>
                </motion.div>
              </ProgressiveLoader>

              {/* Destination Recommendations - TOP 3 ONLY */}
              <ProgressiveLoader delay={300}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-gradient-to-r from-violet-50 to-pink-50 rounded-2xl p-5 mb-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <Map className="h-5 w-5 mr-2 text-violet-600" />
                      <h3 className="text-xl font-bold text-violet-800">{t.results.recommendedForYou}</h3>
                    </div>
                    <div className="bg-violet-600 px-3 py-1 rounded-full text-xs font-medium text-white">
                      {t.results.basedOnProfile}
                    </div>
                  </div>

                  <p className="text-gray-600 mb-4">
                    {t.results.mightEnjoy.replace("{travelerType}", profile.travelerType)}
                  </p>

                  {/* Horizontal scrollable container */}
                  <div className="relative">
                    {/* Mobile indicator dots */}
                    <div className="flex justify-center gap-1 mb-3 md:hidden">
                      {recommendations.slice(0, 3).map((_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 rounded-full ${i === 0 ? "bg-violet-500" : "bg-violet-200"}`}
                        />
                      ))}
                    </div>

                    {/* Scrollable container - TOP 3 ONLY */}
                    <div
                      ref={scrollContainerRef}
                      className="flex overflow-x-auto pb-4 space-x-4 scrollbar-hide snap-x snap-mandatory"
                      onWheel={handleWheel}
                    >
                      {recommendations.slice(0, 3).map((rec, index) => (
                        <DestinationCard
                          key={index}
                          location={rec.location}
                          description={rec.description}
                          matchPercentage={rec.matchPercentage}
                          keywords={rec.keywords}
                          travelerType={profile.travelerType}
                          index={index}
                          attractions={rec.attractions}
                          personalReason={rec.personalReason}
                        />
                      ))}
                    </div>

                    {/* Mobile scroll hint */}
                    <div className="text-center text-xs text-gray-400 mt-2 md:hidden">{t.results.swipeToSeeMore}</div>
                  </div>
                </motion.div>
              </ProgressiveLoader>

              {/* Travel Tips - Now with fewer tips */}
              <ProgressiveLoader delay={400}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-gradient-to-br from-violet-50 to-pink-50 rounded-2xl p-5 mb-6"
                >
                  <h3 className="text-xl font-bold text-violet-800 mb-4 flex items-center">
                    <Lightbulb className="h-5 w-5 mr-2 text-amber-500" />
                    {t.results.travelHacksFor.replace("{travelerType}", profile.travelerType)}
                  </h3>
                  <ul className="space-y-3">
                    {personalizedHacks.map((tip, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                        className="flex items-start bg-white p-2 sm:p-3 rounded-xl shadow-sm"
                      >
                        <span className="text-lg sm:text-xl mr-2 sm:mr-3 flex-shrink-0 mt-0.5">
                          {index === 0 ? "💡" : index === 1 ? "✨" : "🔍"}
                        </span>
                        <span className="text-xs sm:text-sm md:text-base text-gray-700">{tip}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              </ProgressiveLoader>

              {/* Email capture - ENHANCED WITH ANIMATIONS */}
              <motion.div
                className={`bg-gradient-to-r ${getTypeColor()} rounded-2xl p-5 mb-6 text-white relative overflow-hidden`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Animated decorative elements */}
                <motion.div
                  className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/10"
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 90, 180, 270, 360],
                    opacity: [0.1, 0.2, 0.1],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                  }}
                />
                <motion.div
                  className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-white/10"
                  animate={{
                    scale: [1, 1.3, 1],
                    rotate: [360, 270, 180, 90, 0],
                    opacity: [0.1, 0.2, 0.1],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                    delay: 1,
                  }}
                />

                {/* Success animation overlay */}
                <AnimatePresence>
                  {showSuccessAnimation && (
                    <motion.div
                      className="absolute inset-0 bg-green-500 flex items-center justify-center flex-col z-50"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", damping: 10 }}
                      >
                        <CheckCircle className="h-16 w-16 text-white mb-2" />
                      </motion.div>
                      <motion.p
                        className="text-xl font-bold text-white"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        {t.results.youreIn}
                      </motion.p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex items-center mb-4">
                  <motion.div
                    className="bg-white/20 p-2 rounded-full mr-3"
                    whileHover={{ rotate: 15 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Mail className="h-5 w-5 text-white" />
                  </motion.div>
                  <motion.h3
                    className="text-xl font-bold"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    {t.results.getEarlyAccess}
                  </motion.h3>
                </div>

                <motion.p
                  className="mb-4 text-white/90"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  {t.results.earlyAccessDescription} {getPersonalizedCTA()}.
                </motion.p>

                <form onSubmit={handleSubscribe} className="space-y-3 relative z-5">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <motion.input
                      ref={emailInputRef}
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t.results.emailPlaceholder}
                      className="flex-1 px-4 py-3 rounded-xl text-gray-800 outline-none"
                      disabled={isPending}
                      whileFocus={{ scale: 1.02 }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9 }}
                    />
                    <motion.button
                      type="submit"
                      className="bg-white text-violet-600 font-medium px-6 py-3 h-auto rounded-xl hover:bg-gray-100 transition-colors"
                      disabled={isPending}
                      whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.0 }}
                    >
                      {isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : t.results.subscribeButton}
                    </motion.button>
                  </div>

                  {subscriptionStatus.message && !showSuccessAnimation && (
                    <div
                      className={`flex items-center text-sm ${
                        subscriptionStatus.success ? "text-green-100" : "text-red-100"
                      }`}
                    >
                      {subscriptionStatus.success ? (
                        <CheckCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                      ) : (
                        <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                      )}
                      {subscriptionStatus.message}
                    </div>
                  )}
                </form>
              </motion.div>

              {/* Action buttons */}
              <div className="flex flex-col space-y-3">
                <Button
                  onClick={handleShare}
                  variant="outline"
                  className="w-full border-2 border-violet-200 text-violet-700 hover:bg-violet-50 rounded-xl h-12 font-medium relative overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center justify-center">
                    {copied ? t.results.copied : t.results.shareWithFriends}{" "}
                    <Share2 className="ml-2 h-4 w-4 group-hover:animate-pulse" />
                  </span>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-to-r from-violet-400 to-pink-400 transition-opacity"></div>
                </Button>

                <Button
                  onClick={handleChallenge}
                  variant="outline"
                  className="w-full border-2 border-pink-200 text-pink-700 hover:bg-pink-50 rounded-xl h-12 font-medium relative overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center justify-center">
                    {language === "zh" ? "挑戰朋友" : "Challenge Friends"}{" "}
                    <Users className="ml-2 h-4 w-4 group-hover:animate-bounce" />
                  </span>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-to-r from-pink-400 to-rose-400 transition-opacity"></div>
                </Button>

                <Button
                  onClick={onReset}
                  variant="outline"
                  className="w-full border-2 border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl h-12 font-medium relative overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center justify-center">
                    {t.results.tryAgain}{" "}
                    <RotateCcw className="ml-2 h-4 w-4 group-hover:rotate-180 transition-transform duration-500" />
                  </span>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-to-r from-gray-400 to-slate-400 transition-opacity"></div>
                </Button>

                <Button
                  className={`w-full bg-gradient-to-r ${getTypeColor()} text-white hover:opacity-90 rounded-xl h-12 font-medium relative overflow-hidden group`}
                  onClick={() => window.open("https://play.voyagerai.io", "_blank")}
                >
                  <span className="relative z-10 flex items-center justify-center">
                    {t.results.checkoutVoyagerAI}{" "}
                    <ExternalLink className="ml-2 h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-white transition-opacity"></div>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <ShareModal profile={profile} isOpen={showShareModal} onClose={() => setShowShareModal(false)} />
      <ChallengeModal profile={profile} isOpen={showChallengeModal} onClose={() => setShowChallengeModal(false)} />
    </div>
  )
}
