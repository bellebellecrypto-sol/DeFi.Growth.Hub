import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Plus, Wallet, Zap, Users, Gift, BarChart3 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function DashboardHeader() {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />

      {/* Navigation Bar - positioned to the right */}
      <div className="flex flex-1 items-center justify-end gap-3">
        {/* Connect Wallet Button */}
        <Button variant="outline" size="sm" className="gap-2">
          <Wallet className="h-4 w-4" />
          Connect Wallet
        </Button>

        {/* Primary Launch Button with Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" className="gap-2 bg-black text-white hover:bg-black/90">
              <Plus className="h-4 w-4" />
              Launch
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem className="gap-2">
              <Zap className="h-4 w-4" />
              <span>New Campaign</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2">
              <Users className="h-4 w-4" />
              <span>Audience Segment</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2">
              <Gift className="h-4 w-4" />
              <span>Reward Template</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2">
              <BarChart3 className="h-4 w-4" />
              <span>Analytics Report</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
