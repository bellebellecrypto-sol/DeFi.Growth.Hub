"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { RewardsOptimizationSimulator } from "@/components/rewards-optimization-simulator"
import { orcaDataService, type ProcessedOrcaData } from "@/lib/orca-data-service"
import { TrendingUp, Settings, Play } from "lucide-react"

export default function PerformanceOptimizationPage() {
  const [data, setData] = useState<ProcessedOrcaData | null>(null)
  const [loading, setLoading] = useState(true)
  const [optimizationTarget, setOptimizationTarget] = useState("tvl")
  const [totalEmissions, setTotalEmissions] = useState([100000])
  const [maxChange, setMaxChange] = useState([25])
  const [preserveTopPerformers, setPreserveTopPerformers] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        await orcaDataService.fetchData()
        const processedData = orcaDataService.getProcessedData()
        setData(processedData)
        if (processedData) {
          setTotalEmissions([processedData.totalWeeklyEmissions])
        }
      } catch (error) {
        console.error("Failed to fetch data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading || !data) {
    return <div className="flex items-center justify-center h-64">Loading optimization tools...</div>
  }

  // Calculate optimization opportunities
  const optimizationOpportunities = data.topTokenPairs.map((pool) => ({
    name: pool.name,
    currentEmissions: pool.totalEmissions,
    suggestedEmissions: pool.totalEmissions * (0.8 + Math.random() * 0.4),
    potentialImpact: Math.random() * 30 + 10,
    confidence: Math.random() * 30 + 70,
  }))

  const totalCurrentEmissions = optimizationOpportunities.reduce((sum, opp) => sum + opp.currentEmissions, 0)
  const totalSuggestedEmissions = optimizationOpportunities.reduce((sum, opp) => sum + opp.suggestedEmissions, 0)
  const projectedImprovement = ((totalSuggestedEmissions - totalCurrentEmissions) / totalCurrentEmissions) * 100

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Performance Optimization</h1>
          <p className="text-muted-foreground">
            Optimize your reward distribution strategy for maximum ROI and user engagement
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" className="gap-2">
            <Settings className="h-4 w-4" />
            Configure
          </Button>
          <Button className="gap-2">
            <Play className="h-4 w-4" />
            Run Optimization
          </Button>
        </div>
      </div>

      {/* Optimization Controls */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Optimization Target</CardTitle>
            <CardDescription>Choose what metric to optimize for</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select value={optimizationTarget} onValueChange={setOptimizationTarget}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tvl">Total Value Locked</SelectItem>
                <SelectItem value="volume">Trading Volume</SelectItem>
                <SelectItem value="users">Active Users</SelectItem>
                <SelectItem value="retention">User Retention</SelectItem>
                <SelectItem value="roi">Return on Investment</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Emission Controls</CardTitle>
            <CardDescription>Adjust total weekly emissions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Total Weekly Emissions: {totalEmissions[0].toLocaleString()}</Label>
              <Slider
                value={totalEmissions}
                onValueChange={setTotalEmissions}
                max={200000}
                min={50000}
                step={5000}
                className="w-full"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Constraints</CardTitle>
            <CardDescription>Set optimization limits</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Max Change per Pool: {maxChange[0]}%</Label>
              <Slider value={maxChange} onValueChange={setMaxChange} max={50} min={5} step={5} className="w-full" />
            </div>
            <div className="flex items-center space-x-2">
              <Switch checked={preserveTopPerformers} onCheckedChange={setPreserveTopPerformers} />
              <Label>Preserve top performers</Label>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Optimization Results */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Projected Improvement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">+{projectedImprovement.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Expected performance gain</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pools Optimized</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{optimizationOpportunities.length}</div>
            <p className="text-xs text-muted-foreground">Pools with suggested changes</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Emission Efficiency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12.3%</div>
            <p className="text-xs text-muted-foreground">Improved token utilization</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Risk Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">Low</div>
            <p className="text-xs text-muted-foreground">Implementation risk level</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="recommendations" className="space-y-6">
        <TabsList>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="simulator">Strategy Simulator</TabsTrigger>
          <TabsTrigger value="impact">Impact Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="recommendations">
          <Card>
            <CardHeader>
              <CardTitle>Optimization Recommendations</CardTitle>
              <CardDescription>AI-powered suggestions to improve your reward distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pool</TableHead>
                    <TableHead>Current Emissions</TableHead>
                    <TableHead>Suggested Emissions</TableHead>
                    <TableHead>Change</TableHead>
                    <TableHead>Potential Impact</TableHead>
                    <TableHead>Confidence</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {optimizationOpportunities.slice(0, 10).map((opp) => {
                    const change = ((opp.suggestedEmissions - opp.currentEmissions) / opp.currentEmissions) * 100
                    return (
                      <TableRow key={opp.name}>
                        <TableCell className="font-medium">{opp.name}</TableCell>
                        <TableCell>{opp.currentEmissions.toLocaleString()}</TableCell>
                        <TableCell>{opp.suggestedEmissions.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant={change > 0 ? "default" : "destructive"}>
                            {change > 0 ? "+" : ""}
                            {change.toFixed(1)}%
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Progress value={opp.potentialImpact} className="w-16" />
                            <span className="text-sm">+{opp.potentialImpact.toFixed(1)}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{opp.confidence.toFixed(0)}%</Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            Apply
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="simulator">
          <RewardsOptimizationSimulator />
        </TabsContent>

        <TabsContent value="impact">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Projected Outcomes</CardTitle>
                <CardDescription>Expected results from implementing optimization recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">TVL Increase</span>
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span className="font-medium text-green-600">+15.2%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Volume Growth</span>
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span className="font-medium text-green-600">+22.8%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">User Retention</span>
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span className="font-medium text-green-600">+8.5%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">ROI Improvement</span>
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span className="font-medium text-green-600">+18.7%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Implementation Timeline</CardTitle>
                <CardDescription>Recommended phased approach for optimization rollout</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium">Phase 1: High-confidence changes</p>
                      <p className="text-xs text-muted-foreground">Week 1-2: Implement top 5 recommendations</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium">Phase 2: Medium-confidence changes</p>
                      <p className="text-xs text-muted-foreground">Week 3-4: Gradual rollout of remaining changes</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium">Phase 3: Monitor and adjust</p>
                      <p className="text-xs text-muted-foreground">Week 5+: Track performance and fine-tune</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
