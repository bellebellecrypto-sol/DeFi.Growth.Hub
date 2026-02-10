"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RewardsDrawer } from "./rewards-drawer"
import { ConfigBuilder } from "./config-builder"
import type { RewardsDrawerConfig, UserProfile } from "./types"

// Default configuration
const defaultConfig: RewardsDrawerConfig = {
  theme: {
    mode: "light",
    colors: {
      primary: "#3b82f6",
      secondary: "#64748b",
      background: "#ffffff",
      surface: "#f8fafc",
      text: "#0f172a",
      textSecondary: "#64748b",
      accent: "#8b5cf6",
      success: "#10b981",
      warning: "#f59e0b",
      error: "#ef4444",
      border: "#e2e8f0",
    },
    typography: {
      fontFamily: "Inter, system-ui, sans-serif",
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
      url: "/placeholder.svg?height=32&width=32",
      alt: "Company Logo",
      width: 32,
      height: 32,
      position: "top-left",
    },
  },
  leaderboard: {
    enabled: true,
    title: "Leaderboard",
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
        title: "Discounts",
        description: "Save money on your next purchase",
        type: "discount",
        items: [
          {
            id: "discount-10",
            title: "10% Off",
            description: "Get 10% off your next order",
            value: "10%",
            requirements: { points: 100 },
            availability: { maxClaims: 100, currentClaims: 25 },
            status: "available",
            image: {
              url: "/placeholder.svg?height=48&width=48",
              alt: "Discount",
            },
          },
          {
            id: "discount-20",
            title: "20% Off",
            description: "Get 20% off your next order",
            value: "20%",
            requirements: { points: 250 },
            availability: { maxClaims: 50, currentClaims: 10 },
            status: "available",
            image: {
              url: "/placeholder.svg?height=48&width=48",
              alt: "Discount",
            },
          },
        ],
        displayMode: "grid",
        showHeader: true,
        collapsible: false,
        defaultExpanded: true,
      },
      {
        id: "freebies",
        title: "Free Items",
        description: "Claim free products and services",
        type: "freeItem",
        items: [
          {
            id: "free-shipping",
            title: "Free Shipping",
            description: "Free shipping on your next order",
            value: "Free",
            requirements: { points: 50 },
            availability: { maxClaims: 200, currentClaims: 150 },
            status: "available",
            image: {
              url: "/placeholder.svg?height=48&width=48",
              alt: "Free Shipping",
            },
          },
        ],
        displayMode: "list",
        showHeader: true,
        collapsible: true,
        defaultExpanded: true,
      },
    ],
    displayMode: "grid",
    itemsPerPage: 10,
    showPagination: true,
  },
  text: {
    drawer: {
      title: "Rewards Hub",
      subtitle: "Earn points and claim amazing rewards",
      closeButton: "Close",
    },
    leaderboard: {
      title: "Top Performers",
      noDataMessage: "No leaderboard data available",
      loadingMessage: "Loading leaderboard...",
      errorMessage: "Failed to load leaderboard",
      rankLabel: "Rank",
      pointsLabel: "Points",
      youLabel: "You",
    },
    claims: {
      title: "Available Rewards",
      noClaimsMessage: "No rewards available at the moment",
      claimButton: "Claim Reward",
      claimedButton: "Already Claimed",
      unavailableButton: "Not Available",
      requirementsNotMet: "Requirements not met",
      loadingMessage: "Loading rewards...",
      errorMessage: "Failed to load rewards",
    },
    general: {
      loading: "Loading...",
      error: "Something went wrong",
      retry: "Try Again",
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
    baseUrl: "https://api.example.com",
    endpoints: {
      leaderboard: "/leaderboard",
      claims: "/claims",
      userProfile: "/user/profile",
      claimReward: "/claim",
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

// Mock user profile
const mockUser: UserProfile = {
  id: "user-123",
  username: "johndoe",
  displayName: "John Doe",
  avatar: "/placeholder.svg?height=40&width=40",
  points: 1250,
  level: 5,
  rank: 3,
  badges: ["early-adopter", "top-contributor"],
  claimedRewards: ["discount-10"],
}

export function RewardsDrawerDemo() {
  const [config, setConfig] = useState<RewardsDrawerConfig>(defaultConfig)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [showConfig, setShowConfig] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Embeddable Rewards Drawer</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            A fully customizable and embeddable rewards drawer component with comprehensive configuration options for
            branding, functionality, and user experience.
          </p>
        </div>

        <div className="flex justify-center gap-4">
          <Button
            size="lg"
            onClick={() => setIsDrawerOpen(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            Open Rewards Drawer
          </Button>
          <Button size="lg" variant="outline" onClick={() => setShowConfig(!showConfig)}>
            {showConfig ? "Hide" : "Show"} Configuration
          </Button>
        </div>

        {showConfig && <ConfigBuilder onConfigChange={setConfig} onPreview={() => setIsDrawerOpen(true)} />}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>🎨 Customizable Theming</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>• Custom colors and typography</li>
                <li>• Light, dark, and custom themes</li>
                <li>• Advanced CSS customization</li>
                <li>• Responsive design</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>🖼️ Branding Integration</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>• Custom logo and images</li>
                <li>• Background customization</li>
                <li>• Flexible positioning</li>
                <li>• Brand consistency</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>🏆 Leaderboard Features</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>• Configurable rankings</li>
                <li>• User highlighting</li>
                <li>• Badge system</li>
                <li>• Real-time updates</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>🎁 Rewards System</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>• Multiple claim types</li>
                <li>• Requirement validation</li>
                <li>• Availability tracking</li>
                <li>• Custom sections</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>📝 Text Customization</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>• All text customizable</li>
                <li>• Multi-language support</li>
                <li>• Default fallbacks</li>
                <li>• Context-aware messages</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>⚙️ Easy Integration</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>• Simple embed code</li>
                <li>• API integration</li>
                <li>• Event callbacks</li>
                <li>• State persistence</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <RewardsDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          config={config}
          userProfile={mockUser}
        />
      </div>
    </div>
  )
}
