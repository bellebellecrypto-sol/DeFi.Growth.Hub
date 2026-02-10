"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Trash2, Zap, Target, Brain, BarChart3 } from "lucide-react"
import { automatedSegmentService, type BehaviorCondition, type AutomatedSegment } from "@/lib/automated-segment-service"

interface SegmentBuilderProps {
  onSegmentCreated?: (segment: AutomatedSegment) => void
}

export function AutomatedSegmentBuilder({ onSegmentCreated }: SegmentBuilderProps) {
  const [segmentName, setSegmentName] = useState("")
  const [segmentDescription, setSegmentDescription] = useState("")
  const [updateFrequency, setUpdateFrequency] = useState<"realtime" | "hourly" | "daily" | "weekly">("daily")
  const [priority, setPriority] = useState(1)
  const [conditions, setConditions] = useState<BehaviorCondition[]>([])
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

  const behaviorPatterns = automatedSegmentService.getBehaviorPatterns()

  const metricOptions = [
    { value: "transactionCount", label: "Transaction Count", category: "Activity" },
    { value: "totalVolume", label: "Total Volume", category: "Value" },
    { value: "avgTransactionValue", label: "Average Transaction Value", category: "Value" },
    { value: "platformEngagementScore", label: "Platform Engagement Score", category: "Engagement" },
    { value: "campaignParticipation", label: "Campaign Participation", category: "Engagement" },
    { value: "consecutiveActiveDays", label: "Consecutive Active Days", category: "Activity" },
    { value: "daysSinceFirstTransaction", label: "Days Since First Transaction", category: "Temporal" },
    { value: "rewardsClaimed", label: "Rewards Claimed", category: "Value" },
    { value: "behaviorScores.activity", label: "Activity Score", category: "Behavior" },
    { value: "behaviorScores.engagement", label: "Engagement Score", category: "Behavior" },
    { value: "behaviorScores.value", label: "Value Score", category: "Behavior" },
    { value: "behaviorScores.loyalty", label: "Loyalty Score", category: "Behavior" },
  ]

  const operatorOptions = [
    { value: "gte", label: "Greater than or equal to (≥)" },
    { value: "gt", label: "Greater than (>)" },
    { value: "lte", label: "Less than or equal to (≤)" },
    { value: "lt", label: "Less than (<)" },
    { value: "eq", label: "Equal to (=)" },
    { value: "between", label: "Between" },
  ]

  const addCondition = () => {
    const newCondition: BehaviorCondition = {
      id: `condition-${Date.now()}`,
      metric: "transactionCount",
      operator: "gte",
      value: 0,
      weight: 1.0,
    }
    setConditions([...conditions, newCondition])
  }

  const updateCondition = (id: string, updates: Partial<BehaviorCondition>) => {
    setConditions(conditions.map((c) => (c.id === id ? { ...c, ...updates } : c)))
  }

  const removeCondition = (id: string) => {
    setConditions(conditions.filter((c) => c.id !== id))
  }

  const createSegment = () => {
    if (!segmentName || conditions.length === 0) return

    const newSegment = automatedSegmentService.createAutomatedSegment({
      name: segmentName,
      description: segmentDescription,
      patterns: [], // Could be populated based on selected patterns
      rules: [
        {
          id: "main-rule",
          type: "include",
          logic: "and",
          conditions: conditions,
        },
      ],
      isActive: true,
      updateFrequency,
      priority,
    })

    onSegmentCreated?.(newSegment)

    // Reset form
    setSegmentName("")
    setSegmentDescription("")
    setConditions([])
  }

  const getEstimatedRecipients = () => {
    // Mock estimation based on conditions
    const baseCount = 1000
    const modifier = conditions.length > 0 ? Math.max(0.1, 1 - conditions.length * 0.2) : 1
    return Math.floor(baseCount * modifier)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Automated Segment Builder
          </CardTitle>
          <CardDescription>Create segments that automatically update based on user behavior patterns</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Information */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="segment-name">Segment Name</Label>
              <Input
                id="segment-name"
                placeholder="e.g., High-Value Active Users"
                value={segmentName}
                onChange={(e) => setSegmentName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="update-frequency">Update Frequency</Label>
              <Select value={updateFrequency} onValueChange={(value: any) => setUpdateFrequency(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="realtime">Real-time</SelectItem>
                  <SelectItem value="hourly">Hourly</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="segment-description">Description</Label>
            <Textarea
              id="segment-description"
              placeholder="Describe the purpose and criteria for this segment..."
              value={segmentDescription}
              onChange={(e) => setSegmentDescription(e.target.value)}
            />
          </div>

          <Separator />

          {/* Behavior Conditions */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">Behavior Conditions</h3>
                <p className="text-sm text-muted-foreground">
                  Define the criteria that users must meet to be included in this segment
                </p>
              </div>
              <Button onClick={addCondition} className="gap-2">
                <Plus className="h-4 w-4" />
                Add Condition
              </Button>
            </div>

            {conditions.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <Target className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-muted-foreground">No conditions defined yet</p>
                    <p className="text-sm text-muted-foreground">Add conditions to define your segment criteria</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {conditions.map((condition, index) => (
                  <Card key={condition.id} className="p-4">
                    <div className="grid gap-4 md:grid-cols-4">
                      <div className="space-y-2">
                        <Label>Metric</Label>
                        <Select
                          value={condition.metric}
                          onValueChange={(value) => updateCondition(condition.id, { metric: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {metricOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline" className="text-xs">
                                    {option.category}
                                  </Badge>
                                  {option.label}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Operator</Label>
                        <Select
                          value={condition.operator}
                          onValueChange={(value: any) => updateCondition(condition.id, { operator: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {operatorOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Value</Label>
                        <Input
                          type="number"
                          value={condition.value}
                          onChange={(e) => updateCondition(condition.id, { value: Number(e.target.value) })}
                        />
                      </div>

                      <div className="flex items-end">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => removeCondition(condition.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {index < conditions.length - 1 && (
                      <div className="flex items-center justify-center mt-3">
                        <Badge variant="secondary">AND</Badge>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </div>

          <Separator />

          {/* Preview and Actions */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="text-sm font-medium">Estimated Recipients</div>
              <div className="text-2xl font-bold">{getEstimatedRecipients().toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">Based on current user data</div>
            </div>

            <div className="flex gap-2">
              <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Preview
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Segment Preview</DialogTitle>
                    <DialogDescription>Preview how this segment will perform based on current data</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold">{getEstimatedRecipients()}</div>
                        <div className="text-sm text-muted-foreground">Recipients</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold">85%</div>
                        <div className="text-sm text-muted-foreground">Accuracy</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold">12%</div>
                        <div className="text-sm text-muted-foreground">Growth Rate</div>
                      </div>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <h4 className="font-medium">Conditions Summary</h4>
                      {conditions.map((condition, index) => (
                        <div key={condition.id} className="text-sm">
                          {index > 0 && <span className="text-muted-foreground">AND </span>}
                          <span className="font-mono">
                            {metricOptions.find((m) => m.value === condition.metric)?.label} {condition.operator}{" "}
                            {condition.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Button onClick={createSegment} disabled={!segmentName || conditions.length === 0} className="gap-2">
                <Zap className="h-4 w-4" />
                Create Automated Segment
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Templates */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Quick Templates</CardTitle>
          <CardDescription>Start with pre-built behavior patterns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {behaviorPatterns.map((pattern) => (
              <Card key={pattern.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{pattern.name}</h4>
                    <Badge variant="outline">{pattern.category}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{pattern.description}</p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setSegmentName(pattern.name)
                      setSegmentDescription(pattern.description)
                      setConditions(pattern.conditions)
                    }}
                  >
                    Use Template
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
