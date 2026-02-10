"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Line, ResponsiveContainer, XAxis, YAxis, Area, AreaChart } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { orcaDataService, type ProcessedOrcaData } from "@/lib/orca-data-service"
import { TrendingUp, TrendingDown } from "lucide-react"

export function OrcaPerformanceMetrics() {
  const [data, setData] = useState<ProcessedOrcaData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        await orcaDataService.fetchData()
        setData(orcaDataService.getProcessedData())
      } catch (error) {
        console.error("Failed to fetch Orca data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading || !data) {
    return <div className="h-[300px] flex items-center justify-center">Loading Orca metrics...</div>
  }

  // Calculate growth metrics
  const timeSeriesData = data.timeSeriesData
  const currentEmissions = timeSeriesData[timeSeriesData.length - 1]?.totalEmissions || 0
  const previousEmissions = timeSeriesData[timeSeriesData.length - 8]?.totalEmissions || 0
  const emissionsGrowth = previousEmissions > 0 ? ((currentEmissions - previousEmissions) / previousEmissions) * 100 : 0

  const enhancedData = timeSeriesData.map((item, index) => ({
    ...item,
    emissionsMA:
      timeSeriesData.slice(Math.max(0, index - 6), index + 1).reduce((sum, d) => sum + d.totalEmissions, 0) /
      Math.min(7, index + 1),
  }))

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Weekly Emissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentEmissions.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {emissionsGrowth >= 0 ? (
                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
              )}
              <span className={emissionsGrowth >= 0 ? "text-green-500" : "text-red-500"}>
                {Math.abs(emissionsGrowth).toFixed(1)}%
              </span>
              <span className="ml-1">vs last week</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Pools</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalPools}</div>
            <p className="text-xs text-muted-foreground">{data.activeRewards} active rewards</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg. Pool Emissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(data.totalWeeklyEmissions / data.totalPools).toFixed(0)}</div>
            <p className="text-xs text-muted-foreground">tokens per pool per week</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Emissions Trend Analysis</CardTitle>
          <CardDescription>Weekly emissions with 7-day moving average</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              totalEmissions: {
                label: "Total Emissions",
                color: "hsl(var(--chart-1))",
              },
              emissionsMA: {
                label: "7-Day Moving Average",
                color: "hsl(var(--chart-2))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={enhancedData}>
                <XAxis dataKey="date" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="totalEmissions"
                  stroke="var(--color-totalEmissions)"
                  fill="var(--color-totalEmissions)"
                  fillOpacity={0.3}
                />
                <Line
                  type="monotone"
                  dataKey="emissionsMA"
                  stroke="var(--color-emissionsMA)"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
