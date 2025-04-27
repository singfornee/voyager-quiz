import type { Language } from "./i18n"

// Define the question type with preferences
export interface QuizQuestion {
  id: number
  question: string
  options: string[]
  preferences?: {
    spontaneity: number
    exploration: number
    luxury: number
    activity: number
    aesthetics: number
  }[]
  environmentPreferences?: {
    beach: number
    city: number
    mountains: number
    countryside: number
  }[]
  activityPreferences?: {
    cultural: number
    nightlife: number
    adventure: number
    culinary: number
  }[]
  socialPreferences?: {
    solo: number
    couple: number
    group: number
    family: number
  }[]
}

// English questions
export const enQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "What's your travel planning style?",
    options: [
      "Detailed itinerary with everything planned out",
      "Just book flights and figure it out when I get there",
      "Mix of planned highlights with room for spontaneity",
      "Follow recommendations from TikTok and Instagram",
    ],
    preferences: [
      { spontaneity: 20, exploration: 50, luxury: 80, activity: 60, aesthetics: 50 },
      { spontaneity: 95, exploration: 80, luxury: 30, activity: 70, aesthetics: 60 },
      { spontaneity: 70, exploration: 70, luxury: 60, activity: 65, aesthetics: 70 },
      { spontaneity: 60, exploration: 40, luxury: 50, activity: 50, aesthetics: 90 },
    ],
  },
  {
    id: 2,
    question: "Where are you staying?",
    options: [
      "Luxury hotel with all the amenities",
      "Hostel where I can meet other travelers",
      "Unique Airbnb with character and good photo ops",
      "Whatever's closest to the action and affordable",
    ],
    preferences: [
      { spontaneity: 30, exploration: 40, luxury: 95, activity: 50, aesthetics: 70 },
      { spontaneity: 80, exploration: 85, luxury: 20, activity: 75, aesthetics: 50 },
      { spontaneity: 60, exploration: 70, luxury: 60, activity: 60, aesthetics: 90 },
      { spontaneity: 75, exploration: 60, luxury: 30, activity: 80, aesthetics: 50 },
    ],
  },
  {
    id: 3,
    question: "How do you discover the best spots?",
    options: [
      "Top-rated places on review sites",
      "Getting lost and finding hidden gems",
      "Local recommendations and off-the-beaten-path spots",
      "Places that are trending on social media",
    ],
    preferences: [
      { spontaneity: 40, exploration: 30, luxury: 70, activity: 60, aesthetics: 60 },
      { spontaneity: 90, exploration: 95, luxury: 30, activity: 80, aesthetics: 70 },
      { spontaneity: 75, exploration: 90, luxury: 50, activity: 70, aesthetics: 60 },
      { spontaneity: 60, exploration: 40, luxury: 65, activity: 60, aesthetics: 95 },
    ],
  },
  {
    id: 4,
    question: "What's your travel pace?",
    options: [
      "Fast-paced, seeing everything possible",
      "Slow and chill, quality over quantity",
      "Balance of sightseeing and relaxation",
      "Wherever the vibe takes me that day",
    ],
    preferences: [
      { spontaneity: 40, exploration: 75, luxury: 60, activity: 95, aesthetics: 70 },
      { spontaneity: 60, exploration: 50, luxury: 80, activity: 30, aesthetics: 65 },
      { spontaneity: 60, exploration: 70, luxury: 75, activity: 60, aesthetics: 60 },
      { spontaneity: 90, exploration: 65, luxury: 50, activity: 50, aesthetics: 80 },
    ],
  },
  {
    id: 5,
    question: "What's most important in your travel pics?",
    options: [
      "Iconic landmarks and tourist spots",
      "Authentic cultural moments and local life",
      "Aesthetic shots with perfect lighting and composition",
      "Me having the time of my life, wherever I am",
    ],
    preferences: [
      { spontaneity: 30, exploration: 40, luxury: 60, activity: 70, aesthetics: 80 },
      { spontaneity: 60, exploration: 90, luxury: 40, activity: 60, aesthetics: 75 },
      { spontaneity: 50, exploration: 60, luxury: 70, activity: 50, aesthetics: 95 },
      { spontaneity: 75, exploration: 50, luxury: 65, activity: 80, aesthetics: 85 },
    ],
  },
  // Environment preference question
  {
    id: 6,
    question: "What type of environment do you prefer for your travels?",
    options: [
      "Beach and coastal areas",
      "Urban cities with vibrant culture",
      "Mountains and natural landscapes",
      "Countryside and rural retreats",
    ],
    environmentPreferences: [
      { beach: 90, city: 30, mountains: 20, countryside: 40 },
      { beach: 20, city: 90, mountains: 10, countryside: 20 },
      { beach: 30, city: 20, mountains: 90, countryside: 60 },
      { beach: 20, city: 10, mountains: 50, countryside: 90 },
    ],
  },
  // New activity preference question (replacing climate)
  {
    id: 7,
    question: "Your favorite activities?",
    options: ["🏛️ Museums & Culture", "🍹 Bars & Nightlife", "🧗‍♀️ Adventure & Sports", "🍜 Food & Dining"],
    activityPreferences: [
      { cultural: 90, nightlife: 30, adventure: 20, culinary: 50 },
      { cultural: 20, nightlife: 90, adventure: 40, culinary: 60 },
      { cultural: 30, nightlife: 20, adventure: 90, culinary: 30 },
      { cultural: 40, nightlife: 50, adventure: 20, culinary: 90 },
    ],
  },
  {
    id: 8,
    question: "Where do you prefer to splurge when traveling?",
    options: [
      "Luxury accommodations with amazing views",
      "Unique food experiences and fine dining",
      "Exclusive activities and guided tours",
      "Shopping and bringing home special items",
    ],
    preferences: [
      { spontaneity: 30, exploration: 40, luxury: 95, activity: 50, aesthetics: 70 },
      { spontaneity: 60, exploration: 70, luxury: 80, activity: 60, aesthetics: 75 },
      { spontaneity: 70, exploration: 90, luxury: 70, activity: 90, aesthetics: 60 },
      { spontaneity: 60, exploration: 60, luxury: 85, activity: 70, aesthetics: 95 },
    ],
  },
  {
    id: 9,
    question: "Who do you prefer to travel with?",
    options: [
      "Solo - I love the freedom to do whatever I want",
      "With a partner - sharing experiences with someone special",
      "With friends - the more the merrier",
      "With family - creating memories together",
    ],
    preferences: [
      { spontaneity: 90, exploration: 85, luxury: 60, activity: 70, aesthetics: 75 },
      { spontaneity: 70, exploration: 75, luxury: 80, activity: 65, aesthetics: 85 },
      { spontaneity: 80, exploration: 70, luxury: 65, activity: 85, aesthetics: 80 },
      { spontaneity: 50, exploration: 60, luxury: 70, activity: 75, aesthetics: 65 },
    ],
    socialPreferences: [
      { solo: 90, couple: 30, group: 20, family: 10 },
      { solo: 20, couple: 90, group: 40, family: 50 },
      { solo: 10, couple: 40, group: 90, family: 30 },
      { solo: 10, couple: 30, group: 20, family: 90 },
    ],
  },
]

// Traditional Mandarin questions
export const zhQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "你的旅行計劃風格是什麼？",
    options: [
      "詳細的行程，一切都計劃好",
      "只預訂機票，到達後再安排",
      "計劃主要景點，留有自發性空間",
      "跟隨TikTok和Instagram的推薦",
    ],
    preferences: [
      { spontaneity: 20, exploration: 50, luxury: 80, activity: 60, aesthetics: 50 },
      { spontaneity: 95, exploration: 80, luxury: 30, activity: 70, aesthetics: 60 },
      { spontaneity: 70, exploration: 70, luxury: 60, activity: 65, aesthetics: 70 },
      { spontaneity: 60, exploration: 40, luxury: 50, activity: 50, aesthetics: 90 },
    ],
  },
  {
    id: 2,
    question: "你會住在哪裡？",
    options: [
      "設施齊全的豪華酒店",
      "可以結識其他旅行者的青年旅舍",
      "有特色且適合拍照的Airbnb",
      "靠近活動中心且價格合理的地方",
    ],
    preferences: [
      { spontaneity: 30, exploration: 40, luxury: 95, activity: 50, aesthetics: 70 },
      { spontaneity: 80, exploration: 85, luxury: 20, activity: 75, aesthetics: 50 },
      { spontaneity: 60, exploration: 70, luxury: 60, activity: 60, aesthetics: 90 },
      { spontaneity: 75, exploration: 60, luxury: 30, activity: 80, aesthetics: 50 },
    ],
  },
  {
    id: 3,
    question: "你如何發現最好的地方？",
    options: ["評價網站上的高評分地點", "迷路並發現隱藏的寶藏", "當地人推薦和非熱門景點", "社交媒體上流行的地方"],
    preferences: [
      { spontaneity: 40, exploration: 30, luxury: 70, activity: 60, aesthetics: 60 },
      { spontaneity: 90, exploration: 95, luxury: 30, activity: 80, aesthetics: 70 },
      { spontaneity: 75, exploration: 90, luxury: 50, activity: 70, aesthetics: 60 },
      { spontaneity: 60, exploration: 40, luxury: 65, activity: 60, aesthetics: 95 },
    ],
  },
  {
    id: 4,
    question: "你的旅行節奏是什麼？",
    options: ["快節奏，盡可能看更多景點", "慢節奏，注重質量而非數量", "觀光和放鬆的平衡", "隨心所欲，跟隨當天的氛圍"],
    preferences: [
      { spontaneity: 40, exploration: 75, luxury: 60, activity: 95, aesthetics: 70 },
      { spontaneity: 60, exploration: 50, luxury: 80, activity: 30, aesthetics: 65 },
      { spontaneity: 60, exploration: 70, luxury: 75, activity: 60, aesthetics: 60 },
      { spontaneity: 90, exploration: 65, luxury: 50, activity: 50, aesthetics: 80 },
    ],
  },
  {
    id: 5,
    question: "在你的旅行照片中，什麼最重要？",
    options: [
      "標誌性地標和旅遊景點",
      "真實的文化時刻和當地生活",
      "完美光線和構圖的美學照片",
      "無論在哪裡，都是我享受生活的時刻",
    ],
    preferences: [
      { spontaneity: 30, exploration: 40, luxury: 60, activity: 70, aesthetics: 80 },
      { spontaneity: 60, exploration: 90, luxury: 40, activity: 60, aesthetics: 75 },
      { spontaneity: 50, exploration: 60, luxury: 70, activity: 50, aesthetics: 95 },
      { spontaneity: 75, exploration: 50, luxury: 65, activity: 80, aesthetics: 85 },
    ],
  },
  // Environment preference question
  {
    id: 6,
    question: "你喜歡哪種旅行環境？",
    options: ["海灘和沿海地區", "充滿活力文化的城市", "山脈和自然景觀", "鄉村和農村度假地"],
    environmentPreferences: [
      { beach: 90, city: 30, mountains: 20, countryside: 40 },
      { beach: 20, city: 90, mountains: 10, countryside: 20 },
      { beach: 30, city: 20, mountains: 90, countryside: 60 },
      { beach: 20, city: 10, mountains: 50, countryside: 90 },
    ],
  },
  // New activity preference question (replacing climate)
  {
    id: 7,
    question: "你最喜歡的活動？",
    options: ["🏛️ 博物館和文化", "🍹 酒吧和夜生活", "🧗‍♀️ 冒險和運動", "🍜 美食和餐飲"],
    activityPreferences: [
      { cultural: 90, nightlife: 30, adventure: 20, culinary: 50 },
      { cultural: 20, nightlife: 90, adventure: 40, culinary: 60 },
      { cultural: 30, nightlife: 20, adventure: 90, culinary: 30 },
      { cultural: 40, nightlife: 50, adventure: 20, culinary: 90 },
    ],
  },
  {
    id: 8,
    question: "旅行時你喜歡在哪方面奢侈一點？",
    options: ["豪華住宿，有絕美景觀", "獨特的美食體驗和高級餐廳", "獨家活動和導覽行程", "購物和帶回特別的紀念品"],
    preferences: [
      { spontaneity: 30, exploration: 40, luxury: 95, activity: 50, aesthetics: 70 },
      { spontaneity: 60, exploration: 70, luxury: 80, activity: 60, aesthetics: 75 },
      { spontaneity: 70, exploration: 90, luxury: 70, activity: 90, aesthetics: 60 },
      { spontaneity: 60, exploration: 60, luxury: 85, activity: 70, aesthetics: 95 },
    ],
  },
  {
    id: 9,
    question: "你喜歡和誰一起旅行？",
    options: [
      "獨自旅行 - 我喜歡自由自在做任何事",
      "與伴侶 - 與特別的人分享體驗",
      "與朋友 - 人越多越熱鬧",
      "與家人 - 一起創造回憶",
    ],
    preferences: [
      { spontaneity: 90, exploration: 85, luxury: 60, activity: 70, aesthetics: 75 },
      { spontaneity: 70, exploration: 75, luxury: 80, activity: 65, aesthetics: 85 },
      { spontaneity: 80, exploration: 70, luxury: 65, activity: 85, aesthetics: 80 },
      { spontaneity: 50, exploration: 60, luxury: 70, activity: 75, aesthetics: 65 },
    ],
    socialPreferences: [
      { solo: 90, couple: 30, group: 20, family: 10 },
      { solo: 20, couple: 90, group: 40, family: 50 },
      { solo: 10, couple: 40, group: 90, family: 30 },
      { solo: 10, couple: 30, group: 20, family: 90 },
    ],
  },
]

// Get questions based on language
export function getQuestions(language: Language): QuizQuestion[] {
  return language === "en" ? enQuestions : zhQuestions
}

// Add these new translation keys to the English and Chinese translations

// Find the "results" section in the English translations and add:
// travelPersonality: "Travel Personality Insights",
// travelAnimal: "If you were an animal",
// tripRole: "Your role in the trip",
// travelSuperpower: "Your travel superpower",

// Find the "results" section in the Chinese translations and add:
// travelPersonality: "旅行個性解析",
// travelAnimal: "如果你是一種動物",
// tripRole: "你在旅行團隊中的角色",
// travelSuperpower: "你的旅行超能力",
