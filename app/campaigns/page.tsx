"use client"

import { useInterfaceMode } from "@/contexts/interface-mode-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Plus, Search, Filter, Edit, Copy, Archive, Play, Pause } from "lucide-react"
import { PageHeader } from "@/components/page-header"

export default function CampaignsPage() {
  const { mode } = useInterfaceMode()

  const campaigns = [
    {
      id: 1,
      name: "Early Adopter Rewards",
      description: "Incentivize early platform adoption with token rewards",
      status: "active",
      progress: 68,
      recipients: 450,
      startDate: "May 15, 2023",
      endDate: "Aug 15, 2023",
      budget: "$5,000",
      spent: "$3,400",
    },
    {
      id: 2,
      name: "Community Builder Program",
      description: "Reward users who contribute to community growth",
      status: "active",
      progress: 42,
      recipients: 1250,
      startDate: "Jun 1, 2023",
      endDate: "Sep 30, 2023",
      budget: "$15,000",
      spent: "$6,300",
    },
    {
      id: 3,
      name: "Developer Incentives",
      description: "Encourage developers to build on our platform",
      status: "active",
      progress: 89,
      recipients: 650,
      startDate: "Apr 10, 2023",
      endDate: "Jul 10, 2023",
      budget: "$50,000",
      spent: "$44,500",
    },
    {
      id: 4,
      name: "Referral Program",
      description: "Reward users for referring new members",
      status: "draft",
      progress: 0,
      recipients: 0,
      startDate: "Pending",
      endDate: "Pending",
      budget: "$8,000",
      spent: "$0",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "default"
      case "draft":
        return "outline"
      case "paused":
        return "secondary"
      case "completed":
        return "secondary"
      default:
        return "outline"
    }
  }

  const getCampaignActions = (campaign: any) => {
    const actions = [
      { icon: Edit, label: "Edit", variant: "outline" as const },
      { icon: Copy, label: "Duplicate", variant: "outline" as const },
    ]

    if (campaign.status === "active") {
      actions.push({ icon: Pause, label: "Pause", variant: "outline" as const })
    } else if (campaign.status === "draft" || campaign.status === "paused") {
      actions.push({ icon: Play, label: "Start", variant: "default" as const })
    }

    if (campaign.status !== "active") {
      actions.push({ icon: Archive, label: "Archive", variant: "outline" as const })
    }

    return actions
  }

  const handleFilterClick = () => {
    console.log("Campaign filter clicked")
    // Add filter logic here
  }

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <PageHeader
        title="Campaigns"
        subtitle="Manage and monitor your incentive campaigns"
        showIconButton={true}
        iconButtonVariant="filter"
        onIconButtonClick={handleFilterClick}
      >
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Campaign
        </Button>
      </PageHeader>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search campaigns..." className="pl-8" />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filter
        </Button>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Campaigns</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="draft">Draft</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {campaigns.map((campaign) => (
              <Card key={campaign.id} className="flex flex-col">
                <CardHeader className="flex flex-row items-start justify-between space-y-0">
                  <div className="flex-1">
                    <CardTitle className="text-base">{campaign.name}</CardTitle>
                    <CardDescription className="mt-1">{campaign.description}</CardDescription>
                  </div>
                  <Badge variant={getStatusColor(campaign.status)}>{campaign.status}</Badge>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Progress</span>
                        <span>{campaign.progress}%</span>
                      </div>
                      <Progress value={campaign.progress} className="h-2" />
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Audiences</p>
                        <p className="font-medium">{campaign.recipients.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Budget</p>
                        <p className="font-medium">{campaign.budget}</p>
                      </div>
                      {mode === "advanced" && (
                        <>
                          <div>
                            <p className="text-muted-foreground">Spent</p>
                            <p className="font-medium">{campaign.spent}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Remaining</p>
                            <p className="font-medium">
                              $
                              {(
                                Number.parseInt(campaign.budget.replace("$", "").replace(",", "")) -
                                Number.parseInt(campaign.spent.replace("$", "").replace(",", ""))
                              ).toLocaleString()}
                            </p>
                          </div>
                        </>
                      )}
                    </div>

                    {mode === "advanced" && (
                      <div className="pt-2 border-t">
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-muted-foreground">Start:</span>
                            <span className="ml-1">{campaign.startDate}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">End:</span>
                            <span className="ml-1">{campaign.endDate}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex gap-2">
                  {getCampaignActions(campaign)
                    .slice(0, 2)
                    .map((action, index) => (
                      <Button key={index} variant={action.variant} size="sm" className="flex-1">
                        <action.icon className="h-4 w-4 mr-1" />
                        {action.label}
                      </Button>
                    ))}
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="active">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {campaigns
              .filter((c) => c.status === "active")
              .map((campaign) => (
                <Card key={campaign.id}>
                  <CardHeader>
                    <CardTitle className="text-base">{campaign.name}</CardTitle>
                    <CardDescription>{campaign.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Progress</span>
                        <span>{campaign.progress}%</span>
                      </div>
                      <Progress value={campaign.progress} className="h-2" />
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Audiences</p>
                        <p className="font-medium">{campaign.recipients.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Budget</p>
                        <p className="font-medium">{campaign.budget}</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      Manage Campaign
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="draft">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {campaigns
              .filter((c) => c.status === "draft")
              .map((campaign) => (
                <Card key={campaign.id}>
                  <CardHeader>
                    <CardTitle className="text-base">{campaign.name}</CardTitle>
                    <CardDescription>{campaign.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Status</span>
                        <Badge variant="outline">Draft</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Budget</span>
                        <span className="font-medium">{campaign.budget}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button size="sm" className="flex-1">
                      <Play className="h-4 w-4 mr-1" />
                      Launch
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="completed">
          <div className="text-center py-12">
            <h3 className="text-lg font-medium mb-2">No Completed Campaigns</h3>
            <p className="text-muted-foreground">Completed campaigns will appear here once they finish running.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
