// Define the supported languages
export type Language = "en" | "zh"

// Define the translation structure
export interface Translations {
  common: {
    start: string
    next: string
    back: string
    submit: string
    reset: string
    share: string
    loading: string
    tryAgain: string
  }
  quiz: {
    title: string
    subtitle: string
    startButton: string
    questionPrefix: string
    ofQuestions: string
    complete: string
  }
  results: {
    yourTravelVibe: string
    matchPercentage: string
    description: string
    traits: string
    destinations: string
    tips: string
    shareResults: string
    subscribeTitle: string
    subscribeButton: string
    emailPlaceholder: string
    shareWithFriends: string
    tryAgain: string
    checkoutVoyagerAI: string
    travelStyle: string
    travelPreferences: string
    topEnvironment: string
    topActivity: string
    recommendedForYou: string
    basedOnProfile: string
    mightEnjoy: string
    travelHacksFor: string
    getEarlyAccess: string
    earlyAccessDescription: string
    swipeToSeeMore: string
    shareAndChallenge: string
    copyLink: string
    copied: string
    shareToIG: string
    youreIn: string
  }
  shareModal: {
    title: string
    saveButton: string
    twitterButton: string
    facebookButton: string
    instagramButton: string
    copyLinkLabel: string
    copyButton: string
  }
}

// English translations
export const en: Translations = {
  common: {
    start: "Start",
    next: "Next",
    back: "Back",
    submit: "Submit",
    reset: "Try Again",
    share: "Share",
    loading: "Loading...",
    tryAgain: "Try Again",
  },
  quiz: {
    title: "What's Your Travel Vibe?",
    subtitle: "Find your travel personality",
    startButton: "Start Quiz",
    questionPrefix: "Question",
    ofQuestions: "of",
    complete: "complete",
  },
  results: {
    yourTravelVibe: "Your Travel Vibe",
    matchPercentage: "match",
    description: "Description",
    traits: "Your Traits",
    destinations: "Recommended For You",
    tips: "Travel Hacks",
    shareResults: "Share Your Results",
    subscribeTitle: "Get Early Access to Voyager AI",
    subscribeButton: "Get Early Access",
    emailPlaceholder: "your@email.com",
    shareWithFriends: "Share with friends",
    tryAgain: "Try again",
    checkoutVoyagerAI: "Check out Voyager AI",
    travelStyle: "Your Travel Style",
    travelPreferences: "Your Travel Preferences",
    topEnvironment: "Top Environment",
    topActivity: "Top Activity",
    recommendedForYou: "Recommended For You",
    basedOnProfile: "Based on your profile",
    mightEnjoy: "As a {travelerType}, you might enjoy these destinations:",
    travelHacksFor: "Travel Hacks For {travelerType}s",
    getEarlyAccess: "🚀 Get Early Access to Voyager AI",
    earlyAccessDescription: "Be the first to access our AI travel planning tools!",
    swipeToSeeMore: "Swipe to see more destinations →",
    shareAndChallenge: "🎉 Love your vibe? Share it & challenge your friends!",
    copyLink: "Copy Link",
    copied: "Copied!",
    shareToIG: "Share to IG Story",
    youreIn: "You're in!",
  },
  shareModal: {
    title: "Share Your Travel Style",
    saveButton: "Save",
    twitterButton: "Twitter",
    facebookButton: "Facebook",
    instagramButton: "Instagram",
    copyLinkLabel: "Or copy link",
    copyButton: "Copy",
  },
}

// Traditional Mandarin translations
export const zh: Translations = {
  common: {
    start: "開始",
    next: "下一步",
    back: "返回",
    submit: "提交",
    reset: "重新開始",
    share: "分享",
    loading: "加載中...",
    tryAgain: "再試一次",
  },
  quiz: {
    title: "你的旅行風格是什麼？",
    subtitle: "發現你的旅行個性",
    startButton: "開始測試",
    questionPrefix: "問題",
    ofQuestions: "/",
    complete: "完成",
  },
  results: {
    yourTravelVibe: "你的旅行風格",
    matchPercentage: "匹配度",
    description: "描述",
    traits: "你的特點",
    destinations: "為你推薦",
    tips: "旅行小貼士",
    shareResults: "分享你的結果",
    subscribeTitle: "搶先體驗 Voyager AI",
    subscribeButton: "獲取早期訪問",
    emailPlaceholder: "你的郵箱",
    shareWithFriends: "與朋友分享",
    tryAgain: "再試一次",
    checkoutVoyagerAI: "查看 Voyager AI",
    travelStyle: "你的旅行風格",
    travelPreferences: "你的旅行偏好",
    topEnvironment: "首選環境",
    topActivity: "首選活動",
    recommendedForYou: "為你推薦",
    basedOnProfile: "基於你的檔案",
    mightEnjoy: "作為一個{travelerType}，你可能會喜歡這些目的地：",
    travelHacksFor: "{travelerType}的旅行技巧",
    getEarlyAccess: "🚀 搶先體驗 Voyager AI",
    earlyAccessDescription: "成為第一批使用我們AI旅行規劃工具的用戶！",
    swipeToSeeMore: "滑動查看更多目的地 →",
    shareAndChallenge: "🎉 喜歡你的風格？分享並挑戰你的朋友！",
    copyLink: "複製連結",
    copied: "已複製！",
    shareToIG: "分享到IG故事",
    youreIn: "你已加入！",
  },
  shareModal: {
    title: "分享你的旅行風格",
    saveButton: "保存",
    twitterButton: "Twitter",
    facebookButton: "Facebook",
    instagramButton: "Instagram",
    copyLinkLabel: "或複製連結",
    copyButton: "複製",
  },
}

// Create a translations object with all languages
export const translations = {
  en,
  zh,
}
