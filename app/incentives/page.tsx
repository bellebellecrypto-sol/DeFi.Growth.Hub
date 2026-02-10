"use client"

import { useInterfaceMode } from "@/contexts/interface-mode-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Filter, Gift, Coins, Award, Edit, Play } from "lucide-react"

export default function IncentivesPage() {
  const { mode } = useInterfaceMode()

  const incentives = [
    {
      id: 1,
      name: "Early Adopter Token Reward",
      type: "Token",
      description: "Reward users with tokens for early platform adoption",
      campaign: "Early Adopter Rewards",
      status: "active",
      recipients: 450,
      claimed: 320,
      amount: "50 USDC",
      claimRate: 71,
    },
    {
      id: 2,
      name: "Community Contribution NFT",
      type: "NFT",
      description: "Exclusive NFT for community contributors",
      campaign: "Community Builder Program",
      status: "active",
      recipients: 1250,
      claimed: 980,
      amount: "1 NFT",
      claimRate: 78,
    },
    {
      id: 3,
      name: "Developer Grant",
      type: "Token",
      description: "Grants for developers building on the platform",
      campaign: "Developer Incentives",
      status: "active",
      recipients: 650,
      claimed: 420,
      amount: "500 USDC",
      claimRate: 65,
    },
    {
      id: 4,
      name: "Referral Bonus",
      type: "Token",
      description: "Reward for referring new users",
      campaign: "Referral Program",
      status: "draft",
      recipients: 0,
      claimed: 0,
      amount: "25 USDC",
      claimRate: 0,
    },
  ]

  const templates = [
    {
      id: 1,
      name: "Referral Program",
      type: "Token",
      description: "Standard referral program with tiered rewards",
      usageCount: 12,
      category: "Growth",
    },
    {
      id: 2,
      name: "Staking Rewards",
      type: "Token",
      description: "Rewards based on staking duration and amount",
      usageCount: 8,
      category: "DeFi",
    },
    {
      id: 3,
      name: "Community NFT",
      type: "NFT",
      description: "Tiered NFT rewards for community participation",
      usageCount: 5,
      category: "Community",
    },
    {
      id: 4,
      name: "Achievement Badges",
      type: "NFT",
      description: "Digital badges for completing specific actions",
      usageCount: 15,
      category: "Gamification",
    },
  ]

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Token":
        return <Coins className="h-4 w-4" />
      case "NFT":
        return <Award className="h-4 w-4" />
      default:
        return <Gift className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "default"
      case "draft":
        return "outline"
      case "paused":
        return "secondary"
      default:
        return "outline"
    }
  }

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Incentives</h1>
          <p className="text-muted-foreground">
            {mode === "classic"
              ? "Create and manage reward programs for your users"
              : "Advanced incentive management with detailed configuration and analytics"}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Create Incentive
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search incentives..." className="pl-8" />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filter
        </Button>
      </div>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Active Incentives</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="draft">Draft</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {incentives
              .filter((incentive) => incentive.status === "active")
              .map((incentive) => (
                <Card key={incentive.id} className="flex flex-col">
                  <CardHeader className="flex flex-row items-start justify-between space-y-0">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <CardTitle className="text-base">{incentive.name}</CardTitle>
                        <Badge variant="outline" className="gap-1">
                          {getTypeIcon(incentive.type)}
                          {incentive.type}
                        </Badge>
                      </div>
                      <CardDescription>{incentive.description}</CardDescription>
                    </div>
                    <Badge variant={getStatusColor(incentive.status)}>{incentive.status}</Badge>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Campaign</p>
                          <p className="font-medium text-xs">{incentive.campaign}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Amount</p>
                          <p className="font-medium">{incentive.amount}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Audiences</p>
                          <p className="font-medium">{incentive.recipients.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Claimed</p>
                          <p className="font-medium">{incentive.claimed.toLocaleString()}</p>
                        </div>
                      </div>

                      {mode === "advanced" && (
                        <div className="pt-2 border-t">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Claim Rate</span>
                            <span className="font-medium">{incentive.claimRate}%</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {templates.map((template) => (
              <Card key={template.id}>
                <CardHeader className="flex flex-row items-start justify-between space-y-0">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <CardTitle className="text-base">{template.name}</CardTitle>
                      <Badge variant="outline" className="gap-1">
                        {getTypeIcon(template.type)}
                        {template.type}
                      </Badge>
                    </div>
                    <CardDescription>{template.description}</CardDescription>
                  </div>
                  <Badge variant="secondary">{template.category}</Badge>
                </CardHeader>
                <CardContent>
                  <div className="text-sm">
                    <p className="text-muted-foreground">
                      Used in <span className="font-medium">{template.usageCount}</span> campaigns
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit Template
                  </Button>
                  <Button size="sm" className="flex-1">
                    Use Template
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="draft">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {incentives
              .filter((incentive) => incentive.status === "draft")
              .map((incentive) => (
                <Card key={incentive.id}>
                  <CardHeader>
                    <div className="flex items-center space-x-2 mb-1">
                      <CardTitle className="text-base">{incentive.name}</CardTitle>
                      <Badge variant="outline" className="gap-1">
                        {getTypeIcon(incentive.type)}
                        {incentive.type}
                      </Badge>
                    </div>
                    <CardDescription>{incentive.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Amount</span>
                        <span className="font-medium">{incentive.amount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Campaign</span>
                        <span className="font-medium text-xs">{incentive.campaign}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button size="sm" className="flex-1">
                      <Play className="h-4 w-4 mr-1" />
                      Publish
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="completed">
          <div className="text-center py-12">
            <h3 className="text-lg font-medium mb-2">No Completed Incentives</h3>
            <p className="text-muted-foreground">Completed incentives will appear here once their campaigns finish.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
