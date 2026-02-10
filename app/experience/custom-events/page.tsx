"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CustomEventsManager } from "@/components/embeddable-rewards-drawer/analytics/custom-events-manager"
import { RewardsDrawer } from "@/components/embeddable-rewards-drawer/rewards-drawer"
import type { CustomEventDefinition, RewardsDrawerConfig } from "@/components/embeddable-rewards-drawer/types"
import { Settings, Play, BarChart3, Zap } from "lucide-react"

export default function CustomEventsPage() {
  const [customEvents, setCustomEvents] = useState<CustomEventDefinition[]>([
    {
      id: "sample_event_1",
      name: "reward_claim_attempt",
      displayName: "Reward Claim Attempt",
      description: "Tracks when users attempt to claim rewards",
      category: "conversion",
      enabled: true,
      triggers: [
        {
          id: "trigger_1",
          type: "click" as any,
          selector: ".claim-button",
        },
      ],
      properties: [
        {
          id: "prop_1",
          name: "reward_id",
          displayName: "Reward ID",
          type: "string" as any,
          required: true,
          source: "dom_element" as any,
        },
        {
          id: "prop_2",
          name: "user_points",
          displayName: "User Points",
          type: "number" as any,
          required: false,
          source: "user_input" as any,
        },
      ],
      conditions: [],
      actions: [
        {
          id: "action_1",
          type: "track_event" as any,
          config: {
            eventName: "reward_claim_attempted",
          },
          enabled: true,
        },
      ],
      createdAt: "2024-01-15T10:00:00Z",
      updatedAt: "2024-01-15T10:00:00Z",
      createdBy: "admin",
      version: 1,
    },
  ])

  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  // Sample rewards drawer config
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
    branding: {},
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
      sections: [],
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
    analytics: {
      enabled: true,
      clientId: "demo-client-123",
      endpoint: "/api/analytics",
      debugMode: true,
      customDimensions: {
        customEvents: "enabled",
      },
    },
    responsive: {
      breakpoints: {
        mobile: 768,
        tablet: 1024,
        desktop: 1280,
      },
    },
  }

  // Event handlers
  const handleEventCreate = (event: CustomEventDefinition) => {
    setCustomEvents([...customEvents, event])
  }

  const handleEventUpdate = (updatedEvent: CustomEventDefinition) => {
    setCustomEvents(customEvents.map((event) => (event.id === updatedEvent.id ? updatedEvent : event)))
  }

  const handleEventDelete = (eventId: string) => {
    setCustomEvents(customEvents.filter((event) => event.id !== eventId))
  }

  const handleEventTest = (event: CustomEventDefinition) => {
    console.log("Testing event:", event)
    // Here you would implement the actual event testing logic
  }

  const handleEventsExport = (events: CustomEventDefinition[]) => {
    const dataStr = JSON.stringify(events, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `custom-events-${new Date().toISOString().split("T")[0]}.json`
    link.click()
  }

  const handleEventsImport = (events: CustomEventDefinition[]) => {
    setCustomEvents([...customEvents, ...events])
  }

  const enabledEvents = customEvents.filter((event) => event.enabled)
  const totalTriggers = customEvents.reduce((sum, event) => sum + event.triggers.length, 0)
  const totalProperties = customEvents.reduce((sum, event) => sum + event.properties.length, 0)

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Custom Event Builder</h1>
          <p className="text-muted-foreground">Create and manage custom analytics events with a visual interface</p>
        </div>

        <Button onClick={() => setIsDrawerOpen(true)}>
          <Play className="h-4 w-4 mr-2" />
          Test with Drawer
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Total Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customEvents.length}</div>
            <p className="text-xs text-muted-foreground">{enabledEvents.length} enabled</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Total Triggers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTriggers}</div>
            <p className="text-xs text-muted-foreground">Across all events</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Total Properties
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProperties}</div>
            <p className="text-xs text-muted-foreground">Data points captured</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{new Set(customEvents.map((event) => event.category)).size}</div>
            <p className="text-xs text-muted-foreground">Event categories</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="manager" className="space-y-6">
        <TabsList>
          <TabsTrigger value="manager">Event Manager</TabsTrigger>
          <TabsTrigger value="documentation">Documentation</TabsTrigger>
        </TabsList>

        <TabsContent value="manager" className="space-y-6">
          <CustomEventsManager
            events={customEvents}
            onEventCreate={handleEventCreate}
            onEventUpdate={handleEventUpdate}
            onEventDelete={handleEventDelete}
            onEventTest={handleEventTest}
            onEventsExport={handleEventsExport}
            onEventsImport={handleEventsImport}
          />
        </TabsContent>

        <TabsContent value="documentation" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Getting Started</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">1. Create Your First Event</h4>
                  <p className="text-sm text-muted-foreground">
                    Use the Event Manager to create custom events that track specific user interactions in your
                    application.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">2. Define Triggers</h4>
                  <p className="text-sm text-muted-foreground">
                    Set up triggers to specify when your event should fire - on clicks, form submissions, page loads, or
                    custom events.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">3. Configure Properties</h4>
                  <p className="text-sm text-muted-foreground">
                    Add properties to capture additional data when the event fires, such as user information, element
                    attributes, or custom values.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">4. Set Conditions</h4>
                  <p className="text-sm text-muted-foreground">
                    Define conditions to control when events should be tracked based on user properties, session data,
                    or other criteria.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Event Templates</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Badge variant="secondary">Button Click</Badge>
                  <p className="text-sm text-muted-foreground">Track clicks on buttons and interactive elements</p>
                </div>
                <div className="space-y-2">
                  <Badge variant="secondary">Form Submission</Badge>
                  <p className="text-sm text-muted-foreground">Monitor form submissions and capture form data</p>
                </div>
                <div className="space-y-2">
                  <Badge variant="secondary">Page Scroll</Badge>
                  <p className="text-sm text-muted-foreground">Measure user engagement through scroll tracking</p>
                </div>
                <div className="space-y-2">
                  <Badge variant="secondary">Video Play</Badge>
                  <p className="text-sm text-muted-foreground">Track video interactions and engagement</p>
                </div>
                <div className="space-y-2">
                  <Badge variant="secondary">Download Click</Badge>
                  <p className="text-sm text-muted-foreground">Monitor file downloads and resource access</p>
                </div>
                <div className="space-y-2">
                  <Badge variant="secondary">Error Tracking</Badge>
                  <p className="text-sm text-muted-foreground">Capture JavaScript errors and exceptions</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Rewards Drawer for Testing */}
      <RewardsDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        config={drawerConfig}
        userProfile={{
          id: "user-123",
          username: "demo_user",
          displayName: "Demo User",
          avatar: "/placeholder.svg?height=40&width=40&text=DU",
          points: 1250,
          level: 5,
          rank: 3,
          badges: ["early-adopter"],
          claimedRewards: [],
        }}
      />
    </div>
  )
}
