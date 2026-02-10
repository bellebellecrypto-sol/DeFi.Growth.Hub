import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Star, Users, Code, Gift, TrendingUp } from "lucide-react"

export function TemplateLibrary() {
  const templates = [
    {
      id: 1,
      name: "Referral Program",
      type: "Token",
      description: "Standard referral program with tiered rewards based on successful referrals",
      category: "Growth",
      usageCount: 24,
      rating: 4.8,
      icon: Users,
      features: ["Tiered rewards", "Tracking system", "Anti-fraud protection"],
    },
    {
      id: 2,
      name: "Staking Rewards",
      type: "Token",
      description: "Rewards based on staking duration and amount with compound interest",
      category: "DeFi",
      usageCount: 18,
      rating: 4.9,
      icon: TrendingUp,
      features: ["Compound interest", "Lock periods", "Early withdrawal penalties"],
    },
    {
      id: 3,
      name: "Community NFT",
      type: "NFT",
      description: "Tiered NFT rewards for community participation and engagement",
      category: "Community",
      usageCount: 12,
      rating: 4.7,
      icon: Gift,
      features: ["Tiered NFTs", "Rarity system", "Metadata customization"],
    },
    {
      id: 4,
      name: "Developer Bounty",
      type: "Token",
      description: "Rewards for completing development tasks and code contributions",
      category: "Development",
      usageCount: 15,
      rating: 4.6,
      icon: Code,
      features: ["Task verification", "Code review integration", "Milestone tracking"],
    },
    {
      id: 5,
      name: "Early Adopter Program",
      type: "Mixed",
      description: "Comprehensive rewards for early platform adoption",
      category: "Growth",
      usageCount: 31,
      rating: 4.9,
      icon: Star,
      features: ["Multiple reward types", "Progressive unlocks", "Exclusive access"],
    },
    {
      id: 6,
      name: "Governance Participation",
      type: "Token",
      description: "Incentivize participation in governance decisions and voting",
      category: "Governance",
      usageCount: 9,
      rating: 4.5,
      icon: Users,
      features: ["Voting rewards", "Proposal bonuses", "Delegation incentives"],
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Template Library</h3>
          <p className="text-muted-foreground">Choose from proven incentive templates</p>
        </div>
        <Button variant="outline">Create Template</Button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search templates..." className="pl-8" />
        </div>
        <Select>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="growth">Growth</SelectItem>
            <SelectItem value="defi">DeFi</SelectItem>
            <SelectItem value="community">Community</SelectItem>
            <SelectItem value="development">Development</SelectItem>
            <SelectItem value="governance">Governance</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="token">Token</SelectItem>
            <SelectItem value="nft">NFT</SelectItem>
            <SelectItem value="access">Access</SelectItem>
            <SelectItem value="mixed">Mixed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {templates.map((template) => (
          <Card key={template.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <template.icon className="h-5 w-5 text-primary" />
                  <div>
                    <CardTitle className="text-base">{template.name}</CardTitle>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="outline">{template.type}</Badge>
                      <Badge variant="secondary">{template.category}</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <CardDescription>{template.description}</CardDescription>

              <div className="space-y-2">
                <div className="text-sm font-medium">Key Features:</div>
                <div className="flex flex-wrap gap-1">
                  {template.features.map((feature, i) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span>{template.rating}</span>
                </div>
                <div className="text-muted-foreground">Used {template.usageCount} times</div>
              </div>

              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="flex-1">
                  Preview
                </Button>
                <Button size="sm" className="flex-1">
                  Use Template
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
