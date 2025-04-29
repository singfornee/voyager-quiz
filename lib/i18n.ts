"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// Define the language type
export type Language = "en" | "zh-TW"

// Create a context for the language
interface TranslationContextType {
  language: Language
  setLanguage: (language: Language) => void
}

const TranslationContext = createContext<TranslationContextType>({
  language: "en",
  setLanguage: () => {},
})

// Create a provider component
export function TranslationProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")

  // Load language from localStorage on mount
  useEffect(() => {
    const storedLanguage = localStorage.getItem("voyabear_language") as Language | null
    if (storedLanguage && (storedLanguage === "en" || storedLanguage === "zh-TW")) {
      setLanguage(storedLanguage)
    }
  }, [])

  // Save language to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("voyabear_language", language)
  }, [language])

  return <TranslationContext.Provider value={{ language, setLanguage }}>{children}</TranslationContext.Provider>
}

// Create a hook to use the translation context
export function useTranslation() {
  return useContext(TranslationContext)
}
