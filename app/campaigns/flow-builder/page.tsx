"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Save,
  Eye,
  Rocket,
  Plus,
  Settings,
  Layers,
  Filter,
  Users,
  FileCode,
  Gift,
  ArrowRight,
} from "lucide-react"
import { CampaignFlowDesigner } from "@/components/campaign-flow-designer"

export default function FlowBuilderPage() {
  const [campaignData, setCampaignData] = useState({
    name: "Raydium Multi-tier Campaign",
    description: "Complex multi-tier reward system",
    objective: "engagement",
    startDate: "",
    endDate: "",
    totalBudget: "34000",
    currency: "RAY",
  })

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
              <h1 className="text-3xl font-bold tracking-tight">Campaign Flow Builder</h1>
              <p className="text-muted-foreground">Create complex multi-tier incentivized campaigns visually</p>
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

        <div className="grid gap-6 lg:grid-cols-4">
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Campaign Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Campaign Name</Label>
                  <Input
                    id="name"
                    value={campaignData.name}
                    onChange={(e) => setCampaignData({ ...campaignData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="objective">Campaign Objective</Label>
                  <Select
                    value={campaignData.objective}
                    onValueChange={(value) => setCampaignData({ ...campaignData, objective: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select objective" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="acquisition">User Acquisition</SelectItem>
                      <SelectItem value="engagement">Increase Engagement</SelectItem>
                      <SelectItem value="retention">User Retention</SelectItem>
                      <SelectItem value="liquidity">Increase Liquidity</SelectItem>
                      <SelectItem value="volume">Trading Volume</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Schedule</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="startDate" className="text-xs">
                        Start Date
                      </Label>
                      <Input type="date" id="startDate" />
                    </div>
                    <div>
                      <Label htmlFor="endDate" className="text-xs">
                        End Date
                      </Label>
                      <Input type="date" id="endDate" />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Budget</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-2">
                      <Input
                        type="text"
                        value={campaignData.totalBudget}
                        onChange={(e) => setCampaignData({ ...campaignData, totalBudget: e.target.value })}
                      />
                    </div>
                    <div>
                      <Input
                        value={campaignData.currency}
                        onChange={(e) => setCampaignData({ ...campaignData, currency: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Flow Elements</CardTitle>
                <CardDescription>Drag elements to build your flow</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-col gap-2">
                    <div className="border rounded-md p-3 flex items-center justify-between bg-muted/50 cursor-grab">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2" />
                        <span>Audience Source</span>
                      </div>
                      <Badge variant="outline">Start</Badge>
                    </div>
                    <div className="border rounded-md p-3 flex items-center bg-muted/50 cursor-grab">
                      <Filter className="h-4 w-4 mr-2" />
                      <span>Filter Condition</span>
                    </div>
                    <div className="border rounded-md p-3 flex items-center bg-muted/50 cursor-grab">
                      <FileCode className="h-4 w-4 mr-2" />
                      <span>SQL Query</span>
                    </div>
                    <div className="border rounded-md p-3 flex items-center bg-muted/50 cursor-grab">
                      <Layers className="h-4 w-4 mr-2" />
                      <span>Segment Splitter</span>
                    </div>
                    <div className="border rounded-md p-3 flex items-center bg-muted/50 cursor-grab">
                      <Gift className="h-4 w-4 mr-2" />
                      <span>Reward Action</span>
                    </div>
                    <div className="border rounded-md p-3 flex items-center bg-muted/50 cursor-grab">
                      <ArrowRight className="h-4 w-4 mr-2" />
                      <span>Connector</span>
                    </div>
                    <div className="border rounded-md p-3 flex items-center bg-muted/50 cursor-grab">
                      <Settings className="h-4 w-4 mr-2" />
                      <span>Custom Logic</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Campaign Recipe</CardTitle>
                <CardDescription>Save or load campaign templates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select template" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="multi-tier">Multi-tier Leaderboard</SelectItem>
                    <SelectItem value="raffle">Daily Raffle Campaign</SelectItem>
                    <SelectItem value="trade-and-earn">Trade & Earn</SelectItem>
                    <SelectItem value="creator">Creator Rewards</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex flex-col gap-2">
                  <Button variant="outline" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Save as Template
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Visual Flow Designer</CardTitle>
                <CardDescription>Build your campaign flow by connecting elements</CardDescription>
              </CardHeader>
              <CardContent className="py-4">
                <CampaignFlowDesigner />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distribution Configuration</CardTitle>
                <CardDescription>Configure reward amount allocation for each tier</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid gap-4">
                    <div className="rounded-lg border p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <Badge className="mr-2">Tier 1</Badge>
                          <h3 className="font-medium">Creator Rewards</h3>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">15,000 RAY</Badge>
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="text-muted-foreground">Distribution Method</div>
                            <div className="font-medium">SQL Algorithm</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Recipients</div>
                            <div className="font-medium">~500 creators</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Frequency</div>
                            <div className="font-medium">Daily</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Exclusions</div>
                            <div className="font-medium">Tier 2 & 3 winners</div>
                          </div>
                        </div>
                        <div className="text-xs bg-muted p-2 rounded-md font-mono">
                          SELECT wallet_address, SUM(social_score) as score
                          <br />
                          FROM creator_actions
                          <br />
                          WHERE timestamp &gt; current_date - interval '7' day
                          <br />
                          GROUP BY wallet_address
                          <br />
                          ORDER BY score DESC
                          <br />
                          LIMIT 500
                        </div>
                      </div>
                    </div>

                    <div className="rounded-lg border p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <Badge className="mr-2">Tier 2</Badge>
                          <h3 className="font-medium">Leaderboard Rewards</h3>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">14,000 RAY</Badge>
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="text-muted-foreground">Distribution Method</div>
                            <div className="font-medium">Volume-based Ranking</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Recipients</div>
                            <div className="font-medium">Top 100 traders</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Frequency</div>
                            <div className="font-medium">Weekly</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Exclusions</div>
                            <div className="font-medium">Tier 1 winners</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge>Rank 1-10: 500 RAY each</Badge>
                          <Badge>Rank 11-50: 150 RAY each</Badge>
                          <Badge>Rank 51-100: 50 RAY each</Badge>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-lg border p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <Badge className="mr-2">Tier 3</Badge>
                          <h3 className="font-medium">Raffle Rewards</h3>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">5,000 RAY</Badge>
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="text-muted-foreground">Distribution Method</div>
                            <div className="font-medium">Tiered Raffle System</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Recipients</div>
                            <div className="font-medium">250 random winners</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Frequency</div>
                            <div className="font-medium">Daily</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Exclusions</div>
                            <div className="font-medium">Tier 1 & 2 winners</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge>10 winners: 100 RAY each</Badge>
                          <Badge>40 winners: 50 RAY each</Badge>
                          <Badge>200 winners: 10 RAY each</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Back</Button>
                <Button>Save Configuration</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
