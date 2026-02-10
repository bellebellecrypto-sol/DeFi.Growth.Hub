"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Legend, Bar, BarChart } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export function ROIAnalysis() {
  const [investmentAmount, setInvestmentAmount] = useState(10000)
  const [conversionRate, setConversionRate] = useState(5)
  const [averageValue, setAverageValue] = useState(50)
  const [timeframe, setTimeframe] = useState(12)

  // Calculate ROI
  const calculateROI = () => {
    const conversions = (investmentAmount / 10) * (conversionRate / 100)
    const revenue = conversions * averageValue
    const roi = ((revenue - investmentAmount) / investmentAmount) * 100
    return {
      conversions: Math.round(conversions),
      revenue: Math.round(revenue),
      roi: roi.toFixed(2),
    }
  }

  const { conversions, revenue, roi } = calculateROI()

  // Generate projection data
  const generateProjectionData = () => {
    const data = []
    for (let month = 1; month <= timeframe; month++) {
      const monthlyInvestment = investmentAmount / timeframe
      const monthlyConversions = (monthlyInvestment / 10) * (conversionRate / 100) * (1 + month * 0.05)
      const monthlyRevenue = monthlyConversions * averageValue
      const monthlyROI = ((monthlyRevenue - monthlyInvestment) / monthlyInvestment) * 100

      data.push({
        month: `Month ${month}`,
        investment: Math.round(monthlyInvestment),
        revenue: Math.round(monthlyRevenue),
        roi: Math.round(monthlyROI),
      })
    }
    return data
  }

  const projectionData = generateProjectionData()

  // Generate comparison data
  const comparisonData = [
    { name: "Current Strategy", roi: Number.parseFloat(roi), color: "#3b82f6" },
    { name: "Optimized Strategy", roi: Number.parseFloat(roi) * 1.4, color: "#10b981" },
    { name: "Industry Average", roi: Number.parseFloat(roi) * 0.8, color: "#6b7280" },
  ]

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>ROI Calculator</CardTitle>
            <CardDescription>Adjust parameters to calculate potential ROI</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="investment">Investment Amount ($)</Label>
              <Input
                id="investment"
                type="number"
                value={investmentAmount}
                onChange={(e) => setInvestmentAmount(Number(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="conversion-rate">Conversion Rate (%)</Label>
                <span className="text-sm text-muted-foreground">{conversionRate}%</span>
              </div>
              <Slider
                id="conversion-rate"
                min={0.1}
                max={20}
                step={0.1}
                value={[conversionRate]}
                onValueChange={(value) => setConversionRate(value[0])}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="average-value">Average Value per Conversion ($)</Label>
              <Input
                id="average-value"
                type="number"
                value={averageValue}
                onChange={(e) => setAverageValue(Number(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="timeframe">Timeframe (Months)</Label>
                <span className="text-sm text-muted-foreground">{timeframe} months</span>
              </div>
              <Slider
                id="timeframe"
                min={1}
                max={36}
                step={1}
                value={[timeframe]}
                onValueChange={(value) => setTimeframe(value[0])}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>ROI Summary</CardTitle>
            <CardDescription>Projected return on investment</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg text-center">
                <p className="text-sm text-muted-foreground">Conversions</p>
                <p className="text-2xl font-bold">{conversions}</p>
              </div>
              <div className="p-4 border rounded-lg text-center">
                <p className="text-sm text-muted-foreground">Revenue</p>
                <p className="text-2xl font-bold">${revenue}</p>
              </div>
              <div className="p-4 border rounded-lg text-center">
                <p className="text-sm text-muted-foreground">ROI</p>
                <p className="text-2xl font-bold">{roi}%</p>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Strategy Comparison</h4>
              <ChartContainer
                config={{
                  roi: {
                    label: "ROI (%)",
                    color: "hsl(var(--chart-1))",
                  },
                }}
                className="h-[200px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={comparisonData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="roi" fill="var(--color-roi)" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>ROI Projection Over Time</CardTitle>
          <CardDescription>Projected ROI over the selected timeframe</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              investment: {
                label: "Investment ($)",
                color: "hsl(var(--chart-1))",
              },
              revenue: {
                label: "Revenue ($)",
                color: "hsl(var(--chart-2))",
              },
              roi: {
                label: "ROI (%)",
                color: "hsl(var(--chart-3))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={projectionData}>
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="investment"
                  stroke="var(--color-investment)"
                  strokeWidth={2}
                />
                <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="var(--color-revenue)" strokeWidth={2} />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="roi"
                  stroke="var(--color-roi)"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
