"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"

interface ProgressiveLoaderProps {
  children: React.ReactNode
  delay?: number
}

export default function ProgressiveLoader({ children, delay = 0 }: ProgressiveLoaderProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Ensure delay is a number to prevent issues
    const safeDelay = typeof delay === "number" ? delay : 0

    const timer = setTimeout(() => {
      setIsVisible(true)
    }, safeDelay)

    return () => clearTimeout(timer)
  }, [delay])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  )
}
