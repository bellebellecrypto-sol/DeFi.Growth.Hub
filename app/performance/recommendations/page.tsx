"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Lightbulb, TrendingUp, Target, Users, ArrowRight, Check, Clock } from "lucide-react"
import { DashboardCustomizer } from "@/components/dashboard-customizer"

export default function RecommendationsPage() {
  const handleSaveCustomization = (config: any) => {
    console.log("Saved customization:", config)
    // In a real app, you would save this to user preferences
  }

  const campaignRecommendations = [
    {
      title: "Increase reward emissions for SOL-ROOG pool",
      description: "This pool has shown 32% higher engagement than average but has lower emissions.",
      impact: "High",
      effort: "Low",
      category: "Emissions",
      confidence: 92,
    },
    {
      title: "Consolidate low-performing pools",
      description: "5 pools with <1% TVL share are consuming 12% of total emissions.",
      impact: "Medium",
      effort: "Medium",
      category: "Consolidation",
      confidence: 87,
    },
    {
      title: "Launch new ORCA-USDC incentive program",
      description: "Analysis shows high demand for stablecoin pairing with governance token.",
      impact: "High",
      effort: "High",
      category: "New Program",
      confidence: 78,
    },
  ]

  const audienceRecommendations = [
    {
      title: "Target high-volume traders",
      description: "Create a dedicated incentive program for users with >$10k monthly volume.",
      impact: "High",
      effort: "Medium",
      category: "Segmentation",
      confidence: 89,
    },
    {
      title: "Re-engage dormant users",
      description: "1,240 users with previous high activity haven't transacted in 30+ days.",
      impact: "Medium",
      effort: "Low",
      category: "Re-engagement",
      confidence: 84,
    },
  ]

  const incentiveRecommendations = [
    {
      title: "Implement tiered rewards structure",
      description: "Graduated rewards based on user activity level can increase retention by 24%.",
      impact: "High",
      effort: "Medium",
      category: "Structure",
      confidence: 91,
    },
    {
      title: "Adjust reward vesting schedule",
      description: "Extending vesting period from 7 to 14 days could improve long-term retention.",
      impact: "Medium",
      effort: "Low",
      category: "Timing",
      confidence: 82,
    },
  ]

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "High":
        return "bg-green-500"
      case "Medium":
        return "bg-yellow-500"
      case "Low":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  const getEffortColor = (effort: string) => {
    switch (effort) {
      case "Low":
        return "bg-green-500"
      case "Medium":
        return "bg-yellow-500"
      case "High":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const renderRecommendationCard = (recommendation: any, index: number) => (
    <Card key={index} className="mb-4">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{recommendation.title}</CardTitle>
          <Badge variant="outline">{recommendation.category}</Badge>
        </div>
        <CardDescription>{recommendation.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <div className="mr-2 text-sm font-medium">Impact:</div>
            <div className="flex items-center">
              <div className={`h-3 w-3 rounded-full mr-1 ${getImpactColor(recommendation.impact)}`}></div>
              <span>{recommendation.impact}</span>
            </div>
          </div>
          <div className="flex items-center">
            <div className="mr-2 text-sm font-medium">Effort:</div>
            <div className="flex items-center">
              <div className={`h-3 w-3 rounded-full mr-1 ${getEffortColor(recommendation.effort)}`}></div>
              <span>{recommendation.effort}</span>
            </div>
          </div>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span>Confidence</span>
            <span>{recommendation.confidence}%</span>
          </div>
          <Progress value={recommendation.confidence} className="h-2" />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm" className="gap-1">
          <Clock className="h-4 w-4" />
          Schedule
        </Button>
        <Button variant="outline" size="sm" className="gap-1">
          <Check className="h-4 w-4" />
          Apply Now
        </Button>
        <Button size="sm" className="gap-1">
          Details
          <ArrowRight className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Smart Recommendations</h1>
          <p className="text-muted-foreground">
            Data-driven recommendations to optimize your campaigns, incentives, and audience targeting
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <DashboardCustomizer type="performance" onSave={handleSaveCustomization} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center space-x-2">
              <Lightbulb className="h-4 w-4 text-amber-500" />
              <CardTitle className="text-sm font-medium">Total Recommendations</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">10</div>
            <p className="text-xs text-muted-foreground">3 high impact, 5 medium, 2 low</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <CardTitle className="text-sm font-medium">Potential ROI Increase</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+24.5%</div>
            <p className="text-xs text-muted-foreground">If all recommendations applied</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center space-x-2">
              <Target className="h-4 w-4 text-blue-500" />
              <CardTitle className="text-sm font-medium">Campaign Optimizations</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">3 high confidence, 2 experimental</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-purple-500" />
              <CardTitle className="text-sm font-medium">Audience Insights</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">New targeting opportunities</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All Recommendations</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="incentives">Incentives</TabsTrigger>
          <TabsTrigger value="audience">Audience</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">High Impact Recommendations</h3>
              <div className="space-y-4">
                {[...campaignRecommendations, ...audienceRecommendations, ...incentiveRecommendations]
                  .filter((rec) => rec.impact === "High")
                  .map((rec, i) => renderRecommendationCard(rec, i))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">Other Recommendations</h3>
              <div className="space-y-4">
                {[...campaignRecommendations, ...audienceRecommendations, ...incentiveRecommendations]
                  .filter((rec) => rec.impact !== "High")
                  .map((rec, i) => renderRecommendationCard(rec, i))}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="campaigns">
          <div className="space-y-4">{campaignRecommendations.map((rec, i) => renderRecommendationCard(rec, i))}</div>
        </TabsContent>

        <TabsContent value="incentives">
          <div className="space-y-4">{incentiveRecommendations.map((rec, i) => renderRecommendationCard(rec, i))}</div>
        </TabsContent>

        <TabsContent value="audience">
          <div className="space-y-4">{audienceRecommendations.map((rec, i) => renderRecommendationCard(rec, i))}</div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
