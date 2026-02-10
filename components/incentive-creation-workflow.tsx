"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TemplateLibrary } from "@/components/template-library"
import { ArrowLeft, ArrowRight, Gift, Settings } from "lucide-react"

interface IncentiveCreationWorkflowProps {
  data: any
  onUpdate: (data: any) => void
  onNext: () => void
  onBack: () => void
}

export function IncentiveCreationWorkflow({ data, onUpdate, onNext, onBack }: IncentiveCreationWorkflowProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Incentive Setup</h3>
        <p className="text-muted-foreground">Configure rewards and conditions for your campaign</p>
      </div>

      <Tabs defaultValue="create" className="space-y-6">
        <TabsList>
          <TabsTrigger value="create">Create Incentive</TabsTrigger>
          <TabsTrigger value="templates">Use Template</TabsTrigger>
          <TabsTrigger value="existing">Existing Incentives</TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Gift className="h-4 w-4" />
                  Reward Configuration
                </CardTitle>
                <CardDescription>Define what recipients will receive</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Reward Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select reward type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="token">Token Rewards</SelectItem>
                      <SelectItem value="nft">NFT Rewards</SelectItem>
                      <SelectItem value="access">Access Rights</SelectItem>
                      <SelectItem value="discount">Discounts</SelectItem>
                      <SelectItem value="custom">Custom Reward</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Amount</Label>
                    <Input type="number" placeholder="50" />
                  </div>
                  <div className="space-y-2">
                    <Label>Currency/Token</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="USDC" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="usdc">USDC</SelectItem>
                        <SelectItem value="eth">ETH</SelectItem>
                        <SelectItem value="custom">Custom Token</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Reward Structure</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select structure" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fixed">Fixed Amount</SelectItem>
                      <SelectItem value="tiered">Tiered Rewards</SelectItem>
                      <SelectItem value="performance">Performance Based</SelectItem>
                      <SelectItem value="random">Random Amount</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Conditions & Rules
                </CardTitle>
                <CardDescription>Define when rewards are earned</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Trigger Event</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select trigger" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="signup">Account Creation</SelectItem>
                      <SelectItem value="transaction">First Transaction</SelectItem>
                      <SelectItem value="referral">Successful Referral</SelectItem>
                      <SelectItem value="engagement">Platform Engagement</SelectItem>
                      <SelectItem value="custom">Custom Action</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Frequency</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="How often?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="once">One-time Only</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="unlimited">Unlimited</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Additional Conditions</Label>
                  <Textarea placeholder="Define any additional requirements..." />
                </div>

                <div className="space-y-2">
                  <Label>Reward Limits</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input placeholder="Max per user" type="number" />
                    <Input placeholder="Total budget" type="number" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Incentive Preview</CardTitle>
              <CardDescription>Review your incentive configuration</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-4 border rounded-lg bg-muted/50">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">Token Reward Incentive</h4>
                  <Badge>Active</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Users receive 50 USDC for completing their first transaction
                </p>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Trigger:</span>
                    <div className="font-medium">First Transaction</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Frequency:</span>
                    <div className="font-medium">One-time Only</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Budget:</span>
                    <div className="font-medium">$5,000</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates">
          <TemplateLibrary />
        </TabsContent>

        <TabsContent value="existing">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Existing Incentives</CardTitle>
              <CardDescription>Reuse incentives from other campaigns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: "Early Adopter Token Reward", type: "Token", amount: "50 USDC" },
                  { name: "Community NFT Badge", type: "NFT", amount: "1 NFT" },
                  { name: "Premium Access Pass", type: "Access", amount: "30 days" },
                ].map((incentive, i) => (
                  <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">{incentive.name}</div>
                      <div className="text-sm text-muted-foreground">{incentive.amount}</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{incentive.type}</Badge>
                      <Button size="sm" variant="outline">
                        Use
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Audience
        </Button>
        <Button onClick={onNext} className="gap-2">
          Continue to Distribution
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
