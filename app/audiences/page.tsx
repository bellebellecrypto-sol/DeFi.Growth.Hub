"use client"

import { useState } from "react"
import { useInterfaceMode } from "@/contexts/interface-mode-context"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/page-header"
import { PlusIcon } from "lucide-react"

export default function AudiencesPage() {
  const { mode } = useInterfaceMode()
  const [isCSVDialogOpen, setIsCSVDialogOpen] = useState(false)
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null)

  const users = [
    {
      id: 1,
      wallet: "0x1234...5678",
      campaigns: 3,
      rewards: "150 USDC",
      status: "active",
      joinDate: "2024-01-15",
      lastActivity: "2 hours ago",
    },
    {
      id: 2,
      wallet: "0x2345...6789",
      campaigns: 1,
      rewards: "75 USDC",
      status: "active",
      joinDate: "2024-02-01",
      lastActivity: "1 day ago",
    },
    {
      id: 3,
      wallet: "0x3456...7890",
      campaigns: 5,
      rewards: "300 USDC",
      status: "inactive",
      joinDate: "2023-12-10",
      lastActivity: "2 weeks ago",
    },
    {
      id: 4,
      wallet: "0x4567...8901",
      campaigns: 2,
      rewards: "120 USDC",
      status: "active",
      joinDate: "2024-01-20",
      lastActivity: "5 hours ago",
    },
  ]

  const segments = [
    {
      id: "1",
      name: "New Users",
      recipientCount: 245,
      totalAllocation: 12250,
      createdDate: "2024-01-15",
      description: "Users (wallets) who joined in the last 30 days",
      criteria: "Join date < 30 days",
    },
    {
      id: "2",
      name: "Power Users",
      recipientCount: 89,
      totalAllocation: 13350,
      createdDate: "2024-01-10",
      description: "High-engagement users with multiple campaign participation",
      criteria: "Campaigns > 3 AND rewards > 200 USDC",
    },
    {
      id: "3",
      name: "Developers",
      recipientCount: 156,
      totalAllocation: 43680,
      createdDate: "2024-01-05",
      description: "Users participating in developer incentive programs",
      criteria: "Developer Incentives campaign",
    },
    {
      id: "4",
      name: "High-Value Users",
      recipientCount: 67,
      totalAllocation: 30150,
      createdDate: "2024-01-20",
      description: "Users with high reward accumulation",
      criteria: "Total rewards > 500 USDC",
    },
  ]

  const handleCSVImport = (data: any) => {
    console.log("Importing CSV data:", data)
    setIsCSVDialogOpen(false)
    // Handle the imported data
  }

  const handleSegmentMerge = (sourceIds: string[], targetName: string, mergeStrategy: string) => {
    console.log("Merging segments:", { sourceIds, targetName, mergeStrategy })
    // Handle segment merge
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "default"
      case "inactive":
        return "secondary"
      case "pending":
        return "outline"
      default:
        return "outline"
    }
  }

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <PageHeader title="Audiences" subtitle="Manage user segments and audience targeting">
        <Button className="gap-2">
          <PlusIcon className="h-4 w-4" />
          Create Audience
        </Button>
      </PageHeader>

      {/* Audience content would go here */}
      <div className="grid gap-6">
        <p className="text-muted-foreground">Audience management interface coming soon...</p>
      </div>
    </div>
  )
}
