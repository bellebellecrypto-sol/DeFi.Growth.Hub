import { orcaDataService, type OrcaRewardData } from "./orca-data-service"

export interface OptimizationTarget {
  type: "tvl" | "volume" | "users" | "retention" | "engagement" | "balanced"
  weight: number
}

export interface PoolOptimizationData {
  name: string
  currentEmissions: number
  suggestedEmissions: number
  change: number
  changePercent: number
  impact: {
    tvl: number
    volume: number
    users: number
    retention: number
    engagement: number
  }
  score: number
  feeTier: string
  rewardTokens: string[]
}

export interface OptimizationResult {
  pools: PoolOptimizationData[]
  totalEmissions: number
  totalSuggestedEmissions: number
  projectedImpact: {
    tvl: number
    volume: number
    users: number
    retention: number
    engagement: number
  }
  summary: {
    increasedPools: number
    decreasedPools: number
    unchangedPools: number
    maxIncrease: number
    maxDecrease: number
    redistributedEmissions: number
  }
}

export interface SimulationParams {
  totalEmissions: number
  targets: OptimizationTarget[]
  constraints: {
    maxPoolAllocation: number
    minPoolAllocation: number
    maxChangePercent: number
    preserveTopPerformers: boolean
    focusUnderperforming: boolean
  }
}

// Mock data for pool performance metrics (in a real implementation, this would come from an API)
const mockPoolPerformanceData = new Map<
  string,
  {
    tvl: number
    volume: number
    users: number
    retention: number
    engagement: number
    elasticity: number // how responsive the pool is to reward changes
  }
>()

class RewardsOptimizationService {
  private poolPerformanceData: Map<string, any> = mockPoolPerformanceData

  constructor() {
    // Initialize with some mock data for demonstration
    this.initializeMockData()
  }

  private initializeMockData() {
    // This would be replaced with real data in production
    const rawData = orcaDataService.getRawData()

    if (!rawData.length) return

    rawData.forEach((pool) => {
      // Generate realistic mock data based on emissions
      const totalEmissions = this.calculateTotalEmissions(pool)
      const baseValue = Math.sqrt(totalEmissions) * (0.8 + Math.random() * 0.4)

      this.poolPerformanceData.set(pool.name, {
        tvl: baseValue * 100000 * (0.7 + Math.random() * 0.6),
        volume: baseValue * 25000 * (0.6 + Math.random() * 0.8),
        users: Math.floor(baseValue * 50 * (0.5 + Math.random() * 1)),
        retention: Math.min(0.95, 0.4 + (baseValue / 100) * (0.7 + Math.random() * 0.6)),
        engagement: Math.min(0.9, 0.3 + (baseValue / 100) * (0.6 + Math.random() * 0.8)),
        elasticity: 0.2 + Math.random() * 0.6, // how responsive the pool is to reward changes
      })
    })
  }

  private calculateTotalEmissions(pool: OrcaRewardData): number {
    let total = 0
    if (pool.weeklyEmissions1) total += pool.weeklyEmissions1
    if (pool.weeklyEmissions2) total += pool.weeklyEmissions2
    if (pool.weeklyEmissions3) total += pool.weeklyEmissions3
    return total
  }

  // Get performance data for a specific pool
  getPoolPerformance(poolName: string) {
    return (
      this.poolPerformanceData.get(poolName) || {
        tvl: 0,
        volume: 0,
        users: 0,
        retention: 0,
        engagement: 0,
        elasticity: 0.5,
      }
    )
  }

  // Calculate a pool's score based on optimization targets
  calculatePoolScore(pool: OrcaRewardData, targets: OptimizationTarget[]): number {
    const performance = this.getPoolPerformance(pool.name)
    let score = 0
    let totalWeight = 0

    targets.forEach((target) => {
      const weight = target.weight
      totalWeight += weight

      switch (target.type) {
        case "tvl":
          score += (performance.tvl / 1000000) * weight
          break
        case "volume":
          score += (performance.volume / 100000) * weight
          break
        case "users":
          score += (performance.users / 100) * weight
          break
        case "retention":
          score += performance.retention * 10 * weight
          break
        case "engagement":
          score += performance.engagement * 10 * weight
          break
        case "balanced":
          // Balanced approach considers all factors
          score +=
            ((performance.tvl / 1000000 +
              performance.volume / 100000 +
              performance.users / 100 +
              performance.retention * 10 +
              performance.engagement * 10) *
              weight) /
            5
          break
      }
    })

    // Normalize by total weight
    return totalWeight > 0 ? score / totalWeight : 0
  }

  // Optimize reward distribution based on targets and constraints
  optimizeRewards(params: SimulationParams): OptimizationResult {
    const rawData = orcaDataService.getRawData()
    const processedData = orcaDataService.getProcessedData()

    if (!rawData.length || !processedData) {
      throw new Error("No data available for optimization")
    }

    // Calculate scores for each pool
    const poolScores = rawData.map((pool) => {
      const totalEmissions = this.calculateTotalEmissions(pool)
      const score = this.calculatePoolScore(pool, params.targets)
      const performance = this.getPoolPerformance(pool.name)

      return {
        pool,
        score,
        currentEmissions: totalEmissions,
        performance,
      }
    })

    // Sort by score (descending)
    poolScores.sort((a, b) => b.score - a.score)

    // Calculate total score
    const totalScore = poolScores.reduce((sum, p) => sum + p.score, 0)

    // Calculate suggested emissions based on score proportion
    let poolOptimizationData: PoolOptimizationData[] = poolScores.map(
      ({ pool, score, currentEmissions, performance }) => {
        // Base allocation by score proportion
        const scoreProportion = totalScore > 0 ? score / totalScore : 0
        let suggestedEmissions = params.totalEmissions * scoreProportion

        // Apply constraints
        const maxAllocation = params.totalEmissions * params.constraints.maxPoolAllocation
        const minAllocation = params.totalEmissions * params.constraints.minPoolAllocation

        suggestedEmissions = Math.min(suggestedEmissions, maxAllocation)
        suggestedEmissions = Math.max(suggestedEmissions, minAllocation)

        // Limit change percent if specified
        if (params.constraints.maxChangePercent < 100) {
          const maxChange = currentEmissions * (params.constraints.maxChangePercent / 100)
          suggestedEmissions = Math.max(
            Math.min(suggestedEmissions, currentEmissions + maxChange),
            currentEmissions - maxChange,
          )
        }

        // Special handling for top performers
        if (params.constraints.preserveTopPerformers && score > (totalScore / rawData.length) * 1.5) {
          suggestedEmissions = Math.max(suggestedEmissions, currentEmissions)
        }

        // Special handling for underperforming pools
        if (params.constraints.focusUnderperforming && score < (totalScore / rawData.length) * 0.5) {
          suggestedEmissions = Math.min(suggestedEmissions, currentEmissions * 0.8)
        }

        // Calculate change
        const change = suggestedEmissions - currentEmissions
        const changePercent = currentEmissions > 0 ? (change / currentEmissions) * 100 : 0

        // Calculate projected impact based on elasticity
        const elasticity = performance.elasticity
        const changeRatio = suggestedEmissions / (currentEmissions || 1)
        const impactMultiplier =
          changeRatio >= 1 ? 1 + (changeRatio - 1) * elasticity : 1 - (1 - changeRatio) * elasticity

        return {
          name: pool.name,
          currentEmissions,
          suggestedEmissions,
          change,
          changePercent,
          impact: {
            tvl: performance.tvl * impactMultiplier,
            volume: performance.volume * impactMultiplier,
            users: performance.users * impactMultiplier,
            retention: Math.min(1, performance.retention * impactMultiplier),
            engagement: Math.min(1, performance.engagement * impactMultiplier),
          },
          score,
          feeTier: pool.feeTier,
          rewardTokens: [pool.reward1, pool.reward2, pool.reward3].filter(Boolean) as string[],
        }
      },
    )

    // Normalize to ensure total emissions match the target
    const totalSuggestedEmissions = poolOptimizationData.reduce((sum, p) => sum + p.suggestedEmissions, 0)
    const normalizationFactor = params.totalEmissions / totalSuggestedEmissions

    poolOptimizationData = poolOptimizationData.map((pool) => ({
      ...pool,
      suggestedEmissions: pool.suggestedEmissions * normalizationFactor,
      change: pool.suggestedEmissions * normalizationFactor - pool.currentEmissions,
      changePercent:
        ((pool.suggestedEmissions * normalizationFactor - pool.currentEmissions) / pool.currentEmissions) * 100,
    }))

    // Calculate summary statistics
    const increasedPools = poolOptimizationData.filter((p) => p.change > 0).length
    const decreasedPools = poolOptimizationData.filter((p) => p.change < 0).length
    const unchangedPools = poolOptimizationData.filter((p) => p.change === 0).length
    const maxIncrease = Math.max(...poolOptimizationData.map((p) => p.changePercent))
    const maxDecrease = Math.min(...poolOptimizationData.map((p) => p.changePercent))
    const redistributedEmissions = poolOptimizationData
      .filter((p) => p.change > 0)
      .reduce((sum, p) => sum + p.change, 0)

    // Calculate projected impact
    const projectedImpact = {
      tvl: poolOptimizationData.reduce((sum, p) => sum + p.impact.tvl, 0),
      volume: poolOptimizationData.reduce((sum, p) => sum + p.impact.volume, 0),
      users: poolOptimizationData.reduce((sum, p) => sum + p.impact.users, 0),
      retention: poolOptimizationData.reduce((sum, p) => sum + p.impact.retention, 0) / poolOptimizationData.length,
      engagement: poolOptimizationData.reduce((sum, p) => sum + p.impact.engagement, 0) / poolOptimizationData.length,
    }

    return {
      pools: poolOptimizationData,
      totalEmissions: processedData.totalWeeklyEmissions,
      totalSuggestedEmissions: params.totalEmissions,
      projectedImpact,
      summary: {
        increasedPools,
        decreasedPools,
        unchangedPools,
        maxIncrease,
        maxDecrease,
        redistributedEmissions,
      },
    }
  }

  // Run multiple simulations with different parameters
  runSimulations(baseParams: SimulationParams, variations: Partial<SimulationParams>[]): OptimizationResult[] {
    return variations.map((variation) => {
      const params = { ...baseParams, ...variation }
      return this.optimizeRewards(params)
    })
  }

  // Get default optimization targets
  getDefaultTargets(): OptimizationTarget[] {
    return [
      { type: "tvl", weight: 30 },
      { type: "volume", weight: 25 },
      { type: "users", weight: 20 },
      { type: "retention", weight: 15 },
      { type: "engagement", weight: 10 },
    ]
  }

  // Get default constraints
  getDefaultConstraints() {
    return {
      maxPoolAllocation: 0.15, // max 15% to any single pool
      minPoolAllocation: 0.001, // min 0.1% to any pool
      maxChangePercent: 50, // max 50% change up or down
      preserveTopPerformers: true,
      focusUnderperforming: false,
    }
  }
}

export const rewardsOptimizationService = new RewardsOptimizationService()
