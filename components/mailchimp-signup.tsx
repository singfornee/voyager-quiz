"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, CheckCircle2, ExternalLink } from "lucide-react"
import { subscribeToMailchimp } from "@/lib/mailchimp"
import { analyticsClient, getSessionId } from "@/lib/analytics-client"
import Link from "next/link"
import { trackConversion } from "@/lib/ga-utils"

export default function MailchimpSignup({ profileType }: { profileType: string }) {
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
        source: "results_page",
      })

      // Track conversion
      trackConversion("email_signup", {
        profile_type: profileType,
        source: "results_page",
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Oops! Try again?")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center p-3 sm:p-4 text-center">
        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-r from-teal-400 to-blue-400 flex items-center justify-center mb-3 sm:mb-4 shadow-md">
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
    <div className="space-y-4">
      <div className="flex items-center mb-2">
        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-blue-400 flex items-center justify-center mr-3">
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
            className="h-6 w-6 text-white"
          >
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
            <path d="M19 17.7c.4.2.8.3 1.2.3" />
            <path d="M5 8.3a9 9 0 0 1 14.5-3.2" />
          </svg>
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-voyabear-primary">Get On The List</h3>
      </div>

      <p className="text-gray-700 mb-4">We'll send you cool travel stuff. No spam, promise!</p>

      <div className="text-center mb-4">
        <h3 className="text-2xl font-bold text-voyabear-primary mb-1">We're launching soon!</h3>
        <p className="text-gray-600">Be the first to know when we go live.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="border-gray-200 focus:border-voyabear-primary focus:ring-voyabear-primary shadow-sm text-base h-12 rounded-lg"
          />
        </div>
        <div>
          <Input
            type="email"
            placeholder="Email (we won't spam you)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border-gray-200 focus:border-voyabear-primary focus:ring-voyabear-primary shadow-sm text-base h-12 rounded-lg"
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-teal-400 to-blue-400 hover:opacity-90 text-white shadow-md text-base py-3 h-auto rounded-lg"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Just a sec...
            </>
          ) : (
            "Get Early Access"
          )}
        </Button>
      </form>

      <div className="text-center mt-4">
        <Link
          href="https://voyagerai.io"
          target="_blank"
          rel="noopener noreferrer"
          className="text-voyabear-primary hover:text-voyabear-dark text-base flex items-center justify-center transition-colors"
        >
          Learn more at voyagerai.io
          <ExternalLink className="h-4 w-4 ml-1" />
        </Link>
      </div>
    </div>
  )
}
