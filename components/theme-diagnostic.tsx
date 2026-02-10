"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function ThemeDiagnostic() {
  const { theme, setTheme, resolvedTheme, systemTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  const [diagnostics, setDiagnostics] = React.useState<any>({})

  React.useEffect(() => {
    setMounted(true)

    // Run diagnostics
    const runDiagnostics = () => {
      const htmlElement = document.documentElement
      const bodyElement = document.body
      const computedStyle = window.getComputedStyle(htmlElement)

      setDiagnostics({
        mounted: true,
        theme,
        resolvedTheme,
        systemTheme,
        htmlClass: htmlElement.className,
        htmlDataTheme: htmlElement.getAttribute("data-theme"),
        bodyClass: bodyElement.className,
        backgroundColor: computedStyle.backgroundColor,
        color: computedStyle.color,
        colorScheme: computedStyle.colorScheme,
        localStorage: typeof window !== "undefined" ? localStorage.getItem("torque-theme") : null,
        nextThemesStorage: typeof window !== "undefined" ? localStorage.getItem("theme") : null,
      })
    }

    runDiagnostics()

    // Re-run diagnostics when theme changes
    const interval = setInterval(runDiagnostics, 1000)
    return () => clearInterval(interval)
  }, [theme, resolvedTheme, systemTheme])

  const testThemeSwitch = (targetTheme: string) => {
    console.log(`Testing theme switch to: ${targetTheme}`)
    setTheme(targetTheme)

    // Force immediate DOM update
    setTimeout(() => {
      const htmlElement = document.documentElement
      if (targetTheme === "dark") {
        htmlElement.classList.add("dark")
      } else {
        htmlElement.classList.remove("dark")
      }
      console.log(`DOM updated - HTML classes: ${htmlElement.className}`)
    }, 0)
  }

  if (!mounted) {
    return <div>Loading diagnostics...</div>
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Theme Diagnostics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <strong>Theme State:</strong>
            <pre className="mt-1 p-2 bg-muted rounded text-xs">
              {JSON.stringify(
                {
                  theme,
                  resolvedTheme,
                  systemTheme,
                  mounted,
                },
                null,
                2,
              )}
            </pre>
          </div>

          <div>
            <strong>DOM State:</strong>
            <pre className="mt-1 p-2 bg-muted rounded text-xs">
              {JSON.stringify(
                {
                  htmlClass: diagnostics.htmlClass,
                  htmlDataTheme: diagnostics.htmlDataTheme,
                  bodyClass: diagnostics.bodyClass,
                },
                null,
                2,
              )}
            </pre>
          </div>

          <div>
            <strong>Computed Styles:</strong>
            <pre className="mt-1 p-2 bg-muted rounded text-xs">
              {JSON.stringify(
                {
                  backgroundColor: diagnostics.backgroundColor,
                  color: diagnostics.color,
                  colorScheme: diagnostics.colorScheme,
                },
                null,
                2,
              )}
            </pre>
          </div>

          <div>
            <strong>Storage:</strong>
            <pre className="mt-1 p-2 bg-muted rounded text-xs">
              {JSON.stringify(
                {
                  torqueTheme: diagnostics.localStorage,
                  nextThemes: diagnostics.nextThemesStorage,
                },
                null,
                2,
              )}
            </pre>
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={() => testThemeSwitch("light")} variant="outline">
            Test Light Mode
          </Button>
          <Button onClick={() => testThemeSwitch("dark")} variant="outline">
            Test Dark Mode
          </Button>
          <Button
            onClick={() => {
              localStorage.clear()
              window.location.reload()
            }}
            variant="destructive"
          >
            Clear Storage & Reload
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
