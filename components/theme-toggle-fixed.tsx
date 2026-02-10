"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function ThemeToggleFixed() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  const [isChanging, setIsChanging] = React.useState(false)

  // Ensure component is mounted
  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Force DOM synchronization
  const forceDOMUpdate = React.useCallback((newTheme: string) => {
    const htmlElement = document.documentElement
    const isDark = newTheme === "dark"

    // Remove existing theme classes
    htmlElement.classList.remove("light", "dark")

    // Add new theme class
    htmlElement.classList.add(newTheme)

    // Set data attribute for additional targeting
    htmlElement.setAttribute("data-theme", newTheme)

    // Update color-scheme
    htmlElement.style.colorScheme = newTheme

    console.log(`DOM updated to ${newTheme} theme:`, {
      classes: htmlElement.className,
      dataTheme: htmlElement.getAttribute("data-theme"),
      colorScheme: htmlElement.style.colorScheme,
    })
  }, [])

  // Handle theme change with comprehensive error handling
  const handleThemeChange = React.useCallback(
    async (newTheme: string) => {
      if (isChanging) return // Prevent rapid clicking

      setIsChanging(true)
      console.log(`Changing theme from ${resolvedTheme || theme} to ${newTheme}`)

      try {
        // Step 1: Update next-themes state
        setTheme(newTheme)

        // Step 2: Force immediate DOM update
        forceDOMUpdate(newTheme)

        // Step 3: Verify the change after a short delay
        setTimeout(() => {
          const currentTheme = document.documentElement.classList.contains("dark") ? "dark" : "light"
          if (currentTheme !== newTheme) {
            console.warn(`Theme mismatch detected. Expected: ${newTheme}, Actual: ${currentTheme}`)
            forceDOMUpdate(newTheme) // Try again
          }
          setIsChanging(false)
        }, 100)
      } catch (error) {
        console.error("Theme change failed:", error)
        setIsChanging(false)
      }
    },
    [theme, resolvedTheme, setTheme, forceDOMUpdate, isChanging],
  )

  // Get current theme with proper fallback
  const currentTheme = React.useMemo(() => {
    if (!mounted) return "light"

    // Check DOM state as source of truth
    const htmlElement = document.documentElement
    if (htmlElement.classList.contains("dark")) return "dark"
    if (htmlElement.classList.contains("light")) return "light"

    // Fallback to next-themes state
    return resolvedTheme || theme || "light"
  }, [mounted, resolvedTheme, theme])

  const isDark = currentTheme === "dark"

  // Sync DOM on mount and theme changes
  React.useEffect(() => {
    if (mounted && currentTheme) {
      forceDOMUpdate(currentTheme)
    }
  }, [mounted, currentTheme, forceDOMUpdate])

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" disabled>
        <div className="h-[1.2rem] w-[1.2rem] animate-pulse bg-muted rounded" />
        <span className="sr-only">Loading theme toggle</span>
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative transition-all duration-200 hover:bg-accent"
          disabled={isChanging}
          aria-label={`Current theme: ${currentTheme}. Click to change theme`}
        >
          <Sun
            className={`h-[1.2rem] w-[1.2rem] transition-all duration-300 ${
              isDark ? "rotate-90 scale-0" : "rotate-0 scale-100"
            }`}
          />
          <Moon
            className={`absolute h-[1.2rem] w-[1.2rem] transition-all duration-300 ${
              isDark ? "rotate-0 scale-100" : "-rotate-90 scale-0"
            }`}
          />
          {isChanging && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-3 w-3 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[140px]">
        <DropdownMenuItem
          onClick={() => handleThemeChange("light")}
          disabled={isChanging}
          className={`cursor-pointer ${currentTheme === "light" ? "bg-accent text-accent-foreground" : ""}`}
        >
          <Sun className="mr-2 h-4 w-4" />
          <span>Light</span>
          {currentTheme === "light" && <div className="ml-auto h-2 w-2 rounded-full bg-primary" />}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleThemeChange("dark")}
          disabled={isChanging}
          className={`cursor-pointer ${currentTheme === "dark" ? "bg-accent text-accent-foreground" : ""}`}
        >
          <Moon className="mr-2 h-4 w-4" />
          <span>Dark</span>
          {currentTheme === "dark" && <div className="ml-auto h-2 w-2 rounded-full bg-primary" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
