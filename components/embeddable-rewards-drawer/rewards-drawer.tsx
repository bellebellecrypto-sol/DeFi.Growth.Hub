"use client"

import type React from "react"
import { useState, useEffect, useCallback, useMemo } from "react"
import { X, Trophy, Gift, ChevronDown, Loader2, AlertCircle, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"
import type { RewardsDrawerConfig, LeaderboardEntry, UserProfile, ClaimSection } from "./types"
import { useAnalytics } from "./analytics/use-analytics"

interface RewardsDrawerProps {
  isOpen: boolean
  onClose: () => void
  config: RewardsDrawerConfig
  userProfile?: UserProfile
  className?: string
}

export function RewardsDrawer({ isOpen, onClose, config, userProfile, className }: RewardsDrawerProps) {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([])
  const [claimsData, setClaimsData] = useState<ClaimSection[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("leaderboard")

  // Initialize analytics if enabled
  const analyticsConfig = useMemo(() => {
    if (!config.analytics?.enabled) return undefined

    return {
      clientId: config.analytics.clientId,
      endpoint: config.analytics.endpoint,
      debugMode: config.analytics.debugMode,
      batchProcessing: config.analytics.batchProcessing,
      batchSize: config.analytics.batchSize,
      batchInterval: config.analytics.batchInterval,
      samplingRate: config.analytics.samplingRate,
      excludeEvents: config.analytics.excludeEvents,
      appVersion: "1.0.0", // You can make this configurable
    }
  }, [config.analytics])

  const { trackEvent, setUser, EventName, EventCategory } = useAnalytics(analyticsConfig)

  // Generate CSS variables from config
  const cssVariables = useMemo(() => {
    const { colors, typography, borderRadius, shadows } = config.theme
    return {
      "--rewards-primary": colors.primary,
      "--rewards-secondary": colors.secondary,
      "--rewards-background": colors.background,
      "--rewards-surface": colors.surface,
      "--rewards-text": colors.text,
      "--rewards-text-secondary": colors.textSecondary,
      "--rewards-accent": colors.accent,
      "--rewards-success": colors.success,
      "--rewards-warning": colors.warning,
      "--rewards-error": colors.error,
      "--rewards-border": colors.border,
      "--rewards-font-family": typography.fontFamily,
      "--rewards-border-radius": borderRadius,
      "--rewards-shadow-sm": shadows.sm,
      "--rewards-shadow-md": shadows.md,
      "--rewards-shadow-lg": shadows.lg,
    } as React.CSSProperties
  }, [config.theme])

  // Track drawer open/close
  useEffect(() => {
    if (isOpen) {
      trackEvent(EventName.DRAWER_OPEN, {
        position: config.behavior.position,
        width: config.behavior.width,
        initialTab: activeTab,
      })

      // Set user if profile is available
      if (userProfile) {
        setUser(userProfile.id, {
          username: userProfile.username,
          displayName: userProfile.displayName,
          points: userProfile.points,
          level: userProfile.level,
          rank: userProfile.rank,
        })
      }
    } else {
      trackEvent(EventName.DRAWER_CLOSE)
    }
  }, [isOpen, activeTab, config.behavior.position, config.behavior.width, trackEvent, userProfile, setUser])

  // Track tab changes
  useEffect(() => {
    if (isOpen && activeTab) {
      trackEvent(EventName.TAB_CHANGE, { from: activeTab, to: activeTab })
    }
  }, [activeTab, isOpen, trackEvent])

  // Fetch data
  const fetchData = useCallback(async () => {
    if (!isOpen) return

    setLoading(true)
    setError(null)

    try {
      const headers = {
        "Content-Type": "application/json",
        ...config.api.headers,
        ...config.api.authentication?.customHeaders,
      }

      if (config.api.authentication?.type === "bearer" && config.api.authentication.token) {
        headers.Authorization = `Bearer ${config.api.authentication.token}`
      } else if (config.api.authentication?.type === "api-key" && config.api.authentication.apiKey) {
        headers["X-API-Key"] = config.api.authentication.apiKey
      }

      const [leaderboardResponse, claimsResponse] = await Promise.all([
        config.leaderboard.enabled
          ? fetch(`${config.api.baseUrl}${config.api.endpoints.leaderboard}`, { headers })
          : Promise.resolve(null),
        config.claims.enabled
          ? fetch(`${config.api.baseUrl}${config.api.endpoints.claims}`, { headers })
          : Promise.resolve(null),
      ])

      if (leaderboardResponse && config.leaderboard.enabled) {
        const leaderboardData = await leaderboardResponse.json()
        setLeaderboardData(leaderboardData.slice(0, config.leaderboard.maxEntries))

        // Track leaderboard view
        trackEvent(
          EventName.LEADERBOARD_VIEW,
          {
            entries: leaderboardData.length,
            maxEntries: config.leaderboard.maxEntries,
            sortBy: config.leaderboard.sortBy,
            sortOrder: config.leaderboard.sortOrder,
          },
          EventCategory.LEADERBOARD,
        )
      }

      if (claimsResponse && config.claims.enabled) {
        const claimsData = await claimsResponse.json()
        setClaimsData(claimsData)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load data"
      setError(errorMessage)

      // Track error
      trackEvent(
        EventName.ERROR,
        {
          message: errorMessage,
          context: "fetchData",
        },
        EventCategory.SYSTEM,
      )
    } finally {
      setLoading(false)
    }
  }, [isOpen, config, trackEvent, EventName, EventCategory])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Handle claim action
  const handleClaim = async (claimId: string, sectionId: string, itemTitle: string) => {
    // Track claim start
    trackEvent(
      EventName.REWARD_CLAIM_START,
      {
        rewardId: claimId,
        sectionId,
        title: itemTitle,
      },
      EventCategory.REWARDS,
    )

    try {
      const headers = {
        "Content-Type": "application/json",
        ...config.api.headers,
        ...config.api.authentication?.customHeaders,
      }

      if (config.api.authentication?.type === "bearer" && config.api.authentication.token) {
        headers.Authorization = `Bearer ${config.api.authentication.token}`
      }

      const response = await fetch(`${config.api.baseUrl}${config.api.endpoints.claimReward}`, {
        method: "POST",
        headers,
        body: JSON.stringify({ claimId, userId: userProfile?.id }),
      })

      if (response.ok) {
        // Track successful claim
        trackEvent(
          EventName.REWARD_CLAIM_SUCCESS,
          {
            rewardId: claimId,
            sectionId,
            title: itemTitle,
            userId: userProfile?.id,
          },
          EventCategory.REWARDS,
        )

        // Refresh data after successful claim
        fetchData()
      } else {
        // Track failed claim
        trackEvent(
          EventName.REWARD_CLAIM_FAIL,
          {
            rewardId: claimId,
            sectionId,
            title: itemTitle,
            userId: userProfile?.id,
            status: response.status,
            statusText: response.statusText,
          },
          EventCategory.REWARDS,
        )
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to claim reward"

      // Track error
      trackEvent(
        EventName.REWARD_CLAIM_FAIL,
        {
          rewardId: claimId,
          sectionId,
          title: itemTitle,
          userId: userProfile?.id,
          error: errorMessage,
        },
        EventCategory.REWARDS,
      )

      console.error("Failed to claim reward:", err)
    }
  }

  // Handle section expand/collapse
  const handleSectionToggle = (sectionId: string, isExpanded: boolean) => {
    trackEvent(
      isExpanded ? EventName.REWARD_SECTION_EXPAND : EventName.REWARD_SECTION_COLLAPSE,
      { sectionId },
      EventCategory.REWARDS,
    )
  }

  // Track reward view
  const trackRewardView = (rewardId: string, sectionId: string, title: string) => {
    trackEvent(
      EventName.REWARD_VIEW,
      {
        rewardId,
        sectionId,
        title,
      },
      EventCategory.REWARDS,
    )
  }

  // Track leaderboard scroll
  const handleLeaderboardScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const target = e.currentTarget
      const scrollPercentage = (target.scrollTop / (target.scrollHeight - target.clientHeight)) * 100

      // Only track at certain thresholds to avoid excessive events
      if (scrollPercentage >= 50 && scrollPercentage <= 55) {
        trackEvent(
          EventName.LEADERBOARD_SCROLL,
          {
            percentage: Math.round(scrollPercentage),
          },
          EventCategory.LEADERBOARD,
        )
      } else if (scrollPercentage >= 90) {
        trackEvent(
          EventName.LEADERBOARD_SCROLL,
          {
            percentage: Math.round(scrollPercentage),
          },
          EventCategory.LEADERBOARD,
        )
      }
    },
    [trackEvent, EventName, EventCategory],
  )

  // Render leaderboard
  const renderLeaderboard = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Trophy className="h-5 w-5 text-[var(--rewards-accent)]" />
        <h3 className="text-lg font-semibold text-[var(--rewards-text)]">{config.text.leaderboard.title}</h3>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-[var(--rewards-accent)]" />
          <span className="ml-2 text-[var(--rewards-text-secondary)]">{config.text.leaderboard.loadingMessage}</span>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center py-8 text-[var(--rewards-error)]">
          <AlertCircle className="h-5 w-5 mr-2" />
          {config.text.leaderboard.errorMessage}
        </div>
      ) : leaderboardData.length === 0 ? (
        <div className="text-center py-8 text-[var(--rewards-text-secondary)]">
          {config.text.leaderboard.noDataMessage}
        </div>
      ) : (
        <ScrollArea className="h-[400px]" onScroll={handleLeaderboardScroll}>
          <div className="space-y-2">
            {leaderboardData.map((entry, index) => (
              <Card
                key={entry.id}
                className={cn(
                  "p-3 transition-colors",
                  entry.isCurrentUser && config.leaderboard.highlightCurrentUser
                    ? "bg-[var(--rewards-accent)]/10 border-[var(--rewards-accent)]"
                    : "bg-[var(--rewards-surface)] border-[var(--rewards-border)]",
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[var(--rewards-primary)] text-white text-sm font-bold">
                    {entry.rank}
                  </div>

                  {config.leaderboard.displayFields.avatar && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={entry.avatar || "/placeholder.svg"} alt={entry.username} />
                      <AvatarFallback>{entry.username.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  )}

                  <div className="flex-1 min-w-0">
                    {config.leaderboard.displayFields.username && (
                      <p className="text-sm font-medium text-[var(--rewards-text)] truncate">
                        {entry.displayName || entry.username}
                        {entry.isCurrentUser && (
                          <span className="ml-2 text-xs text-[var(--rewards-accent)]">
                            ({config.text.leaderboard.youLabel})
                          </span>
                        )}
                      </p>
                    )}
                  </div>

                  {config.leaderboard.displayFields.badge && entry.badge && (
                    <Badge variant="secondary" className="text-xs" style={{ backgroundColor: entry.badge.color }}>
                      {entry.badge.name}
                    </Badge>
                  )}

                  {config.leaderboard.displayFields.points && (
                    <div className="text-right">
                      <p className="text-sm font-bold text-[var(--rewards-text)]">{entry.points.toLocaleString()}</p>
                      <p className="text-xs text-[var(--rewards-text-secondary)]">
                        {config.text.leaderboard.pointsLabel}
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  )

  // Render claims section
  const renderClaimsSection = (section: ClaimSection) => (
    <Collapsible
      key={section.id}
      defaultOpen={section.defaultExpanded}
      onOpenChange={(isOpen) => handleSectionToggle(section.id, isOpen)}
    >
      <div className="space-y-4">
        {section.showHeader && (
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between p-0 h-auto text-left">
              <div>
                <h4 className="text-base font-semibold text-[var(--rewards-text)]">{section.title}</h4>
                {section.description && (
                  <p className="text-sm text-[var(--rewards-text-secondary)]">{section.description}</p>
                )}
              </div>
              {section.collapsible && <ChevronDown className="h-4 w-4" />}
            </Button>
          </CollapsibleTrigger>
        )}

        <CollapsibleContent>
          <div
            className={cn("gap-4", section.displayMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2" : "space-y-4")}
          >
            {section.items.map((item) => (
              <Card
                key={item.id}
                className="bg-[var(--rewards-surface)] border-[var(--rewards-border)]"
                onMouseEnter={() => trackRewardView(item.id, section.id, item.title)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    {item.image && (
                      <img
                        src={item.image.url || "/placeholder.svg"}
                        alt={item.image.alt}
                        className="w-12 h-12 rounded-lg object-cover"
                        style={{
                          width: item.image.width || 48,
                          height: item.image.height || 48,
                        }}
                      />
                    )}

                    <div className="flex-1 min-w-0">
                      <h5 className="font-medium text-[var(--rewards-text)] truncate">{item.title}</h5>
                      <p className="text-sm text-[var(--rewards-text-secondary)] mt-1">{item.description}</p>

                      {item.requirements.points && (
                        <p className="text-xs text-[var(--rewards-accent)] mt-2">
                          Requires {item.requirements.points} points
                        </p>
                      )}

                      <div className="mt-3">
                        <Button
                          size="sm"
                          disabled={item.status !== "available"}
                          onClick={() => handleClaim(item.id, section.id, item.title)}
                          className={cn(
                            "w-full",
                            item.status === "claimed" && "bg-[var(--rewards-success)]",
                            item.status === "unavailable" && "bg-[var(--rewards-error)]",
                          )}
                        >
                          {item.status === "available" && (
                            <>
                              <Gift className="h-4 w-4 mr-2" />
                              {config.text.claims.claimButton}
                            </>
                          )}
                          {item.status === "claimed" && (
                            <>
                              <Check className="h-4 w-4 mr-2" />
                              {config.text.claims.claimedButton}
                            </>
                          )}
                          {item.status === "unavailable" && config.text.claims.unavailableButton}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  )

  // Render claims
  const renderClaims = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Gift className="h-5 w-5 text-[var(--rewards-accent)]" />
        <h3 className="text-lg font-semibold text-[var(--rewards-text)]">{config.text.claims.title}</h3>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-[var(--rewards-accent)]" />
          <span className="ml-2 text-[var(--rewards-text-secondary)]">{config.text.claims.loadingMessage}</span>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center py-8 text-[var(--rewards-error)]">
          <AlertCircle className="h-5 w-5 mr-2" />
          {config.text.claims.errorMessage}
        </div>
      ) : claimsData.length === 0 ? (
        <div className="text-center py-8 text-[var(--rewards-text-secondary)]">
          {config.text.claims.noClaimsMessage}
        </div>
      ) : (
        <ScrollArea className="h-[400px]">
          <div className="space-y-6">{claimsData.map(renderClaimsSection)}</div>
        </ScrollArea>
      )}
    </div>
  )

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      {config.behavior.overlay && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={config.behavior.closeOnOverlayClick ? onClose : undefined}
        />
      )}

      {/* Drawer */}
      <div
        className={cn(
          "fixed top-0 z-50 h-full bg-[var(--rewards-background)] shadow-[var(--rewards-shadow-lg)] transition-transform duration-300 ease-in-out",
          config.behavior.position === "right" ? "right-0" : "left-0",
          className,
        )}
        style={{
          ...cssVariables,
          width: config.behavior.width,
          maxWidth: config.behavior.maxWidth,
        }}
      >
        {/* Custom CSS */}
        {config.theme.customCSS && <style dangerouslySetInnerHTML={{ __html: config.theme.customCSS }} />}

        {/* Background Image */}
        {config.branding.backgroundImage && (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${config.branding.backgroundImage.url})`,
              backgroundSize: config.branding.backgroundImage.size,
              backgroundPosition: config.branding.backgroundImage.position,
              opacity: config.branding.backgroundImage.opacity,
            }}
          />
        )}

        <div className="relative h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-[var(--rewards-border)]">
            <div className="flex items-center gap-3">
              {config.branding.logo && (
                <img
                  src={config.branding.logo.url || "/placeholder.svg"}
                  alt={config.branding.logo.alt}
                  width={config.branding.logo.width}
                  height={config.branding.logo.height}
                  className="object-contain"
                />
              )}
              <div>
                <h2 className="text-xl font-bold text-[var(--rewards-text)]">{config.text.drawer.title}</h2>
                {config.text.drawer.subtitle && (
                  <p className="text-sm text-[var(--rewards-text-secondary)]">{config.text.drawer.subtitle}</p>
                )}
              </div>
            </div>

            <Button variant="ghost" size="sm" onClick={onClose} className="text-[var(--rewards-text)]">
              <X className="h-4 w-4" />
              <span className="sr-only">{config.text.drawer.closeButton}</span>
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
              <TabsList className="grid w-full grid-cols-2 m-4 mb-0">
                {config.leaderboard.enabled && (
                  <TabsTrigger value="leaderboard" className="text-[var(--rewards-text)]">
                    <Trophy className="h-4 w-4 mr-2" />
                    Leaderboard
                  </TabsTrigger>
                )}
                {config.claims.enabled && (
                  <TabsTrigger value="claims" className="text-[var(--rewards-text)]">
                    <Gift className="h-4 w-4 mr-2" />
                    Rewards
                  </TabsTrigger>
                )}
              </TabsList>

              <div className="flex-1 overflow-hidden">
                {config.leaderboard.enabled && (
                  <TabsContent value="leaderboard" className="h-full m-0 p-4">
                    {renderLeaderboard()}
                  </TabsContent>
                )}

                {config.claims.enabled && (
                  <TabsContent value="claims" className="h-full m-0 p-4">
                    {renderClaims()}
                  </TabsContent>
                )}
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  )
}
