"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getAnalytics } from "./analytics-service"
import type { AnalyticsEvent, AnalyticsMetrics } from "./types"
import { EventName, EventCategory } from "./types"
import { Download, RefreshCw, BarChart3, PieChart, LineChart, Users } from "lucide-react"

interface AnalyticsDashboardProps {
  className?: string
  apiEndpoint?: string
  apiKey?: string
  clientId: string
  startDate?: Date
  endDate?: Date
}

export function AnalyticsDashboard({
  className,
  apiEndpoint,
  apiKey,
  clientId,
  startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Default to last 30 days
  endDate = new Date(),
}: AnalyticsDashboardProps) {
  const [metrics, setMetrics] = useState<AnalyticsMetrics | null>(null)
  const [events, setEvents] = useState<AnalyticsEvent[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("overview")
  const [dateRange, setDateRange] = useState({
    start: startDate.toISOString().split("T")[0],
    end: endDate.toISOString().split("T")[0],
  })
  const [filterCategory, setFilterCategory] = useState<string>("all")

  // Fetch analytics data
  const fetchAnalytics = async () => {
    setLoading(true)
    setError(null)

    try {
      // First try to get local events if available
      const analytics = getAnalytics()
      if (analytics) {
        setEvents(analytics.getEvents())
      }

      // If API endpoint is provided, fetch from server
      if (apiEndpoint) {
        const response = await fetch(`${apiEndpoint}/metrics`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(apiKey ? { "X-API-Key": apiKey } : {}),
          },
          body: JSON.stringify({
            clientId,
            startDate: dateRange.start,
            endDate: dateRange.end,
            filterCategory: filterCategory !== "all" ? filterCategory : undefined,
          }),
        })

        if (!response.ok) {
          throw new Error(`Failed to fetch analytics: ${response.statusText}`)
        }

        const data = await response.json()
        setMetrics(data.metrics)

        // If server returns events, use those instead of local events
        if (data.events) {
          setEvents(data.events)
        }
      } else {
        // If no API endpoint, calculate metrics from local events
        calculateMetrics(events)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch analytics")
      console.error("Analytics error:", err)
    } finally {
      setLoading(false)
    }
  }

  // Calculate metrics from events
  const calculateMetrics = (events: AnalyticsEvent[]) => {
    if (!events.length) return

    const uniqueUsers = new Set(events.filter((e) => e.userId).map((e) => e.userId))
    const uniqueSessions = new Set(events.map((e) => e.sessionId))

    const sessionStarts = events.filter((e) => e.eventName === EventName.SESSION_START)
    const sessionEnds = events.filter((e) => e.eventName === EventName.SESSION_END)

    let totalSessionDuration = 0
    sessionEnds.forEach((endEvent) => {
      const startEvent = sessionStarts.find((e) => e.sessionId === endEvent.sessionId)
      if (startEvent) {
        totalSessionDuration += endEvent.timestamp - startEvent.timestamp
      }
    })

    const averageSessionDuration = sessionEnds.length ? totalSessionDuration / sessionEnds.length : 0

    // Count events by name
    const eventBreakdown: Record<string, number> = {}
    events.forEach((event) => {
      eventBreakdown[event.eventName] = (eventBreakdown[event.eventName] || 0) + 1
    })

    // Calculate reward metrics
    const rewardViews = events.filter((e) => e.eventName === EventName.REWARD_VIEW)
    const rewardClaims = events.filter((e) => e.eventName === EventName.REWARD_CLAIM_SUCCESS)

    const rewardMetrics: Record<string, { views: number; claims: number }> = {}

    rewardViews.forEach((event) => {
      const rewardId = event.properties?.rewardId
      if (rewardId) {
        if (!rewardMetrics[rewardId]) {
          rewardMetrics[rewardId] = { views: 0, claims: 0 }
        }
        rewardMetrics[rewardId].views++
      }
    })

    rewardClaims.forEach((event) => {
      const rewardId = event.properties?.rewardId
      if (rewardId) {
        if (!rewardMetrics[rewardId]) {
          rewardMetrics[rewardId] = { views: 0, claims: 0 }
        }
        rewardMetrics[rewardId].claims++
      }
    })

    // Calculate top rewards
    const topRewards = Object.entries(rewardMetrics)
      .map(([rewardId, { views, claims }]) => ({
        rewardId,
        views,
        claims,
        conversionRate: views > 0 ? claims / views : 0,
      }))
      .sort((a, b) => b.claims - a.claims)
      .slice(0, 10)

    // Calculate overall conversion rate
    const totalViews = rewardViews.length
    const totalClaims = rewardClaims.length
    const conversionRate = totalViews > 0 ? totalClaims / totalViews : 0

    setMetrics({
      totalEvents: events.length,
      uniqueUsers: uniqueUsers.size,
      sessionCount: uniqueSessions.size,
      averageSessionDuration,
      eventBreakdown,
      conversionRate,
      topRewards,
    })
  }

  // Export analytics data as CSV
  const exportCSV = () => {
    if (!events.length) return

    const headers = ["Event ID", "Session ID", "User ID", "Event Name", "Category", "Timestamp", "Properties"]
    const rows = events.map((event) => [
      event.eventId,
      event.sessionId,
      event.userId || "",
      event.eventName,
      event.category,
      new Date(event.timestamp).toISOString(),
      JSON.stringify(event.properties),
    ])

    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `rewards-drawer-analytics-${new Date().toISOString().split("T")[0]}.csv`
    link.click()
  }

  // Initial fetch
  useEffect(() => {
    fetchAnalytics()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Render overview metrics
  const renderOverview = () => {
    if (!metrics) return <div className="text-center py-8">No analytics data available</div>

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalEvents.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Unique Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.uniqueUsers.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.sessionCount.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg. Session Duration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatDuration(metrics.averageSessionDuration)}</div>
          </CardContent>
        </Card>

        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle>Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{(metrics.conversionRate * 100).toFixed(2)}%</div>
            <p className="text-sm text-muted-foreground">Percentage of reward views that resulted in claims</p>
          </CardContent>
        </Card>

        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle>Event Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex items-end justify-between gap-2">
              {Object.entries(metrics.eventBreakdown)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 6)
                .map(([eventName, count]) => (
                  <div key={eventName} className="flex flex-col items-center">
                    <div
                      className="bg-primary w-12 rounded-t-md"
                      style={{
                        height: `${Math.max(20, (count / metrics.totalEvents) * 200)}px`,
                      }}
                    />
                    <div className="text-xs mt-2 max-w-[60px] truncate" title={eventName}>
                      {formatEventName(eventName)}
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Render rewards metrics
  const renderRewards = () => {
    if (!metrics || !metrics.topRewards.length) {
      return <div className="text-center py-8">No reward analytics data available</div>
    }

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Rewards by Claims</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {metrics.topRewards.map((reward) => (
                <div key={reward.rewardId} className="flex items-center">
                  <div className="flex-1">
                    <div className="font-medium">{reward.rewardId}</div>
                    <div className="text-sm text-muted-foreground">
                      {reward.views} views • {reward.claims} claims
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{(reward.conversionRate * 100).toFixed(2)}%</div>
                    <div className="text-sm text-muted-foreground">conversion</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Render user metrics
  const renderUsers = () => {
    if (!metrics) return <div className="text-center py-8">No user analytics data available</div>

    // Group events by user
    const userEvents: Record<string, AnalyticsEvent[]> = {}
    events.forEach((event) => {
      if (event.userId) {
        if (!userEvents[event.userId]) {
          userEvents[event.userId] = []
        }
        userEvents[event.userId].push(event)
      }
    })

    // Calculate user metrics
    const userMetrics = Object.entries(userEvents)
      .map(([userId, events]) => {
        const sessionCount = new Set(events.map((e) => e.sessionId)).size
        const rewardViews = events.filter((e) => e.eventName === EventName.REWARD_VIEW).length
        const rewardClaims = events.filter((e) => e.eventName === EventName.REWARD_CLAIM_SUCCESS).length

        return {
          userId,
          eventCount: events.length,
          sessionCount,
          rewardViews,
          rewardClaims,
          conversionRate: rewardViews > 0 ? rewardClaims / rewardViews : 0,
        }
      })
      .sort((a, b) => b.eventCount - a.eventCount)

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Users by Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {userMetrics.slice(0, 10).map((user) => (
                <div key={user.userId} className="flex items-center">
                  <div className="flex-1">
                    <div className="font-medium">{user.userId}</div>
                    <div className="text-sm text-muted-foreground">
                      {user.sessionCount} sessions • {user.eventCount} events
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{user.rewardClaims}</div>
                    <div className="text-sm text-muted-foreground">claims</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Render raw events
  const renderEvents = () => {
    if (!events.length) return <div className="text-center py-8">No events recorded</div>

    return (
      <div className="space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Event</th>
                <th className="text-left p-2">Category</th>
                <th className="text-left p-2">User ID</th>
                <th className="text-left p-2">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {events.slice(0, 100).map((event) => (
                <tr key={event.eventId} className="border-b hover:bg-muted/50">
                  <td className="p-2">{formatEventName(event.eventName)}</td>
                  <td className="p-2">{event.category}</td>
                  <td className="p-2">{event.userId || "-"}</td>
                  <td className="p-2">{new Date(event.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {events.length > 100 && (
          <div className="text-center text-sm text-muted-foreground">Showing 100 of {events.length} events</div>
        )}
      </div>
    )
  }

  // Helper function to format event names
  const formatEventName = (name: string) => {
    return name.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
  }

  // Helper function to format duration
  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60

    return `${minutes}m ${remainingSeconds}s`
  }

  return (
    <div className={className}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold">Rewards Drawer Analytics</h2>
          <p className="text-muted-foreground">Track user engagement and reward performance</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="start-date" className="sr-only">
              Start Date
            </Label>
            <Input
              id="start-date"
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="w-auto"
            />

            <Label htmlFor="end-date" className="sr-only">
              End Date
            </Label>
            <Input
              id="end-date"
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className="w-auto"
            />
          </div>

          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {Object.values(EventCategory).map((category) => (
                <SelectItem key={category} value={category}>
                  {formatEventName(category)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={fetchAnalytics} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>

          <Button variant="outline" onClick={exportCSV} disabled={!events.length}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {error && <div className="bg-destructive/10 text-destructive p-4 rounded-md mb-6">{error}</div>}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">
            <BarChart3 className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="rewards">
            <PieChart className="h-4 w-4 mr-2" />
            Rewards
          </TabsTrigger>
          <TabsTrigger value="users">
            <Users className="h-4 w-4 mr-2" />
            Users
          </TabsTrigger>
          <TabsTrigger value="events">
            <LineChart className="h-4 w-4 mr-2" />
            Raw Events
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {renderOverview()}
        </TabsContent>

        <TabsContent value="rewards" className="space-y-6">
          {renderRewards()}
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          {renderUsers()}
        </TabsContent>

        <TabsContent value="events" className="space-y-6">
          {renderEvents()}
        </TabsContent>
      </Tabs>
    </div>
  )
}
