"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Settings2 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

interface DashboardCustomizerProps {
  type: "analytics" | "performance"
  onSave: (config: any) => void
  initialConfig?: any
}

export function DashboardCustomizer({ type, onSave, initialConfig = {} }: DashboardCustomizerProps) {
  const [config, setConfig] = useState(initialConfig)

  const handleToggleMetric = (category: string, metric: string) => {
    setConfig((prev: any) => ({
      ...prev,
      metrics: {
        ...prev.metrics,
        [category]: {
          ...(prev.metrics?.[category] || {}),
          [metric]: !(prev.metrics?.[category]?.[metric] ?? true),
        },
      },
    }))
  }

  const handleToggleWidget = (widget: string) => {
    setConfig((prev: any) => ({
      ...prev,
      widgets: {
        ...(prev.widgets || {}),
        [widget]: !(prev.widgets?.[widget] ?? true),
      },
    }))
  }

  const handleSave = () => {
    onSave(config)
  }

  const analyticsMetrics = {
    campaigns: ["Conversion Rate", "Engagement Rate", "Completion Rate", "ROI"],
    incentives: ["Claim Rate", "Distribution Rate", "Effectiveness", "Cost per Action"],
    audience: ["Retention Rate", "Growth Rate", "Activity Level", "Demographic Breakdown"],
    orca: ["Emissions Rate", "Pool Performance", "Token Distribution", "Fee Tier Analysis"],
  }

  const performanceMetrics = {
    optimization: ["Opportunity Score", "Impact Potential", "Implementation Difficulty", "Priority"],
    roi: ["Current ROI", "Projected ROI", "ROI Change", "Investment Efficiency"],
    strategy: ["Strategy Effectiveness", "Resource Allocation", "Target Achievement", "Competitive Position"],
    recommendations: ["Confidence Score", "Expected Impact", "Implementation Time", "Resource Requirements"],
  }

  const analyticsWidgets = [
    "Summary Dashboard",
    "Campaign Performance",
    "Incentive Distribution",
    "Audience Growth",
    "Orca Rewards Analysis",
    "Trend Charts",
    "Comparison Tables",
  ]

  const performanceWidgets = [
    "Optimization Opportunities",
    "ROI Calculator",
    "Strategy Simulator",
    "Recommendation Engine",
    "A/B Testing Tools",
    "Resource Allocator",
    "Impact Projector",
  ]

  const metrics = type === "analytics" ? analyticsMetrics : performanceMetrics
  const widgets = type === "analytics" ? analyticsWidgets : performanceWidgets

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Settings2 className="h-4 w-4" />
          Customize
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Customize {type === "analytics" ? "Analytics" : "Performance"} Dashboard</DialogTitle>
          <DialogDescription>Select which metrics and widgets you want to display on your dashboard.</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="metrics" className="mt-4">
          <TabsList>
            <TabsTrigger value="metrics">Metrics</TabsTrigger>
            <TabsTrigger value="widgets">Widgets</TabsTrigger>
            <TabsTrigger value="layout">Layout</TabsTrigger>
          </TabsList>

          <TabsContent value="metrics" className="space-y-4 mt-4">
            {Object.entries(metrics).map(([category, categoryMetrics]) => (
              <Card key={category}>
                <CardContent className="pt-4">
                  <h3 className="font-medium mb-2 capitalize">{category}</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {categoryMetrics.map((metric) => (
                      <div key={metric} className="flex items-center space-x-2">
                        <Checkbox
                          id={`${category}-${metric}`}
                          checked={config.metrics?.[category]?.[metric] ?? true}
                          onCheckedChange={() => handleToggleMetric(category, metric)}
                        />
                        <Label htmlFor={`${category}-${metric}`}>{metric}</Label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="widgets" className="mt-4">
            <Card>
              <CardContent className="pt-4">
                <div className="grid grid-cols-2 gap-4">
                  {widgets.map((widget) => (
                    <div key={widget} className="flex items-center space-x-2">
                      <Checkbox
                        id={widget}
                        checked={config.widgets?.[widget] ?? true}
                        onCheckedChange={() => handleToggleWidget(widget)}
                      />
                      <Label htmlFor={widget}>{widget}</Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="layout" className="mt-4">
            <Card>
              <CardContent className="pt-4">
                <p className="text-sm text-muted-foreground mb-4">
                  Drag and drop widgets to rearrange your dashboard layout.
                </p>
                <div className="border rounded-md p-4 bg-muted/50 min-h-[200px] flex items-center justify-center">
                  <p className="text-sm text-muted-foreground">Drag and drop layout editor (coming soon)</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Separator className="my-4" />

        <div className="flex justify-end space-x-2">
          <Button variant="outline">Reset to Default</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
