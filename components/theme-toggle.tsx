"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Ensure component is mounted to avoid hydration issues
  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Handle theme switching with comprehensive error handling
  const handleThemeChange = React.useCallback(
    (newTheme: "light" | "dark") => {
      try {
        setTheme(newTheme)

        // Force immediate DOM update for visual consistency
        const htmlElement = document.documentElement
        htmlElement.classList.remove("light", "dark")
        htmlElement.classList.add(newTheme)
        htmlElement.setAttribute("data-theme", newTheme)
        htmlElement.style.colorScheme = newTheme

        // Update localStorage directly for persistence
        localStorage.setItem("torque-theme", newTheme)

        console.log(`Theme changed to: ${newTheme}`)
      } catch (error) {
        console.error("Failed to change theme:", error)
      }
    },
    [setTheme],
  )

  // Get current theme with fallback
  const currentTheme = mounted ? resolvedTheme || theme || "light" : "light"
  const isDark = currentTheme === "dark"

  // Show loading state during hydration
  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" disabled className="h-8 w-8">
        <div className="h-4 w-4 animate-pulse bg-muted rounded" />
        <span className="sr-only">Loading theme toggle</span>
      </Button>
    )
  }

  return (
    <TooltipProvider>
      <DropdownMenu>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 relative transition-all duration-200 hover:bg-accent"
                aria-label={`Current theme: ${currentTheme}. Click to change theme`}
              >
                <Sun
                  className={`h-4 w-4 transition-all duration-300 ${
                    isDark ? "rotate-90 scale-0" : "rotate-0 scale-100"
                  }`}
                />
                <Moon
                  className={`absolute h-4 w-4 transition-all duration-300 ${
                    isDark ? "rotate-0 scale-100" : "-rotate-90 scale-0"
                  }`}
                />
                <span className="sr-only">Toggle theme menu</span>
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="bottom" align="center">
            <p>Switch theme</p>
          </TooltipContent>
        </Tooltip>
        <DropdownMenuContent align="end" className="min-w-[120px]">
          <DropdownMenuItem
            onClick={() => handleThemeChange("light")}
            className={`cursor-pointer ${currentTheme === "light" ? "bg-accent text-accent-foreground" : ""}`}
          >
            <Sun className="mr-2 h-4 w-4" />
            <span>Light</span>
            {currentTheme === "light" && <div className="ml-auto h-2 w-2 rounded-full bg-primary" />}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleThemeChange("dark")}
            className={`cursor-pointer ${currentTheme === "dark" ? "bg-accent text-accent-foreground" : ""}`}
          >
            <Moon className="mr-2 h-4 w-4" />
            <span>Dark</span>
            {currentTheme === "dark" && <div className="ml-auto h-2 w-2 rounded-full bg-primary" />}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </TooltipProvider>
  )
}
