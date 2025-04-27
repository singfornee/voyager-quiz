import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Poppins, Noto_Sans_TC } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { LanguageProvider } from "@/contexts/language-context"

// Add this type declaration at the top of the file, after the imports
declare global {
  interface Window {
    gtag: (...args: any[]) => void
  }
}

// Load Poppins font for English
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-poppins",
})

// Load Noto Sans TC font for Traditional Chinese
const notoSansTC = Noto_Sans_TC({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-noto-sans-tc",
})

export const metadata: Metadata = {
  title: "Voyager AI - What's Your Travel Vibe?",
  description: "Discover your unique travel personality with our AI-powered quiz",
  metadataBase: new URL("https://play.voyagerai.io"),
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Add Google Analytics */}
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}');
          `,
          }}
        />
      </head>
      <body className={`${poppins.variable} ${notoSansTC.variable} font-sans`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <LanguageProvider>{children}</LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
