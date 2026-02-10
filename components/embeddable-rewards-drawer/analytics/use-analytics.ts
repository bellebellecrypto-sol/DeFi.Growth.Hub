"use client"

import { useEffect, useRef } from "react"
import { createAnalytics, getAnalytics } from "./analytics-service"
import type { AnalyticsConfig, EventProperties } from "./types"
import { EventName, EventCategory } from "./types"

export function useAnalytics(config?: AnalyticsConfig) {
  const initialized = useRef(false)

  useEffect(() => {
    if (!initialized.current && config) {
      createAnalytics(config)
      initialized.current = true
    }

    return () => {
      // Clean up analytics on unmount
      const analytics = getAnalytics()
      if (analytics) {
        analytics.dispose()
      }
    }
  }, [config])

  const trackEvent = (
    eventName: string | EventName,
    properties?: EventProperties,
    category: string | EventCategory = EventCategory.DRAWER,
  ) => {
    const analytics = getAnalytics()
    if (analytics) {
      analytics.trackEvent(eventName, properties, category)
    }
  }

  const setUser = (userId: string, properties?: Record<string, any>) => {
    const analytics = getAnalytics()
    if (analytics) {
      analytics.setUser(userId, properties)
    }
  }

  return {
    trackEvent,
    setUser,
    EventName,
    EventCategory,
  }
}
