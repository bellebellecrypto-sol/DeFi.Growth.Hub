"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AutomatedSegmentDashboard } from "@/components/automated-segment-dashboard"
import { BehaviorMonitoring } from "@/components/behavior-monitoring"

export default function AutomatedSegmentsPage() {
  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList>
          <TabsTrigger value="dashboard">Segment Dashboard</TabsTrigger>
          <TabsTrigger value="monitoring">Behavior Monitoring</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <AutomatedSegmentDashboard />
        </TabsContent>

        <TabsContent value="monitoring">
          <BehaviorMonitoring />
        </TabsContent>
      </Tabs>
    </div>
  )
}
