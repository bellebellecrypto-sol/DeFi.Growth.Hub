import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, Users, DollarSign, Target } from "lucide-react"

export function DashboardOverview() {
  const metrics = [
    {
      title: "Active Campaigns",
      value: "12",
      change: "+2",
      trend: "up",
      icon: Target,
    },
    {
      title: "Total Recipients",
      value: "3,240",
      change: "+12%",
      trend: "up",
      icon: Users,
    },
    {
      title: "Rewards Distributed",
      value: "$28,560",
      change: "+18%",
      trend: "up",
      icon: DollarSign,
    },
    {
      title: "Avg. Conversion Rate",
      value: "24.5%",
      change: "+2.1%",
      trend: "up",
      icon: TrendingUp,
    },
  ]

  const activeCampaigns = [
    {
      name: "Early Adopter Rewards",
      status: "active",
      progress: 68,
      recipients: 450,
      budget: "$5,000",
      spent: "$3,400",
    },
    {
      name: "Community Builder Program",
      status: "active",
      progress: 42,
      recipients: 1250,
      budget: "$15,000",
      spent: "$6,300",
    },
    {
      name: "Developer Incentives",
      status: "active",
      progress: 89,
      recipients: 650,
      budget: "$50,000",
      spent: "$44,500",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
              <metric.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                {metric.trend === "up" ? (
                  <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                )}
                <span className={metric.trend === "up" ? "text-green-500" : "text-red-500"}>{metric.change}</span>
                <span className="ml-1">from last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="campaigns" className="space-y-4">
        <TabsList>
          <TabsTrigger value="campaigns">Active Campaigns</TabsTrigger>
          <TabsTrigger value="recent">Recent Activity</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns" className="space-y-4">
          <div className="grid gap-4">
            {activeCampaigns.map((campaign) => (
              <Card key={campaign.name}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{campaign.name}</CardTitle>
                    <Badge variant="default">Active</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Progress</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Progress value={campaign.progress} className="flex-1 h-2" />
                        <span className="font-medium">{campaign.progress}%</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Recipients</p>
                      <p className="font-medium mt-1">{campaign.recipients}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Budget</p>
                      <p className="font-medium mt-1">{campaign.budget}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Spent</p>
                      <p className="font-medium mt-1">{campaign.spent}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
