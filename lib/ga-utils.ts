// Google Analytics utility functions

// Track a custom event
export const trackEvent = (action: string, category?: string, label?: string, value?: number) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}

// Track a page view
export const trackPageView = (url: string) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("config", "G-W5WGTTP0LG", {
      page_path: url,
    })
  }
}

// Track quiz interaction
export const trackQuizInteraction = (step: number, action: string, params?: Record<string, any>) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", `quiz_step_${step}_${action}`, params)
  }
}

// Track conversion events
export const trackConversion = (action: string, params?: Record<string, any>) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", action, params)
  }
}
