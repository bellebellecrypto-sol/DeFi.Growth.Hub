"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Pie, PieChart, Cell } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { TrendingUp, Users, DollarSign, Zap, ArrowUpRight } from "lucide-react"

export function ImpactMeasurement() {
  const impactMetrics = [
    {
      title: "User Acquisition",
      value: "1,240",
      target: "1,500",
      progress: 83,
      change: "+15%",
      icon: Users,
      description: "New users acquired through campaigns",
    },
    {
      title: "Revenue Attribution",
      value: "$125,400",
      target: "$150,000",
      progress: 84,
      change: "+22%",
      icon: DollarSign,
      description: "Revenue directly attributed to campaigns",
    },
    {
      title: "Engagement Lift",
      value: "34%",
      target: "40%",
      progress: 85,
      change: "+8%",
      icon: TrendingUp,
      description: "Increase in user engagement",
    },
    {
      title: "Network Effects",
      value: "2.4x",
      target: "3.0x",
      progress: 80,
      change: "+0.3x",
      icon: Zap,
      description: "Viral coefficient from referrals",
    },
  ]

  const cohortData = [
    { week: "Week 1", retention: 85, engagement: 92 },
    { week: "Week 2", retention: 78, engagement: 88 },
    { week: "Week 3", retention: 72, engagement: 85 },
    { week: "Week 4", retention: 68, engagement: 82 },
    { week: "Week 8", retention: 62, engagement: 78 },
    { week: "Week 12", retention: 58, engagement: 75 },
  ]

  const attributionData = [
    { source: "Referral Program", value: 35, amount: "$43,890" },
    { source: "Early Adopter", value: 28, amount: "$35,112" },
    { source: "Community Builder", value: 22, amount: "$27,588" },
    { source: "Developer Incentives", value: 15, amount: "$18,810" },
  ]

  const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))"]

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {impactMetrics.map((metric) => (
          <Card key={metric.title}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                <metric.icon className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-baseline space-x-2">
                <div className="text-2xl font-bold">{metric.value}</div>
                <div className="text-sm text-muted-foreground">/ {metric.target}</div>
                <Badge variant="outline" className="text-xs text-green-600">
                  {metric.change}
                </Badge>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Progress to target</span>
                  <span>{metric.progress}%</span>
                </div>
                <Progress value={metric.progress} className="h-2" />
              </div>
              <p className="text-xs text-muted-foreground">{metric.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="cohort" className="space-y-6">
        <TabsList>
          <TabsTrigger value="cohort">Cohort Analysis</TabsTrigger>
          <TabsTrigger value="attribution">Revenue Attribution</TabsTrigger>
          <TabsTrigger value="network">Network Effects</TabsTrigger>
        </TabsList>

        <TabsContent value="cohort" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Cohort Analysis</CardTitle>
              <CardDescription>Retention and engagement patterns for users acquired through campaigns</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  retention: { label: "Retention %", color: "hsl(var(--chart-1))" },
                  engagement: { label: "Engagement %", color: "hsl(var(--chart-2))" },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={cohortData}>
                    <XAxis dataKey="week" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line
                      type="monotone"
                      dataKey="retention"
                      stroke="var(--color-retention)"
                      strokeWidth={2}
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="engagement"
                      stroke="var(--color-engagement)"
                      strokeWidth={2}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attribution" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Attribution</CardTitle>
                <CardDescription>Revenue breakdown by campaign source</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    value: { label: "Revenue Share" },
                  }}
                  className="h-[250px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={attributionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {attributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Attribution Breakdown</CardTitle>
                <CardDescription>Detailed revenue attribution by source</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {attributionData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                      <div>
                        <div className="font-medium text-sm">{item.source}</div>
                        <div className="text-xs text-muted-foreground">{item.value}% of total</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{item.amount}</div>
                      <div className="flex items-center text-xs text-green-600">
                        <ArrowUpRight className="h-3 w-3 mr-1" />
                        +12%
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="network" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Viral Coefficient</CardTitle>
                <CardDescription>Average referrals per user</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">2.4x</div>
                <div className="flex items-center text-sm text-green-600 mt-1">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +0.3x from last month
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Network Growth</CardTitle>
                <CardDescription>Organic growth rate</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">18%</div>
                <div className="flex items-center text-sm text-green-600 mt-1">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +3% from last month
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Referral Success</CardTitle>
                <CardDescription>Successful referral rate</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">76%</div>
                <div className="flex items-center text-sm text-green-600 mt-1">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +5% from last month
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
