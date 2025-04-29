// Type definitions for Google Analytics gtag
declare interface Window {
  gtag?: (
    command: "config" | "event" | "set" | "consent" | "js",
    targetId: string,
    config?: Record<string, any> | Date,
  ) => void
  dataLayer?: any[]
}
