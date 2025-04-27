"use client"

import type React from "react"

import { useState, useTransition } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Users, Send, Copy, CheckCircle, Share2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useLanguage } from "@/contexts/language-context"
import { analytics } from "@/lib/analytics"
import type { TravelProfile } from "./quiz-container"
import { sendChallengeEmails } from "@/app/actions/send-challenge-email"

interface ChallengeModalProps {
  profile: TravelProfile
  isOpen: boolean
  onClose: () => void
}

export default function ChallengeModal({ profile, isOpen, onClose }: ChallengeModalProps) {
  const { language } = useLanguage()
  const [copied, setCopied] = useState(false)
  const [friendEmails, setFriendEmails] = useState<string[]>(["", "", ""])
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [isPending, startTransition] = useTransition()

  const travelerEmoji = getTravelerEmoji(profile.travelerType)

  // Get emoji based on traveler type
  function getTravelerEmoji(type: string): string {
    const typeEmojis: Record<string, string> = {
      "Adventurous Explorer": "🧗‍♀️",
      "Cultural Nomad": "🏛️",
      "Luxury Traveler": "💎",
      "Digital Explorer": "💻",
      "Urban Adventurer": "🏙️",
      "Beach Bum": "🏝️",
      Backpacker: "🎒",
      "Foodie Traveler": "🍜",
      "Aesthetic Adventurer": "📸",
      "Social Explorer": "🤝",
      "Luxury Nomad": "🧳",
    }
    return typeEmojis[type] || "✈️"
  }

  // Get opposite traveler type for fun challenges
  function getOppositeType(type: string): string {
    const opposites: Record<string, string> = {
      "Adventurous Explorer": "Luxury Traveler",
      "Cultural Nomad": "Beach Bum",
      "Luxury Traveler": "Backpacker",
      "Digital Explorer": "Adventurous Explorer",
      "Urban Adventurer": "Beach Bum",
      "Beach Bum": "Urban Adventurer",
      Backpacker: "Luxury Traveler",
      "Foodie Traveler": "Digital Explorer",
      "Aesthetic Adventurer": "Cultural Nomad",
      "Social Explorer": "Digital Explorer",
      "Luxury Nomad": "Backpacker",
    }
    return opposites[type] || "Beach Bum"
  }

  const oppositeType = getOppositeType(profile.travelerType)
  const oppositeEmoji = getTravelerEmoji(oppositeType)

  const challengeText =
    language === "zh"
      ? `我是${travelerEmoji} ${profile.travelerType}！來測測你是什麼類型的旅行者，我猜你可能是${oppositeEmoji} ${oppositeType}？`
      : `I'm a ${travelerEmoji} ${profile.travelerType}! Take this 1-min quiz to see what type of traveler you are. I bet you're a ${oppositeEmoji} ${oppositeType}!`

  const challengeUrl = "https://play.voyagerai.io"

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`${challengeText} ${challengeUrl}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)

    // Track copy event
    analytics.track("challenge_copied", {
      travelerType: profile.travelerType,
    })
  }

  const updateFriendEmail = (index: number, value: string) => {
    const newEmails = [...friendEmails]
    newEmails[index] = value
    setFriendEmails(newEmails)
  }

  const handleSendChallenge = (e: React.FormEvent) => {
    e.preventDefault()

    // Filter out empty emails
    const validEmails = friendEmails.filter((email) => email.trim() !== "" && email.includes("@"))

    if (validEmails.length === 0) return

    setSending(true)

    // Create form data to send to the server action
    const formData = new FormData()
    formData.append("senderName", "Your friend") // You could collect the sender's name if you want
    formData.append("senderEmail", "challenge@voyagerai.io") // You could collect the sender's email
    formData.append("travelerType", profile.travelerType)

    // Add all valid recipient emails
    validEmails.forEach((email) => {
      formData.append("recipientEmail", email)
    })

    startTransition(async () => {
      const result = await sendChallengeEmails(formData)
      setSending(false)

      if (result.success) {
        setSent(true)

        // Track challenge sent
        analytics.track("challenge_sent", {
          travelerType: profile.travelerType,
          recipientCount: validEmails.length,
        })

        setTimeout(() => {
          setSent(false)
          setFriendEmails(["", "", ""])
        }, 3000)
      } else {
        // Handle error
        alert(result.message || "Failed to send challenge. Please try again.")
      }
    })
  }

  // Handle native share if available
  const handleNativeShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: language === "zh" ? "旅行風格挑戰" : "Travel Style Challenge",
          text: challengeText,
          url: challengeUrl,
        })
        .then(() => {
          analytics.track("challenge_shared", {
            travelerType: profile.travelerType,
            method: "native_share",
          })
        })
        .catch(console.error)
    } else {
      copyToClipboard()
    }
  }

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
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-xl font-bold flex items-center">
                <Users className="h-5 w-5 mr-2 text-violet-500" />
                {language === "zh" ? "挑戰你的朋友" : "Challenge Your Friends"}
              </h3>
              <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="p-6">
              {/* Challenge message preview */}
              <div className="bg-violet-50 p-4 rounded-xl mb-6">
                <h4 className="font-medium text-violet-800 mb-2">
                  {language === "zh" ? "你的挑戰訊息" : "Your Challenge Message"}
                </h4>
                <p className="text-gray-700">{challengeText}</p>
              </div>

              {/* Email challenge section */}
              <div className="mb-6">
                <form onSubmit={handleSendChallenge} className="space-y-3">
                  <h4 className="font-medium text-gray-800 mb-3">
                    {language === "zh" ? "通過電子郵件發送挑戰" : "Send Challenge via Email"}
                  </h4>
                  <div className="space-y-3">
                    {friendEmails.map((email, index) => (
                      <Input
                        key={index}
                        type="email"
                        value={email}
                        onChange={(e) => updateFriendEmail(index, e.target.value)}
                        placeholder={`${language === "zh" ? "朋友" : "Friend"} ${index + 1} ${language === "zh" ? "的電子郵件" : "email"}`}
                        className="w-full"
                        disabled={sending || sent || isPending}
                      />
                    ))}
                  </div>
                  <Button
                    type="submit"
                    className="w-full mt-3 bg-violet-600 hover:bg-violet-700"
                    disabled={
                      friendEmails.filter((e) => e.trim() !== "" && e.includes("@")).length === 0 ||
                      sending ||
                      sent ||
                      isPending
                    }
                  >
                    {sending || isPending ? (
                      <span className="flex items-center">
                        <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                        {language === "zh" ? "發送中..." : "Sending..."}
                      </span>
                    ) : sent ? (
                      <span className="flex items-center">
                        <CheckCircle className="mr-2 h-4 w-4" />
                        {language === "zh" ? "已發送!" : "Sent!"}
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <Send className="mr-2 h-4 w-4" />
                        {language === "zh" ? "發送挑戰" : "Send Challenge"}
                      </span>
                    )}
                  </Button>
                </form>
              </div>

              {/* Other sharing options */}
              <div>
                <h4 className="font-medium text-gray-800 mb-3">
                  {language === "zh" ? "其他分享選項" : "Other Sharing Options"}
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="flex items-center justify-center" onClick={copyToClipboard}>
                    {copied ? (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                        {language === "zh" ? "已複製!" : "Copied!"}
                      </>
                    ) : (
                      <>
                        <Copy className="mr-2 h-4 w-4" />
                        {language === "zh" ? "複製挑戰" : "Copy Challenge"}
                      </>
                    )}
                  </Button>
                  <Button variant="outline" className="flex items-center justify-center" onClick={handleNativeShare}>
                    <Share2 className="mr-2 h-4 w-4" />
                    {language === "zh" ? "分享挑戰" : "Share Challenge"}
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
