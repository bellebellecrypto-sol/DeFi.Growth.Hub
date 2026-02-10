import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

export function CampaignOverview() {
  const campaigns = [
    {
      id: 1,
      name: "Early Adopter Rewards",
      status: "active",
      progress: 68,
      recipients: 450,
      conversion: 24,
      startDate: "May 15, 2023",
      endDate: "Aug 15, 2023",
    },
    {
      id: 2,
      name: "Community Builder Program",
      status: "active",
      progress: 42,
      recipients: 1250,
      conversion: 18,
      startDate: "Jun 1, 2023",
      endDate: "Sep 30, 2023",
    },
    {
      id: 3,
      name: "Developer Incentives",
      status: "active",
      progress: 89,
      recipients: 650,
      conversion: 35,
      startDate: "Apr 10, 2023",
      endDate: "Jul 10, 2023",
    },
  ]

  return (
    <div className="space-y-8">
      {campaigns.map((campaign) => (
        <div key={campaign.id} className="flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">{campaign.name}</h3>
              <p className="text-sm text-muted-foreground">
                {campaign.startDate} - {campaign.endDate}
              </p>
            </div>
            <Badge variant={campaign.status === "active" ? "default" : "outline"}>{campaign.status}</Badge>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div>Recipients: {campaign.recipients}</div>
            <div>Conversion: {campaign.conversion}%</div>
          </div>
          <Progress value={campaign.progress} className="h-2" />
        </div>
      ))}
    </div>
  )
}
