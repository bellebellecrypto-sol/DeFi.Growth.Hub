"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, AlertCircle, TrendingUp, Target, Zap, Settings } from "lucide-react"

export function PerformanceMetrics() {
  const recommendations = [
    {
      id: 1,
      title: "Optimize High-Performing Pools",
      description: "Increase allocation to top 3 performing pools by 15%",
      impact: "High",
      effort: "Low",
      status: "pending",
      category: "optimization",
    },
    {
      id: 2,
      title: "Reduce Underperforming Allocations",
      description: "Decrease rewards for pools with <10% efficiency",
      impact: "Medium",
      effort: "Medium",
      status: "pending",
      category: "optimization",
    },
    {
      id: 3,
      title: "Implement Dynamic Pricing",
      description: "Adjust rewards based on real-time performance metrics",
      impact: "High",
      effort: "High",
      status: "in-progress",
      category: "automation",
    },
    {
      id: 4,
      title: "Expand Successful Fee Tiers",
      description: "Create more pools in the 0.3% fee tier category",
      impact: "Medium",
      effort: "Medium",
      status: "pending",
      category: "expansion",
    },
  ]

  const optimizationTargets = [
    {
      metric: "Overall ROI",
      current: 3.2,
      target: 4.0,
      progress: 80,
      trend: "up",
    },
    {
      metric: "Conversion Rate",
      current: 24.5,
      target: 30.0,
      progress: 82,
      trend: "up",
    },
    {
      metric: "User Retention",
      current: 68,
      target: 75,
      progress: 91,
      trend: "up",
    },
    {
      metric: "Cost Efficiency",
      current: 85,
      target: 90,
      progress: 94,
      trend: "up",
    },
  ]

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "High":
        return "destructive"
      case "Medium":
        return "default"
      case "Low":
        return "secondary"
      default:
        return "outline"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "in-progress":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      default:
        return <Target className="h-4 w-4 text-muted-foreground" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {optimizationTargets.map((target) => (
          <Card key={target.metric}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">{target.metric}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline space-x-2 mb-2">
                <div className="text-2xl font-bold">{target.current}</div>
                <div className="text-sm text-muted-foreground">/ {target.target}</div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Progress to target</span>
                  <span>{target.progress}%</span>
                </div>
                <Progress value={target.progress} className="h-2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="recommendations" className="space-y-6">
        <TabsList>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="optimization">Optimization Tools</TabsTrigger>
          <TabsTrigger value="automation">Automation</TabsTrigger>
        </TabsList>

        <TabsContent value="recommendations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Recommendations</CardTitle>
              <CardDescription>AI-powered suggestions to improve your rewards program</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recommendations.map((rec) => (
                  <div key={rec.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                    <div className="flex-shrink-0 mt-1">{getStatusIcon(rec.status)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium">{rec.title}</h4>
                        <Badge variant={getImpactColor(rec.impact)}>{rec.impact} Impact</Badge>
                        <Badge variant="outline">{rec.effort} Effort</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{rec.description}</p>
                      <div className="flex space-x-2">
                        <Button size="sm">Implement</Button>
                        <Button variant="outline" size="sm">
                          Learn More
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="optimization" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Reward Optimization</CardTitle>
                <CardDescription>Tools to optimize reward distribution</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full justify-start" variant="outline">
                  <Zap className="h-4 w-4 mr-2" />
                  Run Optimization Simulation
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Analyze Pool Performance
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Target className="h-4 w-4 mr-2" />
                  Set Performance Targets
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Configuration Tools</CardTitle>
                <CardDescription>Advanced configuration and settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full justify-start" variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Adjust Allocation Rules
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Target className="h-4 w-4 mr-2" />
                  Configure Thresholds
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Zap className="h-4 w-4 mr-2" />
                  Setup Alerts
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="automation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Automation Rules</CardTitle>
              <CardDescription>Set up automated optimization and management</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">Auto-Rebalancing</h4>
                    <Badge variant="outline">Inactive</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Automatically rebalance rewards based on performance metrics
                  </p>
                  <Button size="sm">Enable</Button>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">Performance Alerts</h4>
                    <Badge variant="default">Active</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Get notified when pools underperform or exceed targets
                  </p>
                  <Button variant="outline" size="sm">
                    Configure
                  </Button>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">Dynamic Pricing</h4>
                    <Badge variant="secondary">In Progress</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Adjust reward amounts based on real-time market conditions
                  </p>
                  <Button variant="outline" size="sm">
                    View Progress
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
