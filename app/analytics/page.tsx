"use client"

import { useInterfaceMode } from "@/contexts/interface-mode-context"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart, Target, Gift, Users, Layers, TrendingUp } from "lucide-react"

export default function AnalyticsPage() {
  const { mode } = useInterfaceMode()

  const getTabsList = () => {
    const coreTabs = [
      { value: "overview", label: "Overview", icon: BarChart },
      { value: "campaigns", label: "Campaigns", icon: Target },
      { value: "incentives", label: "Incentives", icon: Gift },
      { value: "audiences", label: "Audiences", icon: Users },
    ]

    const advancedTabs = [
      { value: "segments", label: "Segments", icon: Layers },
      { value: "performance", label: "Performance", icon: TrendingUp },
    ]

    return mode === "advanced" ? [...coreTabs, ...advancedTabs] : coreTabs
  }

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">
            {mode === "classic"
              ? "Monitor your campaign performance and user engagement"
              : "Comprehensive analytics with advanced insights and segment analysis"}
          </p>
        </div>
        {mode === "advanced" && (
          <Badge variant="secondary" className="gap-1">
            <BarChart className="h-3 w-3" />
            Advanced Analytics
          </Badge>
        )}
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-6">
          {getTabsList().map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} className="flex items-center gap-2">
              <tab.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-muted-foreground">+2 from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Incentives</CardTitle>
                <Gift className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">+4 from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Audiences</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12,450</div>
                <p className="text-xs text-muted-foreground">+1,200 from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">68%</div>
                <p className="text-xs text-muted-foreground">+5% from last month</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="campaigns">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Analytics</CardTitle>
              <CardDescription>Performance metrics for your campaigns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">Campaign Insights</h3>
                <p className="text-muted-foreground">Detailed campaign performance analytics and insights</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="incentives">
          <Card>
            <CardHeader>
              <CardTitle>Incentive Analytics</CardTitle>
              <CardDescription>Track reward distribution and claim rates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Gift className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">Incentive Metrics</h3>
                <p className="text-muted-foreground">Monitor reward performance and user engagement</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audiences">
          <Card>
            <CardHeader>
              <CardTitle>Audience Analytics</CardTitle>
              <CardDescription>User behavior and engagement analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">User Analysis</h3>
                <p className="text-muted-foreground">Comprehensive audience insights and behavior patterns</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {mode === "advanced" && (
          <>
            <TabsContent value="segments">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    Segment Performance
                    <Badge variant="secondary">Advanced</Badge>
                  </CardTitle>
                  <CardDescription>Advanced segment analytics and automation insights</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Layers className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-medium mb-2">Segment Analytics</h3>
                    <p className="text-muted-foreground">
                      Deep dive into segment performance and automated behavior analysis
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="performance">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    Performance Analytics
                    <Badge variant="secondary">Advanced</Badge>
                  </CardTitle>
                  <CardDescription>ROI analysis and optimization recommendations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <TrendingUp className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-medium mb-2">Performance Insights</h3>
                    <p className="text-muted-foreground">Advanced performance metrics and optimization strategies</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  )
}
