"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Download, Lock, CheckCircle2, Loader2 } from "lucide-react"
import { subscribeToMailchimp } from "@/lib/mailchimp"
import { analyticsClient, getSessionId } from "@/lib/analytics-client"
import { trackConversion } from "@/lib/ga-utils"

interface EmailIncentiveProps {
  profileType: string
  profileId: string
}

export default function EmailIncentive({ profileType, profileId }: EmailIncentiveProps) {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      await subscribeToMailchimp(email, name, profileType)
      setIsSuccess(true)

      // Track email submission
      analyticsClient.trackEvent("email_submitted", {
        sessionId: getSessionId(),
        profileId,
      })

      // Track conversion
      trackConversion("email_signup", {
        profile_type: profileType,
        incentive: "travel_checklist",
      })

      // Simulate download
      setTimeout(() => {
        // In a real implementation, you would generate and provide a real PDF
        const link = document.createElement("a")
        link.href = `/api/download-checklist?profileType=${encodeURIComponent(profileType)}`
        link.download = `${profileType.replace(/\s+/g, "-").toLowerCase()}-travel-checklist.pdf`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }, 1000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Oops! Try again?")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="p-4 sm:p-6 bg-gradient-to-r from-voyabear-primary/5 to-voyabear-secondary/5 border-0 shadow-md">
      <div className="text-center mb-4">
        <h3 className="text-lg sm:text-xl font-bold text-voyabear-primary mb-2">
          {isSuccess ? "Your download is ready!" : "Get Your Free Travel Checklist"}
        </h3>

        {!isSuccess && (
          <p className="text-gray-700 text-sm">A personalized packing list for {profileType.toLowerCase()} travelers</p>
        )}
      </div>

      {isSuccess ? (
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-3">
            <CheckCircle2 className="h-6 w-6 text-green-600" />
          </div>
          <p className="text-gray-700 mb-4">Thanks! Your download should start automatically.</p>
          <Button
            className="bg-voyabear-primary hover:bg-voyabear-dark text-white"
            onClick={() => {
              const link = document.createElement("a")
              link.href = `/api/download-checklist?profileType=${encodeURIComponent(profileType)}`
              link.download = `${profileType.replace(/\s+/g, "-").toLowerCase()}-travel-checklist.pdf`
              document.body.appendChild(link)
              link.click()
              document.body.removeChild(link)
            }}
          >
            <Download className="h-4 w-4 mr-2" />
            Download Again
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <Input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="border-gray-200 focus:border-voyabear-primary focus:ring-voyabear-primary shadow-sm"
            />
          </div>
          <div>
            <Input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border-gray-200 focus:border-voyabear-primary focus:ring-voyabear-primary shadow-sm"
            />
          </div>

          {error && <p className="text-red-500 text-xs">{error}</p>}

          <Button
            type="submit"
            className="w-full bg-voyabear-primary hover:bg-voyabear-dark text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Processing...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Download Now
              </>
            )}
          </Button>

          <div className="text-center flex items-center justify-center">
            <Lock className="h-3 w-3 text-gray-400 mr-1" />
            <p className="text-xs text-gray-500">We respect your privacy. No spam, ever.</p>
          </div>
        </form>
      )}
    </Card>
  )
}
