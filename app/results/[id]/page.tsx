"use client"

import { notFound } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  MapPin,
  Sparkles,
  Heart,
  Award,
  Compass,
  AlertTriangle,
  Users,
  Lightbulb,
  Check,
  ExternalLink,
  Globe,
  Camera,
  Plane,
  Zap,
  Star,
  Coffee,
  Utensils,
  Music,
  Sun,
  Map,
  Briefcase,
} from "lucide-react"
import Link from "next/link"
import ShareProfile from "@/components/share-profile"
import ResultsCta from "@/components/results-cta"
import type { ProfileData } from "@/lib/storage"
import { fetchCityImages } from "@/lib/unsplash"
import Image from "next/image"
import BackToTop from "@/components/back-to-top"
import { useEffect, useState } from "react"
import { analyticsClient, getSessionId } from "@/lib/analytics-client"
import LoadingResults from "@/components/loading-results"

// Type for Unsplash image data
interface UnsplashImageData {
  url: string
  query?: string
  photographer?: string
  photographerUrl?: string
}

export default function ResultsPage({ params }: { params: { id: string } }) {
  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const [cityImages, setCityImages] = useState<UnsplashImageData[]>([])
  const [loading, setLoading] = useState(true)
  const [imagesLoading, setImagesLoading] = useState(true)

  useEffect(() => {
    // First load critical profile data
    const fetchProfileData = async () => {
      try {
        // Fetch profile data
        const response = await fetch(`/api/profile/${params.id}`)
        if (!response.ok) {
          throw new Error("Profile not found")
        }

        const data = await response.json()
        setProfileData(data)

        // Track profile view
        analyticsClient.trackEvent("profile_viewed", {
          sessionId: getSessionId(),
          profileId: params.id,
        })
      } catch (error) {
        console.error("Error fetching profile:", error)
        notFound()
      } finally {
        setLoading(false)
      }
    }

    fetchProfileData()
  }, [params.id])

  // Load city images after profile data is available
  useEffect(() => {
    if (!profileData) return

    const loadCityImages = async () => {
      try {
        setImagesLoading(true)
        const images = await fetchCityImages(profileData.recommendedCities)
        setCityImages(images)
      } catch (error) {
        console.error("Error loading city images:", error)
        // Set fallback images
        setCityImages(
          profileData.recommendedCities.map((city) => ({
            url: `/placeholder.svg?height=400&width=600&query=${encodeURIComponent(`${city.name} ${city.country}`)}`,
            query: `${city.name} ${city.country}`,
          })),
        )
      } finally {
        setImagesLoading(false)
      }
    }

    loadCityImages()
  }, [profileData])

  if (loading) {
    return <LoadingResults />
  }

  if (!profileData) {
    notFound()
  }

  // Emoji mapping for profile types
  const profileEmojis: Record<string, string> = {
    cultural: "🏛️",
    adventure: "🏔️",
    luxury: "✨",
    authentic: "🌿",
  }

  // Get emoji based on profile name (fallback to random travel emoji)
  const getProfileEmoji = () => {
    const lowerName = profileData.profileName.toLowerCase()
    if (lowerName.includes("cultural") || lowerName.includes("history")) return "🏛️"
    if (lowerName.includes("adventure") || lowerName.includes("explorer")) return "🏔️"
    if (lowerName.includes("luxury") || lowerName.includes("comfort")) return "✨"
    if (lowerName.includes("authentic") || lowerName.includes("local")) return "🌿"
    return "🧳"
  }

  const profileEmoji = getProfileEmoji()

  return (
    <main className="min-h-screen bg-voyabear-light bg-confetti py-4 sm:py-8 overflow-hidden">
      {/* Background elements - hidden on small screens for better performance */}
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

      <div className="container mx-auto px-4 max-w-5xl relative">
        <div className="absolute -top-6 -left-16 w-32 h-32 bg-voyabear-secondary/20 rounded-full blur-3xl" />
        <div className="absolute top-1/4 -right-20 w-40 h-40 bg-voyabear-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -left-10 w-24 h-24 bg-voyabear-tertiary/20 rounded-full blur-3xl" />

        <Link
          href="/"
          className="inline-flex items-center text-voyabear-primary hover:text-voyabear-dark mb-4 sm:mb-6 transition-colors bg-white/50 backdrop-blur-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-full shadow-sm text-sm"
        >
          <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
          Try again?
        </Link>

        <header className="text-center mb-6 sm:mb-10 relative">
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-4 sm:mb-5 relative text-shadow">
            <span className="gradient-text glow-text">Here's Your Travel Type!</span>
          </h1>

          <div className="inline-block bg-gradient-voyabear text-white px-4 py-2 sm:px-6 sm:py-3 rounded-full text-lg sm:text-xl md:text-2xl font-semibold mb-3 sm:mb-4 shadow-lg glow">
            <span className="mr-2">{profileEmoji}</span>
            {profileData.profileName}
          </div>

          <p className="text-gray-700 max-w-2xl mx-auto text-sm sm:text-base">
            Our AI figured you out. Scary accurate, right? But in a fun way!
          </p>
        </header>

        {/* Profile Traits Section */}
        <Card className="p-4 sm:p-8 bg-white border-0 shadow-md rounded-xl mb-6 sm:mb-8 fade-in relative overflow-hidden card-glass">
          <div className="absolute top-0 right-0 w-40 h-40 bg-voyabear-light/50 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>

          <div className="flex items-center mb-4 sm:mb-6">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-voyabear flex items-center justify-center mr-3 sm:mr-4 shadow-md">
              <Award className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold text-voyabear-primary">That's So You</h2>
          </div>

          <div className="flex flex-wrap gap-2 sm:gap-3 mb-6 sm:mb-8">
            {profileData.traits.map((trait, index) => {
              // Dynamic icons based on trait keywords
              let icon = <Sparkles className="h-3 w-3" />

              if (trait.toLowerCase().includes("adventure")) icon = <Zap className="h-3 w-3" />
              else if (trait.toLowerCase().includes("culture") || trait.toLowerCase().includes("history"))
                icon = <Globe className="h-3 w-3" />
              else if (trait.toLowerCase().includes("food") || trait.toLowerCase().includes("cuisine"))
                icon = <Utensils className="h-3 w-3" />
              else if (trait.toLowerCase().includes("photo")) icon = <Camera className="h-3 w-3" />
              else if (trait.toLowerCase().includes("luxury") || trait.toLowerCase().includes("comfort"))
                icon = <Star className="h-3 w-3" />
              else if (trait.toLowerCase().includes("social") || trait.toLowerCase().includes("friend"))
                icon = <Users className="h-3 w-3" />
              else if (trait.toLowerCase().includes("plan")) icon = <Map className="h-3 w-3" />
              else if (trait.toLowerCase().includes("relax")) icon = <Coffee className="h-3 w-3" />

              return (
                <span
                  key={index}
                  className="bg-voyabear-light text-voyabear-primary px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium shadow-sm border border-voyabear-primary/10 flex items-center hover:scale-105 transition-transform"
                >
                  <span className="mr-1.5">{icon}</span>
                  {trait}
                </span>
              )
            })}
          </div>

          <Separator className="my-4 sm:my-6 bg-gradient-to-r from-transparent via-voyabear-primary/20 to-transparent" />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-8">
            <div className="card-hover">
              <h3 className="text-base sm:text-lg font-medium text-voyabear-primary mb-2 sm:mb-3 flex items-center">
                <Heart className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-voyabear-tertiary" />
                Your Travel Animal
              </h3>
              <Card className="p-3 sm:p-5 border-0 shadow-sm bg-gradient-to-br from-white to-voyabear-light/50 hover:shadow-md transition-shadow">
                <p className="text-gray-700 text-sm sm:text-base">
                  <span className="font-semibold">{profileData.animal.name}:</span> {profileData.animal.reason}
                </p>
              </Card>
            </div>

            <div className="card-hover">
              <h3 className="text-base sm:text-lg font-medium text-voyabear-primary mb-2 sm:mb-3 flex items-center">
                <Users className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-voyabear-accent" />
                In The Group Chat
              </h3>
              <Card className="p-3 sm:p-5 border-0 shadow-sm bg-gradient-to-br from-white to-voyabear-light/50 hover:shadow-md transition-shadow">
                <p className="text-gray-700 text-sm sm:text-base">{profileData.groupRole}</p>
                <p className="text-xs text-gray-500 mt-2 italic">Every squad needs one!</p>
              </Card>
            </div>

            <div className="card-hover">
              <h3 className="text-base sm:text-lg font-medium text-voyabear-primary mb-2 sm:mb-3 flex items-center">
                <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-voyabear-neon" />
                Special Move
              </h3>
              <Card className="p-3 sm:p-5 border-0 shadow-sm bg-gradient-to-br from-white to-voyabear-light/50 hover:shadow-md transition-shadow">
                <p className="text-gray-700 text-sm sm:text-base">{profileData.superpower}</p>
                <p className="text-xs text-gray-500 mt-2 italic">Use it wisely!</p>
              </Card>
            </div>
          </div>
        </Card>

        {/* MBTI Analysis Section */}
        <Card className="p-4 sm:p-8 bg-white border-0 shadow-md rounded-xl mb-6 sm:mb-8 fade-in relative overflow-hidden card-glass">
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-voyabear-accent/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl"></div>

          <div className="flex items-center mb-4 sm:mb-6">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-voyabear-alt flex items-center justify-center mr-3 sm:mr-4 shadow-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5 sm:h-6 sm:w-6 text-white"
              >
                <path d="M2 12h5" />
                <path d="M17 12h5" />
                <path d="M12 2v5" />
                <path d="M12 17v5" />
                <path d="M4.93 4.93l3.54 3.54" />
                <path d="M15.54 15.54l3.54 3.54" />
                <path d="M4.93 19.07l3.54-3.54" />
                <path d="M15.54 8.46l3.54-3.54" />
              </svg>
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold text-voyabear-primary">The Real You</h2>
          </div>

          <div className="prose prose-purple max-w-none mb-6 sm:mb-8">
            <div className="bg-voyabear-light/50 p-4 sm:p-6 rounded-xl mb-6 sm:mb-8 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-lg sm:text-xl font-medium text-voyabear-primary mb-3 sm:mb-4 flex items-center">
                <Zap className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-voyabear-secondary" />
                How You Roll
              </h3>
              <p className="text-gray-700 whitespace-pre-line text-sm sm:text-base">
                {profileData.mbtiAnalysis.overview}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 mb-6 sm:mb-8">
              <div className="card-hover">
                <h3 className="text-base sm:text-lg font-medium text-voyabear-primary mb-2 sm:mb-3 flex items-center">
                  <Award className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-voyabear-neon" />
                  You're Great At
                </h3>
                <Card className="p-3 sm:p-5 border-0 shadow-sm bg-gradient-to-br from-white to-voyabear-light/50 hover:shadow-md transition-shadow">
                  <ul className="space-y-2 sm:space-y-3">
                    {profileData.mbtiAnalysis.strengths.map((strength, index) => (
                      <li key={index} className="flex items-start">
                        <span className="inline-flex items-center justify-center h-4 w-4 sm:h-5 sm:w-5 rounded-full bg-gradient-to-r from-green-500 to-teal-500 text-white mr-2 mt-0.5 flex-shrink-0 shadow-sm">
                          <Check className="h-2 w-2 sm:h-3 sm:w-3" />
                        </span>
                        <span className="text-gray-700 text-sm sm:text-base">{strength}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>

              <div className="card-hover">
                <h3 className="text-base sm:text-lg font-medium text-voyabear-primary mb-2 sm:mb-3 flex items-center">
                  <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-amber-500" />
                  Watch Out For
                </h3>
                <Card className="p-3 sm:p-5 border-0 shadow-sm bg-gradient-to-br from-white to-voyabear-light/50 hover:shadow-md transition-shadow">
                  <ul className="space-y-2 sm:space-y-3">
                    {profileData.mbtiAnalysis.challenges.map((challenge, index) => (
                      <li key={index} className="flex items-start">
                        <span className="inline-flex items-center justify-center h-4 w-4 sm:h-5 sm:w-5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-white mr-2 mt-0.5 flex-shrink-0 shadow-sm">
                          <AlertTriangle className="h-2 w-2 sm:h-3 sm:w-3" />
                        </span>
                        <span className="text-gray-700 text-sm sm:text-base">{challenge}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
              <div className="card-hover">
                <h3 className="text-base sm:text-lg font-medium text-voyabear-primary mb-2 sm:mb-3 flex items-center">
                  <Compass className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-voyabear-secondary" />
                  Your Style
                </h3>
                <Card className="p-3 sm:p-5 border-0 shadow-sm bg-gradient-to-br from-white to-voyabear-light/50 h-full hover:shadow-md transition-shadow">
                  {/* Improved bullet points with better styling */}
                  <ul className="space-y-2 sm:space-y-3 pl-0">
                    {profileData.mbtiAnalysis.travelStyle
                      .split(". ")
                      .filter((sentence) => sentence.trim().length > 0)
                      .map((sentence, i) => (
                        <li key={i} className="flex items-start">
                          <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-voyabear-secondary/20 text-voyabear-secondary mr-2 mt-0.5 flex-shrink-0">
                            <Check className="h-3 w-3" />
                          </span>
                          <span>{sentence.trim().replace(/\.$/, "")}</span>
                        </li>
                      ))}
                  </ul>
                </Card>
              </div>

              <div className="card-hover">
                <h3 className="text-base sm:text-lg font-medium text-voyabear-primary mb-2 sm:mb-3 flex items-center">
                  <Users className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-voyabear-primary" />
                  Travel With These People
                </h3>
                <Card className="p-3 sm:p-5 border-0 shadow-sm bg-gradient-to-br from-white to-voyabear-light/50 h-full hover:shadow-md transition-shadow">
                  {/* Improved bullet points with better styling */}
                  <ul className="space-y-2 sm:space-y-3 pl-0">
                    {profileData.mbtiAnalysis.idealCompanions
                      .split(". ")
                      .filter((sentence) => sentence.trim().length > 0)
                      .map((sentence, i) => (
                        <li key={i} className="flex items-start">
                          <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-voyabear-primary/20 text-voyabear-primary mr-2 mt-0.5 flex-shrink-0">
                            <Users className="h-3 w-3" />
                          </span>
                          <span>{sentence.trim().replace(/\.$/, "")}</span>
                        </li>
                      ))}
                  </ul>
                </Card>
              </div>

              <div className="card-hover">
                <h3 className="text-base sm:text-lg font-medium text-voyabear-primary mb-2 sm:mb-3 flex items-center">
                  <Lightbulb className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-voyabear-tertiary" />
                  Try This Next Time
                </h3>
                <Card className="p-3 sm:p-5 border-0 shadow-sm bg-gradient-to-br from-white to-voyabear-light/50 h-full hover:shadow-md transition-shadow">
                  {/* Improved bullet points with better styling */}
                  <ul className="space-y-2 sm:space-y-3 pl-0">
                    {profileData.mbtiAnalysis.growthAreas
                      .split(". ")
                      .filter((sentence) => sentence.trim().length > 0)
                      .map((sentence, i) => (
                        <li key={i} className="flex items-start">
                          <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-voyabear-tertiary/20 text-voyabear-tertiary mr-2 mt-0.5 flex-shrink-0">
                            <Lightbulb className="h-3 w-3" />
                          </span>
                          <span>{sentence.trim().replace(/\.$/, "")}</span>
                        </li>
                      ))}
                  </ul>
                </Card>
              </div>
            </div>
          </div>
        </Card>

        {/* Destinations Section - Improved Layout */}
        <Card className="p-4 sm:p-8 bg-white border-0 shadow-md rounded-xl mb-6 sm:mb-8 fade-in relative overflow-hidden card-glass">
          <div className="absolute top-0 left-1/2 w-40 h-40 bg-voyabear-secondary/20 rounded-full -translate-y-1/2 -translate-x-1/2 blur-2xl"></div>

          <div className="flex items-center mb-4 sm:mb-6">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-voyabear-neon flex items-center justify-center mr-3 sm:mr-4 shadow-md">
              <Plane className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold text-voyabear-primary">Places You'd Love</h2>
          </div>

          <p className="text-gray-700 mb-6 sm:mb-8 flex items-center text-sm sm:text-base">
            <Globe className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-voyabear-secondary" />
            Based on your answers, you should check these spots out. Just saying.
          </p>

          {/* Improved grid layout for destinations */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {profileData.recommendedCities.map((city, index) => {
              // Dynamic icon based on city name or country
              let cityIcon = <MapPin className="h-4 w-4 mr-1 text-voyabear-secondary" />

              if (city.name.toLowerCase().includes("beach") || city.country.toLowerCase().includes("island")) {
                cityIcon = <Sun className="h-4 w-4 mr-1 text-voyabear-secondary" />
              } else if (
                city.name.toLowerCase().includes("york") ||
                city.name.toLowerCase().includes("tokyo") ||
                city.name.toLowerCase().includes("london")
              ) {
                cityIcon = <Briefcase className="h-4 w-4 mr-1 text-voyabear-secondary" />
              } else if (city.reason.toLowerCase().includes("food") || city.reason.toLowerCase().includes("cuisine")) {
                cityIcon = <Utensils className="h-4 w-4 mr-1 text-voyabear-secondary" />
              } else if (
                city.reason.toLowerCase().includes("music") ||
                city.reason.toLowerCase().includes("festival")
              ) {
                cityIcon = <Music className="h-4 w-4 mr-1 text-voyabear-secondary" />
              }

              // Create a placeholder URL as fallback
              const placeholderUrl = `/placeholder.svg?height=400&width=600&query=${encodeURIComponent(city.name + " " + city.country)}`

              // Get the image URL from cityImages or use placeholder
              const imageUrl = cityImages[index]?.url || placeholderUrl

              return (
                <Card key={index} className="overflow-hidden border-0 shadow-md card-hover h-full">
                  <div className="h-32 sm:h-40 bg-gray-200 relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10"></div>
                    <div className="absolute inset-0 bg-voyabear-light/50">
                      <Image
                        src={imageUrl || "/placeholder.svg"}
                        alt={`${city.name}, ${city.country}`}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover"
                        unoptimized={!cityImages[index]?.url}
                        priority={index < 3} // Prioritize loading the first 3 images
                      />
                    </div>
                    <div className="absolute bottom-0 left-0 p-3 z-20">
                      <h3 className="font-medium text-white text-base sm:text-lg mb-0.5 flex items-center">
                        {cityIcon}
                        {city.name}
                      </h3>
                      <p className="text-white/90 text-xs">{city.country}</p>
                    </div>
                  </div>
                  <div className="p-3 sm:p-4">
                    <p className="text-gray-600 text-sm">{city.reason}</p>
                  </div>
                </Card>
              )
            })}
          </div>

          <div className="text-xs text-gray-500 text-center mt-4 sm:mt-6">
            Photos from{" "}
            <a
              href="https://unsplash.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-voyabear-primary hover:underline inline-flex items-center"
            >
              Unsplash <ExternalLink className="h-2 w-2 sm:h-3 sm:w-3 ml-1" />
            </a>
          </div>
        </Card>

        {/* Share and Signup Section */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 mb-6 sm:mb-8">
          <Card className="p-4 sm:p-6 bg-white border-0 shadow-md rounded-xl card-glass">
            <h2 className="text-lg sm:text-xl font-semibold text-voyabear-primary mb-3 sm:mb-4 flex items-center">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-voyabear-alt flex items-center justify-center mr-2 sm:mr-3 shadow-md">
                <Compass className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              Brag About It
            </h2>
            <p className="text-gray-700 mb-3 sm:mb-4 flex items-center text-sm sm:text-base">
              <Star className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-voyabear-secondary" />
              Share your results and make your friends take it too!
            </p>
            <ShareProfile profileId={params.id} profileName={profileData.profileName} profileData={profileData} />
          </Card>

          <Card className="p-4 sm:p-6 bg-white border-0 shadow-md rounded-xl card-glass">
            <ResultsCta profileType={profileData.profileName} />
          </Card>
        </div>

        <footer className="text-center text-gray-600 text-xs sm:text-sm mt-8 sm:mt-12">
          <p>© {new Date().getFullYear()} VoyaBear. Made with ☕ and wanderlust.</p>
        </footer>
      </div>

      <BackToTop />
    </main>
  )
}
