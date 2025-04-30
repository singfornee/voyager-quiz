"use client"

import { useState } from "react"
import { Sparkles } from "lucide-react"
import MailchimpSignup from "@/components/mailchimp-signup"
import { Button } from "@/components/ui/button"

export default function EarlyAccessButton() {
  const [showSignup, setShowSignup] = useState(false)

  return (
    <>
      <Button
        onClick={() => setShowSignup(true)}
        className="inline-flex items-center px-4 py-2 rounded-md bg-[#f08080] text-white text-sm font-medium hover:bg-opacity-90 border-0"
      >
        <Sparkles className="h-3.5 w-3.5 mr-1.5" />
        Get Early Access
      </Button>

      {showSignup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full animate-in fade-in zoom-in duration-300">
            <div className="p-6">
              <MailchimpSignup profileType="Website Visitor" />
              <button
                onClick={() => setShowSignup(false)}
                className="mt-4 w-full py-2 text-sm text-gray-500 hover:text-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
