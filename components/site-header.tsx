"use client"

import Link from "next/link"
import Image from "next/image"
import LanguageSwitcher from "@/components/language-switcher"

export default function SiteHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm shadow-sm">
      <div className="container mx-auto px-4 py-2 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <div className="relative h-8 w-8 mr-2">
            <Image src="/voyabear-mascot.png" alt="VoyaBear" fill className="object-contain" sizes="32px" priority />
          </div>
          <span className="font-bold text-voyabear-primary text-lg hidden sm:inline-block">VoyaBear</span>
        </Link>

        <LanguageSwitcher />
      </div>
    </header>
  )
}
