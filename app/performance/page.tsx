"use client"

import { useInterfaceMode } from "@/contexts/interface-mode-context"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Gauge, Lightbulb, Sparkles, Activity } from "lucide-react"

export default function PerformancePage() {
  const { mode } = useInterfaceMode()

  const getTabsList = () => {
    const coreTabs = [
      { value: "overview", label: "Overview", icon: TrendingUp },
      { value: "optimization", label: "Optimization", icon: Gauge },
      { value: "roi", label: "ROI Analysis", icon: TrendingUp },
    ]

    const advancedTabs = [
      { value: "strategy", label: "Strategy Tools", icon: Lightbulb },
      { value: "recommendations", label: "AI Recommendations", icon: Sparkles },
      { value: "testing", label: "A/B Testing", icon: Activity },
    ]

    return mode === "advanced" ? [...coreTabs, ...advancedTabs] : coreTabs
  }

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Performance</h1>
          <p className="text-muted-foreground">
            {mode === "classic"
              ? "Monitor and optimize your campaign performance"
              : "Advanced performance analytics with AI-powered insights and testing tools"}
          </p>
        </div>
        {mode === "advanced" && (
          <Badge variant="secondary" className="gap-1">
            <Sparkles className="h-3 w-3" />
            AI-Powered
          </Badge>
        )}
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
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
                <CardTitle className="text-sm font-medium">Overall ROI</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">324%</div>
                <p className="text-xs text-muted-foreground">+12% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                <Gauge className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">68%</div>
                <p className="text-xs text-muted-foreground">+5% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cost per Acquisition</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$12.50</div>
                <p className="text-xs text-muted-foreground">-8% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Optimization Score</CardTitle>
                <Gauge className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">85</div>
                <p className="text-xs text-muted-foreground">+3 points this week</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="optimization">
          <Card>
            <CardHeader>
              <CardTitle>Performance Optimization</CardTitle>
              <CardDescription>Identify and implement performance improvements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Gauge className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">Optimization Tools</h3>
                <p className="text-muted-foreground">Analyze and optimize your campaign performance metrics</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roi">
          <Card>
            <CardHeader>
              <CardTitle>ROI Analysis</CardTitle>
              <CardDescription>Return on investment tracking and forecasting</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">ROI Insights</h3>
                <p className="text-muted-foreground">Comprehensive ROI analysis and performance forecasting</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {mode === "advanced" && (
          <>
            <TabsContent value="strategy">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    Strategy Tools
                    <Badge variant="secondary">Advanced</Badge>
                  </CardTitle>
                  <CardDescription>Advanced strategic planning and optimization tools</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Lightbulb className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-medium mb-2">Strategic Insights</h3>
                    <p className="text-muted-foreground">
                      Advanced tools for strategic planning and performance optimization
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="recommendations">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    AI Recommendations
                    <Badge variant="secondary">AI</Badge>
                  </CardTitle>
                  <CardDescription>Machine learning-powered optimization suggestions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Sparkles className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-medium mb-2">Smart Recommendations</h3>
                    <p className="text-muted-foreground">
                      AI-powered insights and recommendations for optimal performance
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="testing">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    A/B Testing
                    <Badge variant="secondary">Pro</Badge>
                  </CardTitle>
                  <CardDescription>Advanced testing and experimentation platform</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Activity className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-medium mb-2">Testing Platform</h3>
                    <p className="text-muted-foreground">Comprehensive A/B testing tools for campaign optimization</p>
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
