export interface OrcaRewardData {
  name: string
  chain: string
  feeTier: string
  poolAddress: string
  reward1?: string
  weeklyEmissions1?: number
  startDate1?: string
  endDate1?: string
  reward2?: string
  weeklyEmissions2?: number
  startDate2?: string
  endDate2?: string
  reward3?: string
  weeklyEmissions3?: number
  startDate3?: string
  endDate3?: string
}

export interface ProcessedOrcaData {
  totalPools: number
  totalRewards: number
  totalWeeklyEmissions: number
  activeRewards: number
  topTokenPairs: Array<{
    name: string
    totalEmissions: number
    rewardCount: number
    feeTier: string
  }>
  rewardTokens: Array<{
    token: string
    totalEmissions: number
    poolCount: number
  }>
  emissionsByFeeTier: Array<{
    feeTier: string
    totalEmissions: number
    poolCount: number
  }>
  timeSeriesData: Array<{
    date: string
    activeRewards: number
    totalEmissions: number
  }>
}

class OrcaDataService {
  private data: OrcaRewardData[] = []
  private processedData: ProcessedOrcaData | null = null

  async fetchData(): Promise<OrcaRewardData[]> {
    try {
      const response = await fetch(
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Token%20Pair-Grid%20view-MheHgN2tQn3k1ygeBynEJZvRSRIfNF.csv",
      )
      const csvText = await response.text()

      // Parse CSV
      const lines = csvText.split("\n")
      const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""))

      this.data = lines
        .slice(1)
        .filter((line) => line.trim())
        .map((line) => {
          const values = this.parseCSVLine(line)
          const row: any = {}

          headers.forEach((header, index) => {
            const value = values[index]?.trim().replace(/"/g, "") || ""

            switch (header) {
              case "Name":
                row.name = value
                break
              case "Chain":
                row.chain = value
                break
              case "Fee Tier":
                row.feeTier = value
                break
              case "Pool Address":
                row.poolAddress = value
                break
              case "Reward 1":
                row.reward1 = value || undefined
                break
              case "Weekly Emissions 1":
                row.weeklyEmissions1 = value ? Number.parseFloat(value.replace(/,/g, "")) : undefined
                break
              case "Start Date 1":
                row.startDate1 = value || undefined
                break
              case "End Date 1":
                row.endDate1 = value || undefined
                break
              case "Reward 2":
                row.reward2 = value || undefined
                break
              case "Weekly Emissions 2":
                row.weeklyEmissions2 = value ? Number.parseFloat(value.replace(/,/g, "")) : undefined
                break
              case "Start Date 2":
                row.startDate2 = value || undefined
                break
              case "End Date 2":
                row.endDate2 = value || undefined
                break
              case "Reward 3":
                row.reward3 = value || undefined
                break
              case "Weekly Emissions 3":
                row.weeklyEmissions3 = value ? Number.parseFloat(value.replace(/,/g, "")) : undefined
                break
              case "Start Date 3":
                row.startDate3 = value || undefined
                break
              case "End Date 3":
                row.endDate3 = value || undefined
                break
            }
          })

          return row as OrcaRewardData
        })

      this.processedData = this.processData()
      return this.data
    } catch (error) {
      console.error("Failed to fetch Orca data:", error)
      throw error
    }
  }

  private parseCSVLine(line: string): string[] {
    const result = []
    let current = ""
    let inQuotes = false

    for (let i = 0; i < line.length; i++) {
      const char = line[i]

      if (char === '"') {
        inQuotes = !inQuotes
      } else if (char === "," && !inQuotes) {
        result.push(current)
        current = ""
      } else {
        current += char
      }
    }

    result.push(current)
    return result
  }

  private processData(): ProcessedOrcaData {
    if (!this.data.length) {
      return {
        totalPools: 0,
        totalRewards: 0,
        totalWeeklyEmissions: 0,
        activeRewards: 0,
        topTokenPairs: [],
        rewardTokens: [],
        emissionsByFeeTier: [],
        timeSeriesData: [],
      }
    }

    const totalPools = this.data.length
    let totalWeeklyEmissions = 0
    let activeRewards = 0

    // Process token pairs and emissions
    const tokenPairMap = new Map<string, { totalEmissions: number; rewardCount: number; feeTier: string }>()
    const rewardTokenMap = new Map<string, { totalEmissions: number; poolCount: number }>()
    const feeTierMap = new Map<string, { totalEmissions: number; poolCount: number }>()

    this.data.forEach((pool) => {
      let poolEmissions = 0
      let poolRewardCount = 0

      // Process each reward
      for (let i = 1; i <= 3; i++) {
        const reward = pool[`reward${i}` as keyof OrcaRewardData] as string
        const emissions = pool[`weeklyEmissions${i}` as keyof OrcaRewardData] as number
        const endDate = pool[`endDate${i}` as keyof OrcaRewardData] as string

        if (reward && emissions) {
          poolEmissions += emissions
          poolRewardCount++

          // Check if reward is still active
          if (endDate) {
            const end = new Date(endDate)
            if (end > new Date()) {
              activeRewards++
            }
          }

          // Update reward token map
          const existing = rewardTokenMap.get(reward) || { totalEmissions: 0, poolCount: 0 }
          rewardTokenMap.set(reward, {
            totalEmissions: existing.totalEmissions + emissions,
            poolCount: existing.poolCount + 1,
          })
        }
      }

      totalWeeklyEmissions += poolEmissions

      // Update token pair map
      tokenPairMap.set(pool.name, {
        totalEmissions: poolEmissions,
        rewardCount: poolRewardCount,
        feeTier: pool.feeTier,
      })

      // Update fee tier map
      const existing = feeTierMap.get(pool.feeTier) || { totalEmissions: 0, poolCount: 0 }
      feeTierMap.set(pool.feeTier, {
        totalEmissions: existing.totalEmissions + poolEmissions,
        poolCount: existing.poolCount + 1,
      })
    })

    // Convert maps to arrays and sort
    const topTokenPairs = Array.from(tokenPairMap.entries())
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.totalEmissions - a.totalEmissions)
      .slice(0, 10)

    const rewardTokens = Array.from(rewardTokenMap.entries())
      .map(([token, data]) => ({ token, ...data }))
      .sort((a, b) => b.totalEmissions - a.totalEmissions)

    const emissionsByFeeTier = Array.from(feeTierMap.entries())
      .map(([feeTier, data]) => ({ feeTier, ...data }))
      .sort((a, b) => b.totalEmissions - a.totalEmissions)

    // Generate time series data (simplified for demo)
    const timeSeriesData = this.generateTimeSeriesData()

    return {
      totalPools,
      totalRewards: rewardTokens.length,
      totalWeeklyEmissions,
      activeRewards,
      topTokenPairs,
      rewardTokens,
      emissionsByFeeTier,
      timeSeriesData,
    }
  }

  private generateTimeSeriesData() {
    // Generate sample time series data based on the actual data
    const data = []
    const now = new Date()

    for (let i = 30; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)

      // Simulate some variance in the data
      const variance = 0.8 + Math.random() * 0.4

      data.push({
        date: date.toISOString().split("T")[0],
        activeRewards: Math.floor(this.processedData?.activeRewards || 0 * variance),
        totalEmissions: Math.floor(this.processedData?.totalWeeklyEmissions || 0 * variance),
      })
    }

    return data
  }

  getProcessedData(): ProcessedOrcaData | null {
    return this.processedData
  }

  getRawData(): OrcaRewardData[] {
    return this.data
  }

  // Get pools by reward token
  getPoolsByReward(rewardToken: string): OrcaRewardData[] {
    return this.data.filter(
      (pool) => pool.reward1 === rewardToken || pool.reward2 === rewardToken || pool.reward3 === rewardToken,
    )
  }

  // Get pools by fee tier
  getPoolsByFeeTier(feeTier: string): OrcaRewardData[] {
    return this.data.filter((pool) => pool.feeTier === feeTier)
  }

  // Calculate APR estimates (simplified)
  calculateAPREstimate(pool: OrcaRewardData, tokenPrice = 1): number {
    let totalEmissions = 0

    if (pool.weeklyEmissions1) totalEmissions += pool.weeklyEmissions1
    if (pool.weeklyEmissions2) totalEmissions += pool.weeklyEmissions2
    if (pool.weeklyEmissions3) totalEmissions += pool.weeklyEmissions3

    // Simplified APR calculation (would need TVL data for accurate calculation)
    const annualEmissions = totalEmissions * 52 * tokenPrice
    const estimatedTVL = 1000000 // Placeholder - would need real TVL data

    return (annualEmissions / estimatedTVL) * 100
  }
}

export const orcaDataService = new OrcaDataService()
