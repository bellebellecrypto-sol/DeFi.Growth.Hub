export interface RewardsDrawerConfig {
  // Theme and styling
  theme: {
    mode: "light" | "dark" | "custom"
    colors: {
      primary: string
      secondary: string
      background: string
      surface: string
      text: string
      textSecondary: string
      accent: string
      success: string
      warning: string
      error: string
      border: string
    }
    typography: {
      fontFamily: string
      fontSize: {
        xs: string
        sm: string
        base: string
        lg: string
        xl: string
        "2xl": string
      }
      fontWeight: {
        normal: string
        medium: string
        semibold: string
        bold: string
      }
    }
    borderRadius: string
    shadows: {
      sm: string
      md: string
      lg: string
    }
    customCSS?: string
  }

  // Images and branding
  branding: {
    logo?: {
      url: string
      alt: string
      width: number
      height: number
      position: "top-left" | "top-center" | "top-right"
    }
    backgroundImage?: {
      url: string
      size: "cover" | "contain" | "auto"
      position: string
      opacity: number
    }
    favicon?: string
  }

  // Leaderboard configuration
  leaderboard: {
    enabled: boolean
    title: string
    maxEntries: number
    sortBy: "points" | "rank" | "custom"
    sortOrder: "asc" | "desc"
    displayFields: {
      avatar: boolean
      username: boolean
      points: boolean
      rank: boolean
      badge: boolean
    }
    refreshInterval?: number
    showCurrentUser: boolean
    highlightCurrentUser: boolean
  }

  // Claims and rewards
  claims: {
    enabled: boolean
    title: string
    sections: ClaimSection[]
    displayMode: "grid" | "list"
    itemsPerPage: number
    showPagination: boolean
  }

  // Text customization
  text: {
    drawer: {
      title: string
      subtitle?: string
      closeButton: string
    }
    leaderboard: {
      title: string
      noDataMessage: string
      loadingMessage: string
      errorMessage: string
      rankLabel: string
      pointsLabel: string
      youLabel: string
    }
    claims: {
      title: string
      noClaimsMessage: string
      claimButton: string
      claimedButton: string
      unavailableButton: string
      requirementsNotMet: string
      loadingMessage: string
      errorMessage: string
    }
    general: {
      loading: string
      error: string
      retry: string
      close: string
      back: string
      next: string
      previous: string
    }
  }

  // Behavior and functionality
  behavior: {
    position: "left" | "right"
    width: number
    maxWidth: number
    overlay: boolean
    closeOnOverlayClick: boolean
    closeOnEscape: boolean
    autoOpen: boolean
    persistState: boolean
    animations: boolean
    soundEffects: boolean
  }

  // API and data
  api: {
    baseUrl: string
    endpoints: {
      leaderboard: string
      claims: string
      userProfile: string
      claimReward: string
    }
    headers?: Record<string, string>
    authentication?: {
      type: "bearer" | "api-key" | "custom"
      token?: string
      apiKey?: string
      customHeaders?: Record<string, string>
    }
  }

  // Analytics configuration
  analytics?: {
    enabled: boolean
    clientId: string
    endpoint?: string
    trackEvents?: string[]
    excludeEvents?: string[]
    debugMode?: boolean
    consentRequired?: boolean
    anonymizeIp?: boolean
    batchProcessing?: boolean
    batchSize?: number
    batchInterval?: number
    samplingRate?: number
    customDimensions?: Record<string, string>
    customMetrics?: Record<string, number>
  }

  // Responsive settings
  responsive: {
    breakpoints: {
      mobile: number
      tablet: number
      desktop: number
    }
    mobileOverrides?: Partial<RewardsDrawerConfig>
    tabletOverrides?: Partial<RewardsDrawerConfig>
  }
}

export interface ClaimSection {
  id: string
  title: string
  description?: string
  type: "discount" | "freeItem" | "exclusiveContent" | "points" | "custom"
  items: ClaimItem[]
  displayMode: "grid" | "list" | "carousel"
  showHeader: boolean
  collapsible: boolean
  defaultExpanded: boolean
}

export interface ClaimItem {
  id: string
  title: string
  description: string
  image?: {
    url: string
    alt: string
    width?: number
    height?: number
  }
  value: string | number
  requirements: {
    points?: number
    level?: number
    badges?: string[]
    custom?: Record<string, any>
  }
  availability: {
    startDate?: string
    endDate?: string
    maxClaims?: number
    currentClaims?: number
    userLimit?: number
    userClaimed?: number
  }
  status: "available" | "claimed" | "unavailable" | "expired"
  metadata?: Record<string, any>
}

export interface LeaderboardEntry {
  id: string
  username: string
  displayName?: string
  avatar?: string
  points: number
  rank: number
  badge?: {
    name: string
    icon: string
    color: string
  }
  isCurrentUser?: boolean
}

export interface UserProfile {
  id: string
  username: string
  displayName?: string
  avatar?: string
  points: number
  level: number
  rank: number
  badges: string[]
  claimedRewards: string[]
}

// Re-export analytics types
export * from "./analytics/types"
