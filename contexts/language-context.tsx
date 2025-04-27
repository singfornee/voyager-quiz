"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { type Language, translations, type Translations } from "@/lib/i18n"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: Translations
}

const defaultLanguage: Language = "en"

const LanguageContext = createContext<LanguageContextType>({
  language: defaultLanguage,
  setLanguage: () => {},
  t: translations[defaultLanguage],
})

export const useLanguage = () => useContext(LanguageContext)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(defaultLanguage)
  const [mounted, setMounted] = useState(false)

  // Only run on client side
  useEffect(() => {
    setMounted(true)
    // Try to get the language from localStorage
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "zh")) {
      setLanguageState(savedLanguage)
    } else {
      // Or use browser language if available
      const browserLang = navigator.language.split("-")[0]
      if (browserLang === "zh") {
        setLanguageState("zh")
      }
    }
  }, [])

  // Update HTML lang attribute and font family when language changes
  useEffect(() => {
    if (mounted) {
      document.documentElement.lang = language

      // Apply the appropriate font family based on language
      if (language === "zh") {
        document.body.classList.add("font-chinese")
      } else {
        document.body.classList.remove("font-chinese")
      }
    }
  }, [language, mounted])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    if (typeof window !== "undefined") {
      localStorage.setItem("language", lang)
    }
  }

  // Get translations for current language
  const t = translations[language]

  // Only render children when mounted (to avoid hydration issues)
  if (!mounted) {
    return null
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}
