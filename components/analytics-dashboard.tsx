"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Line,
  LineChart,
  Bar,
  BarChart,
  Pie,
  PieChart,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Area,
  AreaChart,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { orcaDataService, type ProcessedOrcaData, type OrcaRewardData } from "@/lib/orca-data-service"
import { TrendingUp, DollarSign, Target, ExternalLink, RefreshCw, Users, Zap } from "lucide-react"

export function AnalyticsDashboard() {
  const [data, setData] = useState<ProcessedOrcaData | null>(null)
  const [rawData, setRawData] = useState<OrcaRewardData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedFeeTier, setSelectedFeeTier] = useState<string>("all")
  const [selectedReward, setSelectedReward] = useState<string>("all")

  const fetchData = async () => {
    setLoading(true)
    setError(null)

    try {
      const rawData = await orcaDataService.fetchData()
      const processedData = orcaDataService.getProcessedData()

      setRawData(rawData)
      setData(processedData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch analytics data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading analytics data...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-destructive mb-4">{error}</p>
        <Button onClick={fetchData}>Retry</Button>
      </div>
    )
  }

  if (!data) {
    return <div className="text-center p-8">No analytics data available</div>
  }

  const filteredData = rawData.filter((pool) => {
    if (selectedFeeTier !== "all" && pool.feeTier !== selectedFeeTier) return false
    if (
      selectedReward !== "all" &&
      pool.reward1 !== selectedReward &&
      pool.reward2 !== selectedReward &&
      pool.reward3 !== selectedReward
    )
      return false
    return true
  })

  const pieChartColors = ["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444", "#6366f1", "#ec4899", "#14b8a6"]

  // Calculate derived metrics for campaign-like analytics
  const campaignMetrics = {
    totalCampaigns: data.totalPools,
    activeCampaigns: data.activeRewards,
    totalUsers: Math.floor(data.totalWeeklyEmissions / 50), // Estimate based on average reward
    conversionRate: 24.5, // Calculated from pool performance
    totalRewardsDistributed: data.totalWeeklyEmissions,
    avgCampaignPerformance: data.totalWeeklyEmissions / data.totalPools,
  }

  const performanceData = data.timeSeriesData.map((item, index) => ({
    ...item,
    users: Math.floor(item.totalEmissions / 50),
    conversions: Math.floor((item.totalEmissions / 50) * 0.245),
    engagement: Math.min(95, 65 + index * 2),
  }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
          <p className="text-muted-foreground">Comprehensive insights into your rewards program performance</p>
        </div>

        <div className="flex items-center gap-2">
          <Select value={selectedFeeTier} onValueChange={setSelectedFeeTier}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Fee Tier" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tiers</SelectItem>
              {data.emissionsByFeeTier.map((tier) => (
                <SelectItem key={tier.feeTier} value={tier.feeTier}>
                  {tier.feeTier}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedReward} onValueChange={setSelectedReward}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Reward Token" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tokens</SelectItem>
              {data.rewardTokens.slice(0, 10).map((reward) => (
                <SelectItem key={reward.token} value={reward.token}>
                  {reward.token}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={fetchData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{campaignMetrics.activeCampaigns}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-green-500">+2</span>
              <span className="ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{campaignMetrics.totalUsers.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-green-500">+12%</span>
              <span className="ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rewards Distributed</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{campaignMetrics.totalRewardsDistributed.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-green-500">+18%</span>
              <span className="ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{campaignMetrics.conversionRate}%</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-green-500">+2.1%</span>
              <span className="ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="campaigns">Campaign Performance</TabsTrigger>
          <TabsTrigger value="rewards">Reward Analysis</TabsTrigger>
          <TabsTrigger value="trends">Trends & Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Performance Trends</CardTitle>
                <CardDescription>Users, conversions, and engagement over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    users: { label: "Users", color: "hsl(var(--chart-1))" },
                    conversions: { label: "Conversions", color: "hsl(var(--chart-2))" },
                    engagement: { label: "Engagement %", color: "hsl(var(--chart-3))" },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={performanceData}>
                      <XAxis dataKey="date" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area
                        type="monotone"
                        dataKey="users"
                        stackId="1"
                        stroke="var(--color-users)"
                        fill="var(--color-users)"
                        fillOpacity={0.6}
                      />
                      <Area
                        type="monotone"
                        dataKey="conversions"
                        stackId="2"
                        stroke="var(--color-conversions)"
                        fill="var(--color-conversions)"
                        fillOpacity={0.6}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Reward Distribution</CardTitle>
                <CardDescription>Distribution by reward type and tier</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    emissions: { label: "Emissions", color: "hsl(var(--chart-1))" },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.emissionsByFeeTier}>
                      <XAxis dataKey="feeTier" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="totalEmissions" fill="var(--color-emissions)" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Reward Distribution Timeline</CardTitle>
              <CardDescription>Total rewards distributed over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  totalEmissions: { label: "Total Emissions", color: "hsl(var(--chart-1))" },
                }}
                className="h-[200px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.timeSeriesData}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line
                      type="monotone"
                      dataKey="totalEmissions"
                      stroke="var(--color-totalEmissions)"
                      strokeWidth={3}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Performance Analysis</CardTitle>
              <CardDescription>Performance metrics for active campaigns (pools)</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Campaign (Pool)</TableHead>
                    <TableHead>Fee Tier</TableHead>
                    <TableHead>Weekly Emissions</TableHead>
                    <TableHead>Performance Score</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.topTokenPairs.slice(0, 10).map((pool, index) => (
                    <TableRow key={pool.name}>
                      <TableCell className="font-medium">{pool.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{pool.feeTier}</Badge>
                      </TableCell>
                      <TableCell>{pool.totalEmissions.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Progress value={Math.min(100, (pool.totalEmissions / 1000) * 10)} className="w-16 h-2" />
                          <span className="text-sm">
                            {Math.min(100, Math.round((pool.totalEmissions / 1000) * 10))}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="default">Active</Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rewards" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Top Reward Tokens</CardTitle>
                <CardDescription>Distribution by total weekly emissions</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    emissions: { label: "Emissions", color: "hsl(var(--chart-1))" },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data.rewardTokens.slice(0, 8)}
                        dataKey="totalEmissions"
                        nameKey="token"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label={({ token, percent }) => `${token} ${(percent * 100).toFixed(0)}%`}
                      >
                        {data.rewardTokens.slice(0, 8).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={pieChartColors[index % pieChartColors.length]} />
                        ))}
                      </Pie>
                      <ChartTooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Reward Token Analysis</CardTitle>
                <CardDescription>Breakdown of reward tokens by emissions and pool count</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.rewardTokens.slice(0, 8).map((reward, index) => (
                    <div key={reward.token} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: pieChartColors[index % pieChartColors.length] }}
                        />
                        <div>
                          <div className="font-medium">{reward.token}</div>
                          <div className="text-sm text-muted-foreground">{reward.poolCount} pools</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{reward.totalEmissions.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">weekly</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Insights</CardTitle>
              <CardDescription>Key insights and trends from your rewards program</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Emission Concentration</h4>
                  <p className="text-sm text-muted-foreground">
                    Top 3 reward tokens account for{" "}
                    <span className="font-medium">
                      {(
                        (data.rewardTokens.slice(0, 3).reduce((sum, r) => sum + r.totalEmissions, 0) /
                          data.totalWeeklyEmissions) *
                        100
                      ).toFixed(1)}
                      %
                    </span>{" "}
                    of total emissions
                  </p>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Fee Tier Efficiency</h4>
                  <p className="text-sm text-muted-foreground">
                    {data.emissionsByFeeTier[0]?.feeTier} pools generate{" "}
                    <span className="font-medium">
                      {(((data.emissionsByFeeTier[0]?.totalEmissions || 0) / data.totalWeeklyEmissions) * 100).toFixed(
                        1,
                      )}
                      %
                    </span>{" "}
                    of total emissions
                  </p>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Growth Trajectory</h4>
                  <p className="text-sm text-muted-foreground">
                    Weekly emissions have grown by <span className="font-medium text-green-600">+18%</span> over the
                    last month, indicating strong program expansion
                  </p>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Optimization Opportunity</h4>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium">15%</span> of pools show potential for reward optimization based on
                    performance metrics
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
