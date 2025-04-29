"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Facebook, Twitter, Copy, CheckCircle2, Share2 } from "lucide-react"
import type { ProfileData } from "@/lib/storage"
import { analyticsClient, getSessionId } from "@/lib/analytics-client"
import { Card } from "@/components/ui/card"

// Add import for trackEvent
import { trackEvent } from "@/lib/ga-utils"

interface ShareProfileProps {
  profileId: string
  profileName: string
  profileData: ProfileData
}

export default function ShareProfile({ profileId, profileName, profileData }: ShareProfileProps) {
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState<"social" | "copy">("social")
  const [shareError, setShareError] = useState<string | null>(null)

  // Get the full URL to share
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://voyabear.com"

  const shareUrl = `${baseUrl}/results/${profileId}`

  // Create a more engaging share text with emojis that match the profile
  const getShareEmoji = () => {
    const lowerName = profileName.toLowerCase()
    if (lowerName.includes("adventure") || lowerName.includes("explorer")) return "🏔️"
    if (lowerName.includes("luxury") || lowerName.includes("comfort")) return "✨"
    if (lowerName.includes("cultural") || lowerName.includes("history")) return "🏛️"
    if (lowerName.includes("foodie") || lowerName.includes("culinary")) return "🍜"
    if (lowerName.includes("relax") || lowerName.includes("chill")) return "🌴"
    return "🧳"
  }

  const shareEmoji = getShareEmoji()

  // Create a shorter, more concise share text to prevent overflow
  const trait = profileData.traits && profileData.traits.length > 0 ? profileData.traits[0].toLowerCase() : ""

  // Truncate superpower if it's too long
  const superpower = profileData.superpower
    ? profileData.superpower.length > 30
      ? profileData.superpower.substring(0, 30).toLowerCase() + "..."
      : profileData.superpower.toLowerCase()
    : ""

  const shareText = `${shareEmoji} I'm a "${profileName}"! ${
    trait ? `I'm ${trait}` : ""
  } and my travel superpower is ${superpower}. #VoyaBear`

  // Update the handleCopyLink function
  const handleCopyLink = () => {
    try {
      navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setShareError(null)

      // Track share event
      analyticsClient.trackEvent("profile_shared", {
        sessionId: getSessionId(),
        profileId,
        shareMethod: "copy",
      })

      // Track in Google Analytics
      trackEvent("share", "profile_sharing", "copy_link", undefined, false, {
        profile_id: profileId,
        profile_type: profileName,
      })

      // Track in Google Analytics
      trackEvent("share", "profile_sharing", "Copy link", undefined, false, {
        profile_id: profileId,
        share_method: "copy",
      })

      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Error copying to clipboard:", error)
      setShareError("Couldn't copy to clipboard. Please try again.")
    }
  }

  const handleCopyText = () => {
    try {
      navigator.clipboard.writeText(`${shareText}\n\nTake the quiz: ${shareUrl}`)
      setCopied(true)
      setShareError(null)

      // Track share event
      analyticsClient.trackEvent("profile_shared", {
        sessionId: getSessionId(),
        profileId,
        shareMethod: "copy_text",
      })

      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Error copying to clipboard:", error)
      setShareError("Couldn't copy to clipboard. Please try again.")
    }
  }

  // Check if Web Share API is actually available and working
  const isWebShareAvailable = () => {
    return (
      typeof navigator !== "undefined" &&
      typeof navigator.share === "function" &&
      typeof navigator.canShare === "function"
    )
  }

  // Native share API for mobile devices with fallback
  const handleNativeShare = async () => {
    setShareError(null)

    // First check if Web Share API is available
    if (!isWebShareAvailable()) {
      // Fallback to copying to clipboard
      handleCopyText()
      return
    }

    const shareData = {
      title: `My Travel Personality: ${profileName}`,
      text: shareText,
      url: shareUrl,
    }

    // Check if the content can be shared
    if (!navigator.canShare(shareData)) {
      console.log("Content cannot be shared with Web Share API")
      handleCopyText()
      return
    }

    try {
      await navigator.share(shareData)

      // Track share event
      analyticsClient.trackEvent("profile_shared", {
        sessionId: getSessionId(),
        profileId,
        shareMethod: "native",
      })
    } catch (error) {
      console.error("Error sharing:", error)

      // Don't show error for user cancellations
      if (error.name !== "AbortError") {
        // Fallback to copying instead of showing error
        handleCopyText()
      }
    }
  }

  const shareLinks = [
    // Update other sharing methods similarly
    // For example, update the Facebook share action:
    {
      name: "Facebook",
      icon: <Facebook className="h-4 w-4 sm:h-5 sm:w-5" />,
      action: () => {
        try {
          window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(
              shareText,
            )}`,
            "_blank",
            "noopener,noreferrer",
          )
          setShareError(null)

          // Track share event
          analyticsClient.trackEvent("profile_shared", {
            sessionId: getSessionId(),
            profileId,
            shareMethod: "facebook",
          })

          // Track in Google Analytics
          trackEvent("share", "profile_sharing", "facebook", undefined, false, {
            profile_id: profileId,
            profile_type: profileName,
          })

          // Track in Google Analytics
          trackEvent("share", "profile_sharing", "Facebook", undefined, false, {
            profile_id: profileId,
            share_method: "facebook",
          })
        } catch (error) {
          console.error("Error opening Facebook share:", error)
          setShareError("Couldn't open Facebook. Please try a different method.")
        }
      },
      color: "bg-[#1877F2]",
    },
    {
      name: "Twitter",
      icon: <Twitter className="h-4 w-4 sm:h-5 sm:w-5" />,
      action: () => {
        try {
          window.open(
            `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
            "_blank",
            "noopener,noreferrer",
          )
          setShareError(null)

          // Track share event
          analyticsClient.trackEvent("profile_shared", {
            sessionId: getSessionId(),
            profileId,
            shareMethod: "twitter",
          })

          // Track in Google Analytics
          trackEvent("share", "profile_sharing", "twitter", undefined, false, {
            profile_id: profileId,
            profile_type: profileName,
          })
        } catch (error) {
          console.error("Error opening Twitter share:", error)
          setShareError("Couldn't open Twitter. Please try a different method.")
        }
      },
      color: "bg-[#1DA1F2]",
    },
    {
      name: "Instagram",
      icon: (
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
          className="h-4 w-4 sm:h-5 sm:w-5"
        >
          <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
        </svg>
      ),
      action: () => {
        try {
          // For Instagram, we'll copy the text to clipboard
          navigator.clipboard.writeText(`${shareText}\n\nTake the quiz: ${shareUrl}`)
          setShareError(null)
          setCopied(true)
          setTimeout(() => setCopied(false), 2000)

          // Track share event
          analyticsClient.trackEvent("profile_shared", {
            sessionId: getSessionId(),
            profileId,
            shareMethod: "instagram",
          })

          // Track in Google Analytics
          trackEvent("share", "profile_sharing", "instagram", undefined, false, {
            profile_id: profileId,
            profile_type: profileName,
          })
        } catch (error) {
          console.error("Error with Instagram share:", error)
          setShareError("Couldn't copy text. Please try a different method.")
        }
      },
      color: "bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCAF45]",
    },
    {
      name: "WhatsApp",
      icon: (
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
          className="h-4 w-4 sm:h-5 sm:w-5"
        >
          <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
          <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1Z" />
          <path d="M14 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1Z" />
          <path d="M9.5 13.5c.5 1.5 2.5 2 4 1" />
        </svg>
      ),
      action: () => {
        try {
          window.open(
            `https://wa.me/?text=${encodeURIComponent(`${shareText}\n\nTake the quiz: ${shareUrl}`)}`,
            "_blank",
            "noopener,noreferrer",
          )
          setShareError(null)

          // Track share event
          analyticsClient.trackEvent("profile_shared", {
            sessionId: getSessionId(),
            profileId,
            shareMethod: "whatsapp",
          })

          // Track in Google Analytics
          trackEvent("share", "profile_sharing", "whatsapp", undefined, false, {
            profile_id: profileId,
            profile_type: profileName,
          })
        } catch (error) {
          console.error("Error opening WhatsApp share:", error)
          setShareError("Couldn't open WhatsApp. Please try a different method.")
        }
      },
      color: "bg-[#25D366]",
    },
  ]

  // Check if the device supports the Web Share API
  const nativeShareAvailable = isWebShareAvailable()

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Preview card */}
      <Card className="p-3 sm:p-4 border border-voyabear-primary/10 bg-white/80 backdrop-blur-sm">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-voyabear flex items-center justify-center flex-shrink-0">
            <span className="text-xl sm:text-2xl">{shareEmoji}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm sm:text-base font-medium text-gray-800 break-words">{shareText}</p>
            <p className="text-xs text-gray-500 mt-1 truncate">{shareUrl}</p>
          </div>
        </div>
      </Card>

      {/* Share options tabs */}
      <div className="flex border-b border-gray-200">
        <button
          className={`flex-1 py-2 text-sm font-medium ${
            activeTab === "social"
              ? "text-voyabear-primary border-b-2 border-voyabear-primary"
              : "text-gray-500 hover:text-voyabear-primary/70"
          }`}
          onClick={() => setActiveTab("social")}
        >
          Share
        </button>
        <button
          className={`flex-1 py-2 text-sm font-medium ${
            activeTab === "copy"
              ? "text-voyabear-primary border-b-2 border-voyabear-primary"
              : "text-gray-500 hover:text-voyabear-primary/70"
          }`}
          onClick={() => setActiveTab("copy")}
        >
          Copy
        </button>
      </div>

      {/* Error message */}
      {shareError && <div className="text-xs text-red-500 text-center p-2 bg-red-50 rounded-md">{shareError}</div>}

      {activeTab === "social" && (
        <>
          {/* Native share button for mobile */}
          {nativeShareAvailable && (
            <Button
              variant="default"
              className="w-full bg-gradient-voyabear hover:opacity-90 text-white shadow-md"
              onClick={handleNativeShare}
            >
              <Share2 className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              Share to Any App
            </Button>
          )}

          {/* Social media buttons */}
          <div className="grid grid-cols-4 gap-2">
            {shareLinks.map((link) => (
              <Button
                key={link.name}
                variant="default"
                className={`${link.color} text-white p-2 h-auto shadow-sm transition-transform hover:scale-105`}
                onClick={link.action}
                aria-label={`Share on ${link.name}`}
              >
                {link.icon}
              </Button>
            ))}
          </div>
        </>
      )}

      {activeTab === "copy" && (
        <div className="space-y-3">
          <Button
            variant="outline"
            className="w-full border-gray-200 hover:bg-voyabear-light hover:text-voyabear-primary hover:border-voyabear-primary transition-all shadow-sm text-sm py-2 h-auto"
            onClick={handleCopyLink}
          >
            {copied ? (
              <>
                <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-2" />
                <span>Copy Link Only</span>
              </>
            )}
          </Button>

          <Button
            variant="outline"
            className="w-full border-gray-200 hover:bg-voyabear-light hover:text-voyabear-primary hover:border-voyabear-primary transition-all shadow-sm text-sm py-2 h-auto"
            onClick={handleCopyText}
          >
            {copied ? (
              <>
                <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-2" />
                <span>Copy Text & Link</span>
              </>
            )}
          </Button>
        </div>
      )}

      <p className="text-xs text-center text-gray-500 mt-2">
        Share your results and challenge your friends to take the quiz!
      </p>
    </div>
  )
}
