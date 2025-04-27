"use client"

import { motion } from "framer-motion"
import { PieChart, BarChart, TrendingUp, Users, Percent } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

interface TravelerStatsProps {
  travelerType: string
}

export default function TravelerStats({ travelerType }: TravelerStatsProps) {
  const { language } = useLanguage()

  // Get statistics based on traveler type
  const getTypeStatistics = () => {
    // These are fictional statistics for demonstration purposes
    const stats: Record<
      string,
      {
        rarity: number
        destinations: string[]
        funFact: string
        travelBudget: string
        travelDuration: string
      }
    > = {
      "Adventurous Explorer": {
        rarity: 14,
        destinations: ["New Zealand", "Nepal", "Costa Rica"],
        funFact:
          language === "zh"
            ? "冒險探索者比其他旅行者多走15,000步/天"
            : "Adventurous Explorers walk 15,000 more steps per day than other travelers",
        travelBudget: language === "zh" ? "中等" : "Medium",
        travelDuration: language === "zh" ? "2-3週" : "2-3 weeks",
      },
      "Cultural Nomad": {
        rarity: 11,
        destinations: ["Japan", "Italy", "Morocco"],
        funFact: language === "zh" ? "文化探索者平均會說2.7種語言" : "Cultural Nomads speak 2.7 languages on average",
        travelBudget: language === "zh" ? "中等" : "Medium",
        travelDuration: language === "zh" ? "3-4週" : "3-4 weeks",
      },
      "Luxury Traveler": {
        rarity: 8,
        destinations: ["Maldives", "Switzerland", "Dubai"],
        funFact:
          language === "zh"
            ? "奢華旅行者在住宿上的花費是平均旅行者的4倍"
            : "Luxury Travelers spend 4x more on accommodations than average",
        travelBudget: language === "zh" ? "高" : "High",
        travelDuration: language === "zh" ? "1-2週" : "1-2 weeks",
      },
      "Digital Explorer": {
        rarity: 15,
        destinations: ["Bali", "Lisbon", "Mexico City"],
        funFact:
          language === "zh"
            ? "數位探險家平均每年訪問12個國家"
            : "Digital Explorers visit 12 countries per year on average",
        travelBudget: language === "zh" ? "中等" : "Medium",
        travelDuration: language === "zh" ? "1-3個月" : "1-3 months",
      },
      "Urban Adventurer": {
        rarity: 18,
        destinations: ["Tokyo", "New York", "London"],
        funFact:
          language === "zh"
            ? "城市冒險家在社交媒體上的旅行照片獲得的讚數比其他旅行者多40%"
            : "Urban Adventurers get 40% more likes on travel photos than other travelers",
        travelBudget: language === "zh" ? "中高" : "Medium-High",
        travelDuration: language === "zh" ? "1週" : "1 week",
      },
      "Beach Bum": {
        rarity: 16,
        destinations: ["Hawaii", "Thailand", "Greece"],
        funFact:
          language === "zh"
            ? "海灘愛好者平均每年花費120小時在陽光下"
            : "Beach Bums spend 120 hours in the sun per year on average",
        travelBudget: language === "zh" ? "中等" : "Medium",
        travelDuration: language === "zh" ? "1-2週" : "1-2 weeks",
      },
      Backpacker: {
        rarity: 13,
        destinations: ["Southeast Asia", "South America", "Eastern Europe"],
        funFact:
          language === "zh"
            ? "背包客的行李平均比其他旅行者輕60%"
            : "Backpackers travel with 60% less luggage than other travelers",
        travelBudget: language === "zh" ? "低" : "Low",
        travelDuration: language === "zh" ? "1-3個月" : "1-3 months",
      },
      "Foodie Traveler": {
        rarity: 12,
        destinations: ["France", "Japan", "Italy"],
        funFact:
          language === "zh"
            ? "美食旅行者平均每次旅行嘗試22種新食物"
            : "Foodie Travelers try 22 new foods on average per trip",
        travelBudget: language === "zh" ? "中高" : "Medium-High",
        travelDuration: language === "zh" ? "1-2週" : "1-2 weeks",
      },
      "Aesthetic Adventurer": {
        rarity: 9,
        destinations: ["Santorini", "Bali", "Morocco"],
        funFact:
          language === "zh"
            ? "美學冒險家平均每次旅行拍攝500張照片"
            : "Aesthetic Adventurers take 500 photos per trip on average",
        travelBudget: language === "zh" ? "中高" : "Medium-High",
        travelDuration: language === "zh" ? "1-2週" : "1-2 weeks",
      },
      "Social Explorer": {
        rarity: 10,
        destinations: ["Barcelona", "Berlin", "Bangkok"],
        funFact:
          language === "zh"
            ? "社交探索者在旅行中平均結交7個新朋友"
            : "Social Explorers make 7 new friends on average per trip",
        travelBudget: language === "zh" ? "中等" : "Medium",
        travelDuration: language === "zh" ? "2週" : "2 weeks",
      },
      "Luxury Nomad": {
        rarity: 7,
        destinations: ["Bora Bora", "Amalfi Coast", "Aspen"],
        funFact:
          language === "zh"
            ? "奢華漫遊者比其他旅行者多30%的機會升級座位"
            : "Luxury Nomads are 30% more likely to get seat upgrades than other travelers",
        travelBudget: language === "zh" ? "高" : "High",
        travelDuration: language === "zh" ? "2-3週" : "2-3 weeks",
      },
    }

    // Default stats if traveler type not found
    const defaultStats = {
      rarity: 10,
      destinations: ["Japan", "Italy", "Thailand"],
      funFact:
        language === "zh"
          ? "這種類型的旅行者比平均旅行者多訪問3個國家/年"
          : "This type of traveler visits 3 more countries per year than average",
      travelBudget: language === "zh" ? "中等" : "Medium",
      travelDuration: language === "zh" ? "2週" : "2 weeks",
    }

    return stats[travelerType] || defaultStats
  }

  const stats = getTypeStatistics()

  return (
    <div className="bg-gradient-to-r from-violet-50 to-pink-50 rounded-2xl p-5">
      <div className="flex items-center mb-4">
        <BarChart className="h-5 w-5 mr-2 text-violet-600" />
        <h3 className="text-xl font-bold text-violet-800">{language === "zh" ? "旅行者統計" : "Traveler Stats"}</h3>
      </div>

      <div className="space-y-4">
        {/* Rarity stat */}
        <motion.div
          className="bg-white rounded-xl p-4 shadow-sm"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-start">
            <div className="bg-violet-100 p-2 rounded-full mr-3">
              <Percent className="h-5 w-5 text-violet-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-800">{language === "zh" ? "稀有度" : "Rarity"}</h4>
              <p className="text-violet-700 font-bold text-lg">
                {language === "zh"
                  ? `只有${stats.rarity}%的旅行者屬於這種類型`
                  : `Only ${stats.rarity}% of travelers are this type`}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Fun fact */}
        <motion.div
          className="bg-white rounded-xl p-4 shadow-sm"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-start">
            <div className="bg-pink-100 p-2 rounded-full mr-3">
              <TrendingUp className="h-5 w-5 text-pink-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-800">{language === "zh" ? "有趣的事實" : "Fun Fact"}</h4>
              <p className="text-gray-700">{stats.funFact}</p>
            </div>
          </div>
        </motion.div>

        {/* Top destinations */}
        <motion.div
          className="bg-white rounded-xl p-4 shadow-sm"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-start">
            <div className="bg-amber-100 p-2 rounded-full mr-3">
              <PieChart className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-800">{language === "zh" ? "熱門目的地" : "Popular Destinations"}</h4>
              <div className="flex flex-wrap gap-2 mt-1">
                {stats.destinations.map((destination, index) => (
                  <span key={index} className="bg-amber-50 text-amber-700 px-2 py-1 rounded-full text-xs font-medium">
                    {destination}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Travel habits */}
        <motion.div
          className="bg-white rounded-xl p-4 shadow-sm"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-start">
            <div className="bg-emerald-100 p-2 rounded-full mr-3">
              <Users className="h-5 w-5 text-emerald-600" />
            </div>
            <div className="grid grid-cols-2 gap-4 w-full">
              <div>
                <h4 className="font-medium text-gray-800 text-sm">{language === "zh" ? "平均預算" : "Avg. Budget"}</h4>
                <p className="text-emerald-700 font-bold">{stats.travelBudget}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-800 text-sm">
                  {language === "zh" ? "平均旅行時間" : "Avg. Trip Length"}
                </h4>
                <p className="text-emerald-700 font-bold">{stats.travelDuration}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
