"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ThemeToggleButton() {
  const [mounted, setMounted] = React.useState(false)
  const [isDark, setIsDark] = React.useState(false)
  const [isChanging, setIsChanging] = React.useState(false)

  // Initialize on mount
  React.useEffect(() => {
    setMounted(true)
    const isDarkMode = document.documentElement.classList.contains("dark")
    setIsDark(isDarkMode)
    console.log("[ThemeButton] Mounted, initial dark mode:", isDarkMode)
  }, [])

  // Toggle theme with direct DOM manipulation
  const toggleTheme = React.useCallback(() => {
    if (isChanging) return
    setIsChanging(true)

    try {
      // Toggle dark mode state
      const newIsDark = !isDark
      setIsDark(newIsDark)

      // Get theme name
      const newTheme = newIsDark ? "dark" : "light"
      console.log(`[ThemeButton] Toggling to ${newTheme} mode`)

      // Update DOM
      const htmlElement = document.documentElement
      htmlElement.classList.remove("light", "dark")
      htmlElement.classList.add(newTheme)
      htmlElement.setAttribute("data-theme", newTheme)
      htmlElement.style.colorScheme = newTheme

      // Update localStorage
      try {
        localStorage.setItem("torque-theme", newTheme)
        localStorage.setItem("theme", newTheme)
      } catch (e) {
        console.error("[ThemeButton] localStorage error:", e)
      }

      console.log(`[ThemeButton] Theme toggled to ${newTheme}`)
    } catch (error) {
      console.error("[ThemeButton] Toggle error:", error)
    } finally {
      setTimeout(() => setIsChanging(false), 300)
    }
  }, [isDark, isChanging])

  if (!mounted) {
    return (
      <Button variant="outline" size="icon" disabled>
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      </Button>
    )
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      disabled={isChanging}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isChanging ? (
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : isDark ? (
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      ) : (
        <Moon className="h-[1.2rem] w-[1.2rem]" />
      )}
    </Button>
  )
}
