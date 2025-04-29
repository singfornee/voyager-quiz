"use client"

import { Button } from "@/components/ui/button"
import { Globe } from "lucide-react"
import { useTranslation } from "@/lib/i18n"

export default function LanguageSwitcher() {
  const { language, setLanguage } = useTranslation()

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setLanguage(language === "en" ? "zh-TW" : "en")}
      className="h-8 px-2 text-gray-600 hover:bg-gray-100/80 flex items-center transition-colors"
      title={language === "en" ? "Switch to Traditional Chinese" : "Switch to English"}
    >
      <Globe className="h-4 w-4 mr-1" />
      <span className="text-xs">{language === "en" ? "中文" : "EN"}</span>
    </Button>
  )
}
