"use client"

import { useInterfaceMode } from "@/contexts/interface-mode-context"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  Home,
  Zap,
  Users,
  Gift,
  Settings,
  Database,
  Workflow,
  Key,
  Server,
  Palette,
  Component,
  TrendingUp,
  Sliders,
  BarChart,
  Activity,
  Brain,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ModeToggle } from "@/components/mode-toggle"
import { ThemeToggle } from "@/components/theme-toggle"

// Core navigation items (available in both modes)
const coreNavItems = [
  { title: "Growth Hub", url: "/", icon: Home },
  { title: "Campaigns", url: "/campaigns", icon: Zap },
  { title: "Incentives", url: "/incentives", icon: Gift },
  { title: "Audiences", url: "/audiences", icon: Users },
  { title: "Analytics", url: "/analytics", icon: BarChart },
  { title: "Performance", url: "/performance", icon: TrendingUp },
]

// Advanced-only navigation items
const advancedNavItems = [
  {
    title: "Advanced Tools",
    items: [
      {
        title: "Automated Segments",
        url: "/audiences/automated",
        icon: Brain,
        badge: "AI",
        description: "Behavior-based audience automation",
      },
      {
        title: "Flow Builder",
        url: "/campaigns/flow-builder",
        icon: Workflow,
        badge: "Pro",
        description: "Visual campaign workflow designer",
      },
      {
        title: "A/B Testing",
        url: "/performance/testing",
        icon: Activity,
        badge: "Pro",
        description: "Campaign optimization testing",
      },
    ],
  },
  {
    title: "Experience & Integration",
    items: [
      {
        title: "Components",
        url: "/experience/components",
        icon: Component,
        description: "Embeddable UI components",
      },
      {
        title: "Rewards Drawer",
        url: "/experience/rewards-drawer",
        icon: Gift,
        description: "Customizable rewards interface",
      },
      {
        title: "Custom Events",
        url: "/experience/custom-events",
        icon: Sliders,
        description: "Event tracking and analytics",
      },
    ],
  },
  {
    title: "Configuration",
    items: [
      {
        title: "Protocol Setup",
        url: "/setup/protocol",
        icon: Server,
        description: "Blockchain protocol configuration",
      },
      {
        title: "API Management",
        url: "/setup/api",
        icon: Key,
        description: "API keys and integrations",
      },
      {
        title: "Data Sources",
        url: "/setup/data",
        icon: Database,
        description: "External data connections",
      },
      {
        title: "Theming",
        url: "/setup/theme",
        icon: Palette,
        description: "Brand customization",
      },
    ],
  },
]

export function PlatformSidebar() {
  const { mode } = useInterfaceMode()
  const pathname = usePathname()

  return (
    <Sidebar>
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
              <Zap className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg">Torque</span>
          </div>
          <div className="flex items-center space-x-1">
            <ThemeToggle />
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Core Navigation - Available in both modes */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {coreNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <Link href={item.url} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Advanced Mode Features */}
        {mode === "advanced" && (
          <>
            <Separator className="my-2" />
            {advancedNavItems.map((section, index) => (
              <SidebarGroup key={index}>
                <SidebarGroupLabel className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                  {section.title}
                  <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                    Advanced
                  </Badge>
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {section.items.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild isActive={pathname === item.url}>
                          <Link href={item.url} className="flex items-center gap-2 group">
                            <item.icon className="h-4 w-4" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="truncate">{item.title}</span>
                                {item.badge && (
                                  <Badge variant="outline" className="text-xs px-1.5 py-0.5 h-5">
                                    {item.badge}
                                  </Badge>
                                )}
                              </div>
                              {item.description && (
                                <div className="text-xs text-muted-foreground truncate opacity-0 group-hover:opacity-100 transition-opacity">
                                  {item.description}
                                </div>
                              )}
                            </div>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            ))}
          </>
        )}
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <div className="space-y-3">
          <Button variant="outline" size="sm" className="w-full justify-start gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </Button>
          <Separator />
          <div className="px-1">
            <ModeToggle />
          </div>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
