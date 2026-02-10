import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Target, Gift, Users, BarChart3, ArrowRight, Settings } from "lucide-react"

export function CampaignStructureVisualization() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Campaign Structure Overview</CardTitle>
        <CardDescription>Understand how campaigns, incentives, and audiences work together</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-blue-500" />
              <h3 className="font-semibold">Campaigns</h3>
            </div>
            <div className="space-y-2">
              <div className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">Early Adopter Rewards</span>
                  <Badge variant="default" className="text-xs">
                    Active
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">3 incentives • 450 recipients</p>
              </div>
              <div className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">Community Builder</span>
                  <Badge variant="default" className="text-xs">
                    Active
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">2 incentives • 1,250 recipients</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Gift className="h-5 w-5 text-green-500" />
              <h3 className="font-semibold">Incentives</h3>
            </div>
            <div className="space-y-2">
              <div className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">Token Reward</span>
                  <Badge variant="outline" className="text-xs">
                    Token
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">50 USDC per user</p>
              </div>
              <div className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">NFT Badge</span>
                  <Badge variant="outline" className="text-xs">
                    NFT
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">Exclusive community NFT</p>
              </div>
              <div className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">Premium Access</span>
                  <Badge variant="outline" className="text-xs">
                    Access
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">30-day premium features</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-purple-500" />
              <h3 className="font-semibold">Audiences</h3>
            </div>
            <div className="space-y-2">
              <div className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">New Users</span>
                  <span className="text-xs text-muted-foreground">1,250</span>
                </div>
                <p className="text-xs text-muted-foreground">Joined in last 30 days</p>
              </div>
              <div className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">Power Users</span>
                  <span className="text-xs text-muted-foreground">450</span>
                </div>
                <p className="text-xs text-muted-foreground">High engagement metrics</p>
              </div>
              <div className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">Developers</span>
                  <span className="text-xs text-muted-foreground">650</span>
                </div>
                <p className="text-xs text-muted-foreground">Developer activity detected</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Target className="h-4 w-4" />
                <ArrowRight className="h-4 w-4" />
                <Gift className="h-4 w-4" />
                <ArrowRight className="h-4 w-4" />
                <Users className="h-4 w-4" />
                <ArrowRight className="h-4 w-4" />
                <BarChart3 className="h-4 w-4" />
              </div>
              <span className="text-sm text-muted-foreground">Campaign Flow</span>
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <Settings className="h-4 w-4" />
              Configure Structure
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
