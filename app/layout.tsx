import type React from "react"
import "./globals.css"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import ServiceWorkerRegister from "@/components/service-worker-register"
import GoogleAnalytics from "@/components/google-analytics"
import { Suspense } from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "VoyaBear Travel Personality Quiz",
  description: "Discover your unique travel personality with VoyaBear's fun quiz!",
  applicationName: "VoyaBear",
  authors: [{ name: "VoyaBear Team" }],
  keywords: ["travel", "personality", "quiz", "travel style", "travel profile"],
    generator: 'v0.dev'
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#7C3AED",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <Suspense>{children}</Suspense>
        </ThemeProvider>
        <ServiceWorkerRegister />
        <GoogleAnalytics />
      </body>
    </html>
  )
}
