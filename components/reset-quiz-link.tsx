"use client"

import type React from "react"
import { useRouter } from "next/navigation"

interface ResetQuizLinkProps {
  children: React.ReactNode
  className?: string
}

export default function ResetQuizLink({ children, className }: ResetQuizLinkProps) {
  const router = useRouter()

  const handleReset = (e: React.MouseEvent) => {
    e.preventDefault()

    // Clear the saved quiz progress from localStorage
    localStorage.removeItem("voyabear_quiz_progress")

    // Refresh the page to reset the quiz state
    router.refresh()

    // Navigate to the home page
    window.location.href = "/"
  }

  return (
    <a href="/" onClick={handleReset} className={className}>
      {children}
    </a>
  )
}
