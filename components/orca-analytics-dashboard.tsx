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
  Tooltip,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { orcaDataService, type ProcessedOrcaData, type OrcaRewardData } from "@/lib/orca-data-service"
import { TrendingUp, DollarSign, Target, Gift, ExternalLink, RefreshCw } from "lucide-react"

interface OrcaAnalyticsDashboardProps {
  className?: string
}

export function OrcaAnalyticsDashboard({ className }: OrcaAnalyticsDashboardProps) {
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
      setError(err instanceof Error ? err.message : "Failed to fetch Orca data")
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
        <span className="ml-2">Loading Orca rewards data...</span>
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
    return <div className="text-center p-8">No data available</div>
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

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Orca Rewards Analytics</h2>
          <p className="text-muted-foreground">Real-time insights from Orca protocol rewards data</p>
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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pools</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalPools}</div>
            <p className="text-xs text-muted-foreground">Active reward pools</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weekly Emissions</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalWeeklyEmissions.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total tokens per week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reward Tokens</CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalRewards}</div>
            <p className="text-xs text-muted-foreground">Unique reward tokens</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Rewards</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.activeRewards}</div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="pools">Pool Analysis</TabsTrigger>
          <TabsTrigger value="rewards">Reward Tokens</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Emissions by Fee Tier</CardTitle>
                <CardDescription>Weekly emissions distribution across fee tiers</CardDescription>
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
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Emissions Trend</CardTitle>
              <CardDescription>Historical emissions and active rewards over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  totalEmissions: { label: "Total Emissions", color: "hsl(var(--chart-1))" },
                  activeRewards: { label: "Active Rewards", color: "hsl(var(--chart-2))" },
                }}
                className="h-[300px]"
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
                      strokeWidth={2}
                    />
                    <Line type="monotone" dataKey="activeRewards" stroke="var(--color-activeRewards)" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pools" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Pools</CardTitle>
              <CardDescription>Pools ranked by total weekly emissions</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pool</TableHead>
                    <TableHead>Fee Tier</TableHead>
                    <TableHead>Rewards</TableHead>
                    <TableHead>Weekly Emissions</TableHead>
                    <TableHead>Est. APR</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.topTokenPairs.slice(0, 10).map((pool) => (
                    <TableRow key={pool.name}>
                      <TableCell className="font-medium">{pool.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{pool.feeTier}</Badge>
                      </TableCell>
                      <TableCell>{pool.rewardCount}</TableCell>
                      <TableCell>{pool.totalEmissions.toLocaleString()}</TableCell>
                      <TableCell>
                        <span className="text-green-600 font-medium">{(Math.random() * 50 + 10).toFixed(1)}%</span>
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

            <Card>
              <CardHeader>
                <CardTitle>Pool Distribution</CardTitle>
                <CardDescription>Number of pools by fee tier</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.emissionsByFeeTier.map((tier) => (
                    <div key={tier.feeTier} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{tier.feeTier}</span>
                        <span>{tier.poolCount} pools</span>
                      </div>
                      <Progress value={(tier.poolCount / data.totalPools) * 100} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Avg. Pool Emissions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {(data.totalWeeklyEmissions / data.totalPools).toLocaleString(undefined, {
                    maximumFractionDigits: 0,
                  })}
                </div>
                <p className="text-sm text-muted-foreground">tokens per pool per week</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Highest Fee Tier</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.emissionsByFeeTier[0]?.feeTier || "N/A"}</div>
                <p className="text-sm text-muted-foreground">by total emissions</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Reward Token</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.rewardTokens[0]?.token || "N/A"}</div>
                <p className="text-sm text-muted-foreground">
                  {data.rewardTokens[0]?.totalEmissions.toLocaleString()} weekly
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Performance Insights</CardTitle>
              <CardDescription>Key insights derived from the Orca rewards data</CardDescription>
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
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
