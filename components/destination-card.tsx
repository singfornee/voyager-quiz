"use client"

import { motion } from "framer-motion"
import { MapPin, Percent, Tag } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

interface DestinationCardProps {
  location: string
  description: string
  matchPercentage: number
  keywords: string[]
  travelerType: string
  index: number
  attractions?: string[]
  personalReason?: string // Add this new prop
}

export default function DestinationCard({
  location,
  description,
  matchPercentage,
  keywords,
  travelerType,
  index,
  attractions = ["Local hidden gems", "Authentic cultural experiences"],
  personalReason,
}: DestinationCardProps) {
  const { language } = useLanguage()

  // First, let's update the getTagColor function to include more tag colors for the new keywords
  const getTagColor = (keyword: string) => {
    const keywordColors: Record<string, string> = {
      beach: "bg-cyan-500 text-white",
      city: "bg-slate-600 text-white",
      mountains: "bg-violet-500 text-white",
      countryside: "bg-emerald-500 text-white",
      culture: "bg-indigo-500 text-white",
      nightlife: "bg-pink-500 text-white",
      adventure: "bg-orange-500 text-white",
      food: "bg-amber-500 text-white",
      historical: "bg-amber-700 text-white",
      romantic: "bg-rose-400 text-white",
      relaxing: "bg-blue-400 text-white",
      luxury: "bg-purple-500 text-white",
      budget: "bg-green-500 text-white",
      family: "bg-teal-500 text-white",
      scenic: "bg-emerald-600 text-white",
      spiritual: "bg-indigo-400 text-white",
      shopping: "bg-pink-600 text-white",
      architecture: "bg-stone-600 text-white",
      海灘: "bg-cyan-500 text-white",
      城市: "bg-slate-600 text-white",
      山脈: "bg-violet-500 text-white",
      鄉村: "bg-emerald-500 text-white",
      文化: "bg-indigo-500 text-white",
      夜生活: "bg-pink-500 text-white",
      冒險: "bg-orange-500 text-white",
      美食: "bg-amber-500 text-white",
      歷史: "bg-amber-700 text-white",
      浪漫: "bg-rose-400 text-white",
      放鬆: "bg-blue-400 text-white",
      奢華: "bg-purple-500 text-white",
      預算: "bg-green-500 text-white",
      家庭: "bg-teal-500 text-white",
      風景: "bg-emerald-600 text-white",
      精神: "bg-indigo-400 text-white",
      購物: "bg-pink-600 text-white",
      建築: "bg-stone-600 text-white",
      vibes: "bg-purple-500 text-white",
      氛圍: "bg-purple-500 text-white",
    }

    return keywordColors[keyword.toLowerCase()] || "bg-violet-500 text-white"
  }

  // Get match color based on percentage
  const getMatchColor = () => {
    if (matchPercentage >= 90) return "text-green-500"
    if (matchPercentage >= 80) return "text-emerald-500"
    if (matchPercentage >= 70) return "text-teal-500"
    return "text-blue-500"
  }

  // Translate match text
  const getMatchText = () => {
    return language === "zh" ? "匹配度" : "match"
  }

  // Translate perfect for you text
  const getPerfectForYouText = () => {
    return language === "zh" ? "非常適合你" : "Perfect for you"
  }

  // First, update the section title translation function
  // Change the getMustVisitAttractionText function to getBestTimeToVisitText
  const getBestTimeToVisitText = () => {
    return language === "zh" ? "最佳旅行時間" : "Best time to visit"
  }

  // Then, replace the getMustVisitDescription function with getBestTimeToVisit
  const getBestTimeToVisit = () => {
    const locationLower = location.toLowerCase()

    // Beach destinations
    if (locationLower.includes("maldives")) {
      return language === "zh" ? "11月至4月（旱季）" : "November to April (dry season)"
    } else if (locationLower.includes("bora")) {
      return language === "zh" ? "5月至10月（冬季）" : "May to October (winter)"
    } else if (locationLower.includes("bahamas")) {
      return language === "zh" ? "12月至4月" : "December to April"
    } else if (locationLower.includes("hawaii")) {
      return language === "zh" ? "4-6月或9-10月" : "April-June or September-October"
    } else if (locationLower.includes("bali")) {
      return language === "zh" ? "4月至10月（旱季）" : "April to October (dry season)"
    }

    // City destinations
    else if (locationLower.includes("tokyo")) {
      return language === "zh"
        ? "3-4月（櫻花季）或10-11月（秋季）"
        : "March-April (cherry blossoms) or October-November (autumn)"
    } else if (locationLower.includes("new york") || locationLower.includes("nyc")) {
      return language === "zh" ? "4-6月或9-11月" : "April-June or September-November"
    } else if (locationLower.includes("paris")) {
      return language === "zh" ? "4-6月或9-10月" : "April-June or September-October"
    } else if (locationLower.includes("london")) {
      return language === "zh" ? "5月至9月" : "May to September"
    } else if (locationLower.includes("singapore")) {
      return language === "zh" ? "2-4月（較乾燥的月份）" : "February-April (drier months)"
    }

    // Mountain destinations
    else if (locationLower.includes("swiss") || locationLower.includes("alps")) {
      return language === "zh" ? "6-9月（徒步）或12-3月（滑雪）" : "June-September (hiking) or December-March (skiing)"
    } else if (locationLower.includes("nepal") || locationLower.includes("himalaya")) {
      return language === "zh" ? "10-11月或3-4月" : "October-November or March-April"
    } else if (locationLower.includes("andes")) {
      return language === "zh" ? "5-9月（旱季）" : "May-September (dry season)"
    }

    // Cultural destinations
    else if (locationLower.includes("rome") || locationLower.includes("italy")) {
      return language === "zh" ? "4-6月或9-10月" : "April-June or September-October"
    } else if (locationLower.includes("kyoto")) {
      return language === "zh" ? "3-4月（櫻花季）或11月（秋季）" : "March-April (cherry blossoms) or November (autumn)"
    } else if (locationLower.includes("istanbul")) {
      return language === "zh" ? "4-5月或9-10月" : "April-May or September-October"
    } else if (locationLower.includes("marrakech")) {
      return language === "zh" ? "3-5月或9-11月" : "March-May or September-November"
    }

    // Default seasonal recommendations
    const defaultSeasons =
      language === "zh"
        ? ["春季（3-5月）和秋季（9-11月）", "4-6月和9-10月", "5月和9月（淡季）", "3-5月（春季）或9-11月（秋季）"]
        : [
            "Spring (March-May) and Fall (September-November)",
            "April-June and September-October",
            "May and September (shoulder seasons)",
            "March-May (Spring) or September-November (Fall)",
          ]

    // Use the hash of the location name to pick a default season recommendation
    const hash = location.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return defaultSeasons[hash % defaultSeasons.length]
  }

  // Generate a card background color based on the destination and index
  const getCardGradient = () => {
    // Create a deterministic but varied color scheme based on location name and index
    const colorSchemes = [
      "from-cyan-500 to-blue-500",
      "from-violet-500 to-purple-500",
      "from-pink-500 to-rose-500",
      "from-amber-500 to-orange-500",
      "from-emerald-500 to-green-500",
      "from-indigo-500 to-blue-500",
      "from-fuchsia-500 to-pink-500",
      "from-teal-500 to-cyan-500",
      "from-red-500 to-orange-500",
      "from-blue-500 to-indigo-500",
    ]

    // Use a hash of the location name to pick a color scheme
    const hash = location.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
    const colorIndex = (hash + index) % colorSchemes.length

    return colorSchemes[colorIndex]
  }

  // Now, let's replace the getDestinationAttractions function with a new function that also returns destination-specific tags
  const getDestinationDetails = () => {
    const locationLower = location.toLowerCase()
    let attractions = ["Local hidden gems", "Authentic cultural experiences"]
    let tags = keywords // Start with the existing keywords

    // Beach destinations
    if (locationLower.includes("maldives")) {
      attractions =
        language === "zh"
          ? ["水上屋體驗", "珊瑚礁浮潛之旅"]
          : ["Overwater bungalow experience", "Coral reef snorkeling tours"]
      tags = language === "zh" ? ["海灘", "奢華", "放鬆", "浪漫"] : ["beach", "luxury", "relaxing", "romantic"]
    } else if (locationLower.includes("bora")) {
      attractions =
        language === "zh"
          ? ["私人海灘日落晚餐", "傳統舞蹈表演"]
          : ["Private beach sunset dinners", "Traditional dance performances"]
      tags = language === "zh" ? ["海灘", "奢華", "浪漫", "風景"] : ["beach", "luxury", "romantic", "scenic"]
    } else if (locationLower.includes("bahamas")) {
      attractions =
        language === "zh"
          ? ["游泳與豬島之旅", "海底洞穴探險"]
          : ["Swimming pigs island tour", "Underwater cave exploration"]
      tags = language === "zh" ? ["海灘", "冒險", "家庭", "放鬆"] : ["beach", "adventure", "family", "relaxing"]
    } else if (locationLower.includes("hawaii")) {
      attractions =
        language === "zh"
          ? ["火山國家公園徒步", "傳統夏威夷盧奧宴"]
          : ["Volcano National Park hikes", "Traditional Hawaiian luaus"]
      tags = language === "zh" ? ["海灘", "冒險", "文化", "風景"] : ["beach", "adventure", "culture", "scenic"]
    } else if (locationLower.includes("bali")) {
      attractions =
        language === "zh"
          ? ["烏布梯田日出之旅", "傳統巴厘舞蹈課程"]
          : ["Ubud rice terrace sunrise tours", "Traditional Balinese dance lessons"]
      tags = language === "zh" ? ["海灘", "精神", "文化", "預算"] : ["beach", "spiritual", "culture", "budget"]
    } else if (locationLower.includes("seychelles")) {
      attractions =
        language === "zh"
          ? ["塞舌爾巨龜保護區", "安塞拉齊奧海灘日落"]
          : ["Aldabra giant tortoise reserves", "Anse Lazio beach sunsets"]
      tags = language === "zh" ? ["海灘", "奢華", "自然", "浪漫"] : ["beach", "luxury", "nature", "romantic"]
    }

    // City destinations
    else if (locationLower.includes("tokyo")) {
      attractions =
        language === "zh"
          ? ["隱藏的深夜拉麵店", "當地藝術家工作室參觀"]
          : ["Hidden late-night ramen shops", "Local artist studio visits"]
      tags = language === "zh" ? ["城市", "美食", "科技", "購物"] : ["city", "food", "technology", "shopping"]
    } else if (locationLower.includes("new york") || locationLower.includes("nyc")) {
      attractions =
        language === "zh"
          ? ["布魯克林地下音樂現場", "高線公園日出瑜伽"]
          : ["Brooklyn underground music venues", "High Line sunrise yoga"]
      tags = language === "zh" ? ["城市", "藝術", "夜生活", "美食"] : ["city", "arts", "nightlife", "food"]
    } else if (locationLower.includes("paris")) {
      attractions =
        language === "zh"
          ? ["私人葡萄酒品鑒會", "塞納河畔秘密野餐點"]
          : ["Private wine tastings", "Secret picnic spots along the Seine"]
      tags = language === "zh" ? ["城市", "浪漫", "美食", "藝術"] : ["city", "romantic", "food", "arts"]
    } else if (locationLower.includes("london")) {
      attractions =
        language === "zh"
          ? ["隱藏的地下酒吧", "當地市場美食之旅"]
          : ["Hidden speakeasy bars", "Local market food tours"]
      tags = language === "zh" ? ["城市", "歷史", "文化", "購物"] : ["city", "historical", "culture", "shopping"]
    } else if (locationLower.includes("singapore")) {
      attractions =
        language === "zh" ? ["當地人宵夜熱點", "隱藏的屋頂花園"] : ["Local supper spots", "Hidden rooftop gardens"]
      tags = language === "zh" ? ["城市", "美食", "現代", "清潔"] : ["city", "food", "modern", "clean"]
    }

    // Mountain destinations
    else if (locationLower.includes("swiss") || locationLower.includes("alps")) {
      attractions =
        language === "zh"
          ? ["隱秘溫泉浴場", "當地奶酪製作工坊"]
          : ["Hidden thermal baths", "Local cheese-making workshops"]
      tags = language === "zh" ? ["山脈", "風景", "冒險", "奢華"] : ["mountains", "scenic", "adventure", "luxury"]
    } else if (locationLower.includes("nepal") || locationLower.includes("himalaya")) {
      attractions =
        language === "zh"
          ? ["與當地僧侶冥想體驗", "遠離人群的徒步路線"]
          : ["Meditation with local monks", "Off-the-beaten-path trekking routes"]
      tags = language === "zh" ? ["山脈", "精神", "冒險", "預算"] : ["mountains", "spiritual", "adventure", "budget"]
    } else if (locationLower.includes("andes")) {
      attractions =
        language === "zh"
          ? ["當地社區家庭寄宿", "傳統編織工作坊"]
          : ["Local community homestays", "Traditional weaving workshops"]
      tags = language === "zh" ? ["山脈", "文化", "冒險", "風景"] : ["mountains", "culture", "adventure", "scenic"]
    }

    // Cultural destinations
    else if (locationLower.includes("rome") || locationLower.includes("italy")) {
      attractions =
        language === "zh"
          ? ["私人羅馬遺跡導覽", "當地家庭烹飪課程"]
          : ["Private Roman ruins tours", "Home cooking classes with local families"]
      tags = language === "zh" ? ["歷史", "美食", "建築", "藝術"] : ["historical", "food", "architecture", "arts"]
    } else if (locationLower.includes("kyoto")) {
      attractions =
        language === "zh"
          ? ["清晨寺廟參拜體驗", "私人茶道課程"]
          : ["Early morning temple visits", "Private tea ceremony lessons"]
      tags =
        language === "zh" ? ["文化", "歷史", "精神", "傳統"] : ["culture", "historical", "spiritual", "traditional"]
    } else if (locationLower.includes("istanbul")) {
      attractions =
        language === "zh"
          ? ["當地香料市場導覽", "博斯普魯斯海峽私人遊船"]
          : ["Local spice market tours", "Private Bosphorus boat cruises"]
      tags = language === "zh" ? ["歷史", "文化", "美食", "建築"] : ["historical", "culture", "food", "architecture"]
    } else if (locationLower.includes("marrakech")) {
      attractions =
        language === "zh"
          ? ["隱藏的庭院茶館", "沙漠星空露營"]
          : ["Hidden courtyard tea houses", "Desert stargazing camps"]
      tags = language === "zh" ? ["文化", "市集", "歷史", "冒險"] : ["culture", "markets", "historical", "adventure"]
    }

    // Default attractions with some randomization
    if (attractions.length === 2 && attractions[0] === "Local hidden gems") {
      const defaultAttractions =
        language === "zh"
          ? [
              ["只有當地人知道的隱藏觀景點", "地道美食體驗"],
              ["非傳統路線的冒險", "文化沉浸活動"],
              ["完美照片的秘密地點", "當地節日和活動"],
              ["獨家導覽體驗", "正宗當地美食品嚐"],
            ]
          : [
              ["Hidden viewpoints only locals know", "Authentic food experiences"],
              ["Off-the-beaten-path adventures", "Cultural immersion activities"],
              ["Secret spots for perfect photos", "Local festivals and events"],
              ["Exclusive guided experiences", "Authentic local cuisine tastings"],
            ]

      // Use the hash of the location name to pick default attractions
      const hash = location.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
      attractions = defaultAttractions[hash % defaultAttractions.length]
    }

    return { attractions, tags }
  }

  // Get a unique description for each destination
  const getUniqueDescription = () => {
    const locationLower = location.toLowerCase()
    const placeName = location.split(",")[0].trim()

    // Beach destinations
    if (locationLower.includes("maldives")) {
      return language === "zh"
        ? "水晶般清澈的海水和私密的白沙灘，完美的水上屋體驗"
        : "Crystal-clear turquoise waters with private overwater bungalows and pristine white sand beaches"
    } else if (locationLower.includes("bora")) {
      return language === "zh"
        ? "世界上最美麗的環礁湖，被稱為「南太平洋的珍珠」"
        : "Home to the world's most beautiful lagoon, known as the 'Pearl of the South Pacific'"
    } else if (locationLower.includes("bahamas")) {
      return language === "zh"
        ? "粉紅沙灘和會游泳的小豬，加勒比海的天堂"
        : "Pink sand beaches and swimming pigs in this Caribbean paradise"
    } else if (locationLower.includes("hawaii")) {
      return language === "zh"
        ? "火山、衝浪和熱帶雨林的完美結合，阿羅哈精神的發源地"
        : "Volcanoes, surf, and tropical rainforests blend perfectly in the birthplace of aloha"
    } else if (locationLower.includes("bali")) {
      return language === "zh"
        ? "神聖寺廟、梯田和瑜伽靜修的精神之島"
        : "Island of sacred temples, rice terraces, and spiritual yoga retreats"
    } else if (locationLower.includes("seychelles")) {
      return language === "zh"
        ? "印度洋上的天堂，擁有世界上最美麗的海灘和獨特的野生動物"
        : "Paradise in the Indian Ocean with some of the world's most beautiful beaches and unique wildlife"
    }

    // City destinations
    else if (locationLower.includes("tokyo")) {
      return language === "zh"
        ? "未來與傳統的完美融合，從霓虹燈到寧靜的寺廟"
        : "Perfect blend of future and tradition, from neon lights to serene temples"
    } else if (locationLower.includes("new york") || locationLower.includes("nyc")) {
      return language === "zh"
        ? "永不睡眠的城市，充滿藝術、美食和無盡的能量"
        : "The city that never sleeps, packed with art, cuisine, and endless energy"
    } else if (locationLower.includes("paris")) {
      return language === "zh"
        ? "浪漫之都，擁有世界級的藝術、時尚和美食"
        : "City of romance with world-class art, fashion, and cuisine"
    } else if (locationLower.includes("london")) {
      return language === "zh"
        ? "歷史與現代並存的城市，充滿活力的藝術和音樂場景"
        : "Historic yet modern city with vibrant arts and music scenes"
    } else if (locationLower.includes("singapore")) {
      return language === "zh"
        ? "未來主義的花園城市，擁有世界一流的美食和建築"
        : "Futuristic garden city with world-class cuisine and architecture"
    }

    // Mountain destinations
    else if (locationLower.includes("swiss") || locationLower.includes("alps")) {
      return language === "zh"
        ? "壯麗的山峰、清澈的湖泊和童話般的村莊"
        : "Majestic peaks, crystal-clear lakes, and fairytale villages"
    } else if (locationLower.includes("nepal") || locationLower.includes("himalaya")) {
      return language === "zh"
        ? "世界屋脊，擁有令人敬畏的山脈和豐富的精神文化"
        : "Roof of the world with awe-inspiring mountains and rich spiritual culture"
    } else if (locationLower.includes("andes")) {
      return language === "zh"
        ? "南美洲的脊樑，從馬丘比丘到彩虹山的壯麗景觀"
        : "Backbone of South America with stunning vistas from Machu Picchu to Rainbow Mountain"
    }

    // Cultural destinations
    else if (locationLower.includes("rome")) {
      return language === "zh"
        ? "永恆之城，古羅馬遺跡與現代意大利生活方式的交匯"
        : "The Eternal City where ancient Roman ruins meet modern Italian lifestyle"
    } else if (locationLower.includes("kyoto")) {
      return language === "zh"
        ? "日本的文化心臟，擁有超過1600座寺廟和傳統的日本庭園"
        : "Japan's cultural heart with over 1,600 temples and traditional Japanese gardens"
    } else if (locationLower.includes("istanbul")) {
      return language === "zh"
        ? "橫跨歐亞的城市，融合了拜占庭、奧斯曼和現代土耳其文化"
        : "City straddling Europe and Asia, blending Byzantine, Ottoman, and modern Turkish cultures"
    } else if (locationLower.includes("marrakech")) {
      return language === "zh"
        ? "紅色城市，迷宮般的市集和令人驚嘆的宮殿"
        : "The Red City with maze-like souks and stunning palaces"
    }

    // Default descriptions with variety
    const defaultDescriptions =
      language === "zh"
        ? [
            `令人驚嘆的目的地，擁有獨特的文化體驗和難忘的風景`,
            `以壯麗的風景和熱情好客的當地人而聞名，他們分享真實的傳統`,
            `自然美景與文化豐富完美融合的地方，等待您的探索`,
            `冒險與放鬆完美結合的令人難以置信的目的地`,
          ]
        : [
            `A breathtaking destination with unique cultural experiences and unforgettable landscapes`,
            `Famous for its stunning scenery and welcoming locals who share authentic traditions`,
            `A perfect blend of natural beauty and cultural richness waiting to be explored`,
            `An incredible destination where adventure and relaxation come together seamlessly`,
          ]

    // Use the hash of the location name to pick a default description
    const hash = location.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return language === "zh"
      ? defaultDescriptions[hash % defaultDescriptions.length]
      : defaultDescriptions[hash % defaultDescriptions.length]
  }

  // Get destination-specific must-visit text

  // Now update the render section to use the new function
  // Replace the "Must visit" section with "Best time to visit"

  // Get destination-specific attractions and tags
  const destinationDetails = getDestinationDetails()
  const customAttractions = destinationDetails.attractions
  const destinationTags = destinationDetails.tags

  // Get unique description for this destination
  const uniqueDescription = getUniqueDescription()

  return (
    <motion.div
      className="flex-shrink-0 w-[280px] rounded-xl overflow-hidden shadow-md bg-white snap-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.1 }}
    >
      {/* Gradient header instead of image */}
      <div className={`h-36 bg-gradient-to-br ${getCardGradient()} p-4 flex flex-col justify-end`}>
        <div className="bg-white/20 backdrop-blur-md px-2 py-1 rounded-full text-white text-xs font-medium inline-flex items-center self-start mb-2">
          <Percent className="h-3 w-3 mr-1" />
          <span className={`text-white font-bold`}>{matchPercentage}%</span>{" "}
          <span className="ml-1">{getMatchText()}</span>
        </div>
        <h3 className="text-white font-bold text-lg drop-shadow-sm">{location}</h3>
      </div>

      <div className="p-4">
        <div className="flex flex-wrap gap-1 mb-3">
          {destinationTags.map((keyword, i) => (
            <div
              key={i}
              className={`${getTagColor(keyword)} px-2 py-0.5 rounded-full text-xs font-medium flex items-center shadow-sm`}
            >
              <Tag className="h-3 w-3 mr-1 opacity-70" />
              {keyword}
            </div>
          ))}
        </div>

        {/* Use the unique description instead of the generic one */}
        <p className="text-gray-600 text-sm mb-3">{uniqueDescription}</p>

        {/* Now showing all information directly without the "Show more" button */}
        <div className="mt-3 pt-3 border-t">
          {/* Perfect for you section */}
          <div className="mt-4">
            <h4 className="font-medium text-gray-800 mb-2">{getPerfectForYouText()}</h4>
            <p className="text-gray-600 text-sm italic mb-2">
              {personalReason || `${language === "zh" ? "符合你的風格" : "Matches your style"}`}
            </p>
            <ul className="space-y-2">
              {customAttractions?.map((attraction, i) => (
                <li key={i} className="flex items-start">
                  <MapPin className="h-4 w-4 text-violet-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-sm text-gray-600">{attraction}</span>
                </li>
              ))}
            </ul>
            <div className="mt-3 pt-3 border-t">
              <h4 className="font-medium text-gray-800 mb-2">{getBestTimeToVisitText()}</h4>
              <div className="bg-violet-50 rounded-lg p-2 text-center">
                <p className="text-sm font-medium text-violet-700">{getBestTimeToVisit()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
