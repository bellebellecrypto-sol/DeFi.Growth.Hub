export interface BehaviorPattern {
  id: string
  name: string
  description: string
  category: "activity" | "engagement" | "transaction" | "temporal" | "value"
  conditions: BehaviorCondition[]
  priority: number
  isActive: boolean
}

export interface BehaviorCondition {
  id: string
  metric: string
  operator: "gt" | "lt" | "eq" | "gte" | "lte" | "between" | "in" | "contains"
  value: any
  timeframe?: string
  weight?: number
}

export interface AutomatedSegment {
  id: string
  name: string
  description: string
  patterns: string[] // Pattern IDs
  rules: SegmentRule[]
  isActive: boolean
  createdAt: string
  lastUpdated: string
  recipientCount: number
  updateFrequency: "realtime" | "hourly" | "daily" | "weekly"
  priority: number
}

export interface SegmentRule {
  id: string
  type: "include" | "exclude"
  conditions: BehaviorCondition[]
  logic: "and" | "or"
}

export interface UserBehaviorData {
  userId: string
  wallet: string
  metrics: {
    transactionCount: number
    totalVolume: number
    avgTransactionValue: number
    lastActivityDate: string
    daysSinceFirstTransaction: number
    platformEngagementScore: number
    campaignParticipation: number
    rewardsClaimed: number
    consecutiveActiveDays: number
    peakActivityHour: number
    preferredTokens: string[]
    networkActivity: Record<string, number>
  }
  behaviorScores: {
    activity: number
    engagement: number
    value: number
    loyalty: number
    growth: number
  }
  lastUpdated: string
}

class AutomatedSegmentService {
  private segments: AutomatedSegment[] = []
  private patterns: BehaviorPattern[] = []
  private userBehaviorData: Map<string, UserBehaviorData> = new Map()

  constructor() {
    this.initializeDefaultPatterns()
    this.initializeDefaultSegments()
  }

  private initializeDefaultPatterns(): void {
    this.patterns = [
      {
        id: "high-activity",
        name: "High Activity Users",
        description: "Users with frequent platform interactions",
        category: "activity",
        priority: 1,
        isActive: true,
        conditions: [
          {
            id: "tx-count",
            metric: "transactionCount",
            operator: "gte",
            value: 10,
            timeframe: "30d",
            weight: 0.4,
          },
          {
            id: "engagement",
            metric: "platformEngagementScore",
            operator: "gte",
            value: 70,
            weight: 0.6,
          },
        ],
      },
      {
        id: "whale-behavior",
        name: "High-Value Users",
        description: "Users with significant transaction volumes",
        category: "value",
        priority: 1,
        isActive: true,
        conditions: [
          {
            id: "total-volume",
            metric: "totalVolume",
            operator: "gte",
            value: 10000,
            timeframe: "90d",
            weight: 0.7,
          },
          {
            id: "avg-tx-value",
            metric: "avgTransactionValue",
            operator: "gte",
            value: 500,
            weight: 0.3,
          },
        ],
      },
      {
        id: "new-user",
        name: "New Users",
        description: "Recently joined users",
        category: "temporal",
        priority: 2,
        isActive: true,
        conditions: [
          {
            id: "days-since-first",
            metric: "daysSinceFirstTransaction",
            operator: "lte",
            value: 30,
            weight: 1.0,
          },
        ],
      },
      {
        id: "dormant-user",
        name: "Dormant Users",
        description: "Users with declining activity",
        category: "activity",
        priority: 3,
        isActive: true,
        conditions: [
          {
            id: "last-activity",
            metric: "lastActivityDate",
            operator: "lt",
            value: "60d",
            weight: 0.6,
          },
          {
            id: "engagement-drop",
            metric: "platformEngagementScore",
            operator: "lt",
            value: 30,
            weight: 0.4,
          },
        ],
      },
      {
        id: "power-user",
        name: "Power Users",
        description: "Highly engaged, consistent users",
        category: "engagement",
        priority: 1,
        isActive: true,
        conditions: [
          {
            id: "consecutive-days",
            metric: "consecutiveActiveDays",
            operator: "gte",
            value: 14,
            weight: 0.3,
          },
          {
            id: "campaign-participation",
            metric: "campaignParticipation",
            operator: "gte",
            value: 3,
            weight: 0.3,
          },
          {
            id: "engagement-score",
            metric: "platformEngagementScore",
            operator: "gte",
            value: 80,
            weight: 0.4,
          },
        ],
      },
    ]
  }

  private initializeDefaultSegments(): void {
    this.segments = [
      {
        id: "auto-high-value",
        name: "High-Value Users (Auto)",
        description: "Automatically maintained segment of high-value users",
        patterns: ["whale-behavior"],
        rules: [
          {
            id: "rule-1",
            type: "include",
            logic: "and",
            conditions: [
              {
                id: "min-volume",
                metric: "totalVolume",
                operator: "gte",
                value: 10000,
                timeframe: "90d",
              },
            ],
          },
        ],
        isActive: true,
        createdAt: "2024-01-01",
        lastUpdated: new Date().toISOString(),
        recipientCount: 0,
        updateFrequency: "daily",
        priority: 1,
      },
      {
        id: "auto-power-users",
        name: "Power Users (Auto)",
        description: "Automatically maintained segment of power users",
        patterns: ["power-user", "high-activity"],
        rules: [
          {
            id: "rule-1",
            type: "include",
            logic: "and",
            conditions: [
              {
                id: "engagement",
                metric: "platformEngagementScore",
                operator: "gte",
                value: 75,
              },
              {
                id: "activity",
                metric: "consecutiveActiveDays",
                operator: "gte",
                value: 7,
              },
            ],
          },
        ],
        isActive: true,
        createdAt: "2024-01-01",
        lastUpdated: new Date().toISOString(),
        recipientCount: 0,
        updateFrequency: "hourly",
        priority: 1,
      },
    ]
  }

  // Analyze user behavior and assign to segments
  async analyzeUserBehavior(userId: string, behaviorData: Partial<UserBehaviorData>): Promise<string[]> {
    // Update user behavior data
    const existingData = this.userBehaviorData.get(userId)
    const updatedData: UserBehaviorData = {
      ...existingData,
      ...behaviorData,
      userId,
      lastUpdated: new Date().toISOString(),
    } as UserBehaviorData

    this.userBehaviorData.set(userId, updatedData)

    // Calculate behavior scores
    updatedData.behaviorScores = this.calculateBehaviorScores(updatedData)

    // Find matching segments
    const matchingSegments: string[] = []

    for (const segment of this.segments.filter((s) => s.isActive)) {
      if (this.evaluateSegmentRules(updatedData, segment)) {
        matchingSegments.push(segment.id)
      }
    }

    return matchingSegments
  }

  private calculateBehaviorScores(data: UserBehaviorData): UserBehaviorData["behaviorScores"] {
    const { metrics } = data

    // Activity score (0-100)
    const activityScore = Math.min(
      100,
      metrics.transactionCount * 2 + metrics.consecutiveActiveDays * 3 + metrics.platformEngagementScore * 0.5,
    )

    // Engagement score (0-100)
    const engagementScore = Math.min(
      100,
      metrics.platformEngagementScore * 0.7 + metrics.campaignParticipation * 10 + metrics.rewardsClaimed * 2,
    )

    // Value score (0-100)
    const valueScore = Math.min(
      100,
      Math.log10(metrics.totalVolume + 1) * 10 + Math.log10(metrics.avgTransactionValue + 1) * 5,
    )

    // Loyalty score (0-100)
    const loyaltyScore = Math.min(
      100,
      metrics.daysSinceFirstTransaction * 0.5 + metrics.consecutiveActiveDays * 2 + metrics.campaignParticipation * 8,
    )

    // Growth score (0-100) - simplified calculation
    const growthScore = Math.min(100, activityScore * 0.4 + engagementScore * 0.6)

    return {
      activity: Math.round(activityScore),
      engagement: Math.round(engagementScore),
      value: Math.round(valueScore),
      loyalty: Math.round(loyaltyScore),
      growth: Math.round(growthScore),
    }
  }

  private evaluateSegmentRules(userData: UserBehaviorData, segment: AutomatedSegment): boolean {
    for (const rule of segment.rules) {
      const ruleResult = this.evaluateRule(userData, rule)

      if (rule.type === "include" && !ruleResult) {
        return false
      }
      if (rule.type === "exclude" && ruleResult) {
        return false
      }
    }
    return true
  }

  private evaluateRule(userData: UserBehaviorData, rule: SegmentRule): boolean {
    const results = rule.conditions.map((condition) => this.evaluateCondition(userData, condition))

    return rule.logic === "and" ? results.every((r) => r) : results.some((r) => r)
  }

  private evaluateCondition(userData: UserBehaviorData, condition: BehaviorCondition): boolean {
    const value = this.getMetricValue(userData, condition.metric)

    switch (condition.operator) {
      case "gt":
        return value > condition.value
      case "gte":
        return value >= condition.value
      case "lt":
        return value < condition.value
      case "lte":
        return value <= condition.value
      case "eq":
        return value === condition.value
      case "between":
        return value >= condition.value[0] && value <= condition.value[1]
      case "in":
        return condition.value.includes(value)
      case "contains":
        return String(value).includes(condition.value)
      default:
        return false
    }
  }

  private getMetricValue(userData: UserBehaviorData, metric: string): any {
    // Handle nested metrics
    if (metric.includes(".")) {
      const [category, field] = metric.split(".")
      return userData[category as keyof UserBehaviorData]?.[field as any]
    }

    return (
      userData.metrics[metric as keyof UserBehaviorData["metrics"]] ||
      userData.behaviorScores[metric as keyof UserBehaviorData["behaviorScores"]] ||
      userData[metric as keyof UserBehaviorData]
    )
  }

  // Get all automated segments
  getAutomatedSegments(): AutomatedSegment[] {
    return this.segments
  }

  // Get behavior patterns
  getBehaviorPatterns(): BehaviorPattern[] {
    return this.patterns
  }

  // Create new automated segment
  createAutomatedSegment(
    segment: Omit<AutomatedSegment, "id" | "createdAt" | "lastUpdated" | "recipientCount">,
  ): AutomatedSegment {
    const newSegment: AutomatedSegment = {
      ...segment,
      id: `auto-${Date.now()}`,
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      recipientCount: 0,
    }

    this.segments.push(newSegment)
    return newSegment
  }

  // Update segment
  updateAutomatedSegment(id: string, updates: Partial<AutomatedSegment>): AutomatedSegment | null {
    const index = this.segments.findIndex((s) => s.id === id)
    if (index === -1) return null

    this.segments[index] = {
      ...this.segments[index],
      ...updates,
      lastUpdated: new Date().toISOString(),
    }

    return this.segments[index]
  }

  // Get segment performance metrics
  getSegmentMetrics(segmentId: string): {
    recipientCount: number
    growthRate: number
    engagementScore: number
    valueScore: number
    retentionRate: number
  } {
    // This would typically query actual data
    return {
      recipientCount: Math.floor(Math.random() * 1000) + 100,
      growthRate: Math.random() * 20 - 5, // -5% to +15%
      engagementScore: Math.floor(Math.random() * 40) + 60, // 60-100
      valueScore: Math.floor(Math.random() * 50) + 50, // 50-100
      retentionRate: Math.floor(Math.random() * 30) + 70, // 70-100%
    }
  }

  // Simulate real-time behavior updates
  simulateUserActivity(userId: string): void {
    const currentData = this.userBehaviorData.get(userId) || this.generateMockUserData(userId)

    // Simulate some activity
    const updates: Partial<UserBehaviorData> = {
      metrics: {
        ...currentData.metrics,
        transactionCount: currentData.metrics.transactionCount + Math.floor(Math.random() * 3),
        platformEngagementScore: Math.max(
          0,
          Math.min(100, currentData.metrics.platformEngagementScore + (Math.random() * 10 - 5)),
        ),
        lastActivityDate: new Date().toISOString(),
      },
    }

    this.analyzeUserBehavior(userId, updates)
  }

  private generateMockUserData(userId: string): UserBehaviorData {
    return {
      userId,
      wallet: `0x${Math.random().toString(16).substr(2, 40)}`,
      metrics: {
        transactionCount: Math.floor(Math.random() * 50),
        totalVolume: Math.random() * 50000,
        avgTransactionValue: Math.random() * 1000,
        lastActivityDate: new Date().toISOString(),
        daysSinceFirstTransaction: Math.floor(Math.random() * 365),
        platformEngagementScore: Math.floor(Math.random() * 100),
        campaignParticipation: Math.floor(Math.random() * 10),
        rewardsClaimed: Math.floor(Math.random() * 20),
        consecutiveActiveDays: Math.floor(Math.random() * 30),
        peakActivityHour: Math.floor(Math.random() * 24),
        preferredTokens: ["USDC", "ETH", "ORCA"],
        networkActivity: {
          ethereum: Math.random() * 100,
          polygon: Math.random() * 100,
          solana: Math.random() * 100,
        },
      },
      behaviorScores: {
        activity: 0,
        engagement: 0,
        value: 0,
        loyalty: 0,
        growth: 0,
      },
      lastUpdated: new Date().toISOString(),
    }
  }
}

export const automatedSegmentService = new AutomatedSegmentService()
