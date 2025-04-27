"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"

interface TravelStyleMeterProps {
  leftLabel: string
  rightLabel: string
  leftIcon: ReactNode
  rightIcon: ReactNode
  emoji: string
  color: string
  value: number
  index: number
}

export default function TravelStyleMeter({
  leftLabel,
  rightLabel,
  leftIcon,
  rightIcon,
  emoji,
  color,
  value,
  index,
}: TravelStyleMeterProps) {
  // Get color classes based on the preference color
  const getColorClass = (type: string) => {
    const colorMap: Record<string, Record<string, string>> = {
      violet: {
        bg: "bg-violet-100",
        fill: "bg-violet-500",
        border: "border-violet-300",
        text: "text-violet-500",
      },
      emerald: {
        bg: "bg-emerald-100",
        fill: "bg-emerald-500",
        border: "border-emerald-300",
        text: "text-emerald-500",
      },
      amber: {
        bg: "bg-amber-100",
        fill: "bg-amber-500",
        border: "border-amber-300",
        text: "text-amber-500",
      },
      rose: {
        bg: "bg-rose-100",
        fill: "bg-rose-500",
        border: "border-rose-300",
        text: "text-rose-500",
      },
      pink: {
        bg: "bg-pink-100",
        fill: "bg-pink-500",
        border: "border-pink-300",
        text: "text-pink-500",
      },
    }
    return colorMap[color] || colorMap.violet
  }

  const colors = getColorClass(color)

  // Normalize value to ensure it's within 0-100 range
  const normalizedValue = Math.min(100, Math.max(0, value))

  // Calculate the position relative to the midpoint (50)
  // If value is less than 50, it leans toward the left trait
  // If value is more than 50, it leans toward the right trait
  const isRightLeaning = normalizedValue >= 50

  // Calculate the percentage for the indicator position
  // For left-leaning: starts at 50% (middle) and goes left based on how far from 50
  // For right-leaning: starts at 50% (middle) and goes right based on how far from 50
  const positionPercentage = isRightLeaning
    ? 50 + ((normalizedValue - 50) / 50) * 45 // Right side: 50-95%
    : 50 - ((50 - normalizedValue) / 50) * 45 // Left side: 5-50%

  // Calculate the fill width
  // For left-leaning: fill from position to middle (50%)
  // For right-leaning: fill from middle (50%) to position
  const fillStartPercentage = isRightLeaning ? 50 : positionPercentage
  const fillEndPercentage = isRightLeaning ? positionPercentage : 50
  const fillWidth = fillEndPercentage - fillStartPercentage

  // Calculate the strength as a percentage based on distance from midpoint
  const strengthPercentage = Math.abs(normalizedValue - 50) * 2
  // Ensure the display value never exceeds 100%
  const displayValue = Math.min(100, Math.round(strengthPercentage))

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 + index * 0.1 }}
      className="mb-8 relative"
    >
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center">
          <div className={`p-2 rounded-full mr-2 ${colors.bg} ${colors.text}`}>{leftIcon}</div>
          <span className="text-gray-700 font-medium">{leftLabel}</span>
        </div>
        <div className="flex items-center">
          <span className="text-gray-700 font-medium">{rightLabel}</span>
          <div className={`p-2 rounded-full ml-2 ${colors.bg} ${colors.text}`}>{rightIcon}</div>
        </div>
      </div>

      <div className="relative h-4 w-full">
        {/* Track background */}
        <div className={`absolute inset-0 rounded-full ${colors.bg}`}></div>

        {/* Midpoint marker */}
        <div className="absolute top-0 bottom-0 left-1/2 w-1 bg-white/70 transform -translate-x-1/2 z-10"></div>

        {/* Filled track - positioned based on which side is filled */}
        <motion.div
          className={`absolute top-0 bottom-0 rounded-full ${colors.fill} opacity-30`}
          initial={{ width: "0%", left: `${fillStartPercentage}%` }}
          animate={{
            width: `${fillWidth}%`,
            left: `${fillStartPercentage}%`,
          }}
          transition={{ duration: 1, ease: "easeOut" }}
        ></motion.div>

        {/* Indicator bubble - positioned at the calculated position */}
        <div className="absolute top-0 bottom-0 flex items-center" style={{ left: `${positionPercentage}%` }}>
          <motion.div
            className="relative"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
          >
            <div
              className={`w-10 h-10 rounded-full ${colors.fill} border-2 ${colors.border} shadow-md flex items-center justify-center text-white text-sm font-bold transform -translate-x-1/2`}
            >
              {displayValue}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Labels for which side is stronger */}
      <div className="flex justify-between mt-1 text-xs text-gray-500">
        <div className={normalizedValue < 50 ? "font-medium" : ""}>
          {normalizedValue < 50 ? `${displayValue}% ${leftLabel}` : ""}
        </div>
        <div className={normalizedValue > 50 ? "font-medium" : ""}>
          {normalizedValue > 50 ? `${displayValue}% ${rightLabel}` : ""}
        </div>
      </div>
    </motion.div>
  )
}
