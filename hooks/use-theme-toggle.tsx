"use client"

import * as React from "react"
import { useTheme } from "next-themes"

export function useThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const currentTheme = React.useMemo(() => {
    if (!mounted) return "light"
    return resolvedTheme || theme || "light"
  }, [mounted, resolvedTheme, theme])

  const toggleTheme = React.useCallback(() => {
    const newTheme = currentTheme === "light" ? "dark" : "light"
    setTheme(newTheme)

    // Ensure DOM updates immediately
    requestAnimationFrame(() => {
      document.documentElement.classList.toggle("dark", newTheme === "dark")
    })
  }, [currentTheme, setTheme])

  const setSpecificTheme = React.useCallback(
    (newTheme: "light" | "dark") => {
      setTheme(newTheme)

      // Ensure DOM updates immediately
      requestAnimationFrame(() => {
        document.documentElement.classList.toggle("dark", newTheme === "dark")
      })
    },
    [setTheme],
  )

  return {
    currentTheme: currentTheme as "light" | "dark",
    toggleTheme,
    setTheme: setSpecificTheme,
    mounted,
    isDark: currentTheme === "dark",
    isLight: currentTheme === "light",
  }
}
