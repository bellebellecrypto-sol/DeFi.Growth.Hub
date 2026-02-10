"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { Moon, Sun, RotateCw, Trash2, Bug, AlertTriangle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function ThemeDebugPanel() {
  const { theme, setTheme, resolvedTheme, systemTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  const [debugInfo, setDebugInfo] = React.useState<Record<string, any>>({})
  const [logs, setLogs] = React.useState<string[]>([])
  const [errors, setErrors] = React.useState<string[]>([])

  const addLog = (message: string) => {
    console.log(`[Theme Debug]: ${message}`)
    setLogs((prev) => [`${new Date().toISOString().split("T")[1].split(".")[0]} - ${message}`, ...prev.slice(0, 9)])
  }

  const addError = (message: string) => {
    console.error(`[Theme Error]: ${message}`)
    setErrors((prev) => [`${new Date().toISOString().split("T")[1].split(".")[0]} - ${message}`, ...prev.slice(0, 4)])
  }

  // Collect debug information
  const collectDebugInfo = React.useCallback(() => {
    try {
      const htmlElement = document.documentElement
      const bodyElement = document.body
      const computedHtmlStyle = window.getComputedStyle(htmlElement)
      const computedBodyStyle = window.getComputedStyle(bodyElement)

      // Check localStorage
      let localStorageItems: Record<string, string> = {}
      try {
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i)
          if (key) {
            localStorageItems[key] = localStorage.getItem(key) || ""
          }
        }
      } catch (e) {
        addError(`LocalStorage access error: ${e}`)
        localStorageItems = { error: "Could not access localStorage" }
      }

      // Check CSS variables
      const cssVariables: Record<string, string> = {}
      ;[
        "--background",
        "--foreground",
        "--card",
        "--card-foreground",
        "--primary",
        "--primary-foreground",
        "--secondary",
        "--muted",
      ].forEach((variable) => {
        cssVariables[variable] = computedHtmlStyle.getPropertyValue(variable)
      })

      const info = {
        theme: {
          theme,
          resolvedTheme,
          systemTheme,
          mounted,
        },
        dom: {
          htmlClasses: htmlElement.className.split(" "),
          bodyClasses: bodyElement.className.split(" "),
          htmlDataTheme: htmlElement.getAttribute("data-theme"),
          bodyDataTheme: bodyElement.getAttribute("data-theme"),
          colorScheme: computedHtmlStyle.colorScheme,
        },
        styles: {
          htmlBackground: computedHtmlStyle.backgroundColor,
          bodyBackground: computedBodyStyle.backgroundColor,
          htmlColor: computedHtmlStyle.color,
          bodyColor: computedBodyStyle.color,
          cssVariables,
        },
        storage: localStorageItems,
      }

      setDebugInfo(info)
      addLog("Debug info collected")
      return info
    } catch (e) {
      addError(`Error collecting debug info: ${e}`)
      return { error: String(e) }
    }
  }, [theme, resolvedTheme, systemTheme, mounted])

  // Force theme change with direct DOM manipulation
  const forceThemeChange = React.useCallback(
    (newTheme: "light" | "dark") => {
      try {
        addLog(`Forcing theme change to ${newTheme}`)

        // 1. Update next-themes state
        setTheme(newTheme)
        addLog("Updated next-themes state")

        // 2. Direct DOM manipulation
        const htmlElement = document.documentElement

        // Remove existing theme classes
        htmlElement.classList.remove("light", "dark")

        // Add new theme class
        htmlElement.classList.add(newTheme)

        // Set data attribute
        htmlElement.setAttribute("data-theme", newTheme)

        // Update color-scheme
        htmlElement.style.colorScheme = newTheme

        addLog(`Updated DOM: added class "${newTheme}", set data-theme="${newTheme}"`)

        // 3. Force localStorage update
        try {
          localStorage.setItem("torque-theme", newTheme)
          localStorage.setItem("theme", newTheme)
          addLog("Updated localStorage")
        } catch (e) {
          addError(`LocalStorage error: ${e}`)
        }

        // 4. Verify the change
        setTimeout(() => {
          const currentHtmlClass = document.documentElement.classList.contains("dark") ? "dark" : "light"
          if (currentHtmlClass !== newTheme) {
            addError(`Theme verification failed: Expected ${newTheme}, got ${currentHtmlClass}`)
            // Try again with more force
            document.documentElement.className = document.documentElement.className
              .split(" ")
              .filter((cls) => cls !== "light" && cls !== "dark")
              .concat([newTheme])
              .join(" ")
            addLog("Attempted secondary DOM update")
          } else {
            addLog("Theme verification successful")
          }
          collectDebugInfo()
        }, 100)
      } catch (e) {
        addError(`Force theme change error: ${e}`)
      }
    },
    [setTheme, collectDebugInfo],
  )

  // Reset everything
  const resetTheme = React.useCallback(() => {
    try {
      addLog("Resetting theme state")

      // Clear localStorage
      try {
        localStorage.removeItem("torque-theme")
        localStorage.removeItem("theme")
        addLog("Cleared localStorage theme keys")
      } catch (e) {
        addError(`LocalStorage clear error: ${e}`)
      }

      // Reset DOM
      const htmlElement = document.documentElement
      htmlElement.classList.remove("light", "dark")
      htmlElement.removeAttribute("data-theme")
      htmlElement.style.colorScheme = ""
      addLog("Reset DOM theme state")

      // Set to default theme
      setTheme("light")
      addLog("Set next-themes to default 'light'")

      // Force light theme
      setTimeout(() => {
        htmlElement.classList.add("light")
        htmlElement.setAttribute("data-theme", "light")
        htmlElement.style.colorScheme = "light"
        addLog("Forced light theme in DOM")
        collectDebugInfo()
      }, 100)
    } catch (e) {
      addError(`Reset error: ${e}`)
    }
  }, [setTheme, collectDebugInfo])

  // Initialize on mount
  React.useEffect(() => {
    setMounted(true)
    addLog("Component mounted")

    // Initial debug info collection
    setTimeout(() => {
      collectDebugInfo()
    }, 500)

    // Set up periodic debug info collection
    const interval = setInterval(() => {
      collectDebugInfo()
    }, 2000)

    return () => {
      clearInterval(interval)
      addLog("Component unmounted")
    }
  }, [collectDebugInfo])

  if (!mounted) {
    return <div>Loading theme debugger...</div>
  }

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bug className="h-5 w-5" /> Theme System Debugger
        </CardTitle>
        <CardDescription>Comprehensive diagnostics and manual controls for the theme system</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {errors.length > 0 && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Theme System Errors</AlertTitle>
            <AlertDescription>
              <ul className="mt-2 text-xs space-y-1">
                {errors.map((error, i) => (
                  <li key={i}>{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium mb-2">Theme State</h3>
            <pre className="text-xs p-3 bg-muted rounded-md overflow-auto max-h-[200px]">
              {JSON.stringify(debugInfo.theme || {}, null, 2)}
            </pre>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">DOM State</h3>
            <pre className="text-xs p-3 bg-muted rounded-md overflow-auto max-h-[200px]">
              {JSON.stringify(debugInfo.dom || {}, null, 2)}
            </pre>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">Computed Styles</h3>
            <pre className="text-xs p-3 bg-muted rounded-md overflow-auto max-h-[200px]">
              {JSON.stringify(debugInfo.styles || {}, null, 2)}
            </pre>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">Storage</h3>
            <pre className="text-xs p-3 bg-muted rounded-md overflow-auto max-h-[200px]">
              {JSON.stringify(debugInfo.storage || {}, null, 2)}
            </pre>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-2">Debug Log</h3>
          <div className="text-xs p-3 bg-muted rounded-md overflow-auto max-h-[150px]">
            {logs.length > 0 ? (
              <ul className="space-y-1">
                {logs.map((log, i) => (
                  <li key={i} className="font-mono">
                    {log}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No logs yet</p>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-wrap gap-2">
        <Button onClick={() => forceThemeChange("light")} variant="outline" size="sm">
          <Sun className="h-4 w-4 mr-1" /> Force Light
        </Button>
        <Button onClick={() => forceThemeChange("dark")} variant="outline" size="sm">
          <Moon className="h-4 w-4 mr-1" /> Force Dark
        </Button>
        <Button onClick={collectDebugInfo} variant="outline" size="sm">
          <RotateCw className="h-4 w-4 mr-1" /> Refresh Debug
        </Button>
        <Button onClick={resetTheme} variant="destructive" size="sm">
          <Trash2 className="h-4 w-4 mr-1" /> Reset Theme
        </Button>
      </CardFooter>
    </Card>
  )
}
