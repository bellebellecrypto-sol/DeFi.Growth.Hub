"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Brain,
  Activity,
  Users,
  TrendingUp,
  TrendingDown,
  Settings,
  Play,
  Pause,
  MoreHorizontal,
  RefreshCw,
  AlertTriangle,
  Clock,
  Zap,
  BarChart3,
  Target,
} from "lucide-react"
import { automatedSegmentService, type AutomatedSegment } from "@/lib/automated-segment-service"
import { AutomatedSegmentBuilder } from "./automated-segment-builder"

export function AutomatedSegmentDashboard() {
  const [segments, setSegments] = useState<AutomatedSegment[]>([])
  const [isBuilderOpen, setIsBuilderOpen] = useState(false)
  const [selectedSegment, setSelectedSegment] = useState<AutomatedSegment | null>(null)

  useEffect(() => {
    setSegments(automatedSegmentService.getAutomatedSegments())
  }, [])

  const toggleSegmentStatus = (segmentId: string) => {
    const segment = segments.find((s) => s.id === segmentId)
    if (segment) {
      const updated = automatedSegmentService.updateAutomatedSegment(segmentId, {
        isActive: !segment.isActive,
      })
      if (updated) {
        setSegments(segments.map((s) => (s.id === segmentId ? updated : s)))
      }
    }
  }

  const getSegmentMetrics = (segmentId: string) => {
    return automatedSegmentService.getSegmentMetrics(segmentId)
  }

  const getStatusIcon = (segment: AutomatedSegment) => {
    if (!segment.isActive) return <Pause className="h-4 w-4 text-muted-foreground" />
    return <Play className="h-4 w-4 text-green-500" />
  }

  const getUpdateFrequencyIcon = (frequency: string) => {
    switch (frequency) {
      case "realtime":
        return <Zap className="h-3 w-3" />
      case "hourly":
        return <Clock className="h-3 w-3" />
      case "daily":
        return <RefreshCw className="h-3 w-3" />
      case "weekly":
        return <Activity className="h-3 w-3" />
      default:
        return <Clock className="h-3 w-3" />
    }
  }

  const handleSegmentCreated = (newSegment: AutomatedSegment) => {
    setSegments([...segments, newSegment])
    setIsBuilderOpen(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Automated Segments</h1>
          <p className="text-muted-foreground">
            AI-powered segments that automatically update based on user behavior patterns
          </p>
        </div>
        <Dialog open={isBuilderOpen} onOpenChange={setIsBuilderOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Brain className="h-4 w-4" />
              Create Automated Segment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Automated Segment</DialogTitle>
              <DialogDescription>
                Build a segment that automatically updates based on user behavior patterns
              </DialogDescription>
            </DialogHeader>
            <AutomatedSegmentBuilder onSegmentCreated={handleSegmentCreated} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Brain className="h-4 w-4 text-blue-500" />
              <div className="text-sm font-medium">Active Segments</div>
            </div>
            <div className="text-2xl font-bold">{segments.filter((s) => s.isActive).length}</div>
            <div className="text-xs text-muted-foreground">{segments.length} total segments</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-green-500" />
              <div className="text-sm font-medium">Total Recipients</div>
            </div>
            <div className="text-2xl font-bold">
              {segments.reduce((sum, s) => sum + getSegmentMetrics(s.id).recipientCount, 0).toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">Across all segments</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-orange-500" />
              <div className="text-sm font-medium">Avg Growth Rate</div>
            </div>
            <div className="text-2xl font-bold">
              {(
                segments.reduce((sum, s) => sum + getSegmentMetrics(s.id).growthRate, 0) / segments.length || 0
              ).toFixed(1)}
              %
            </div>
            <div className="text-xs text-muted-foreground">Last 30 days</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Target className="h-4 w-4 text-purple-500" />
              <div className="text-sm font-medium">Avg Engagement</div>
            </div>
            <div className="text-2xl font-bold">
              {(
                segments.reduce((sum, s) => sum + getSegmentMetrics(s.id).engagementScore, 0) / segments.length || 0
              ).toFixed(0)}
              %
            </div>
            <div className="text-xs text-muted-foreground">Engagement score</div>
          </CardContent>
        </Card>
      </div>

      {/* Segments List */}
      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Active Segments</TabsTrigger>
          <TabsTrigger value="all">All Segments</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          <div className="grid gap-4">
            {segments
              .filter((s) => s.isActive)
              .map((segment) => {
                const metrics = getSegmentMetrics(segment.id)
                return (
                  <Card key={segment.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            {getStatusIcon(segment)}
                            <h3 className="font-semibold">{segment.name}</h3>
                            <Badge variant="outline" className="gap-1">
                              {getUpdateFrequencyIcon(segment.updateFrequency)}
                              {segment.updateFrequency}
                            </Badge>
                            <Badge variant={segment.priority === 1 ? "default" : "secondary"}>
                              Priority {segment.priority}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-4">{segment.description}</p>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                              <div className="text-sm text-muted-foreground">Recipients</div>
                              <div className="font-semibold">{metrics.recipientCount.toLocaleString()}</div>
                            </div>
                            <div>
                              <div className="text-sm text-muted-foreground">Growth Rate</div>
                              <div
                                className={`font-semibold flex items-center gap-1 ${
                                  metrics.growthRate >= 0 ? "text-green-600" : "text-red-600"
                                }`}
                              >
                                {metrics.growthRate >= 0 ? (
                                  <TrendingUp className="h-3 w-3" />
                                ) : (
                                  <TrendingDown className="h-3 w-3" />
                                )}
                                {metrics.growthRate.toFixed(1)}%
                              </div>
                            </div>
                            <div>
                              <div className="text-sm text-muted-foreground">Engagement</div>
                              <div className="font-semibold">{metrics.engagementScore}%</div>
                            </div>
                            <div>
                              <div className="text-sm text-muted-foreground">Retention</div>
                              <div className="font-semibold">{metrics.retentionRate}%</div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Switch checked={segment.isActive} onCheckedChange={() => toggleSegmentStatus(segment.id)} />
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => setSelectedSegment(segment)}>
                                <BarChart3 className="h-4 w-4 mr-2" />
                                View Analytics
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Settings className="h-4 w-4 mr-2" />
                                Edit Rules
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Users className="h-4 w-4 mr-2" />
                                View Recipients
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                <AlertTriangle className="h-4 w-4 mr-2" />
                                Delete Segment
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
          </div>
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4">
            {segments.map((segment) => {
              const metrics = getSegmentMetrics(segment.id)
              return (
                <Card
                  key={segment.id}
                  className={`hover:shadow-md transition-shadow ${!segment.isActive ? "opacity-60" : ""}`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(segment)}
                        <div>
                          <h3 className="font-semibold">{segment.name}</h3>
                          <p className="text-sm text-muted-foreground">{segment.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="font-semibold">{metrics.recipientCount.toLocaleString()}</div>
                          <div className="text-sm text-muted-foreground">recipients</div>
                        </div>
                        <Switch checked={segment.isActive} onCheckedChange={() => toggleSegmentStatus(segment.id)} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="templates">
          <AutomatedSegmentBuilder onSegmentCreated={handleSegmentCreated} />
        </TabsContent>
      </Tabs>

      {/* Segment Analytics Modal */}
      {selectedSegment && (
        <Dialog open={!!selectedSegment} onOpenChange={() => setSelectedSegment(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>{selectedSegment.name} Analytics</DialogTitle>
              <DialogDescription>
                Detailed performance metrics and insights for this automated segment
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              {/* Performance Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(getSegmentMetrics(selectedSegment.id)).map(([key, value]) => (
                  <Card key={key}>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold">
                        {typeof value === "number"
                          ? key.includes("Rate") || key.includes("Score")
                            ? `${value}%`
                            : value.toLocaleString()
                          : value}
                      </div>
                      <div className="text-sm text-muted-foreground capitalize">
                        {key.replace(/([A-Z])/g, " $1").trim()}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Rules Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Segment Rules</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {selectedSegment.rules.map((rule, index) => (
                      <div key={rule.id} className="p-3 bg-muted rounded-lg">
                        <div className="font-medium mb-2">
                          Rule {index + 1}: {rule.type === "include" ? "Include" : "Exclude"} users where
                        </div>
                        <div className="space-y-1">
                          {rule.conditions.map((condition, condIndex) => (
                            <div key={condition.id} className="text-sm font-mono">
                              {condIndex > 0 && (
                                <span className="text-muted-foreground">{rule.logic.toUpperCase()} </span>
                              )}
                              {condition.metric} {condition.operator} {condition.value}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
