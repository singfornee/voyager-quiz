import { Loader2 } from "lucide-react"

export default function LoadingQuiz() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] sm:min-h-[60vh] p-4 sm:p-8">
      <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-md">
        <div className="flex flex-col items-center">
          <Loader2 className="h-10 w-10 text-voyabear-primary animate-spin mb-4" />
          <h3 className="text-lg sm:text-xl font-medium text-voyabear-primary">Loading your adventure...</h3>
          <p className="text-gray-600 mt-2 text-center max-w-xs text-sm sm:text-base">
            Preparing your travel personality quiz. This'll be worth it, promise!
          </p>
        </div>

        <div className="mt-6 sm:mt-8 flex items-center justify-center space-x-2">
          <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-voyabear-primary animate-bounce"></div>
          <div
            className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-voyabear-secondary animate-bounce"
            style={{ animationDelay: "0.2s" }}
          ></div>
          <div
            className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-voyabear-tertiary animate-bounce"
            style={{ animationDelay: "0.4s" }}
          ></div>
        </div>
      </div>
    </div>
  )
}
