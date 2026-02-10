"use client"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, Zap, Users, Gift } from "lucide-react"

export function QuickCreate() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Quick Create
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem>
          <Zap className="mr-2 h-4 w-4" />
          New Campaign
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Users className="mr-2 h-4 w-4" />
          Audience Segment
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Gift className="mr-2 h-4 w-4" />
          Reward Template
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
