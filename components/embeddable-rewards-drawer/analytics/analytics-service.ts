import type { AnalyticsEvent, AnalyticsConfig, EventProperties } from "./types"

/**
 * Analytics service for tracking user interactions with the rewards drawer
 */
export class AnalyticsService {
  private config: AnalyticsConfig
  private sessionId: string
  private sessionStartTime: number
  private events: AnalyticsEvent[] = []
  private userId?: string
  private userProperties?: Record<string, any>
  private isEnabled = true
  private batchQueue: AnalyticsEvent[] = []
  private flushInterval?: NodeJS.Timeout
  private lastInteractionTime: number

  constructor(config: AnalyticsConfig) {
    this.config = config
    this.sessionId = this.generateSessionId()
    this.sessionStartTime = Date.now()
    this.lastInteractionTime = this.sessionStartTime

    // Initialize flush interval if batch processing is enabled
    if (config.batchProcessing && config.batchInterval) {
      this.flushInterval = setInterval(() => this.flush(), config.batchInterval)
    }

    // Register session start event
    this.trackEvent("session_start", {
      referrer: document.referrer,
      userAgent: navigator.userAgent,
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
    })

    // Add unload handler to track session end
    if (typeof window !== "undefined") {
      window.addEventListener("beforeunload", () => {
        this.trackEvent("session_end", {
          duration: Date.now() - this.sessionStartTime,
        })
        this.flush(true)
      })
    }
  }

  /**
   * Set user identity for analytics tracking
   */
  public setUser(userId: string, properties?: Record<string, any>): void {
    this.userId = userId
    this.userProperties = properties

    this.trackEvent("user_identified", {
      ...properties,
    })
  }

  /**
   * Track an event with optional properties
   */
  public trackEvent(eventName: string, properties?: EventProperties, category = "rewards_drawer"): void {
    if (!this.isEnabled) return

    const timestamp = Date.now()
    const timeOnPage = timestamp - this.lastInteractionTime
    this.lastInteractionTime = timestamp

    const event: AnalyticsEvent = {
      eventId: this.generateEventId(),
      sessionId: this.sessionId,
      userId: this.userId,
      eventName,
      category,
      properties: {
        ...properties,
        timeOnPage,
      },
      timestamp,
    }

    this.events.push(event)

    // If batch processing is disabled, send immediately
    if (!this.config.batchProcessing) {
      this.sendEvent(event)
    } else {
      this.batchQueue.push(event)

      // If queue exceeds batch size, flush
      if (this.batchQueue.length >= (this.config.batchSize || 10)) {
        this.flush()
      }
    }

    // Log to console if debug mode is enabled
    if (this.config.debugMode) {
      console.log(`[Analytics] ${eventName}`, properties)
    }
  }

  /**
   * Enable or disable analytics tracking
   */
  public setEnabled(enabled: boolean): void {
    this.isEnabled = enabled

    if (enabled) {
      this.trackEvent("analytics_enabled")
    } else {
      this.trackEvent("analytics_disabled")
      this.flush(true) // Flush any remaining events
    }
  }

  /**
   * Get all tracked events
   */
  public getEvents(): AnalyticsEvent[] {
    return [...this.events]
  }

  /**
   * Clear all tracked events
   */
  public clearEvents(): void {
    this.events = []
  }

  /**
   * Flush batched events to the server
   */
  public flush(immediate = false): void {
    if (this.batchQueue.length === 0) return

    const eventsToSend = [...this.batchQueue]
    this.batchQueue = []

    this.sendEvents(eventsToSend, immediate)
  }

  /**
   * Clean up resources
   */
  public dispose(): void {
    if (this.flushInterval) {
      clearInterval(this.flushInterval)
    }

    // Send final flush
    this.trackEvent("analytics_disposed")
    this.flush(true)
  }

  /**
   * Send a single event to the server
   */
  private sendEvent(event: AnalyticsEvent): void {
    if (!this.config.endpoint) return

    const payload = {
      ...event,
      clientId: this.config.clientId,
      appVersion: this.config.appVersion,
    }

    // Use sendBeacon for better reliability when page is unloading
    if (navigator.sendBeacon && this.config.useBeacon) {
      navigator.sendBeacon(this.config.endpoint, JSON.stringify(payload))
    } else {
      fetch(this.config.endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...this.config.headers,
        },
        body: JSON.stringify(payload),
        // Use keepalive to ensure the request completes even if the page unloads
        keepalive: true,
      }).catch((err) => {
        if (this.config.debugMode) {
          console.error("[Analytics] Failed to send event:", err)
        }
      })
    }
  }

  /**
   * Send multiple events to the server
   */
  private sendEvents(events: AnalyticsEvent[], immediate = false): void {
    if (!this.config.endpoint || events.length === 0) return

    const payload = {
      clientId: this.config.clientId,
      appVersion: this.config.appVersion,
      events,
    }

    // For immediate sends (like on page unload), use sendBeacon
    if (immediate && navigator.sendBeacon && this.config.useBeacon) {
      navigator.sendBeacon(this.config.endpoint, JSON.stringify(payload))
      return
    }

    fetch(this.config.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...this.config.headers,
      },
      body: JSON.stringify(payload),
      keepalive: immediate,
    }).catch((err) => {
      if (this.config.debugMode) {
        console.error("[Analytics] Failed to send events:", err)
      }
    })
  }

  /**
   * Generate a unique session ID
   */
  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`
  }

  /**
   * Generate a unique event ID
   */
  private generateEventId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`
  }
}

/**
 * Create a singleton analytics instance
 */
let analyticsInstance: AnalyticsService | null = null

export function createAnalytics(config: AnalyticsConfig): AnalyticsService {
  if (!analyticsInstance) {
    analyticsInstance = new AnalyticsService(config)
  }
  return analyticsInstance
}

export function getAnalytics(): AnalyticsService | null {
  return analyticsInstance
}
