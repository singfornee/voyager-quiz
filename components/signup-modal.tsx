"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, CheckCircle2, Lock, AlertCircle } from "lucide-react"
import { subscribeToMailchimp } from "@/lib/mailchimp"
import { analyticsClient, getSessionId } from "@/lib/analytics-client"
import { trackConversion } from "@/lib/ga-utils"
import Image from "next/image"

interface SignupModalProps {
  onClose: () => void
  profileType?: string
  language: "en" | "zh-TW"
}

// Translation content
const translations = {
  en: {
    title: "While we're generating your profile...",
    description: "We're launching a smart travel assistant we think you'll love. Want to join as a beta user?",
    nameLabel: "Your name",
    emailLabel: "Email address",
    joinButton: "Join Beta",
    skipButton: "Skip",
    loading: "Just a sec...",
    privacyNote: "We'll send you cool travel stuff, no spam.",
    successTitle: "You're in!",
    successMessage: "We'll let you know when we launch!",
    continueButton: "Continue to my results",
    errorGeneric: "Something went wrong. Please try again.",
    errorEmail: "Please enter a valid email address.",
    errorRequired: "This field is required.",
    betaTag: "BETA",
  },
  "zh-TW": {
    title: "在我們生成您的個人資料時...",
    description: "我們即將推出一款您會喜歡的智能旅行助手。想成為測試用戶嗎？",
    nameLabel: "您的姓名",
    emailLabel: "電子郵箱",
    joinButton: "加入測試",
    skipButton: "跳過",
    loading: "請稍等...",
    privacyNote: "我們會發送有趣的旅行內容，絕不發送垃圾郵件。",
    successTitle: "您已加入!",
    successMessage: "我們會在產品上線時通知您!",
    continueButton: "繼續查看我的結果",
    errorGeneric: "出現錯誤，請重試。",
    errorEmail: "請輸入有效的電子郵箱地址。",
    errorRequired: "此字段為必填項。",
    betaTag: "測試版",
  },
}

export default function SignupModal({ onClose, profileType = "", language = "en" }: SignupModalProps) {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")
  const [emailError, setEmailError] = useState("")
  const [nameError, setNameError] = useState("")

  const t = translations[language]

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const isValid = emailRegex.test(email)
    setEmailError(isValid ? "" : t.errorEmail)
    return isValid
  }

  const validateName = (name: string): boolean => {
    const isValid = name.trim().length > 0
    setNameError(isValid ? "" : t.errorRequired)
    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate inputs
    const isEmailValid = validateEmail(email)
    const isNameValid = validateName(name)

    if (!isEmailValid || !isNameValid) {
      return
    }

    setIsSubmitting(true)
    setError("")

    try {
      await subscribeToMailchimp(email, name, profileType)
      setIsSuccess(true)

      // Track email submission
      analyticsClient.trackEvent("email_submitted", {
        sessionId: getSessionId(),
        source: "loading_modal",
        language,
      })

      // Track conversion
      trackConversion("email_signup", {
        profile_type: profileType,
        source: "loading_modal",
        language,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : t.errorGeneric)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-auto animate-in fade-in zoom-in duration-300 relative">
        {/* VoyaBear branding at top */}
        <div className="absolute top-0 left-0 right-0 bg-gradient-voyabear py-2 px-4 rounded-t-xl flex items-center justify-between">
          <div className="flex items-center">
            <Image src="/voyabear-mascot.png" alt="VoyaBear" width={24} height={24} className="mr-2" />
            <span className="text-white font-bold text-lg">VoyaBear</span>
            <span className="ml-2 bg-white/20 text-white text-xs px-1.5 py-0.5 rounded-md">{t.betaTag}</span>
          </div>
        </div>

        <div className="p-5 sm:p-6 mt-10">
          {isSuccess ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-gradient-voyabear mx-auto flex items-center justify-center mb-4 shadow-md">
                <CheckCircle2 className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-voyabear-primary mb-2">{t.successTitle}</h3>
              <p className="text-gray-600 mb-4">{t.successMessage}</p>
              <Button
                onClick={onClose}
                className="bg-gradient-voyabear hover:opacity-90 text-white shadow-md transition-all active:scale-95"
              >
                {t.continueButton}
              </Button>
            </div>
          ) : (
            <>
              <div className="flex items-center mb-5">
                <div className="relative mr-4">
                  <div className="absolute -inset-1 bg-gradient-voyabear rounded-full opacity-30 blur-sm"></div>
                  <div className="relative w-14 h-14 flex items-center justify-center">
                    <Image src="/voyabear-mascot.png" alt="VoyaBear" width={56} height={56} className="animate-float" />
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-bold gradient-text">{t.title}</h2>
                </div>
              </div>

              <p className="text-gray-700 mb-5 border-l-4 border-voyabear-primary pl-3 py-1">{t.description}</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder={t.nameLabel}
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value)
                        if (nameError) validateName(e.target.value)
                      }}
                      required
                      className={`border-gray-200 focus:border-voyabear-primary focus:ring-voyabear-primary shadow-sm ${
                        nameError ? "border-red-500" : ""
                      }`}
                      aria-invalid={!!nameError}
                      aria-describedby={nameError ? "name-error" : undefined}
                    />
                    {nameError && (
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <AlertCircle className="h-4 w-4 text-red-500" />
                      </div>
                    )}
                  </div>
                  {nameError && (
                    <p id="name-error" className="mt-1 text-xs text-red-500">
                      {nameError}
                    </p>
                  )}
                </div>

                <div>
                  <div className="relative">
                    <Input
                      type="email"
                      placeholder={t.emailLabel}
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value)
                        if (emailError) validateEmail(e.target.value)
                      }}
                      required
                      className={`border-gray-200 focus:border-voyabear-primary focus:ring-voyabear-primary shadow-sm ${
                        emailError ? "border-red-500" : ""
                      }`}
                      aria-invalid={!!emailError}
                      aria-describedby={emailError ? "email-error" : undefined}
                    />
                    {emailError && (
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <AlertCircle className="h-4 w-4 text-red-500" />
                      </div>
                    )}
                  </div>
                  {emailError && (
                    <p id="email-error" className="mt-1 text-xs text-red-500">
                      {emailError}
                    </p>
                  )}
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-3 text-sm text-red-600 flex items-start">
                    <AlertCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-voyabear hover:opacity-90 text-white shadow-md transition-all active:scale-95"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        {t.loading}
                      </>
                    ) : (
                      t.joinButton
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    className="border-gray-200 hover:bg-voyabear-light/50 transition-colors active:scale-95"
                  >
                    {t.skipButton}
                  </Button>
                </div>

                <div className="text-center flex items-center justify-center pt-2">
                  <Lock className="h-3 w-3 text-gray-400 mr-1" />
                  <p className="text-xs text-gray-500">{t.privacyNote}</p>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
