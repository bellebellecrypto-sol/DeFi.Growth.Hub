"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { Download, Filter, Settings2, ExternalLink } from "lucide-react"
import { orcaDataService, type ProcessedOrcaData, type OrcaRewardData } from "@/lib/orca-data-service"
import { Line, LineChart, Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export default function CampaignInsightsPage() {
  const [data, setData] = useState<ProcessedOrcaData | null>(null)
  const [rawData, setRawData] = useState<OrcaRewardData[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedFeeTier, setSelectedFeeTier] = useState<string>("all")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const rawData = await orcaDataService.fetchData()
        const processedData = orcaDataService.getProcessedData()
        setRawData(rawData)
        setData(processedData)
      } catch (error) {
        console.error("Failed to fetch data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading || !data) {
    return <div className="flex items-center justify-center h-64">Loading campaign insights...</div>
  }

  // Transform Orca pools into campaign-like data
  const campaignData = data.topTokenPairs.map((pool, index) => ({
    name: pool.name,
    status: index < 3 ? "Active" : "Completed",
    totalEmissions: pool.totalEmissions,
    rewardCount: pool.rewardCount,
    feeTier: pool.feeTier,
    performance: 65 + Math.random() * 30, // Simulated performance score
    roi: 2.1 + Math.random() * 2.5, // Simulated ROI
  }))

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Campaign Insights</h1>
          <p className="text-muted-foreground">
            Detailed analysis of your reward campaigns and their performance metrics
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={selectedFeeTier} onValueChange={setSelectedFeeTier}>
            <SelectTrigger className="w-40">
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
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
          <Button variant="outline" className="gap-2">
            <Settings2 className="h-4 w-4" />
            Customize
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Campaign Performance Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{campaignData.filter((c) => c.status === "Active").length}</div>
            <p className="text-xs text-muted-foreground">Currently running</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Emissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalWeeklyEmissions.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Weekly distribution</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg. Campaign ROI</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(campaignData.reduce((sum, c) => sum + c.roi, 0) / campaignData.length).toFixed(1)}x
            </div>
            <p className="text-xs text-muted-foreground">Return on investment</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {((campaignData.filter((c) => c.performance > 70).length / campaignData.length) * 100).toFixed(0)}%
            </div>
            <p className="text-xs text-muted-foreground">High-performing campaigns</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="distribution">Distribution</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Campaign Performance Distribution</CardTitle>
                <CardDescription>Performance scores across all active campaigns</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    performance: { label: "Performance Score", color: "hsl(var(--chart-1))" },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={campaignData.slice(0, 8)}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="performance" fill="var(--color-performance)" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Emissions Trend</CardTitle>
                <CardDescription>Weekly emissions over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    totalEmissions: { label: "Total Emissions", color: "hsl(var(--chart-2))" },
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
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Performance Table</CardTitle>
              <CardDescription>Detailed performance metrics for each campaign</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Campaign</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Fee Tier</TableHead>
                    <TableHead>Weekly Emissions</TableHead>
                    <TableHead>Performance Score</TableHead>
                    <TableHead>ROI</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {campaignData.slice(0, 10).map((campaign) => (
                    <TableRow key={campaign.name}>
                      <TableCell className="font-medium">{campaign.name}</TableCell>
                      <TableCell>
                        <Badge variant={campaign.status === "Active" ? "default" : "secondary"}>
                          {campaign.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{campaign.feeTier}</Badge>
                      </TableCell>
                      <TableCell>{campaign.totalEmissions.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Progress value={campaign.performance} className="w-16" />
                          <span className="text-sm">{campaign.performance.toFixed(0)}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium text-green-600">{campaign.roi.toFixed(1)}x</span>
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

        <TabsContent value="distribution">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Emissions by Fee Tier</CardTitle>
                <CardDescription>Distribution of weekly emissions across fee tiers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.emissionsByFeeTier.map((tier) => (
                    <div key={tier.feeTier} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{tier.feeTier}</span>
                        <span>{tier.totalEmissions.toLocaleString()} tokens</span>
                      </div>
                      <Progress value={(tier.totalEmissions / data.totalWeeklyEmissions) * 100} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Campaign Status Distribution</CardTitle>
                <CardDescription>Breakdown of campaigns by current status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Active Campaigns</span>
                    <div className="flex items-center space-x-2">
                      <Badge>{campaignData.filter((c) => c.status === "Active").length}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {(
                          (campaignData.filter((c) => c.status === "Active").length / campaignData.length) *
                          100
                        ).toFixed(0)}
                        %
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Completed Campaigns</span>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">{campaignData.filter((c) => c.status === "Completed").length}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {(
                          (campaignData.filter((c) => c.status === "Completed").length / campaignData.length) *
                          100
                        ).toFixed(0)}
                        %
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Performance Trends</CardTitle>
              <CardDescription>Historical analysis of campaign effectiveness over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  activeRewards: { label: "Active Campaigns", color: "hsl(var(--chart-1))" },
                  totalEmissions: { label: "Total Emissions", color: "hsl(var(--chart-2))" },
                }}
                className="h-[400px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.timeSeriesData}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line type="monotone" dataKey="activeRewards" stroke="var(--color-activeRewards)" strokeWidth={2} />
                    <Line
                      type="monotone"
                      dataKey="totalEmissions"
                      stroke="var(--color-totalEmissions)"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
