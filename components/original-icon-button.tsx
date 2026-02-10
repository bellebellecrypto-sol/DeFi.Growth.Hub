"use client"

import * as React from "react"
import { Sun, Settings, Bell, User, Menu, Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface OriginalIconButtonProps {
  variant?: "settings" | "notifications" | "user" | "menu" | "search" | "filter" | "brightness"
  onClick?: () => void
  className?: string
  disabled?: boolean
}

export function OriginalIconButton({
  variant = "brightness",
  onClick,
  className = "",
  disabled = false,
}: OriginalIconButtonProps) {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const getIcon = () => {
    switch (variant) {
      case "settings":
        return <Settings className="h-4 w-4" />
      case "notifications":
        return <Bell className="h-4 w-4" />
      case "user":
        return <User className="h-4 w-4" />
      case "menu":
        return <Menu className="h-4 w-4" />
      case "search":
        return <Search className="h-4 w-4" />
      case "filter":
        return <Filter className="h-4 w-4" />
      case "brightness":
      default:
        return <Sun className="h-4 w-4" />
    }
  }

  const getTooltipText = () => {
    switch (variant) {
      case "settings":
        return "Settings"
      case "notifications":
        return "Notifications"
      case "user":
        return "User menu"
      case "menu":
        return "Menu"
      case "search":
        return "Search"
      case "filter":
        return "Filter"
      case "brightness":
      default:
        return "Brightness settings"
    }
  }

  const getAriaLabel = () => {
    switch (variant) {
      case "settings":
        return "Open settings menu"
      case "notifications":
        return "View notifications"
      case "user":
        return "Open user menu"
      case "menu":
        return "Open navigation menu"
      case "search":
        return "Open search"
      case "filter":
        return "Open filter options"
      case "brightness":
      default:
        return "Adjust brightness settings"
    }
  }

  const handleClick = React.useCallback(() => {
    if (onClick) {
      onClick()
    } else {
      // Default behavior for brightness button
      console.log(`${variant} button clicked`)
    }
  }, [onClick, variant])

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault()
        handleClick()
      }
    },
    [handleClick],
  )

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" disabled className={`h-9 w-9 ${className}`}>
        <div className="h-4 w-4 animate-pulse bg-muted rounded" />
        <span className="sr-only">Loading...</span>
      </Button>
    )
  }

  if (variant === "brightness") {
    return (
      <TooltipProvider>
        <DropdownMenu>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-9 w-9 relative transition-all duration-200 hover:bg-accent ${className}`}
                  aria-label={getAriaLabel()}
                  disabled={disabled}
                  onKeyDown={handleKeyDown}
                >
                  {getIcon()}
                  <span className="sr-only">{getTooltipText()}</span>
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent side="bottom" align="center">
              <p>{getTooltipText()}</p>
            </TooltipContent>
          </Tooltip>
          <DropdownMenuContent align="end" className="min-w-[140px]">
            <DropdownMenuItem onClick={() => console.log("Auto brightness")}>
              <Sun className="mr-2 h-4 w-4" />
              <span>Auto</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => console.log("High brightness")}>
              <Sun className="mr-2 h-4 w-4" />
              <span>High</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => console.log("Low brightness")}>
              <Sun className="mr-2 h-4 w-4" />
              <span>Low</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TooltipProvider>
    )
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            className={`h-9 w-9 transition-all duration-200 hover:bg-accent ${className}`}
            aria-label={getAriaLabel()}
            disabled={disabled}
          >
            {getIcon()}
            <span className="sr-only">{getTooltipText()}</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom" align="center">
          <p>{getTooltipText()}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
