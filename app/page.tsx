"use client"

import { PageHeader } from "@/components/page-header"
import { DashboardOverview } from "@/components/dashboard-overview"

export default function GrowthHubPage() {
  const handleBrightnessClick = () => {
    console.log("Brightness settings clicked")
    // Add brightness adjustment logic here
  }

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <PageHeader
        title="Growth Hub"
        subtitle="Monitor your incentive campaigns and track performance metrics"
        showIconButton={true}
        iconButtonVariant="brightness"
        onIconButtonClick={handleBrightnessClick}
      />

      <DashboardOverview />
    </div>
  )
}
