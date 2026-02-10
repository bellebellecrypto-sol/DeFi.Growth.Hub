"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AnalyticsDashboard } from "@/components/embeddable-rewards-drawer/analytics/analytics-dashboard"
import { RewardsDrawer } from "@/components/embeddable-rewards-drawer/rewards-drawer"
import type { RewardsDrawerConfig } from "@/components/embeddable-rewards-drawer/types"
import { BarChart3, Settings, Eye } from "lucide-react"

export default function AnalyticsPage() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [analyticsConfig, setAnalyticsConfig] = useState({
    enabled: true,
    clientId: "demo-client-123",
    endpoint: "/api/analytics",
    debugMode: true,
    batchProcessing: true,
    batchSize: 10,
    batchInterval: 5000,
  })

  // Sample rewards drawer config with analytics enabled
  const drawerConfig: RewardsDrawerConfig = {
    theme: {
      mode: "light" as const,
      colors: {
        primary: "#3b82f6",
        secondary: "#64748b",
        background: "#ffffff",
        surface: "#f8fafc",
        text: "#1e293b",
        textSecondary: "#64748b",
        accent: "#8b5cf6",
        success: "#10b981",
        warning: "#f59e0b",
        error: "#ef4444",
        border: "#e2e8f0",
      },
      typography: {
        fontFamily: "Inter, sans-serif",
        fontSize: {
          xs: "0.75rem",
          sm: "0.875rem",
          base: "1rem",
          lg: "1.125rem",
          xl: "1.25rem",
          "2xl": "1.5rem",
        },
        fontWeight: {
          normal: "400",
          medium: "500",
          semibold: "600",
          bold: "700",
        },
      },
      borderRadius: "0.5rem",
      shadows: {
        sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        md: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
        lg: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
      },
    },
    branding: {
      logo: {
        url: "/placeholder.svg?height=32&width=32&text=Logo",
        alt: "Company Logo",
        width: 32,
        height: 32,
        position: "top-left",
      },
    },
    leaderboard: {
      enabled: true,
      title: "Top Performers",
      maxEntries: 10,
      sortBy: "points",
      sortOrder: "desc",
      displayFields: {
        avatar: true,
        username: true,
        points: true,
        rank: true,
        badge: true,
      },
      showCurrentUser: true,
      highlightCurrentUser: true,
    },
    claims: {
      enabled: true,
      title: "Available Rewards",
      sections: [
        {
          id: "discounts",
          title: "Exclusive Discounts",
          type: "discount",
          items: [
            {
              id: "discount-10",
              title: "10% Off Next Purchase",
              description: "Save 10% on your next order",
              value: "10%",
              requirements: { points: 100 },
              availability: { maxClaims: 100, currentClaims: 25 },
              status: "available",
            },
            {
              id: "discount-20",
              title: "20% Off Premium Items",
              description: "Exclusive discount on premium products",
              value: "20%",
              requirements: { points: 250 },
              availability: { maxClaims: 50, currentClaims: 10 },
              status: "available",
            },
          ],
          displayMode: "grid",
          showHeader: true,
          collapsible: true,
          defaultExpanded: true,
        },
      ],
      displayMode: "grid",
      itemsPerPage: 6,
      showPagination: false,
    },
    text: {
      drawer: {
        title: "Rewards Center",
        subtitle: "Track your progress and claim rewards",
        closeButton: "Close",
      },
      leaderboard: {
        title: "Leaderboard",
        noDataMessage: "No leaderboard data available",
        loadingMessage: "Loading leaderboard...",
        errorMessage: "Failed to load leaderboard",
        rankLabel: "Rank",
        pointsLabel: "Points",
        youLabel: "You",
      },
      claims: {
        title: "Rewards",
        noClaimsMessage: "No rewards available",
        claimButton: "Claim",
        claimedButton: "Claimed",
        unavailableButton: "Unavailable",
        requirementsNotMet: "Requirements not met",
        loadingMessage: "Loading rewards...",
        errorMessage: "Failed to load rewards",
      },
      general: {
        loading: "Loading...",
        error: "Error",
        retry: "Retry",
        close: "Close",
        back: "Back",
        next: "Next",
        previous: "Previous",
      },
    },
    behavior: {
      position: "right",
      width: 400,
      maxWidth: 500,
      overlay: true,
      closeOnOverlayClick: true,
      closeOnEscape: true,
      autoOpen: false,
      persistState: true,
      animations: true,
      soundEffects: false,
    },
    api: {
      baseUrl: "/api",
      endpoints: {
        leaderboard: "/leaderboard",
        claims: "/claims",
        userProfile: "/user/profile",
        claimReward: "/rewards/claim",
      },
    },
    analytics: analyticsConfig,
    responsive: {
      breakpoints: {
        mobile: 768,
        tablet: 1024,
        desktop: 1280,
      },
    },
  }

  const userProfile = {
    id: "user-123",
    username: "demo_user",
    displayName: "Demo User",
    avatar: "/placeholder.svg?height=40&width=40&text=DU",
    points: 1250,
    level: 5,
    rank: 3,
    badges: ["early-adopter", "top-performer"],
    claimedRewards: ["discount-10"],
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor user engagement and reward performance with built-in analytics
          </p>
        </div>

        <Button onClick={() => setIsDrawerOpen(true)}>
          <Eye className="h-4 w-4 mr-2" />
          Preview Drawer
        </Button>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList>
          <TabsTrigger value="dashboard">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics Dashboard
          </TabsTrigger>
          <TabsTrigger value="configuration">
            <Settings className="h-4 w-4 mr-2" />
            Analytics Configuration
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <AnalyticsDashboard
            clientId={analyticsConfig.clientId}
            apiEndpoint={analyticsConfig.endpoint}
            className="space-y-6"
          />
        </TabsContent>

        <TabsContent value="configuration" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Analytics Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="analytics-enabled"
                      checked={analyticsConfig.enabled}
                      onCheckedChange={(enabled) => setAnalyticsConfig({ ...analyticsConfig, enabled })}
                    />
                    <Label htmlFor="analytics-enabled">Enable Analytics</Label>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="client-id">Client ID</Label>
                    <Input
                      id="client-id"
                      value={analyticsConfig.clientId}
                      onChange={(e) => setAnalyticsConfig({ ...analyticsConfig, clientId: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endpoint">Analytics Endpoint</Label>
                    <Input
                      id="endpoint"
                      value={analyticsConfig.endpoint}
                      onChange={(e) => setAnalyticsConfig({ ...analyticsConfig, endpoint: e.target.value })}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="debug-mode"
                      checked={analyticsConfig.debugMode}
                      onCheckedChange={(debugMode) => setAnalyticsConfig({ ...analyticsConfig, debugMode })}
                    />
                    <Label htmlFor="debug-mode">Debug Mode</Label>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="batch-processing"
                      checked={analyticsConfig.batchProcessing}
                      onCheckedChange={(batchProcessing) => setAnalyticsConfig({ ...analyticsConfig, batchProcessing })}
                    />
                    <Label htmlFor="batch-processing">Batch Processing</Label>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="batch-size">Batch Size</Label>
                    <Input
                      id="batch-size"
                      type="number"
                      value={analyticsConfig.batchSize}
                      onChange={(e) =>
                        setAnalyticsConfig({ ...analyticsConfig, batchSize: Number.parseInt(e.target.value) })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="batch-interval">Batch Interval (ms)</Label>
                    <Input
                      id="batch-interval"
                      type="number"
                      value={analyticsConfig.batchInterval}
                      onChange={(e) =>
                        setAnalyticsConfig({ ...analyticsConfig, batchInterval: Number.parseInt(e.target.value) })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-medium mb-4">Configuration Preview</h4>
                <pre className="bg-muted p-4 rounded-md text-sm overflow-x-auto">
                  {JSON.stringify(analyticsConfig, null, 2)}
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Rewards Drawer */}
      <RewardsDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        config={drawerConfig}
        userProfile={userProfile}
      />
    </div>
  )
}
