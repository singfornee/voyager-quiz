"use client"

import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { Globe } from "lucide-react"

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "zh" : "en")
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className="flex items-center gap-1 text-white/90 hover:text-white hover:bg-white/10"
      onClick={toggleLanguage}
    >
      <Globe className="h-4 w-4" />
      <span>{language === "en" ? "繁體中文" : "English"}</span>
    </Button>
  )
}
