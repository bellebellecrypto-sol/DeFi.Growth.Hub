/**
 * Configuration for the analytics service
 */
export interface AnalyticsConfig {
  // Required configuration
  clientId: string
  endpoint?: string

  // Optional configuration
  appVersion?: string
  debugMode?: boolean
  headers?: Record<string, string>

  // Batch processing configuration
  batchProcessing?: boolean
  batchSize?: number
  batchInterval?: number

  // Advanced options
  useBeacon?: boolean
  samplingRate?: number
  excludeEvents?: string[]
  includeEvents?: string[]

  // Consent management
  requireConsent?: boolean
  defaultConsent?: boolean

  // Custom event processors
  eventProcessors?: Array<(event: AnalyticsEvent) => AnalyticsEvent>
}

/**
 * Analytics event structure
 */
export interface AnalyticsEvent {
  eventId: string
  sessionId: string
  userId?: string
  eventName: string
  category: string
  properties?: EventProperties
  timestamp: number
}

/**
 * Properties that can be attached to events
 */
export interface EventProperties {
  [key: string]: any
}

/**
 * Analytics metrics for reporting
 */
export interface AnalyticsMetrics {
  totalEvents: number
  uniqueUsers: number
  sessionCount: number
  averageSessionDuration: number
  eventBreakdown: Record<string, number>
  conversionRate: number
  topRewards: Array<{
    rewardId: string
    views: number
    claims: number
    conversionRate: number
  }>
}

/**
 * Event categories for the rewards drawer
 */
export enum EventCategory {
  DRAWER = "drawer",
  LEADERBOARD = "leaderboard",
  REWARDS = "rewards",
  USER = "user",
  SYSTEM = "system",
}

/**
 * Standard event names for the rewards drawer
 */
export enum EventName {
  // Drawer events
  DRAWER_OPEN = "drawer_open",
  DRAWER_CLOSE = "drawer_close",
  TAB_CHANGE = "tab_change",

  // Leaderboard events
  LEADERBOARD_VIEW = "leaderboard_view",
  LEADERBOARD_SCROLL = "leaderboard_scroll",
  LEADERBOARD_FILTER = "leaderboard_filter",

  // Reward events
  REWARD_VIEW = "reward_view",
  REWARD_CLAIM_START = "reward_claim_start",
  REWARD_CLAIM_SUCCESS = "reward_claim_success",
  REWARD_CLAIM_FAIL = "reward_claim_fail",
  REWARD_SECTION_EXPAND = "reward_section_expand",
  REWARD_SECTION_COLLAPSE = "reward_section_collapse",

  // User events
  USER_IDENTIFIED = "user_identified",
  USER_PROFILE_VIEW = "user_profile_view",

  // System events
  SESSION_START = "session_start",
  SESSION_END = "session_end",
  ERROR = "error",
}
