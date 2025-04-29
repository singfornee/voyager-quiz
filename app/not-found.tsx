import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-voyabear-light bg-travel-pattern flex flex-col items-center justify-center p-4 text-center">
      <div className="hidden sm:block absolute top-20 left-10 w-16 h-16 opacity-20">
        <Image
          src="/travel-illustrations/airplane.png"
          alt="Airplane"
          width={64}
          height={64}
          className="animate-float"
        />
      </div>
      <div className="hidden sm:block absolute top-40 right-10 w-12 h-12 opacity-20">
        <Image
          src="/travel-illustrations/compass.png"
          alt="Compass"
          width={48}
          height={48}
          className="animate-float-delayed"
        />
      </div>

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

      <h1 className="text-2xl sm:text-4xl font-bold mb-3 sm:mb-4 gradient-text text-shadow glow-text">
        Oops! You're Lost in the Travel Void
      </h1>
      <p className="text-base sm:text-lg text-gray-700 mb-6 sm:mb-8 max-w-md">
        This profile has wandered off the map! Maybe it's backpacking through Europe without cell service? Let's get you
        back on track.
      </p>

      <Button
        asChild
        className="bg-gradient-voyabear hover:opacity-90 text-white px-4 sm:px-6 py-2 sm:py-6 text-base sm:text-lg shadow-md glow"
      >
        <Link href="/">
          <span className="flex items-center">
            Take the Quiz Again
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="ml-2"
            >
              <path d="M5 12h14"></path>
              <path d="m12 5 7 7-7 7"></path>
            </svg>
          </span>
        </Link>
      </Button>
    </div>
  )
}
