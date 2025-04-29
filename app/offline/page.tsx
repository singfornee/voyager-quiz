"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { WifiOff, RefreshCw } from "lucide-react"

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-voyabear-light flex flex-col items-center justify-center p-4 text-center">
      <div className="w-24 h-24 sm:w-32 sm:h-32 mb-4 sm:mb-6 relative">
        <div className="absolute -inset-4 rounded-full bg-white/50 blur-lg"></div>
        <Image
          src="/voyabear-mascot.png"
          alt="VoyaBear Mascot"
          width={128}
          height={128}
          className="animate-float relative z-10"
        />
        <div className="absolute -bottom-2 w-full h-4 bg-black/10 blur-md rounded-full"></div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg max-w-md">
        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
          <WifiOff className="h-6 w-6 text-red-500" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold mb-3 text-voyabear-primary">You're Offline</h1>

        <p className="text-base text-gray-700 mb-6">
          Looks like you've lost your internet connection. Connect to WiFi or mobile data to continue your travel
          adventure!
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={() => window.location.reload()}
            className="bg-voyabear-primary hover:bg-voyabear-dark text-white"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>

          <Button asChild variant="outline">
            <Link href="/">Go Home</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
