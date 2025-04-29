// Google Analytics utility functions

// Track a custom event
export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number,
  nonInteraction?: boolean,
  customDimensions?: Record<string, string | number | boolean>,
) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
      non_interaction: nonInteraction,
      ...customDimensions,
    })
  }
}

// Track a page view (can be called manually for custom page views)
export const trackPageView = (url: string) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("config", "G-W5WGTTP0LG", {
      page_path: url,
    })
  }
}

// Track a user action
export const trackUserAction = (action: string, metadata?: Record<string, any>) => {
  trackEvent(action, "user_action", undefined, undefined, false, metadata)
}

// Track a quiz interaction
export const trackQuizInteraction = (step: number, action: string, metadata?: Record<string, any>) => {
  trackEvent(action, "quiz_interaction", `Step ${step}`, step, false, metadata)
}

// Track a conversion
export const trackConversion = (type: string, metadata?: Record<string, any>) => {
  trackEvent("conversion", type, undefined, undefined, false, metadata)
}
