"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, CheckCircle2, ExternalLink } from "lucide-react"
import { subscribeToMailchimp } from "@/lib/mailchimp"
import { analyticsClient, getSessionId } from "@/lib/analytics-client"
import Link from "next/link"

// Add import for trackEvent
import { trackEvent } from "@/lib/analytics"
import { trackConversion } from "@/lib/ga-utils"

interface MailchimpSignupProps {
  profileType: string
}

export default function MailchimpSignup({ profileType }: MailchimpSignupProps) {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")

  // Update the handleSubmit function
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
      })

      // Track in Google Analytics
      trackEvent("signup", "email_subscription", "Email submitted", undefined, false, { profile_type: profileType })

      // Track in Google Analytics
      trackConversion("email_signup", {
        profile_type: profileType,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Oops! Try again?")

      // Track error in Google Analytics
      trackEvent(
        "error",
        "email_subscription",
        `Subscription error: ${err instanceof Error ? err.message : String(err)}`,
        undefined,
        true,
      )

      // Track error in Google Analytics
      trackEvent("error", "email_signup", err instanceof Error ? err.message : "Unknown error")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center p-3 sm:p-4 text-center">
        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-voyabear-neon flex items-center justify-center mb-3 sm:mb-4 shadow-md">
          <CheckCircle2 className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
        </div>
        <h3 className="text-base sm:text-lg font-medium text-voyabear-primary mb-1">You're in!</h3>
        <p className="text-gray-700 text-sm sm:text-base mb-2">We'll let you know when we launch!</p>
        <Link
          href="https://voyagerai.io"
          target="_blank"
          rel="noopener noreferrer"
          className="text-voyabear-primary hover:text-voyabear-dark text-sm flex items-center transition-colors"
        >
          Learn more at voyagerai.io
          <ExternalLink className="h-3 w-3 ml-1" />
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="text-center mb-2">
        <h3 className="text-base sm:text-lg font-medium text-voyabear-primary mb-1">We're launching soon!</h3>
        <p className="text-gray-600 text-xs sm:text-sm">Be the first to know when we go live.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
        <div>
          <Input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="border-gray-200 focus:border-voyabear-primary focus:ring-voyabear-primary shadow-sm text-sm sm:text-base h-9 sm:h-10"
          />
        </div>
        <div>
          <Input
            type="email"
            placeholder="Email (we won't spam you)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border-gray-200 focus:border-voyabear-primary focus:ring-voyabear-primary shadow-sm text-sm sm:text-base h-9 sm:h-10"
          />
        </div>

        {error && <p className="text-red-500 text-xs sm:text-sm">{error}</p>}

        <Button
          type="submit"
          className="w-full bg-gradient-voyabear-neon hover:opacity-90 text-white shadow-md text-sm sm:text-base py-2 h-auto"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin mr-2" />
              Just a sec...
            </>
          ) : (
            "Get Early Access"
          )}
        </Button>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            <Link
              href="https://voyagerai.io"
              target="_blank"
              rel="noopener noreferrer"
              className="text-voyabear-primary hover:text-voyabear-dark inline-flex items-center transition-colors"
            >
              Learn more at voyagerai.io
              <ExternalLink className="h-3 w-3 ml-1" />
            </Link>
          </p>
        </div>
      </form>
    </div>
  )
}
