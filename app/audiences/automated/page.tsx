import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Brain, Users, Activity, Settings, Plus, Zap, Target, Clock, BarChart3 } from "lucide-react"

export default function AutomatedSegmentsPage() {
  const handleSettingsClick = () => {
    console.log("Automated segments settings clicked")
    // Add settings logic here
  }

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <PageHeader
        title="Automated Segments"
        subtitle="AI-powered audience segmentation based on user behavior patterns"
        showBackNavigation={true}
        parentPath="/audiences"
        parentLabel="Audiences"
        showIconButton={true}
        iconButtonVariant="settings"
        onIconButtonClick={handleSettingsClick}
      >
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Create Segment
        </Button>
      </PageHeader>

      <Tabs defaultValue="active" className="space-y-6">
        <TabsList>
          <TabsTrigger value="active">Active Segments</TabsTrigger>
          <TabsTrigger value="patterns">Behavior Patterns</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* High-Value Users Segment */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">High-Value Users</CardTitle>
                <Badge variant="secondary" className="gap-1">
                  <Brain className="h-3 w-3" />
                  AI
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2,847</div>
                <p className="text-xs text-muted-foreground">Users with high transaction volume</p>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Growth this week</span>
                    <span className="text-green-600">+12.3%</span>
                  </div>
                  <Progress value={78} className="h-2" />
                </div>
                <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  Updated 2 hours ago
                </div>
              </CardContent>
            </Card>

            {/* Power Users Segment */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Power Users</CardTitle>
                <Badge variant="secondary" className="gap-1">
                  <Activity className="h-3 w-3" />
                  Active
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,234</div>
                <p className="text-xs text-muted-foreground">Highly engaged daily active users</p>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Engagement score</span>
                    <span className="text-blue-600">94%</span>
                  </div>
                  <Progress value={94} className="h-2" />
                </div>
                <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  Updated 1 hour ago
                </div>
              </CardContent>
            </Card>

            {/* New Users Segment */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">New Users</CardTitle>
                <Badge variant="outline" className="gap-1">
                  <Users className="h-3 w-3" />
                  Growing
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">567</div>
                <p className="text-xs text-muted-foreground">Users joined in the last 30 days</p>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Retention rate</span>
                    <span className="text-green-600">67%</span>
                  </div>
                  <Progress value={67} className="h-2" />
                </div>
                <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  Updated 30 minutes ago
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Segment Performance Overview
              </CardTitle>
              <CardDescription>Real-time analytics for all automated segments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Total Segments</p>
                  <p className="text-2xl font-bold">12</p>
                  <p className="text-xs text-muted-foreground">3 created this week</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Total Users</p>
                  <p className="text-2xl font-bold">8,456</p>
                  <p className="text-xs text-muted-foreground">+15.2% from last week</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Avg. Engagement</p>
                  <p className="text-2xl font-bold">82%</p>
                  <p className="text-xs text-muted-foreground">+5.1% improvement</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patterns" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Behavior Pattern Analysis</CardTitle>
              <CardDescription>Discover emerging user behavior patterns and trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <p className="font-medium">High Transaction Frequency</p>
                    <p className="text-sm text-muted-foreground">Users with 10+ transactions per week</p>
                  </div>
                  <Badge variant="secondary">Trending</Badge>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <p className="font-medium">Weekend Activity Spike</p>
                    <p className="text-sm text-muted-foreground">Increased engagement on weekends</p>
                  </div>
                  <Badge variant="outline">Stable</Badge>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <p className="font-medium">Mobile-First Users</p>
                    <p className="text-sm text-muted-foreground">Primarily use mobile applications</p>
                  </div>
                  <Badge variant="secondary">Growing</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  High-Value Customer Template
                </CardTitle>
                <CardDescription>Automatically identify and segment high-value customers</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  Use Template
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Engagement Champions Template
                </CardTitle>
                <CardDescription>Segment users with highest platform engagement</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  Use Template
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Automation Settings
              </CardTitle>
              <CardDescription>Configure how automated segments are created and updated</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Update Frequency</label>
                <select className="w-full p-2 border rounded-md">
                  <option>Real-time</option>
                  <option>Hourly</option>
                  <option>Daily</option>
                  <option>Weekly</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Minimum Segment Size</label>
                <input type="number" className="w-full p-2 border rounded-md" defaultValue="100" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Data Retention Period</label>
                <select className="w-full p-2 border rounded-md">
                  <option>30 days</option>
                  <option>90 days</option>
                  <option>1 year</option>
                  <option>Indefinite</option>
                </select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
