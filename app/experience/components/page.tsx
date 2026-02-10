import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Code, Copy, PanelRight, Trophy, Bot, ExternalLink } from "lucide-react"
import { DrawerPreview } from "@/components/drawer-preview"

export default function ComponentsPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <DashboardHeader />
      <main className="flex-1 space-y-6 p-8 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">User Journey Components</h1>
            <p className="text-muted-foreground">Create and manage embeddable UI components for user journeys</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Component
          </Button>
        </div>

        <Tabs defaultValue="drawer" className="space-y-6">
          <TabsList>
            <TabsTrigger value="drawer" className="flex items-center gap-2">
              <PanelRight className="h-4 w-4" />
              Drawer Components
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Leaderboard Components
            </TabsTrigger>
            <TabsTrigger value="offer" className="flex items-center gap-2">
              <ExternalLink className="h-4 w-4" />
              Offer Pages
            </TabsTrigger>
            <TabsTrigger value="bot" className="flex items-center gap-2">
              <Bot className="h-4 w-4" />
              Telegram Integration
            </TabsTrigger>
          </TabsList>

          <TabsContent value="drawer" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle>Drawer Configuration</CardTitle>
                  <CardDescription>Customize the embedded drawer component</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="drawer-name">Component Name</Label>
                    <Input id="drawer-name" defaultValue="Raydium Rewards Drawer" />
                  </div>

                  <div className="space-y-4">
                    <Label>Theme Configuration</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="primary-color" className="text-xs">
                          Primary Color
                        </Label>
                        <div className="flex mt-1.5">
                          <Input id="primary-color" defaultValue="#5C6EF5" className="rounded-r-none" />
                          <div
                            className="w-10 h-10 rounded-r-md border border-l-0"
                            style={{ backgroundColor: "#5C6EF5" }}
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="secondary-color" className="text-xs">
                          Secondary Color
                        </Label>
                        <div className="flex mt-1.5">
                          <Input id="secondary-color" defaultValue="#10B981" className="rounded-r-none" />
                          <div
                            className="w-10 h-10 rounded-r-md border border-l-0"
                            style={{ backgroundColor: "#10B981" }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-4 items-center">
                      <div className="flex flex-1 items-center space-x-2">
                        <Switch id="dark-mode" />
                        <Label htmlFor="dark-mode">Enable Dark Mode</Label>
                      </div>
                      <div className="flex flex-1 items-center space-x-2">
                        <Switch id="inherit-theme" defaultChecked />
                        <Label htmlFor="inherit-theme">Inherit Site Theme</Label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label>Tab Configuration</Label>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 rounded-lg border">
                        <div>
                          <h4 className="font-medium">Active Rewards</h4>
                          <p className="text-xs text-muted-foreground">Current available rewards</p>
                        </div>
                        <div className="flex space-x-2">
                          <Badge>Enabled</Badge>
                          <Button variant="ghost" size="icon">
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg border">
                        <div>
                          <h4 className="font-medium">Leaderboard</h4>
                          <p className="text-xs text-muted-foreground">Current rankings</p>
                        </div>
                        <div className="flex space-x-2">
                          <Badge>Enabled</Badge>
                          <Button variant="ghost" size="icon">
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg border">
                        <div>
                          <h4 className="font-medium">History</h4>
                          <p className="text-xs text-muted-foreground">Past rewards</p>
                        </div>
                        <div className="flex space-x-2">
                          <Badge variant="outline">Disabled</Badge>
                          <Button variant="ghost" size="icon">
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <Button variant="outline" className="w-full">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Custom Tab
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label>Position & Trigger</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="position" className="text-xs">
                          Drawer Position
                        </Label>
                        <Select defaultValue="right">
                          <SelectTrigger id="position" className="mt-1.5">
                            <SelectValue placeholder="Select position" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="right">Right</SelectItem>
                            <SelectItem value="left">Left</SelectItem>
                            <SelectItem value="bottom">Bottom</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="trigger-type" className="text-xs">
                          Trigger Type
                        </Label>
                        <Select defaultValue="button">
                          <SelectTrigger id="trigger-type" className="mt-1.5">
                            <SelectValue placeholder="Select trigger" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="button">Button</SelectItem>
                            <SelectItem value="icon">Icon Only</SelectItem>
                            <SelectItem value="custom">Custom Element</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="button-text">Button Text</Label>
                    <Input id="button-text" defaultValue="View Rewards" />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div className="flex space-x-2 items-center">
                      <Code className="h-4 w-4" />
                      <Label>Embed Code</Label>
                    </div>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <Copy className="h-4 w-4" />
                      Copy
                    </Button>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">Preview</Button>
                  <Button>Save Changes</Button>
                </CardFooter>
              </Card>

              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle>Live Preview</CardTitle>
                  <CardDescription>See how your drawer will appear on your site</CardDescription>
                </CardHeader>
                <CardContent className="h-[550px] flex items-center justify-center bg-muted/50 rounded-lg">
                  <DrawerPreview />
                </CardContent>
                <CardFooter className="text-sm text-muted-foreground">
                  <p>
                    The preview shows the drawer as it will appear on your website. All customizations are applied in
                    real-time.
                  </p>
                </CardFooter>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Integration Guide</CardTitle>
                <CardDescription>How to add this component to your website</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>1. Add the Torque script to your HTML</Label>
                  <div className="bg-muted p-3 rounded-md font-mono text-xs">
                    &lt;script src="https://cdn.torque.so/embed.js" async&gt;&lt;/script&gt;
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>2. Add the drawer component</Label>
                  <div className="bg-muted p-3 rounded-md font-mono text-xs">
                    &lt;div data-torque-drawer="raydium-rewards" data-theme="inherit"&gt;&lt;/div&gt;
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>3. Optional: Custom trigger</Label>
                  <div className="bg-muted p-3 rounded-md font-mono text-xs whitespace-pre-wrap">
                    {`<button onclick="Torque.openDrawer('raydium-rewards')">
  Custom Trigger Button
</button>`}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <p className="text-sm text-muted-foreground">
                  Once integrated, the drawer will automatically inherit your site's theme and can be triggered with a
                  single button click.
                </p>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
