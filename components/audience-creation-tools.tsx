"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, ArrowRight, Users, Plus, Filter } from "lucide-react"

interface AudienceCreationToolsProps {
  data: any
  onUpdate: (data: any) => void
  onNext: () => void
  onBack: () => void
}

export function AudienceCreationTools({ data, onUpdate, onNext, onBack }: AudienceCreationToolsProps) {
  const existingSegments = [
    { id: "new-users", name: "New Users", count: 1250, description: "Users (wallets) who joined in the last 30 days" },
    { id: "power-users", name: "Power Users", count: 450, description: "Users with high engagement metrics" },
    { id: "developers", name: "Developers", count: 650, description: "Users identified as developers" },
    { id: "inactive", name: "Inactive Users", count: 850, description: "Users with no activity in 60+ days" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Target Segments</h3>
        <p className="text-muted-foreground">Define which segments will receive your campaign incentives</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="h-4 w-4" />
              Existing Segments
            </CardTitle>
            <CardDescription>Select from pre-defined segments</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {existingSegments.map((segment) => (
              <div key={segment.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50">
                <Checkbox id={segment.id} />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <Label htmlFor={segment.id} className="font-medium">
                      {segment.name}
                    </Label>
                    <Badge variant="outline">{segment.count}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{segment.description}</p>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full gap-2">
              <Plus className="h-4 w-4" />
              Create New Segment
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Custom Criteria
            </CardTitle>
            <CardDescription>Define specific targeting conditions for recipients</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Wallet Activity</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select activity level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High Activity (10+ transactions)</SelectItem>
                  <SelectItem value="medium">Medium Activity (3-10 transactions)</SelectItem>
                  <SelectItem value="low">Low Activity (1-3 transactions)</SelectItem>
                  <SelectItem value="new">New Wallets (0 transactions)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Platform Engagement</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select engagement level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily Active Users</SelectItem>
                  <SelectItem value="weekly">Weekly Active Users</SelectItem>
                  <SelectItem value="monthly">Monthly Active Users</SelectItem>
                  <SelectItem value="inactive">Inactive Users</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Token Holdings</Label>
              <div className="grid grid-cols-2 gap-2">
                <Input placeholder="Min amount" type="number" />
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Token" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="eth">ETH</SelectItem>
                    <SelectItem value="usdc">USDC</SelectItem>
                    <SelectItem value="custom">Custom Token</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Geographic Location</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select regions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="global">Global</SelectItem>
                  <SelectItem value="us">United States</SelectItem>
                  <SelectItem value="eu">European Union</SelectItem>
                  <SelectItem value="asia">Asia Pacific</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Additional Conditions</Label>
              <Textarea placeholder="Define any additional targeting criteria for recipients..." />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Segment Preview</CardTitle>
          <CardDescription>Estimated reach based on your criteria</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold">2,450</div>
              <div className="text-sm text-muted-foreground">Estimated Recipients</div>
            </div>
            <div>
              <div className="text-2xl font-bold">18%</div>
              <div className="text-sm text-muted-foreground">Of Total Users</div>
            </div>
            <div>
              <div className="text-2xl font-bold">$12,250</div>
              <div className="text-sm text-muted-foreground">Estimated Cost</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Details
        </Button>
        <Button onClick={onNext} className="gap-2">
          Continue to Incentives
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
