"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { BarChart3, Users, Gift, Target } from "lucide-react"

export function MainNav({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname()

  const routes = [
    {
      href: "/",
      label: "Dashboard",
      icon: BarChart3,
      active: pathname === "/",
    },
    {
      href: "/campaigns",
      label: "Campaigns",
      icon: Target,
      active: pathname?.startsWith("/campaigns"),
    },
    {
      href: "/incentives",
      label: "Incentives",
      icon: Gift,
      active: pathname?.startsWith("/incentives"),
    },
    {
      href: "/recipients",
      label: "Recipients",
      icon: Users,
      active: pathname?.startsWith("/recipients"),
    },
    {
      href: "/analytics",
      label: "Analytics",
      icon: BarChart3,
      active: pathname?.startsWith("/analytics"),
    },
  ]

  return (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)} {...props}>
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            "flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary",
            route.active ? "text-primary" : "text-muted-foreground",
          )}
        >
          <route.icon className="h-4 w-4" />
          <span>{route.label}</span>
        </Link>
      ))}
    </nav>
  )
}
