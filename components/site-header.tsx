"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Globe } from "lucide-react"
import { useTranslation } from "@/lib/i18n"

export default function SiteHeader() {
  const { language, setLanguage } = useTranslation()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm shadow-sm">
      <div className="container mx-auto px-4 py-2 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center"
          onClick={() => {
            // Clear saved quiz progress when clicking the logo
            if (typeof window !== "undefined") {
              localStorage.removeItem("voyabear_quiz_progress")
              // Also clear any other related quiz data
              localStorage.removeItem("voyabear_last_question")
              localStorage.removeItem("voyabear_answers")
            }
          }}
        >
          <div className="relative h-8 w-8 mr-2">
            <Image src="/voyabear-mascot.png" alt="VoyaBear" fill className="object-contain" sizes="32px" priority />
          </div>
          <span className="font-bold text-voyabear-primary text-lg hidden sm:inline-block">VoyaBear</span>
        </Link>

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
      </div>
    </header>
  )
}
