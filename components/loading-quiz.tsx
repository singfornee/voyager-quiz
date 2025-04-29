import Image from "next/image"

export default function LoadingQuiz() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] sm:min-h-[60vh] p-4 sm:p-8">
      <div className="relative mb-4 sm:mb-6">
        <div className="absolute -inset-6 sm:-inset-8 rounded-full bg-gradient-to-r from-voyabear-primary/30 to-voyabear-secondary/30 blur-lg animate-pulse"></div>
        <div className="relative w-20 h-20 sm:w-28 sm:h-28">
          <Image src="/voyabear-mascot.png" alt="VoyaBear Mascot" width={112} height={112} className="animate-float" />
          <div className="absolute -bottom-2 w-full h-4 bg-black/10 blur-md rounded-full"></div>
        </div>
      </div>
      <h3 className="text-lg sm:text-xl font-medium text-voyabear-primary mt-2 animate-pulse">
        Loading your adventure...
      </h3>
      <p className="text-gray-600 mt-2 text-center max-w-xs text-sm sm:text-base">
        Our bear is digging through your travel soul. This'll be worth it, promise!
      </p>

      <div className="mt-6 sm:mt-8 flex items-center space-x-2">
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
  )
}
