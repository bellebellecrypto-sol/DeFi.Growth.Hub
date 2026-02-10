"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, ArrowRight, Zap, Clock, Shield, DollarSign } from "lucide-react"

interface RewardsDistributionConfigProps {
  data: any
  onUpdate: (data: any) => void
  onNext: () => void
  onBack: () => void
}

export function RewardsDistributionConfig({ data, onUpdate, onNext, onBack }: RewardsDistributionConfigProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Reward Distribution</h3>
        <p className="text-muted-foreground">Configure how and when rewards are delivered to recipients</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Distribution Method
            </CardTitle>
            <CardDescription>Choose how rewards are distributed</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium">Automatic Distribution</div>
                  <div className="text-sm text-muted-foreground">
                    Instant reward delivery upon condition fulfillment
                  </div>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium">Manual Approval</div>
                  <div className="text-sm text-muted-foreground">Admin review required before distribution</div>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium">User Claim</div>
                  <div className="text-sm text-muted-foreground">Recipients must actively claim their rewards</div>
                </div>
                <Switch />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Timing & Frequency
            </CardTitle>
            <CardDescription>Set distribution schedule and timing</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Distribution Frequency</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="immediate">Immediate</SelectItem>
                  <SelectItem value="hourly">Hourly</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="end">End of Campaign</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Batch Size</Label>
              <Input type="number" placeholder="100" />
              <div className="text-xs text-muted-foreground">Number of rewards to process in each batch</div>
            </div>

            <div className="space-y-2">
              <Label>Delay Between Batches (minutes)</Label>
              <Input type="number" placeholder="5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Gas & Fees
            </CardTitle>
            <CardDescription>Configure transaction fee handling</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Gas Payment Method</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Who pays gas fees?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sponsor">Sponsor All Gas Fees</SelectItem>
                  <SelectItem value="user">User Pays Gas</SelectItem>
                  <SelectItem value="hybrid">Hybrid Model</SelectItem>
                  <SelectItem value="gasless">Gasless Transactions</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Gas Price Strategy</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select strategy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="fast">Fast</SelectItem>
                  <SelectItem value="economy">Economy</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="gas-optimization">Enable Gas Optimization</Label>
              <Switch id="gas-optimization" defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Security & Compliance
            </CardTitle>
            <CardDescription>Set security measures and compliance checks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="kyc-check">Require KYC Verification</Label>
              <Switch id="kyc-check" />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="fraud-detection">Enable Fraud Detection</Label>
              <Switch id="fraud-detection" defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="multi-sig">Multi-signature Approval</Label>
              <Switch id="multi-sig" />
            </div>

            <div className="space-y-2">
              <Label>Maximum Daily Distribution</Label>
              <Input type="number" placeholder="10000" />
              <div className="text-xs text-muted-foreground">Maximum USD value that can be distributed per day</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Distribution Summary</CardTitle>
          <CardDescription>Review your distribution configuration</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="text-muted-foreground">Method</div>
              <div className="font-medium">Automatic</div>
            </div>
            <div>
              <div className="text-muted-foreground">Frequency</div>
              <div className="font-medium">Immediate</div>
            </div>
            <div>
              <div className="text-muted-foreground">Gas Payment</div>
              <div className="font-medium">Sponsored</div>
            </div>
            <div>
              <div className="text-muted-foreground">Security</div>
              <div className="font-medium">Enhanced</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Incentives
        </Button>
        <Button onClick={onNext} className="gap-2">
          Continue to Review
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
