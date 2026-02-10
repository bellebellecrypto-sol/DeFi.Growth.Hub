import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Users, TrendingUp, TrendingDown, Edit, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function AudienceSegmentation() {
  const segments = [
    {
      id: 1,
      name: "New Users",
      description: "Users (wallets) who joined in the last 30 days",
      recipientCount: 1250,
      growth: "+12%",
      growthTrend: "up",
      activeCampaigns: 3,
      conversionRate: 18,
      avgReward: "$45.50",
      criteria: ["Registration date < 30 days", "First transaction completed"],
    },
    {
      id: 2,
      name: "Power Users",
      description: "Users with high engagement metrics",
      recipientCount: 450,
      growth: "+8%",
      growthTrend: "up",
      activeCampaigns: 2,
      conversionRate: 35,
      avgReward: "$125.75",
      criteria: ["Daily active for 7+ days", "Multiple transactions", "High platform engagement"],
    },
    {
      id: 3,
      name: "Developers",
      description: "Users identified as developers",
      recipientCount: 650,
      growth: "+15%",
      growthTrend: "up",
      activeCampaigns: 1,
      conversionRate: 42,
      avgReward: "$280.00",
      criteria: ["GitHub integration", "Smart contract interactions", "Developer tools usage"],
    },
    {
      id: 4,
      name: "Inactive Users",
      description: "Users with no activity in 60+ days",
      recipientCount: 850,
      growth: "-5%",
      growthTrend: "down",
      activeCampaigns: 1,
      conversionRate: 8,
      avgReward: "$15.25",
      criteria: ["No activity > 60 days", "No recent transactions"],
    },
    {
      id: 5,
      name: "High-Value Users",
      description: "Users with significant token holdings",
      recipientCount: 320,
      growth: "+22%",
      growthTrend: "up",
      activeCampaigns: 2,
      conversionRate: 58,
      avgReward: "$450.00",
      criteria: ["Token holdings > $10,000", "Premium features usage", "VIP status"],
    },
    {
      id: 6,
      name: "Community Contributors",
      description: "Active community members and contributors",
      recipientCount: 580,
      growth: "+18%",
      growthTrend: "up",
      activeCampaigns: 3,
      conversionRate: 28,
      avgReward: "$85.50",
      criteria: ["Forum participation", "Content creation", "Community events attendance"],
    },
  ]

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {segments.map((segment) => (
          <Card key={segment.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-primary" />
                  <div>
                    <CardTitle className="text-base">{segment.name}</CardTitle>
                    <CardDescription className="text-sm">{segment.description}</CardDescription>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem className="gap-2">
                      <Edit className="h-4 w-4" />
                      Edit Segment
                    </DropdownMenuItem>
                    <DropdownMenuItem>View Recipients</DropdownMenuItem>
                    <DropdownMenuItem>Export Data</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">Delete Segment</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-muted-foreground">Recipients</div>
                  <div className="flex items-center space-x-1">
                    <span className="font-bold text-lg">{segment.recipientCount.toLocaleString()}</span>
                    <div className="flex items-center">
                      {segment.growthTrend === "up" ? (
                        <TrendingUp className="h-3 w-3 text-green-500" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-red-500" />
                      )}
                      <span className={`text-xs ${segment.growthTrend === "up" ? "text-green-500" : "text-red-500"}`}>
                        {segment.growth}
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground">Active Campaigns</div>
                  <div className="font-bold text-lg">{segment.activeCampaigns}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Conversion Rate</div>
                  <div className="flex items-center space-x-2">
                    <Progress value={segment.conversionRate} className="flex-1 h-2" />
                    <span className="text-sm font-medium">{segment.conversionRate}%</span>
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground">Avg. Reward</div>
                  <div className="font-bold text-lg">{segment.avgReward}</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium">Criteria:</div>
                <div className="flex flex-wrap gap-1">
                  {segment.criteria.map((criterion, i) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      {criterion}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <Button variant="outline" className="w-full">
                View Recipients
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
