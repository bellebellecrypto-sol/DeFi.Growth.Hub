"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardHeader } from "@/components/dashboard-header"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { CampaignSetupWizard } from "@/components/campaign-setup-wizard"
import { AudienceCreationTools } from "@/components/audience-creation-tools"
import { IncentiveCreationWorkflow } from "@/components/incentive-creation-workflow"
import { RewardsDistributionConfig } from "@/components/rewards-distribution-config"
import { ArrowLeft, Save, Eye, Rocket } from "lucide-react"

export default function CreateCampaignPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [campaignData, setCampaignData] = useState({
    name: "",
    description: "",
    objective: "",
    startDate: "",
    endDate: "",
    budget: "",
    audience: null,
    incentives: [],
    distribution: null,
  })

  const steps = [
    { id: "details", title: "Campaign Details", description: "Basic information and goals" },
    { id: "audience", title: "Target Audience", description: "Define who will receive incentives" },
    { id: "incentives", title: "Incentive Setup", description: "Configure rewards and conditions" },
    { id: "distribution", title: "Distribution", description: "Set up reward delivery" },
    { id: "review", title: "Review & Launch", description: "Final review before publishing" },
  ]

  const progress = ((currentStep + 1) / steps.length) * 100

  return (
    <div className="flex min-h-screen w-full flex-col">
      <DashboardHeader />
      <main className="flex-1 space-y-6 p-8 pt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Create Campaign</h1>
              <p className="text-muted-foreground">Set up a new incentive campaign to engage your audience</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" className="gap-2">
              <Save className="h-4 w-4" />
              Save Draft
            </Button>
            <Button variant="outline" className="gap-2">
              <Eye className="h-4 w-4" />
              Preview
            </Button>
            <Button className="gap-2">
              <Rocket className="h-4 w-4" />
              Publish Campaign
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Campaign Setup Wizard</CardTitle>
                <CardDescription>Follow these steps to create your campaign</CardDescription>
              </div>
              <Badge variant="outline">
                {currentStep + 1} of {steps.length}
              </Badge>
            </div>
            <div className="space-y-2">
              <Progress value={progress} className="h-2" />
              <div className="flex justify-between text-sm text-muted-foreground">
                {steps.map((step, index) => (
                  <span key={step.id} className={index <= currentStep ? "text-primary" : ""}>
                    {step.title}
                  </span>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={steps[currentStep].id} className="space-y-6">
              <TabsContent value="details">
                <CampaignSetupWizard data={campaignData} onUpdate={setCampaignData} onNext={() => setCurrentStep(1)} />
              </TabsContent>

              <TabsContent value="audience">
                <AudienceCreationTools
                  data={campaignData}
                  onUpdate={setCampaignData}
                  onNext={() => setCurrentStep(2)}
                  onBack={() => setCurrentStep(0)}
                />
              </TabsContent>

              <TabsContent value="incentives">
                <IncentiveCreationWorkflow
                  data={campaignData}
                  onUpdate={setCampaignData}
                  onNext={() => setCurrentStep(3)}
                  onBack={() => setCurrentStep(1)}
                />
              </TabsContent>

              <TabsContent value="distribution">
                <RewardsDistributionConfig
                  data={campaignData}
                  onUpdate={setCampaignData}
                  onNext={() => setCurrentStep(4)}
                  onBack={() => setCurrentStep(2)}
                />
              </TabsContent>

              <TabsContent value="review">
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold">Review Your Campaign</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Campaign Details</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2 text-sm">
                        <div>
                          <span className="font-medium">Name:</span> {campaignData.name || "Not set"}
                        </div>
                        <div>
                          <span className="font-medium">Objective:</span> {campaignData.objective || "Not set"}
                        </div>
                        <div>
                          <span className="font-medium">Budget:</span> {campaignData.budget || "Not set"}
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Configuration Summary</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2 text-sm">
                        <div>
                          <span className="font-medium">Audience:</span>{" "}
                          {campaignData.audience ? "Configured" : "Not set"}
                        </div>
                        <div>
                          <span className="font-medium">Incentives:</span> {campaignData.incentives.length} configured
                        </div>
                        <div>
                          <span className="font-medium">Distribution:</span>{" "}
                          {campaignData.distribution ? "Configured" : "Not set"}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setCurrentStep(3)}>
                      Back
                    </Button>
                    <Button className="gap-2">
                      <Rocket className="h-4 w-4" />
                      Launch Campaign
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
