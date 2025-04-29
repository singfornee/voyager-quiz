"use client"

import { useState, useEffect } from "react"
import { WifiOff } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function OfflineNotice() {
  const [isOffline, setIsOffline] = useState(false)

  useEffect(() => {
    // Check initial online status
    setIsOffline(!navigator.onLine)

    // Add event listeners for online/offline events
    const handleOnline = () => setIsOffline(false)
    const handleOffline = () => setIsOffline(true)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  if (!isOffline) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50">
      <Alert variant="destructive" className="border-red-500 bg-red-50 shadow-lg">
        <WifiOff className="h-4 w-4 text-red-500" />
        <AlertTitle className="text-red-500 text-sm sm:text-base">You're offline</AlertTitle>
        <AlertDescription className="text-xs sm:text-sm">
          You can still take the quiz, but you'll need to reconnect to see your results.
        </AlertDescription>
      </Alert>
    </div>
  )
}
