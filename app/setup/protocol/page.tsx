import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Database, Activity, PlayCircle, PauseCircle, RefreshCw, Plus, Clock, AlertTriangle } from "lucide-react"

export default function ProtocolSetupPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <DashboardHeader />
      <main className="flex-1 space-y-6 p-8 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Protocol Setup</h1>
            <p className="text-muted-foreground">Configure data sources, stream management, and SDK integration</p>
          </div>
          <Button>Connect New Data Source</Button>
        </div>

        <Tabs defaultValue="onchain" className="space-y-6">
          <TabsList>
            <TabsTrigger value="onchain">Onchain Data</TabsTrigger>
            <TabsTrigger value="offchain">Offchain Events</TabsTrigger>
            <TabsTrigger value="monitoring">Program Monitoring</TabsTrigger>
            <TabsTrigger value="sdk">SDK Configuration</TabsTrigger>
          </TabsList>

          <TabsContent value="onchain" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Connected Programs</CardTitle>
                    <CardDescription>Onchain programs connected to Torque</CardDescription>
                  </div>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Connect Program
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      name: "Raydium Liquidity",
                      programId: "Raaay.....1234",
                      events: 24,
                      status: "active",
                      rpc: "Helius",
                      lastSync: "2 min ago",
                    },
                    {
                      name: "Token Distributor",
                      programId: "Dist.....8765",
                      events: 12,
                      status: "active",
                      rpc: "Triton",
                      lastSync: "5 min ago",
                    },
                    {
                      name: "Staking Program",
                      programId: "Stak.....5432",
                      events: 8,
                      status: "paused",
                      rpc: "Custom",
                      lastSync: "3 hours ago",
                    },
                  ].map((program, i) => (
                    <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-start space-x-4">
                        <Database className="h-8 w-8 text-primary mt-1" />
                        <div>
                          <h3 className="font-medium">{program.name}</h3>
                          <code className="text-xs bg-muted px-2 py-1 rounded">{program.programId}</code>
                          <div className="flex items-center mt-1 space-x-4 text-sm text-muted-foreground">
                            <span>Events: {program.events}</span>
                            <span>RPC: {program.rpc}</span>
                            <span>Last sync: {program.lastSync}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={program.status === "active" ? "default" : "secondary"}>{program.status}</Badge>
                        <Button variant="outline" size="icon">
                          {program.status === "active" ? (
                            <PauseCircle className="h-4 w-4" />
                          ) : (
                            <PlayCircle className="h-4 w-4" />
                          )}
                        </Button>
                        <Button variant="outline" size="icon">
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>IDL Management</CardTitle>
                <CardDescription>Manage program interfaces and event extraction</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="idl-program">Program ID</Label>
                      <div className="flex space-x-2 mt-1.5">
                        <Input id="idl-program" placeholder="Enter Program ID" />
                        <Button>Fetch IDL</Button>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="idl-name">Event Name Filter</Label>
                      <div className="flex space-x-2 mt-1.5">
                        <Input id="idl-name" placeholder="e.g., SwapEvent" />
                        <Button variant="outline">Filter</Button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="idl-content">IDL Content</Label>
                    <div className="mt-1.5 border rounded-md">
                      <Textarea
                        id="idl-content"
                        className="font-mono text-xs h-48"
                        placeholder="Paste IDL JSON here or fetch from Program ID"
                        defaultValue={`{\n  "version": "0.1.0",\n  "name": "raydium_amm",\n  "instructions": [...],\n  "events": [\n    {\n      "name": "SwapEvent",\n      "fields": [...]\n    }\n  ]\n}`}
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label>Field Extraction</Label>
                    <div className="space-y-2">
                      {[
                        { field: "user", type: "publicKey", indexed: true },
                        { field: "amountIn", type: "u64", indexed: false },
                        { field: "amountOut", type: "u64", indexed: false },
                        { field: "mintIn", type: "publicKey", indexed: true },
                        { field: "mintOut", type: "publicKey", indexed: true },
                      ].map((field, i) => (
                        <div key={i} className="flex items-center justify-between rounded-lg border p-3">
                          <div className="flex items-center space-x-4">
                            <div className="w-40">
                              <div className="font-medium">{field.field}</div>
                              <div className="text-sm text-muted-foreground">{field.type}</div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="text-sm font-medium">Indexed:</div>
                              <Switch checked={field.indexed} />
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm">
                              Map
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-500">
                              Ignore
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Cancel</Button>
                <Button>Save Configuration</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="monitoring" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Monitored Programs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3</div>
                  <p className="text-xs text-muted-foreground">All programs active</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Event Streams</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">5</div>
                  <p className="text-xs text-muted-foreground">4 active, 1 paused</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Events Last 24h</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12,450</div>
                  <p className="text-xs text-muted-foreground">+18% from yesterday</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Current Lag</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1.2s</div>
                  <p className="text-xs text-muted-foreground">Well within threshold</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Live Event Feed</CardTitle>
                    <CardDescription>Real-time program events and monitoring</CardDescription>
                  </div>
                  <Badge variant="outline" className="flex items-center">
                    <Activity className="mr-1 h-3 w-3" /> Live
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    {
                      program: "Raydium Liquidity",
                      event: "SwapEvent",
                      timestamp: "12 sec ago",
                      data: { user: "7x24...a9b3", amountIn: "1500 USDC", amountOut: "25.4 RAY" },
                    },
                    {
                      program: "Token Distributor",
                      event: "RewardDistributed",
                      timestamp: "32 sec ago",
                      data: { recipient: "8h91...c7d5", amount: "45 RAY", campaign: "Early Adopter Rewards" },
                    },
                    {
                      program: "Token Distributor",
                      event: "RewardClaimed",
                      timestamp: "48 sec ago",
                      data: { user: "2k56...e3f1", amount: "100 RAY", timestamp: "1623456789" },
                    },
                    {
                      program: "Raydium Liquidity",
                      event: "DepositEvent",
                      timestamp: "1 min ago",
                      data: { user: "5j38...b2c9", tokenA: "5000 USDC", tokenB: "100 RAY" },
                    },
                    {
                      program: "Staking Program",
                      event: "StakeEvent",
                      timestamp: "3 hours ago",
                      data: { user: "9g47...d5e2", amount: "1000 RAY", lockPeriod: "90 days" },
                    },
                  ].map((event, i) => (
                    <div key={i} className="rounded-lg border p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">{event.program}</Badge>
                          <Badge>{event.event}</Badge>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>{event.timestamp}</span>
                        </div>
                      </div>
                      <div className="mt-2 bg-muted p-2 rounded text-xs font-mono">
                        {JSON.stringify(event.data, null, 2)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Health Monitoring</CardTitle>
                    <CardDescription>Program health and error tracking</CardDescription>
                  </div>
                  <Button variant="outline">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    View All Issues
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      program: "Raydium Liquidity",
                      status: "healthy",
                      uptime: "99.98%",
                      errors: 0,
                      lastCheck: "30 sec ago",
                    },
                    {
                      program: "Token Distributor",
                      status: "healthy",
                      uptime: "99.95%",
                      errors: 0,
                      lastCheck: "45 sec ago",
                    },
                    {
                      program: "Staking Program",
                      status: "warning",
                      uptime: "98.72%",
                      errors: 2,
                      lastCheck: "3 min ago",
                    },
                  ].map((program, i) => (
                    <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-medium">{program.program}</h3>
                        <div className="flex items-center mt-1 space-x-4 text-sm text-muted-foreground">
                          <span>Uptime: {program.uptime}</span>
                          <span>Errors: {program.errors}</span>
                          <span>Last check: {program.lastCheck}</span>
                        </div>
                      </div>
                      <Badge
                        variant={program.status === "healthy" ? "default" : "outline"}
                        className={program.status === "warning" ? "text-yellow-500" : ""}
                      >
                        {program.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
