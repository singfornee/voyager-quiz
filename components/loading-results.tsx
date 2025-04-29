import Image from "next/image"

export default function LoadingResults() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-4 sm:p-8">
      <div className="relative mb-4 sm:mb-6">
        <div className="absolute -inset-6 sm:-inset-8 rounded-full bg-gradient-to-r from-voyabear-primary/30 to-voyabear-secondary/30 blur-lg animate-pulse"></div>
        <div className="relative w-20 h-20 sm:w-28 sm:h-28">
          <Image src="/voyabear-mascot.png" alt="VoyaBear Mascot" width={112} height={112} className="animate-float" />
          <div className="absolute -bottom-2 w-full h-4 bg-black/10 blur-md rounded-full"></div>
        </div>
      </div>
      <h3 className="text-lg sm:text-xl font-medium text-voyabear-primary mt-2 animate-pulse">
        Creating your profile...
      </h3>
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
  )
}
