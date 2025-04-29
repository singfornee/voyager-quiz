// Define the results page translations type
export type ResultsTranslations = {
  pageTitle: string
  heroText: string
  personalitySection: {
    title: string
    animalTitle: string
    groupRoleTitle: string
    superpowerTitle: string
    groupRoleFooter: string
    superpowerFooter: string
  }
  mbtiSection: {
    title: string
    overviewTitle: string
    strengthsTitle: string
    challengesTitle: string
    travelStyleTitle: string
    companionsTitle: string
    growthTitle: string
  }
  destinationsSection: {
    title: string
    subtitle: string
    photoCredit: string
  }
  shareSection: {
    title: string
    subtitle: string
  }
  signupSection: {
    title: string
    subtitle: string
    betaTitle: string
    betaSubtitle: string
    emailPlaceholder: string
    namePlaceholder: string
    buttonText: string
    privacyText: string
    successTitle: string
    successMessage: string
  }
  footer: string
}

// English translations
const enTranslations: ResultsTranslations = {
  pageTitle: "Here's Your Travel Type!",
  heroText: "Our AI figured you out. Scary accurate, right? But in a fun way!",
  personalitySection: {
    title: "That's So You",
    animalTitle: "Your Travel Animal",
    groupRoleTitle: "In The Group Chat",
    superpowerTitle: "Special Move",
    groupRoleFooter: "Every squad needs one!",
    superpowerFooter: "Use it wisely!",
  },
  mbtiSection: {
    title: "The Real You",
    overviewTitle: "How You Roll",
    strengthsTitle: "You're Great At",
    challengesTitle: "Watch Out For",
    travelStyleTitle: "Your Style",
    companionsTitle: "Travel With These People",
    growthTitle: "Try This Next Time",
  },
  destinationsSection: {
    title: "Places You'd Love",
    subtitle: "Based on your answers, you should check these spots out. Just saying.",
    photoCredit: "Photos from Unsplash",
  },
  shareSection: {
    title: "Brag About It",
    subtitle: "Share your results and make your friends take it too!",
  },
  signupSection: {
    title: "Get On The List",
    subtitle: "We'll send you cool travel stuff. No spam, promise!",
    betaTitle: "We're launching soon!",
    betaSubtitle: "Be the first to know when we go live.",
    emailPlaceholder: "Email (we won't spam you)",
    namePlaceholder: "Your name",
    buttonText: "Get Early Access",
    privacyText: "We respect your privacy. No spam, ever.",
    successTitle: "You're in!",
    successMessage: "We'll let you know when we launch!",
  },
  footer: "Made with ☕ and wanderlust.",
}

// Traditional Mandarin translations
const zhTWTranslations: ResultsTranslations = {
  pageTitle: "這是您的旅行類型！",
  heroText: "我們的AI已經了解您。準確得有點嚇人，對吧？但是很有趣！",
  personalitySection: {
    title: "這就是您",
    animalTitle: "您的旅行動物",
    groupRoleTitle: "在群組聊天中",
    superpowerTitle: "特殊技能",
    groupRoleFooter: "每個團隊都需要一個！",
    superpowerFooter: "明智地使用它！",
  },
  mbtiSection: {
    title: "真實的您",
    overviewTitle: "您的旅行方式",
    strengthsTitle: "您擅長的事",
    challengesTitle: "需要注意的事",
    travelStyleTitle: "您的風格",
    companionsTitle: "與這些人一起旅行",
    growthTitle: "下次嘗試這個",
  },
  destinationsSection: {
    title: "您會喜歡的地方",
    subtitle: "根據您的回答，您應該去看看這些地方。真的！",
    photoCredit: "照片來自Unsplash",
  },
  shareSection: {
    title: "炫耀一下",
    subtitle: "分享您的結果，讓您的朋友也來測試！",
  },
  signupSection: {
    title: "加入我們的名單",
    subtitle: "我們會發送很棒的旅行內容。絕不發送垃圾郵件！",
    betaTitle: "我們即將推出！",
    betaSubtitle: "成為第一個知道我們上線的人。",
    emailPlaceholder: "電子郵件（我們不會發送垃圾郵件）",
    namePlaceholder: "您的姓名",
    buttonText: "獲取早期訪問權限",
    privacyText: "我們尊重您的隱私。絕不發送垃圾郵件。",
    successTitle: "您已加入！",
    successMessage: "我們會在上線時通知您！",
  },
  footer: "用☕和旅行熱情製作。",
}

// Function to get translations based on language
export function getResultsTranslations(language: "en" | "zh-TW"): ResultsTranslations {
  return language === "zh-TW" ? zhTWTranslations : enTranslations
}
