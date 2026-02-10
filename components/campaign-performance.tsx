import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export function CampaignPerformance() {
  const campaigns = [
    {
      name: "Early Adopter Rewards",
      status: "active",
      users: 450,
      conversions: 108,
      conversionRate: 24,
      rewards: "$5,400",
      roi: "3.2x",
    },
    {
      name: "Community Builder Program",
      status: "active",
      users: 1250,
      conversions: 225,
      conversionRate: 18,
      rewards: "$11,250",
      roi: "2.8x",
    },
    {
      name: "Developer Incentives",
      status: "active",
      users: 650,
      conversions: 228,
      conversionRate: 35,
      rewards: "$114,000",
      roi: "4.1x",
    },
    {
      name: "Governance Participation",
      status: "completed",
      users: 850,
      conversions: 357,
      conversionRate: 42,
      rewards: "$8,500",
      roi: "5.2x",
    },
  ]

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Campaign</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Users</TableHead>
          <TableHead>Conversions</TableHead>
          <TableHead>Conversion Rate</TableHead>
          <TableHead>Rewards Distributed</TableHead>
          <TableHead>ROI</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {campaigns.map((campaign, i) => (
          <TableRow key={i}>
            <TableCell className="font-medium">{campaign.name}</TableCell>
            <TableCell>
              <Badge variant={campaign.status === "active" ? "default" : "secondary"}>{campaign.status}</Badge>
            </TableCell>
            <TableCell>{campaign.users}</TableCell>
            <TableCell>{campaign.conversions}</TableCell>
            <TableCell>
              <div className="flex items-center space-x-2">
                <Progress value={campaign.conversionRate} className="w-16 h-2" />
                <span>{campaign.conversionRate}%</span>
              </div>
            </TableCell>
            <TableCell>{campaign.rewards}</TableCell>
            <TableCell>{campaign.roi}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
