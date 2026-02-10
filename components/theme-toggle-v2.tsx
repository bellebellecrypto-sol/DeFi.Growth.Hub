"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function ThemeToggleV2() {
  const { setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  const [currentTheme, setCurrentTheme] = React.useState<"light" | "dark">("light")
  const [isChanging, setIsChanging] = React.useState(false)

  // Detect current theme from DOM
  const detectTheme = React.useCallback(() => {
    if (typeof document === "undefined") return "light"
    return document.documentElement.classList.contains("dark") ? "dark" : "light"
  }, [])

  // Initialize on mount
  React.useEffect(() => {
    setMounted(true)
    setCurrentTheme(detectTheme())

    // Log initial state
    console.log("[ThemeToggle] Mounted, initial theme:", detectTheme())
    console.log("[ThemeToggle] HTML classes:", document.documentElement.className)
    console.log("[ThemeToggle] localStorage:", {
      "torque-theme": localStorage.getItem("torque-theme"),
      theme: localStorage.getItem("theme"),
    })
  }, [detectTheme])

  // Direct DOM manipulation for theme change
  const applyThemeToDOM = React.useCallback((newTheme: "light" | "dark") => {
    try {
      const htmlElement = document.documentElement

      // Remove existing theme classes
      htmlElement.classList.remove("light", "dark")

      // Add new theme class
      htmlElement.classList.add(newTheme)

      // Set data attribute
      htmlElement.setAttribute("data-theme", newTheme)

      // Update color-scheme
      htmlElement.style.colorScheme = newTheme

      console.log(`[ThemeToggle] Applied ${newTheme} theme to DOM`)
      return true
    } catch (error) {
      console.error("[ThemeToggle] DOM update error:", error)
      return false
    }
  }, [])

  // Update localStorage directly
  const updateLocalStorage = React.useCallback((newTheme: "light" | "dark") => {
    try {
      localStorage.setItem("torque-theme", newTheme)
      localStorage.setItem("theme", newTheme)
      console.log(`[ThemeToggle] Updated localStorage to ${newTheme}`)
      return true
    } catch (error) {
      console.error("[ThemeToggle] localStorage error:", error)
      return false
    }
  }, [])

  // Handle theme change with comprehensive approach
  const handleThemeChange = React.useCallback(
    async (newTheme: "light" | "dark") => {
      if (isChanging) return

      setIsChanging(true)
      console.log(`[ThemeToggle] Changing theme to ${newTheme}`)

      try {
        // 1. Update next-themes state
        setTheme(newTheme)

        // 2. Direct DOM manipulation
        applyThemeToDOM(newTheme)

        // 3. Update localStorage
        updateLocalStorage(newTheme)

        // 4. Update component state
        setCurrentTheme(newTheme)

        // 5. Verify the change after a short delay
        setTimeout(() => {
          const actualTheme = detectTheme()
          if (actualTheme !== newTheme) {
            console.warn(`[ThemeToggle] Theme mismatch! Expected: ${newTheme}, Actual: ${actualTheme}`)
            // Try again with more force
            applyThemeToDOM(newTheme)
            setCurrentTheme(newTheme)
          }
          setIsChanging(false)
        }, 100)
      } catch (error) {
        console.error("[ThemeToggle] Theme change failed:", error)
        setIsChanging(false)
      }
    },
    [isChanging, setTheme, applyThemeToDOM, updateLocalStorage, detectTheme],
  )

  // Toggle between light and dark
  const toggleTheme = React.useCallback(() => {
    const newTheme = currentTheme === "light" ? "dark" : "light"
    handleThemeChange(newTheme)
  }, [currentTheme, handleThemeChange])

  // Loading state
  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" disabled>
        <div className="h-[1.2rem] w-[1.2rem] animate-pulse bg-muted rounded-full" />
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
          className="relative"
          disabled={isChanging}
          aria-label={`Current theme: ${currentTheme}. Click to change theme`}
        >
          <Sun
            className={`h-[1.2rem] w-[1.2rem] transition-all duration-300 ${
              currentTheme === "dark" ? "scale-0 opacity-0" : "scale-100 opacity-100"
            }`}
          />
          <Moon
            className={`absolute h-[1.2rem] w-[1.2rem] transition-all duration-300 ${
              currentTheme === "dark" ? "scale-100 opacity-100" : "scale-0 opacity-0"
            }`}
          />
          {isChanging && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-3 w-3 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => handleThemeChange("light")}
          className={currentTheme === "light" ? "bg-accent" : ""}
        >
          <Sun className="mr-2 h-4 w-4" />
          <span>Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleThemeChange("dark")}
          className={currentTheme === "dark" ? "bg-accent" : ""}
        >
          <Moon className="mr-2 h-4 w-4" />
          <span>Dark</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
