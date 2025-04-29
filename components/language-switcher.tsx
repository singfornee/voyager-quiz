"use client"

import { Button } from "@/components/ui/button"
import { Globe } from "lucide-react"
import { useTranslation } from "@/lib/i18n"

export default function LanguageSwitcher() {
  const { language, setLanguage } = useTranslation()

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "zh-TW" : "en")
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="h-8 px-2 text-gray-600 hover:bg-gray-100/80 flex items-center transition-colors"
    >
      <Globe className="h-4 w-4 mr-1" />
      <span className="text-xs">{language === "en" ? "中文" : "EN"}</span>
    </Button>
  )
}
