"use client"

import { Loader2 } from "lucide-react"

export default function LoadingResults() {
  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-4 sm:p-8">
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-md">
          <Loader2 className="h-12 w-12 text-voyabear-primary animate-spin mx-auto mb-4" />
          <h3 className="text-lg sm:text-xl font-medium text-voyabear-primary text-center">Creating your profile...</h3>
          <p className="text-gray-600 mt-2 text-center max-w-xs text-sm sm:text-base">
            Our AI is crafting your unique travel personality. Just a moment!
          </p>

          <div className="mt-6 sm:mt-8 flex flex-col items-center">
            <div className="w-48 sm:w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-voyabear animate-pulse" style={{ width: "75%" }}></div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Almost there...</p>
          </div>
        </div>
      </div>
    </>
  )
}
