import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, Target, Gift, Users, BarChart3 } from "lucide-react"

export function QuickActions() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Quick Create
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem className="gap-2">
          <Target className="h-4 w-4" />
          New Campaign
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-2">
          <Gift className="h-4 w-4" />
          New Incentive
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-2">
          <Users className="h-4 w-4" />
          Audience Segment
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-2">
          <BarChart3 className="h-4 w-4" />
          Custom Report
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
