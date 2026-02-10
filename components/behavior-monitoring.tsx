"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Activity,
  Users,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
  Zap,
} from "lucide-react"
import { automatedSegmentService } from "@/lib/automated-segment-service"

export function BehaviorMonitoring() {
  const [isMonitoring, setIsMonitoring] = useState(false)
  const [realtimeUpdates, setRealtimeUpdates] = useState<
    Array<{
      id: string
      userId: string
      wallet: string
      action: string
      timestamp: string
      segmentChanges: string[]
    }>
  >([])

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isMonitoring) {
      interval = setInterval(() => {
        // Simulate real-time behavior updates
        const userId = `user-${Math.floor(Math.random() * 1000)}`
        automatedSegmentService.simulateUserActivity(userId)

        // Add to updates feed
        const newUpdate = {
          id: `update-${Date.now()}`,
          userId,
          wallet: `0x${Math.random().toString(16).substr(2, 8)}...`,
          action: ["transaction", "login", "campaign_join", "reward_claim"][Math.floor(Math.random() * 4)],
          timestamp: new Date().toISOString(),
          segmentChanges: Math.random() > 0.7 ? ["High-Value Users", "Power Users"] : [],
        }

        setRealtimeUpdates((prev) => [newUpdate, ...prev.slice(0, 19)]) // Keep last 20 updates
      }, 2000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isMonitoring])

  const behaviorMetrics = {
    totalUsers: 12450,
    activeUsers: 8920,
    segmentUpdates: 156,
    automationAccuracy: 94.2,
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Behavior Monitoring</h2>
          <p className="text-muted-foreground">Real-time monitoring of user behavior and automated segment updates</p>
        </div>
        <Button
          onClick={() => setIsMonitoring(!isMonitoring)}
          variant={isMonitoring ? "destructive" : "default"}
          className="gap-2"
        >
          {isMonitoring ? (
            <>
              <AlertCircle className="h-4 w-4" />
              Stop Monitoring
            </>
          ) : (
            <>
              <Activity className="h-4 w-4" />
              Start Monitoring
            </>
          )}
        </Button>
      </div>

      {/* Monitoring Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-blue-500" />
              <div className="text-sm font-medium">Total Users</div>
            </div>
            <div className="text-2xl font-bold">{behaviorMetrics.totalUsers.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">Being monitored</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4 text-green-500" />
              <div className="text-sm font-medium">Active Users</div>
            </div>
            <div className="text-2xl font-bold">{behaviorMetrics.activeUsers.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">Last 24 hours</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <RefreshCw className="h-4 w-4 text-orange-500" />
              <div className="text-sm font-medium">Segment Updates</div>
            </div>
            <div className="text-2xl font-bold">{behaviorMetrics.segmentUpdates}</div>
            <div className="text-xs text-muted-foreground">Today</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-purple-500" />
              <div className="text-sm font-medium">Accuracy</div>
            </div>
            <div className="text-2xl font-bold">{behaviorMetrics.automationAccuracy}%</div>
            <div className="text-xs text-muted-foreground">Automation accuracy</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="realtime" className="space-y-4">
        <TabsList>
          <TabsTrigger value="realtime">Real-time Updates</TabsTrigger>
          <TabsTrigger value="patterns">Behavior Patterns</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="realtime">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Live Activity Feed
                {isMonitoring && (
                  <Badge variant="default" className="gap-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    Live
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>Real-time user behavior updates and segment changes</CardDescription>
            </CardHeader>
            <CardContent>
              {!isMonitoring ? (
                <div className="text-center py-8">
                  <Activity className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-muted-foreground">Start monitoring to see real-time updates</p>
                </div>
              ) : realtimeUpdates.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-muted-foreground">Waiting for user activity...</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {realtimeUpdates.map((update) => (
                    <div key={update.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        <div>
                          <div className="font-medium">{update.wallet}</div>
                          <div className="text-sm text-muted-foreground">
                            {update.action.replace("_", " ")} • {new Date(update.timestamp).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        {update.segmentChanges.map((segment) => (
                          <Badge key={segment} variant="outline" className="text-xs">
                            {segment}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patterns">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Top Behavior Patterns</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { pattern: "High Activity", users: 1250, trend: "up", change: 12 },
                  { pattern: "Value Growth", users: 890, trend: "up", change: 8 },
                  { pattern: "Engagement Drop", users: 340, trend: "down", change: -5 },
                  { pattern: "New User Onboarding", users: 560, trend: "up", change: 15 },
                ].map((item) => (
                  <div key={item.pattern} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{item.pattern}</div>
                      <div className="text-sm text-muted-foreground">{item.users} users</div>
                    </div>
                    <div
                      className={`flex items-center gap-1 ${item.trend === "up" ? "text-green-600" : "text-red-600"}`}
                    >
                      {item.trend === "up" ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                      <span className="font-medium">{Math.abs(item.change)}%</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Segment Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { segment: "High-Value Users", accuracy: 96, updates: 45 },
                  { segment: "Power Users", accuracy: 94, updates: 67 },
                  { segment: "New Users", accuracy: 92, updates: 123 },
                  { segment: "Dormant Users", accuracy: 89, updates: 23 },
                ].map((item) => (
                  <div key={item.segment} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{item.segment}</div>
                      <div className="text-sm text-muted-foreground">{item.updates} updates</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={item.accuracy} className="flex-1" />
                      <span className="text-sm font-medium">{item.accuracy}%</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Processing Speed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1.2s</div>
                <div className="text-sm text-muted-foreground">Average processing time</div>
                <Progress value={85} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Memory Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">68%</div>
                <div className="text-sm text-muted-foreground">System memory usage</div>
                <Progress value={68} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Error Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0.3%</div>
                <div className="text-sm text-muted-foreground">Processing errors</div>
                <Progress value={3} className="mt-2" />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
