"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface LanguagePromptProps {
  onAccept: () => void
  onDismiss: () => void
}

export default function LanguagePrompt({ onAccept, onDismiss }: LanguagePromptProps) {
  const [isVisible, setIsVisible] = useState(false)

  // Show the prompt with a slight delay for better UX
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-4 left-0 right-0 z-50 mx-auto max-w-md px-4"
        >
          <div className="bg-white rounded-lg shadow-lg border border-voyabear-primary/20 p-4 flex items-center">
            <div className="mr-3 text-2xl">🇹🇼</div>
            <div className="flex-1">
              <p className="text-sm text-gray-700">
                <span className="font-medium">偵測到您的瀏覽器使用繁體中文</span>
                <br />
                <span className="text-xs">我們可以為您切換到繁體中文介面</span>
              </p>
            </div>
            <div className="flex space-x-2 ml-2">
              <Button size="sm" variant="outline" className="text-xs h-8 px-2 border-gray-200" onClick={onDismiss}>
                <X className="h-3 w-3 mr-1" />
                No
              </Button>
              <Button
                size="sm"
                className="text-xs h-8 px-2 bg-voyabear-primary hover:bg-voyabear-dark text-white"
                onClick={onAccept}
              >
                切換到中文
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
