"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export function SimpleThemeToggleFixed() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const handleToggle = React.useCallback(() => {
    const htmlElement = document.documentElement
    const currentIsDark = htmlElement.classList.contains("dark")
    const newTheme = currentIsDark ? "light" : "dark"

    console.log(`Toggling from ${currentIsDark ? "dark" : "light"} to ${newTheme}`)

    // Update next-themes
    setTheme(newTheme)

    // Force immediate DOM update
    htmlElement.classList.remove("light", "dark")
    htmlElement.classList.add(newTheme)
    htmlElement.setAttribute("data-theme", newTheme)
    htmlElement.style.colorScheme = newTheme

    console.log(`Toggle complete - DOM classes: ${htmlElement.className}`)
  }, [setTheme])

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" disabled>
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      </Button>
    )
  }

  const isDark = document.documentElement.classList.contains("dark")

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      <Sun className={`h-[1.2rem] w-[1.2rem] transition-all ${isDark ? "rotate-90 scale-0" : "rotate-0 scale-100"}`} />
      <Moon
        className={`absolute h-[1.2rem] w-[1.2rem] transition-all ${isDark ? "rotate-0 scale-100" : "-rotate-90 scale-0"}`}
      />
    </Button>
  )
}
