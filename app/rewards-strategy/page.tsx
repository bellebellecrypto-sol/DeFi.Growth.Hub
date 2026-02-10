import { RewardsOptimizationSimulator } from "@/components/rewards-optimization-simulator"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Rewards Strategy Optimization",
  description: "Optimize your rewards distribution strategy for maximum impact",
}

export default function RewardsStrategyPage() {
  return (
    <div className="container py-6 space-y-6">
      <RewardsOptimizationSimulator />
    </div>
  )
}
