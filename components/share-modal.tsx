"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Download, Twitter, Instagram, Link, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import ShareCard from "./share-card"
import InstagramStoryTemplate from "./instagram-story-template"
import type { TravelProfile } from "./quiz-container"
import html2canvas from "html2canvas"
import { analytics } from "@/lib/analytics"
import { useLanguage } from "@/contexts/language-context"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import TravelerComparison from "./traveler-comparison"

interface ShareModalProps {
  profile: TravelProfile
  isOpen: boolean
  onClose: () => void
}

export default function ShareModal({ profile, isOpen, onClose }: ShareModalProps) {
  const { t, language } = useLanguage()
  const [shareImageUrl, setShareImageUrl] = useState<string | null>(null)
  const [instagramStoryUrl, setInstagramStoryUrl] = useState<string | null>(null)
  const [comparisonImageUrl, setComparisonImageUrl] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const storyRef = useRef<HTMLDivElement>(null)
  const comparisonRef = useRef<HTMLDivElement>(null)
  const [shareUrl, setShareUrl] = useState<string>("")
  const [activeTab, setActiveTab] = useState<string>("feed")

  useEffect(() => {
    // Only run this effect in the browser
    if (typeof window !== "undefined") {
      // Get the current URL with any result parameter
      const url = new URL(window.location.href)
      const resultParam = url.searchParams.get("result")

      if (resultParam) {
        setShareUrl(url.toString())
      } else {
        // If no result parameter, the URL might not be properly set up yet
        setShareUrl("https://play.voyagerai.io")
      }
    }
  }, [])

  const generateImage = async (ref: React.RefObject<HTMLDivElement>) => {
    if (!ref.current) return null

    try {
      const canvas = await html2canvas(ref.current, {
        scale: 2,
        logging: false,
        useCORS: true,
        backgroundColor: null,
        allowTaint: true,
      })

      const imageUrl = canvas.toDataURL("image/png")
      return imageUrl
    } catch (error) {
      console.error("Error generating image:", error)
      return null
    }
  }

  const handleDownload = async () => {
    setDownloading(true)

    let imageUrl
    if (activeTab === "feed") {
      imageUrl = shareImageUrl || (await generateImage(cardRef))
      if (imageUrl) setShareImageUrl(imageUrl)
    } else if (activeTab === "story") {
      imageUrl = instagramStoryUrl || (await generateImage(storyRef))
      if (imageUrl) setInstagramStoryUrl(imageUrl)
    } else if (activeTab === "compare") {
      imageUrl = comparisonImageUrl || (await generateImage(comparisonRef))
      if (imageUrl) setComparisonImageUrl(imageUrl)
    }

    if (imageUrl) {
      const link = document.createElement("a")
      link.href = imageUrl
      link.download = `${profile.travelerType.replace(/\s+/g, "-").toLowerCase()}-voyager-quiz-${activeTab}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // Track download event
      analytics.track("image_downloaded", {
        travelerType: profile.travelerType,
        imageType: activeTab,
      })
    }

    setDownloading(false)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)

    // Track copy event
    analytics.track("result_shared", {
      method: "copy_link",
      travelerType: profile.travelerType,
    })
  }

  const handleSocialShare = (platform: string) => {
    let shareUrl = ""
    const text =
      language === "zh"
        ? `我是${profile.travelerType}！用Voyager AI測試發現你的旅行個性：`
        : `I'm a ${profile.travelerType}! Discover your travel personality with Voyager AI Quiz:`
    const url = shareUrl || "https://play.voyagerai.io"

    // Track share event
    analytics.track("result_shared", {
      method: platform,
      travelerType: profile.travelerType,
    })

    switch (platform) {
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
        break
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`
        break
      case "tiktok":
        // TikTok doesn't have a direct sharing URL, so we'll just download the image
        // and show instructions for TikTok
        handleDownload()
        alert(
          language === "zh"
            ? "下載圖片後，打開TikTok應用程序，點擊+按鈕創建新視頻，然後從相冊中選擇此圖片。"
            : "After downloading the image, open the TikTok app, tap the + button to create a new video, and select this image from your gallery.",
        )
        return
      case "instagram":
        // Instagram doesn't support direct sharing via URL, so we'll just prompt to download
        handleDownload()
        return
    }

    if (shareUrl) {
      window.open(shareUrl, "_blank", "noopener,noreferrer")
    }
  }

  // Generate images when modal opens or tab changes
  useEffect(() => {
    if (isOpen) {
      if (activeTab === "feed" && cardRef.current && !shareImageUrl) {
        generateImage(cardRef).then((url) => {
          if (url) setShareImageUrl(url)
        })
      } else if (activeTab === "story" && storyRef.current && !instagramStoryUrl) {
        generateImage(storyRef).then((url) => {
          if (url) setInstagramStoryUrl(url)
        })
      } else if (activeTab === "compare" && comparisonRef.current && !comparisonImageUrl) {
        generateImage(comparisonRef).then((url) => {
          if (url) setComparisonImageUrl(url)
        })
      }
    }
  }, [isOpen, activeTab, shareImageUrl, instagramStoryUrl, comparisonImageUrl])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-2xl w-full max-w-lg overflow-hidden"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-3 sm:p-4 border-b flex justify-between items-center">
              <h3 className="text-lg sm:text-xl font-bold">{t.shareModal.title}</h3>
              <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="p-4 sm:p-6 flex flex-col items-center">
              <Tabs defaultValue="feed" className="w-full" onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="feed" className="text-xs sm:text-sm">
                    {language === "zh" ? "社交媒體貼文" : "Social Post"}
                  </TabsTrigger>
                  <TabsTrigger value="story" className="text-xs sm:text-sm">
                    {language === "zh" ? "Instagram 故事" : "Instagram Story"}
                  </TabsTrigger>
                  <TabsTrigger value="compare" className="text-xs sm:text-sm">
                    {language === "zh" ? "比較圖表" : "Comparison"}
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="feed" className="flex justify-center">
                  <div ref={cardRef} className="mb-6 w-full max-w-[280px] mx-auto">
                    <ShareCard profile={profile} />
                  </div>
                </TabsContent>

                <TabsContent value="story" className="flex justify-center">
                  <div ref={storyRef} className="mb-6 w-full max-w-[200px] mx-auto">
                    <InstagramStoryTemplate profile={profile} />
                  </div>
                </TabsContent>

                <TabsContent value="compare" className="flex justify-center">
                  <div ref={comparisonRef} className="mb-6 w-full max-w-[600px] mx-auto">
                    <TravelerComparison profile={profile} />
                  </div>
                </TabsContent>
              </Tabs>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 w-full mb-4 sm:mb-6">
                <Button
                  variant="outline"
                  className="flex flex-col items-center justify-center h-14 sm:h-16 rounded-xl text-xs sm:text-sm"
                  onClick={handleDownload}
                  disabled={downloading}
                >
                  <Download className="h-4 w-4 sm:h-5 sm:w-5 mb-1" />
                  <span>{t.shareModal.saveButton}</span>
                </Button>
                <Button
                  variant="outline"
                  className="flex flex-col items-center justify-center h-14 sm:h-16 rounded-xl text-xs sm:text-sm"
                  onClick={() => handleSocialShare("twitter")}
                >
                  <Twitter className="h-4 w-4 sm:h-5 sm:w-5 mb-1" />
                  <span className="text-xs">{t.shareModal.twitterButton}</span>
                </Button>
                <Button
                  variant="outline"
                  className="flex flex-col items-center justify-center h-14 sm:h-16 rounded-xl text-xs sm:text-sm"
                  onClick={() => handleSocialShare("instagram")}
                >
                  <Instagram className="h-4 w-4 sm:h-5 sm:w-5 mb-1" />
                  <span className="text-xs">
                    {activeTab === "story"
                      ? language === "zh"
                        ? "IG 故事"
                        : "IG Story"
                      : language === "zh"
                        ? "Instagram"
                        : "Instagram"}
                  </span>
                </Button>
                <Button
                  variant="outline"
                  className="flex flex-col items-center justify-center h-14 sm:h-16 rounded-xl text-xs sm:text-sm"
                  onClick={() => handleSocialShare("tiktok")}
                >
                  <svg className="h-4 w-4 sm:h-5 sm:w-5 mb-1" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                  </svg>
                  <span className="text-xs">TikTok</span>
                </Button>
              </div>

              <div className="w-full">
                <div className="text-xs sm:text-sm font-medium mb-2">{t.shareModal.copyLinkLabel}</div>
                <div className="flex items-center">
                  <div className="flex-1 bg-gray-100 rounded-l-lg py-2 px-3 text-gray-600 text-xs sm:text-sm truncate">
                    {shareUrl
                      ? new URL(shareUrl).hostname +
                        new URL(shareUrl).pathname +
                        (new URL(shareUrl).search ? "?result=..." : "")
                      : "play.voyagerai.io"}
                  </div>
                  <Button className="rounded-l-none rounded-r-lg h-9 text-xs sm:text-sm" onClick={copyToClipboard}>
                    {copied ? (
                      <Check className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    ) : (
                      <Link className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    )}
                    {copied ? t.results.copied : t.shareModal.copyButton}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
