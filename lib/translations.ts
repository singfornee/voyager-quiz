// Define the quiz translations type
export type QuizTranslations = {
  questions: Array<{
    question: string
    options: string[]
    emoji: string
    illustration: string
  }>
  progressMessages: string[]
  next: string
  showResults: string
  analyzing: string
  swipeRight: string
  swipeLeft: string
  errorMessage: string
}

// English translations
const enTranslations: QuizTranslations = {
  questions: [
    {
      question: "Which of the following would you choose?",
      options: [
        "🌴 Leave me under a palm tree with no schedule",
        "🗺️ Get me lost in side streets and hidden trails",
        "🎟️ Museum hopping, guided tours, history deep-dives",
        "🏙️ Luxury stays, fine dining, rooftop sunsets",
      ],
      emoji: "🤔",
      illustration: "/travel-illustrations/map.png",
    },
    {
      question: "First 24 hours in a new city — what's your move?",
      options: [
        "🍜 Hunt for the best hole-in-the-wall local food",
        "🧭 Drop the bags, walk 10,000 steps without a plan",
        "🎟️ Stack my day with top-rated attractions",
        "🛏️ Order room service and soak in the view",
      ],
      emoji: "🕒",
      illustration: "/travel-illustrations/suitcase.png",
    },
    {
      question: "Which travel trophy would you brag about?",
      options: [
        "🌋 Summited a volcano or climbed a mountain",
        "🐬 Swam with wild dolphins or snorkeled a reef",
        "🎭 Joined a once-in-a-lifetime local festival or sacred ceremony",
        "🏰 Stayed overnight in a medieval castle or hidden historic village",
      ],
      emoji: "🏆",
      illustration: "/travel-illustrations/passport.png",
    },
    {
      question: "If you could put one thing into your magical backpack, what would it be?",
      options: [
        "🎧 Noise-canceling headphones — to stay in my own world when needed",
        "🥾 Trail shoes — to follow wherever the wild paths lead",
        "📸 Endless camera roll storage — every hidden moment captured",
        "📅 A perfectly crafted travel plan — ready for any twist and turn",
      ],
      emoji: "🎒",
      illustration: "/travel-illustrations/backpack.png",
    },
    {
      question: "You win $1,000 to spend on your trip. Where's it going?",
      options: [
        "🍽️ On tasting menus, street food crawls, and night markets",
        "🏖️ Private beaches, sunset cruises, and tropical escapes",
        "🛍️ Local boutiques, handmade crafts, and once-in-a-lifetime souvenirs",
        "🏞️ Adventure tours — hiking, rafting, zip-lining, you name it",
      ],
      emoji: "💰",
      illustration: "/travel-illustrations/world.png",
    },
    {
      question: "Last night of the trip — what's the vibe?",
      options: [
        "🧘 Spa day or slow beach sunset — total recharge",
        "🚀 One last crazy adventure — night hikes, secret boat rides, no regrets",
        "🎨 Cultural night — traditional performance, night market, or art crawl",
        "🏙️ Dress up and toast the trip with rooftop cocktails and skyline views",
      ],
      emoji: "🌙",
      illustration: "/travel-illustrations/camera.png",
    },
  ],
  progressMessages: [
    "Just getting started!",
    "You're crushing it!",
    "Halfway there!",
    "Almost done!",
    "Final question!",
  ],
  next: "Next",
  showResults: "Show My Results",
  analyzing: "Analyzing...",
  swipeRight: "Swipe right to go back",
  swipeLeft: "Swipe left to continue",
  errorMessage: "Oops! Our AI had a brain freeze. Try again or contact our tech wizards for help.",
}

// Traditional Mandarin translations
const zhTWTranslations: QuizTranslations = {
  questions: [
    {
      question: "您會選擇以下哪一項？",
      options: [
        "🌴 讓我在棕櫚樹下無計劃地放鬆",
        "🗺️ 讓我在小巷和隱藏的小徑中迷路",
        "🎟️ 參觀博物館、導覽團、深入了解歷史",
        "🏙️ 豪華住宿、精緻美食、屋頂日落景觀",
      ],
      emoji: "🤔",
      illustration: "/travel-illustrations/map.png",
    },
    {
      question: "抵達新城市的前24小時 — 您會怎麼做？",
      options: [
        "🍜 尋找最好的在地小吃",
        "🧭 放下行李，沒有計劃地走上10,000步",
        "🎟️ 安排一天參觀頂級景點",
        "🛏️ 點客房服務並欣賞美景",
      ],
      emoji: "🕒",
      illustration: "/travel-illustrations/suitcase.png",
    },
    {
      question: "您會炫耀哪種旅行成就？",
      options: [
        "🌋 登上火山或爬山",
        "🐬 與野生海豚一起游泳或在珊瑚礁浮潛",
        "🎭 參加一生一次的當地節慶或神聖儀式",
        "🏰 在中世紀城堡或隱藏的歷史村莊過夜",
      ],
      emoji: "🏆",
      illustration: "/travel-illustrations/passport.png",
    },
    {
      question: "如果您可以在神奇背包中放入一樣東西，會是什麼？",
      options: [
        "🎧 降噪耳機 — 在需要時保持自己的世界",
        "🥾 登山鞋 — 跟隨野外小徑的指引",
        "📸 無限相機儲存空間 — 捕捉每個隱藏時刻",
        "📅 完美規劃的旅行計劃 — 為任何轉折做好準備",
      ],
      emoji: "🎒",
      illustration: "/travel-illustrations/backpack.png",
    },
    {
      question: "您贏得了$1,000用於旅行。會花在哪裡？",
      options: [
        "🍽️ 品嚐菜單、街頭美食之旅和夜市",
        "🏖️ 私人海灘、日落遊船和熱帶度假",
        "🛍️ 當地精品店、手工藝品和一生一次的紀念品",
        "🏞️ 冒險之旅 — 遠足、漂流、高空滑索，應有盡有",
      ],
      emoji: "💰",
      illustration: "/travel-illustrations/world.png",
    },
    {
      question: "旅行的最後一晚 — 氛圍如何？",
      options: [
        "🧘 水療日或緩慢的海灘日落 — 完全充電",
        "🚀 最後一次瘋狂冒險 — 夜間遠足、秘密船之旅、無悔",
        "🎨 文化之夜 — 傳統表演、夜市或藝術之旅",
        "🏙️ 盛裝打扮，在屋頂雞尾酒和天際線景觀中慶祝旅行",
      ],
      emoji: "🌙",
      illustration: "/travel-illustrations/camera.png",
    },
  ],
  progressMessages: ["剛剛開始！", "您做得很好！", "已完成一半！", "即將完成！", "最後一題！"],
  next: "下一題",
  showResults: "顯示我的結果",
  analyzing: "分析中...",
  swipeRight: "向右滑動返回",
  swipeLeft: "向左滑動繼續",
  errorMessage: "糟糕！我們的AI當機了。請再試一次或聯繫我們的技術團隊尋求幫助。",
}

// Function to get translations based on language
export function getQuizTranslations(language: "en" | "zh-TW"): QuizTranslations {
  return language === "zh-TW" ? zhTWTranslations : enTranslations
}
