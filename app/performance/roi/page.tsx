"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { ROIAnalysis } from "@/components/roi-analysis"
import { DashboardCustomizer } from "@/components/dashboard-customizer"

export default function ROIAnalysisPage() {
  const handleSaveCustomization = (config: any) => {
    console.log("Saved customization:", config)
    // In a real app, you would save this to user preferences
  }

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">ROI Analysis</h1>
          <p className="text-muted-foreground">
            Analyze and optimize your return on investment across campaigns and incentives
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <DashboardCustomizer type="performance" onSave={handleSaveCustomization} />
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <Tabs defaultValue="calculator" className="space-y-6">
        <TabsList>
          <TabsTrigger value="calculator">ROI Calculator</TabsTrigger>
          <TabsTrigger value="campaigns">Campaign ROI</TabsTrigger>
          <TabsTrigger value="incentives">Incentive ROI</TabsTrigger>
          <TabsTrigger value="comparison">Strategy Comparison</TabsTrigger>
        </TabsList>

        <TabsContent value="calculator">
          <ROIAnalysis />
        </TabsContent>

        <TabsContent value="campaigns">
          <Card>
            <CardHeader>
              <CardTitle>Campaign ROI Analysis</CardTitle>
              <CardDescription>ROI breakdown by campaign</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Campaign ROI analysis will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="incentives">
          <Card>
            <CardHeader>
              <CardTitle>Incentive ROI Analysis</CardTitle>
              <CardDescription>ROI breakdown by incentive type</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Incentive ROI analysis will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparison">
          <Card>
            <CardHeader>
              <CardTitle>Strategy Comparison</CardTitle>
              <CardDescription>Compare ROI across different strategies</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Strategy comparison will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
