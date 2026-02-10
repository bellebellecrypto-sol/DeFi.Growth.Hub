import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function RecentActivity() {
  const activities = [
    {
      id: 1,
      user: {
        name: "Alex Johnson",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "AJ",
      },
      action: "claimed a reward",
      campaign: "Early Adopter Rewards",
      time: "2 hours ago",
    },
    {
      id: 2,
      user: {
        name: "Sarah Chen",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "SC",
      },
      action: "completed a task",
      campaign: "Community Builder Program",
      time: "4 hours ago",
    },
    {
      id: 3,
      user: {
        name: "Miguel Rodriguez",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "MR",
      },
      action: "joined audience",
      campaign: "Developer Incentives",
      time: "6 hours ago",
    },
    {
      id: 4,
      user: {
        name: "Emma Wilson",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "EW",
      },
      action: "referred a friend",
      campaign: "Community Builder Program",
      time: "8 hours ago",
    },
    {
      id: 5,
      user: {
        name: "David Kim",
        avatar: "/placeholder.svg?height=32&width=32",
        initials: "DK",
      },
      action: "completed onboarding",
      campaign: "Early Adopter Rewards",
      time: "10 hours ago",
    },
  ]

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src={activity.user.avatar || "/placeholder.svg"} alt={activity.user.name} />
            <AvatarFallback>{activity.user.initials}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">
              {activity.user.name} {activity.action}
            </p>
            <p className="text-sm text-muted-foreground">
              {activity.campaign} • {activity.time}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
