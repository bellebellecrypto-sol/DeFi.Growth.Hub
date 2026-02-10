"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // Force theme consistency on mount
  React.useEffect(() => {
    // Get theme from localStorage
    let savedTheme: string | null = null

    try {
      savedTheme = localStorage.getItem("torque-theme") || localStorage.getItem("theme")
    } catch (e) {
      console.error("[ThemeProvider] localStorage error:", e)
    }

    // Apply theme to DOM directly
    const htmlElement = document.documentElement
    const theme = savedTheme === "dark" ? "dark" : "light"

    // Remove existing theme classes
    htmlElement.classList.remove("light", "dark")

    // Add theme class
    htmlElement.classList.add(theme)

    // Set data attribute
    htmlElement.setAttribute("data-theme", theme)

    // Set color-scheme
    htmlElement.style.colorScheme = theme

    console.log(`[ThemeProvider] Initial theme set to ${theme}`)
  }, [])

  return (
    <NextThemesProvider
      {...props}
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange={false}
      storageKey="torque-theme"
      themes={["light", "dark"]}
      value={{
        light: "light",
        dark: "dark",
      }}
    >
      {children}
    </NextThemesProvider>
  )
}
