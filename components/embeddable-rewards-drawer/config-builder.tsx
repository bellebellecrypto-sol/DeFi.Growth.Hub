"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Copy, Download, Eye } from "lucide-react"
import type { RewardsDrawerConfig } from "./types"

interface ConfigBuilderProps {
  onConfigChange: (config: RewardsDrawerConfig) => void
  onPreview: () => void
}

export function ConfigBuilder({ onConfigChange, onPreview }: ConfigBuilderProps) {
  const [config, setConfig] = useState<RewardsDrawerConfig>({
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
    branding: {},
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
      sections: [],
      displayMode: "grid",
      itemsPerPage: 10,
      showPagination: true,
    },
    text: {
      drawer: {
        title: "Rewards",
        subtitle: "Earn points and claim rewards",
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
  })

  const updateConfig = (path: string, value: any) => {
    const keys = path.split(".")
    const newConfig = { ...config }
    let current = newConfig as any

    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]]
    }
    current[keys[keys.length - 1]] = value

    setConfig(newConfig)
    onConfigChange(newConfig)
  }

  const exportConfig = () => {
    const dataStr = JSON.stringify(config, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = "rewards-drawer-config.json"
    link.click()
  }

  const copyEmbedCode = () => {
    const embedCode = `
<!-- Rewards Drawer Embed Code -->
<div id="rewards-drawer-container"></div>
<script>
  window.RewardsDrawerConfig = ${JSON.stringify(config, null, 2)};
</script>
<script src="https://cdn.example.com/rewards-drawer.js"></script>
    `.trim()

    navigator.clipboard.writeText(embedCode)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Rewards Drawer Configuration</h2>
          <p className="text-muted-foreground">Customize your rewards drawer to match your brand and requirements</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onPreview}>
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button variant="outline" onClick={exportConfig}>
            <Download className="h-4 w-4 mr-2" />
            Export Config
          </Button>
          <Button onClick={copyEmbedCode}>
            <Copy className="h-4 w-4 mr-2" />
            Copy Embed Code
          </Button>
        </div>
      </div>

      <Tabs defaultValue="theme" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="theme">Theme</TabsTrigger>
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          <TabsTrigger value="claims">Claims</TabsTrigger>
          <TabsTrigger value="text">Text</TabsTrigger>
          <TabsTrigger value="behavior">Behavior</TabsTrigger>
        </TabsList>

        <TabsContent value="theme" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Theme Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="theme-mode">Theme Mode</Label>
                  <Select value={config.theme.mode} onValueChange={(value) => updateConfig("theme.mode", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="font-family">Font Family</Label>
                  <Input
                    id="font-family"
                    value={config.theme.typography.fontFamily}
                    onChange={(e) => updateConfig("theme.typography.fontFamily", e.target.value)}
                  />
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="text-sm font-medium mb-4">Colors</h4>
                <div className="grid grid-cols-3 gap-4">
                  {Object.entries(config.theme.colors).map(([key, value]) => (
                    <div key={key}>
                      <Label htmlFor={`color-${key}`} className="capitalize">
                        {key.replace(/([A-Z])/g, " $1").trim()}
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          id={`color-${key}`}
                          type="color"
                          value={value}
                          onChange={(e) => updateConfig(`theme.colors.${key}`, e.target.value)}
                          className="w-16 h-10 p-1"
                        />
                        <Input
                          value={value}
                          onChange={(e) => updateConfig(`theme.colors.${key}`, e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="custom-css">Custom CSS</Label>
                <Textarea
                  id="custom-css"
                  placeholder="Add custom CSS rules..."
                  value={config.theme.customCSS || ""}
                  onChange={(e) => updateConfig("theme.customCSS", e.target.value)}
                  rows={6}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="branding" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Branding & Images</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="text-sm font-medium mb-4">Logo Configuration</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="logo-url">Logo URL</Label>
                    <Input
                      id="logo-url"
                      placeholder="https://example.com/logo.png"
                      value={config.branding.logo?.url || ""}
                      onChange={(e) => updateConfig("branding.logo.url", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="logo-alt">Alt Text</Label>
                    <Input
                      id="logo-alt"
                      placeholder="Company Logo"
                      value={config.branding.logo?.alt || ""}
                      onChange={(e) => updateConfig("branding.logo.alt", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="logo-width">Width (px)</Label>
                    <Input
                      id="logo-width"
                      type="number"
                      value={config.branding.logo?.width || 32}
                      onChange={(e) => updateConfig("branding.logo.width", Number.parseInt(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="logo-height">Height (px)</Label>
                    <Input
                      id="logo-height"
                      type="number"
                      value={config.branding.logo?.height || 32}
                      onChange={(e) => updateConfig("branding.logo.height", Number.parseInt(e.target.value))}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="text-sm font-medium mb-4">Background Image</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="bg-url">Background URL</Label>
                    <Input
                      id="bg-url"
                      placeholder="https://example.com/background.jpg"
                      value={config.branding.backgroundImage?.url || ""}
                      onChange={(e) => updateConfig("branding.backgroundImage.url", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="bg-size">Background Size</Label>
                    <Select
                      value={config.branding.backgroundImage?.size || "cover"}
                      onValueChange={(value) => updateConfig("branding.backgroundImage.size", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cover">Cover</SelectItem>
                        <SelectItem value="contain">Contain</SelectItem>
                        <SelectItem value="auto">Auto</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="bg-opacity">Opacity</Label>
                    <Input
                      id="bg-opacity"
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={config.branding.backgroundImage?.opacity || 1}
                      onChange={(e) =>
                        updateConfig("branding.backgroundImage.opacity", Number.parseFloat(e.target.value))
                      }
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Leaderboard Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-2">
                <Switch
                  id="leaderboard-enabled"
                  checked={config.leaderboard.enabled}
                  onCheckedChange={(checked) => updateConfig("leaderboard.enabled", checked)}
                />
                <Label htmlFor="leaderboard-enabled">Enable Leaderboard</Label>
              </div>

              {config.leaderboard.enabled && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="leaderboard-title">Title</Label>
                      <Input
                        id="leaderboard-title"
                        value={config.leaderboard.title}
                        onChange={(e) => updateConfig("leaderboard.title", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="max-entries">Max Entries</Label>
                      <Input
                        id="max-entries"
                        type="number"
                        value={config.leaderboard.maxEntries}
                        onChange={(e) => updateConfig("leaderboard.maxEntries", Number.parseInt(e.target.value))}
                      />
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-4">Display Fields</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(config.leaderboard.displayFields).map(([key, value]) => (
                        <div key={key} className="flex items-center space-x-2">
                          <Switch
                            id={`display-${key}`}
                            checked={value}
                            onCheckedChange={(checked) => updateConfig(`leaderboard.displayFields.${key}`, checked)}
                          />
                          <Label htmlFor={`display-${key}`} className="capitalize">
                            {key}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="claims" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Claims & Rewards Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-2">
                <Switch
                  id="claims-enabled"
                  checked={config.claims.enabled}
                  onCheckedChange={(checked) => updateConfig("claims.enabled", checked)}
                />
                <Label htmlFor="claims-enabled">Enable Claims</Label>
              </div>

              {config.claims.enabled && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="claims-title">Title</Label>
                      <Input
                        id="claims-title"
                        value={config.claims.title}
                        onChange={(e) => updateConfig("claims.title", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="display-mode">Display Mode</Label>
                      <Select
                        value={config.claims.displayMode}
                        onValueChange={(value) => updateConfig("claims.displayMode", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="grid">Grid</SelectItem>
                          <SelectItem value="list">List</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="text" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Text Customization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="text-sm font-medium mb-4">Drawer Text</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="drawer-title">Title</Label>
                    <Input
                      id="drawer-title"
                      value={config.text.drawer.title}
                      onChange={(e) => updateConfig("text.drawer.title", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="drawer-subtitle">Subtitle</Label>
                    <Input
                      id="drawer-subtitle"
                      value={config.text.drawer.subtitle || ""}
                      onChange={(e) => updateConfig("text.drawer.subtitle", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="text-sm font-medium mb-4">Button Labels</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="claim-button">Claim Button</Label>
                    <Input
                      id="claim-button"
                      value={config.text.claims.claimButton}
                      onChange={(e) => updateConfig("text.claims.claimButton", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="claimed-button">Claimed Button</Label>
                    <Input
                      id="claimed-button"
                      value={config.text.claims.claimedButton}
                      onChange={(e) => updateConfig("text.claims.claimedButton", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="unavailable-button">Unavailable Button</Label>
                    <Input
                      id="unavailable-button"
                      value={config.text.claims.unavailableButton}
                      onChange={(e) => updateConfig("text.claims.unavailableButton", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="behavior" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Behavior & Layout</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="position">Position</Label>
                  <Select
                    value={config.behavior.position}
                    onValueChange={(value) => updateConfig("behavior.position", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="left">Left</SelectItem>
                      <SelectItem value="right">Right</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="width">Width (px)</Label>
                  <Input
                    id="width"
                    type="number"
                    value={config.behavior.width}
                    onChange={(e) => updateConfig("behavior.width", Number.parseInt(e.target.value))}
                  />
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { key: "overlay", label: "Show Overlay" },
                  { key: "closeOnOverlayClick", label: "Close on Overlay Click" },
                  { key: "closeOnEscape", label: "Close on Escape Key" },
                  { key: "animations", label: "Enable Animations" },
                  { key: "persistState", label: "Persist State" },
                ].map(({ key, label }) => (
                  <div key={key} className="flex items-center space-x-2">
                    <Switch
                      id={key}
                      checked={config.behavior[key as keyof typeof config.behavior] as boolean}
                      onCheckedChange={(checked) => updateConfig(`behavior.${key}`, checked)}
                    />
                    <Label htmlFor={key}>{label}</Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Integration Code</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label>HTML Embed Code</Label>
              <Textarea
                readOnly
                value={`<!-- Rewards Drawer Embed Code -->
<div id="rewards-drawer-container"></div>
<script>
  window.RewardsDrawerConfig = ${JSON.stringify(config, null, 2)};
</script>
<script src="https://cdn.example.com/rewards-drawer.js"></script>`}
                rows={8}
                className="font-mono text-sm"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={copyEmbedCode}>
                <Copy className="h-4 w-4 mr-2" />
                Copy Embed Code
              </Button>
              <Badge variant="secondary">Size: {JSON.stringify(config).length} bytes</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
