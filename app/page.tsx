import { Suspense } from "react"
import LoadingQuiz from "@/components/loading-quiz"
import OfflineNotice from "@/components/offline-notice"
import { Sparkles } from "lucide-react"
import Image from "next/image"
import dynamic from "next/dynamic"
import Link from "next/link"
import EarlyAccessButton from "@/components/early-access-button"

// Lazy load the TravelQuiz component
const TravelQuiz = dynamic(() => import("@/components/travel-quiz"), {
  loading: () => <LoadingQuiz />,
})

export default function Home() {
  return (
    <main className="min-h-screen bg-voyabear-light bg-travel-pattern overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-voyabear-primary/10 to-transparent pointer-events-none" />
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
      <div className="hidden sm:block absolute bottom-20 left-20 w-14 h-14 opacity-20">
        <Image
          src="/travel-illustrations/passport.png"
          alt="Passport"
          width={56}
          height={56}
          className="animate-float"
        />
      </div>
      <div className="hidden sm:block absolute bottom-40 right-20 w-16 h-16 opacity-20">
        <Image src="/travel-illustrations/camera.png" alt="Camera" width={64} height={64} className="animate-float" />
      </div>

      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold text-voyabear-primary">VoyaBear</span>
            </Link>
          </div>

          <div>
            <EarlyAccessButton />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 sm:py-10 max-w-4xl relative">
        <div className="absolute -top-6 -left-16 w-32 h-32 bg-voyabear-secondary/20 rounded-full blur-3xl" />
        <div className="absolute top-1/4 -right-20 w-40 h-40 bg-voyabear-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -left-10 w-24 h-24 bg-voyabear-tertiary/20 rounded-full blur-3xl" />

        <header className="text-center mb-6 sm:mb-8 relative">
          <div className="flex justify-center items-center mb-4 sm:mb-6">
            <div className="relative w-20 h-20 sm:w-24 sm:h-24">
              <div className="absolute -inset-4 rounded-full bg-white/50 blur-lg"></div>
              <Image
                src="/voyabear-mascot.png"
                alt="VoyaBear Mascot"
                width={96}
                height={96}
                className="animate-float relative z-10"
              />
              <div className="absolute -bottom-2 w-full h-4 bg-black/10 blur-md rounded-full"></div>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 relative text-shadow">
            <span className="gradient-text glow-text">Get Personalised Destination Picks?</span>
          </h1>

          <p className="text-base sm:text-lg text-gray-700 mb-3 sm:mb-4 max-w-2xl mx-auto">
            6 quick Qs. One epic travel profile. Way more fun than your horoscope. 😎
          </p>

          <div className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white shadow-md text-voyabear-primary text-xs sm:text-sm font-medium mb-4 sm:mb-6 border border-voyabear-primary/10">
            <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 text-voyabear-secondary" />
            <span>Instant Results. No signups required.</span>
          </div>
        </header>

        <div className="relative z-10">
          <Suspense fallback={<LoadingQuiz />}>
            <TravelQuiz />
          </Suspense>
        </div>
      </div>

      <footer className="mt-8 py-4 text-center text-sm text-gray-500">Powered by Voyager AI &copy; 2025</footer>

      <OfflineNotice />
    </main>
  )
}
