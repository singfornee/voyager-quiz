"use client"

import type React from "react"

import { useRef, useEffect, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { motion } from "framer-motion"
import DestinationCard from "./destination-card"
import { useLanguage } from "@/contexts/language-context"

interface DestinationCardsContainerProps {
  recommendations: Array<{
    location: string
    description: string
    matchPercentage: number
    keywords: string[]
    attractions?: string[]
    personalReason?: string
  }>
  travelerType: string
}

export default function DestinationCardsContainer({ recommendations, travelerType }: DestinationCardsContainerProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const { t } = useLanguage()

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Handle scroll events to update arrow visibility
  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const handleScroll = () => {
      const { scrollLeft, scrollWidth, clientWidth } = container
      setShowLeftArrow(scrollLeft > 20)
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 20)

      // Update active index based on scroll position
      const cardWidth = 280 + 16 // card width + gap
      const newIndex = Math.round(scrollLeft / cardWidth)
      setActiveIndex(Math.min(newIndex, recommendations.length - 1))
    }

    container.addEventListener("scroll", handleScroll)
    return () => container.removeEventListener("scroll", handleScroll)
  }, [recommendations.length])

  // Scroll to a specific card
  const scrollToCard = (index: number) => {
    const container = scrollContainerRef.current
    if (!container) return

    const cardWidth = 280 + 16 // card width + gap
    container.scrollTo({
      left: index * cardWidth,
      behavior: "smooth",
    })
  }

  // Scroll left/right by one card
  const scrollLeft = () => {
    if (activeIndex > 0) {
      scrollToCard(activeIndex - 1)
    }
  }

  const scrollRight = () => {
    if (activeIndex < recommendations.length - 1) {
      scrollToCard(activeIndex + 1)
    }
  }

  // Handle wheel events for horizontal scrolling
  const handleWheel = (e: React.WheelEvent) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft += e.deltaY
      e.preventDefault()
    }
  }

  return (
    <div className="relative">
      {/* Mobile indicator dots */}
      <div className="flex justify-center gap-1 mb-3 md:hidden">
        {recommendations.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollToCard(i)}
            className={`w-2 h-2 rounded-full transition-colors ${
              i === activeIndex ? "bg-violet-500" : "bg-violet-200"
            }`}
            aria-label={`Go to destination ${i + 1}`}
          />
        ))}
      </div>

      {/* Left/Right arrows - ALWAYS VISIBLE NOW */}
      <button
        onClick={scrollLeft}
        className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors ${
          !showLeftArrow ? "opacity-50 cursor-not-allowed" : "opacity-100"
        }`}
        disabled={!showLeftArrow}
        aria-label="Previous destination"
      >
        <ChevronLeft className="h-5 w-5 text-violet-600" />
      </button>

      <button
        onClick={scrollRight}
        className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors ${
          !showRightArrow ? "opacity-50 cursor-not-allowed" : "opacity-100"
        }`}
        disabled={!showRightArrow}
        aria-label="Next destination"
      >
        <ChevronRight className="h-5 w-5 text-violet-600" />
      </button>

      {/* Card container with peek-a-boo design */}
      <div className="relative overflow-hidden">
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto pb-4 pl-4 -mr-20 pr-24 scrollbar-hide snap-x snap-mandatory"
          onWheel={handleWheel}
        >
          {recommendations.map((rec, index) => (
            <div
              key={index}
              className="flex-shrink-0 pr-4 snap-center"
              style={{ width: isMobile ? "calc(85% - 8px)" : "280px" }}
            >
              <DestinationCard
                location={rec.location}
                description={rec.description}
                matchPercentage={rec.matchPercentage}
                keywords={rec.keywords}
                travelerType={travelerType}
                index={index}
                attractions={rec.attractions}
                personalReason={rec.personalReason}
              />
            </div>
          ))}

          {/* Add an empty spacer at the end to ensure the last card can be fully scrolled into view */}
          <div className="flex-shrink-0 w-4" />
        </div>

        {/* Swipe indicator for mobile */}
        {isMobile && (
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white to-transparent pointer-events-none flex items-center justify-center">
            <motion.div
              animate={{ x: [0, 10, 0] }}
              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5, ease: "easeInOut" }}
              className="text-violet-400 opacity-70"
            >
              <ChevronRight className="h-6 w-6" />
            </motion.div>
          </div>
        )}
      </div>

      {/* Mobile scroll hint text */}
      <div className="text-center text-xs text-gray-400 mt-2 md:hidden">{t.results.swipeToSeeMore}</div>
    </div>
  )
}
