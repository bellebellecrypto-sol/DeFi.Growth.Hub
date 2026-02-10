import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Circle, ArrowRight } from "lucide-react"

export default function OnboardingPage() {
  const steps = [
    { id: 1, title: "Account Setup", completed: true },
    { id: 2, title: "Role Assignment", completed: true },
    { id: 3, title: "Platform Introduction", completed: false },
    { id: 4, title: "First Campaign", completed: false },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Welcome to Torque</h1>
          <p className="text-xl text-muted-foreground">Let's get you set up to create amazing incentive campaigns</p>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex items-center space-x-2">
                  {step.completed ? (
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  ) : (
                    <Circle className="w-6 h-6 text-muted-foreground" />
                  )}
                  <span className={`text-sm ${step.completed ? "text-green-500" : "text-muted-foreground"}`}>
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && <ArrowRight className="w-4 h-4 text-muted-foreground mx-4" />}
              </div>
            ))}
          </div>
          <Progress value={50} className="h-2" />
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Platform Introduction</CardTitle>
            <CardDescription>Learn about Torque's key features and how to get started</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Key Features</h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Campaign Management</h4>
                      <p className="text-sm text-muted-foreground">Create and manage incentive campaigns with ease</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Audience Targeting</h4>
                      <p className="text-sm text-muted-foreground">Segment and target specific user groups</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Reward Distribution</h4>
                      <p className="text-sm text-muted-foreground">
                        Automated reward distribution with blockchain integration
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Analytics & Reporting</h4>
                      <p className="text-sm text-muted-foreground">Track performance and measure campaign impact</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Getting Started</h3>
                <div className="space-y-3">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">1. Create Your First Campaign</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Start by creating a campaign to engage your users
                    </p>
                    <Button size="sm">Create Campaign</Button>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">2. Define Your Audience</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Set up audience segments for targeted campaigns
                    </p>
                    <Button size="sm" variant="outline">
                      Manage Recipients
                    </Button>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">3. Configure Incentives</h4>
                    <p className="text-sm text-muted-foreground mb-3">Set up rewards and distribution mechanisms</p>
                    <Button size="sm" variant="outline">
                      Setup Incentives
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">Skip Tutorial</Button>
            <Button>Continue Setup</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Admin Role Configuration</CardTitle>
            <CardDescription>Configure your admin permissions and team settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="admin-role">Admin Role</Label>
                <Select defaultValue="super-admin">
                  <SelectTrigger id="admin-role">
                    <SelectValue placeholder="Select admin role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="super-admin">Super Admin</SelectItem>
                    <SelectItem value="campaign-manager">Campaign Manager</SelectItem>
                    <SelectItem value="analyst">Analyst</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="organization">Organization</Label>
                <Input id="organization" placeholder="Enter organization name" />
              </div>
            </div>

            <div className="space-y-3">
              <Label>Permissions</Label>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="create-campaigns" defaultChecked />
                  <Label htmlFor="create-campaigns">Create & Edit Campaigns</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="manage-recipients" defaultChecked />
                  <Label htmlFor="manage-recipients">Manage Recipients</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="distribute-rewards" defaultChecked />
                  <Label htmlFor="distribute-rewards">Distribute Rewards</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="view-analytics" defaultChecked />
                  <Label htmlFor="view-analytics">View Analytics</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="manage-team" />
                  <Label htmlFor="manage-team">Manage Team Members</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="billing" />
                  <Label htmlFor="billing">Billing & Payments</Label>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">Back</Button>
            <Button>Complete Setup</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
