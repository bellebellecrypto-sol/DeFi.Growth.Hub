"use client"

import { cn } from "@/lib/utils"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Bell, CheckCircle, AlertCircle, Info } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

export function NotificationDrawer() {
  const [open, setOpen] = useState(false)

  const notifications = [
    {
      id: 1,
      type: "success",
      title: "Campaign Milestone Reached",
      message: "Early Adopter Rewards campaign has reached 75% completion",
      time: "2 minutes ago",
      unread: true,
    },
    {
      id: 2,
      type: "warning",
      title: "Low Budget Alert",
      message: "Developer Incentives campaign budget is running low (15% remaining)",
      time: "1 hour ago",
      unread: true,
    },
    {
      id: 3,
      type: "info",
      title: "New Recipients Added",
      message: "45 new recipients have been added to the Power Users segment",
      time: "3 hours ago",
      unread: false,
    },
    {
      id: 4,
      type: "success",
      title: "Reward Distribution Complete",
      message: "Successfully distributed 150 rewards in Community Builder Program",
      time: "1 day ago",
      unread: false,
    },
  ]

  const unreadCount = notifications.filter((n) => n.unread).length

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "warning":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case "info":
        return <Info className="h-4 w-4 text-blue-500" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-80">
        <SheetHeader>
          <SheetTitle>Notifications</SheetTitle>
          <SheetDescription>Stay updated with your campaign activities</SheetDescription>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-120px)] mt-6">
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={cn(
                  "p-4 rounded-lg border transition-colors hover:bg-muted/50",
                  notification.unread ? "bg-muted/30" : "",
                )}
              >
                <div className="flex items-start space-x-3">
                  {getIcon(notification.type)}
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{notification.title}</p>
                      {notification.unread && <div className="h-2 w-2 bg-blue-500 rounded-full" />}
                    </div>
                    <p className="text-sm text-muted-foreground">{notification.message}</p>
                    <p className="text-xs text-muted-foreground">{notification.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="mt-4 pt-4 border-t">
          <Button variant="outline" className="w-full">
            Mark All as Read
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
