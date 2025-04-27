"use server"

import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"
import type { Language } from "@/lib/i18n"

// Update the TravelPreferences interface:

export interface TravelPreferences {
  spontaneity: number
  exploration: number
  luxury: number
  activity: number
  aesthetics: number
  environment?: {
    beach: number
    city: number
    mountains: number
    countryside: number
  }
  activities?: {
    cultural: number
    nightlife: number
    adventure: number
    culinary: number
  }
  social?: {
    solo: number
    couple: number
    group: number
    family: number
  }
}

export interface TravelProfile {
  travelerType: string
  description: string
  preferences: TravelPreferences
  destinations: string[]
  tips: string[]
  tags?: string[] // Added tags field
}

export async function generateTravelProfile(
  preferences: TravelPreferences,
  language: Language = "en",
): Promise<TravelProfile> {
  try {
    // Create a system prompt that instructs the model on what to generate
    let systemPrompt =
      language === "zh"
        ? `你是一位旅行顧問專家，能夠根據用戶的旅行偏好生成個性化的旅行者檔案。
    你的回應應該是一個JSON對象，包含以下字段：
    - travelerType: 一個簡短有力的旅行者類型名稱，最多2-3個詞（理想情況下2個詞）。使用1個氛圍詞+1個身份詞（例如"禪意探索者"、"海灘跳躍者"）。避免使用填充詞如"追求者"、"鑑賞家"、"生活方式者"。請使用有趣、情感豐富、充滿活力的詞彙。請確保這個名稱是完全用中文表達的，不要使用英文。
    - description: 一段Gen Z風格的描述，使用像"OMG"、"超級"、"真的是"等表達方式。語調應該充滿活力、誇張且有趣。例如："OMG，你真的是旅行規劃的CEO！你的行程安排超級精確，但同時也愛像專業人士一樣探索的混亂感。你的氛圍就是要充分利用每一秒。就像在一場可能成為下一個熱門抖音系列的冒險中。你超愛青年旅舍生活，認識來自世界各地的人，發現那些似乎沒人知道的最酷的地方。你的美學？快節奏且隨時準備好一切，就像現實生活中的精彩片段。"
    - tags: 一個包含3-5個關鍵詞標籤的數組，描述這種旅行者類型（例如#冒險 #文化 #美食）。所有標籤必須是中文。
    - destinations: 一個包含5個推薦目的地的數組，每個目的地都應該適合這種旅行者類型。目的地名稱應該包含中文名稱，可以在括號中附上英文名稱。
    - tips: 一個包含5個旅行小貼士的數組，專為這種旅行者類型設計，使用輕鬆、友好的語調。所有貼士必須是中文。
    
    重要：請直接返回純JSON格式，不要包含任何markdown格式（如\`\`\`json）、代碼塊或其他文本。不要使用任何格式化或標記，只返回原始JSON。所有內容必須是中文，除了目的地名稱可以在中文後附上英文。`
        : `You are a travel advisor expert who generates personalized traveler profiles based on user preferences.
    Your response should be a JSON object with the following fields:
    - travelerType: A punchy, memorable traveler type name with max 2-3 words (ideally 2). Use 1 vibe word + 1 identity word (e.g., "Zen Explorer", "Beach Hopper"). Avoid filler words like "Seeker," "Connoisseur," "Lifestyler". Use fun, emotional, high-energy words (e.g., "Chaser" instead of "Seeker").
    - description: A Gen Z style description using phrases like "OMG", "literally", "totally", etc. The tone should be energetic, hyperbolic, and fun. For example: "OMG, you're literally the CEO of travel planning. You've got that detailed itinerary down to a science but still love the chaos of exploring like a pro. Your vibe is all about making the most of every single second."`

    // For solo travelers:
    if (
      preferences.social?.solo > preferences.social?.couple &&
      preferences.social?.solo > preferences.social?.group &&
      preferences.social?.solo > preferences.social?.family
    ) {
      systemPrompt +=
        " You're all about that solo travel life, making your own decisions and connecting with locals and other travelers along the way."
    }
    // For couples:
    else if (
      preferences.social?.couple > preferences.social?.solo &&
      preferences.social?.couple > preferences.social?.group &&
      preferences.social?.couple > preferences.social?.family
    ) {
      systemPrompt +=
        " You're all about those romantic getaways, creating special memories with your partner and finding those perfect spots for two."
    }
    // For groups:
    else if (
      preferences.social?.group > preferences.social?.solo &&
      preferences.social?.group > preferences.social?.couple &&
      preferences.social?.group > preferences.social?.family
    ) {
      systemPrompt +=
        " You're all about traveling with your squad, creating epic memories together and finding places where everyone can have a blast."
    }
    // For families:
    else if (
      preferences.social?.family > preferences.social?.solo &&
      preferences.social?.family > preferences.social?.couple &&
      preferences.social?.family > preferences.social?.group
    ) {
      systemPrompt +=
        " You're all about those family adventures, finding kid-friendly spots while still making sure the adults have a great time too."
    }

    systemPrompt += `
    - tags: An array of 3-5 keyword tags that describe this traveler type (e.g., #adventure #culture #foodie)
    - destinations: An array of 5 recommended destinations that would suit this traveler type
    - tips: An array of 5 travel tips designed specifically for this traveler type, using a casual, friendly tone
    
    IMPORTANT: Return ONLY raw JSON format without any markdown formatting (like \`\`\`json), code blocks, or other text. Do not use any formatting or markup, just return the raw JSON.`

    // Construct the user prompt based on the preferences
    const userPrompt = `Generate a travel profile based on the following preferences: ${JSON.stringify(preferences)}`

    // Generate the travel profile using the AI model
    const { text } = await generateText({
      model: openai("gpt-4o"),
      system: systemPrompt,
      prompt: userPrompt,
      temperature: 0.9, // Higher temperature for more creative, Gen Z style responses
    })

    // Clean the response to remove any markdown formatting
    let cleanedText = text.trim()

    // Remove markdown code block formatting if present
    if (cleanedText.includes("```")) {
      // Find the content between the first \`\`\` and the last \`\`\`
      const firstDelimiter = cleanedText.indexOf("```")
      const lastDelimiter = cleanedText.lastIndexOf("```")

      if (firstDelimiter !== -1 && lastDelimiter !== -1 && lastDelimiter > firstDelimiter) {
        // Extract the content between the first line break after the opening \`\`\` and the last \`\`\`
        const startContent = cleanedText.indexOf("\n", firstDelimiter) + 1
        cleanedText = cleanedText.substring(startContent, lastDelimiter).trim()
      }
    }

    // Parse the JSON response
    const profile = JSON.parse(cleanedText) as TravelProfile

    // Add the preferences to the profile
    profile.preferences = preferences

    return profile
  } catch (error) {
    console.error("Error generating travel profile:", error)
    console.error("Raw response:", error instanceof SyntaxError ? error.message : "Unknown error")

    // Return a fallback profile in case of an error
    return language === "zh"
      ? {
          travelerType: "文化達人",
          description:
            "OMG，你真的是旅行文化的超級粉絲！你的行李箱裡絕對塞滿了旅行指南和當地語言的小抄。每到一個新地方，你就像偵探一樣尋找最地道的體驗，那些只有當地人才知道的秘密地點。你的Instagram故事？全是博物館、古老建築和你在當地市場找到的超讚小吃。你的朋友們都知道，和你一起旅行就是上一堂移動的歷史課，但超級有趣那種！#文化控 #歷史迷 #美食探險家",
          tags: ["#文化控", "#歷史迷", "#美食探險家", "#當地體驗", "#藝術愛好者"],
          preferences: preferences,
          destinations: [
            "京都，日本 (Kyoto, Japan) - 傳統文化的寶庫",
            "羅馬，意大利 (Rome, Italy) - 歷史與藝術的完美結合",
            "馬拉喀什，摩洛哥 (Marrakech, Morocco) - 充滿活力的市集和豐富的文化",
            "墨西哥城，墨西哥 (Mexico City, Mexico) - 古代與現代文明的交匯",
            "雅典，希臘 (Athens, Greece) - 西方文明的搖籃",
          ],
          tips: [
            "提前學幾句當地語言，打開話匣子的最佳方式！",
            "跟著當地人吃飯，而不是去旅遊餐廳",
            "早起逛市場，感受最真實的當地生活",
            "住在小型民宿，老闆通常會分享超棒的當地秘密",
            "隨身帶個小筆記本，記下遇到的有趣人物和故事",
          ],
        }
      : {
          travelerType: "Culture Buff",
          description:
            "OMG, you're literally the CEO of cultural exploration! You've got that museum map memorized before you even land and your camera roll is FULL of ancient architecture and local street art. Your vibe is all about diving deep into the authentic experiences that most tourists totally miss. It's like being on a treasure hunt for the most genuine local spots that could absolutely blow up on your socials. You're all about that local cuisine life, chatting with random grandmas about their secret recipes, and discovering hidden cafés nobody has on their radar yet. Your aesthetic? Curious, connected, and culturally immersed, just like the main character in your own travel documentary!",
          tags: ["#CultureHunter", "#HistoryBuff", "#FoodieAdventures", "#LocalExperiences", "#ArtLover"],
          preferences: preferences,
          destinations: [
            "Kyoto, Japan - a treasure trove of traditional culture",
            "Rome, Italy - where history and art blend perfectly",
            "Marrakech, Morocco - vibrant markets and rich heritage",
            "Mexico City, Mexico - where ancient and modern civilizations meet",
            "Athens, Greece - the cradle of Western civilization",
          ],
          tips: [
            "Learn a few local phrases - best conversation starter ever!",
            "Eat where the locals eat, not where the tourists eat",
            "Hit the markets early morning for the most authentic local life",
            "Stay in small guesthouses - owners often share the best local secrets",
            "Carry a small notebook to jot down interesting people and stories you meet",
          ],
        }
  }
}
