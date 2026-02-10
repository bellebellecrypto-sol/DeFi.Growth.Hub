"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function ThemeDebug() {
  const { theme, resolvedTheme, systemTheme, themes } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Theme Debug (Loading...)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div>Loading theme information...</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Theme Debug Info</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <div>
            <strong>Current Theme:</strong> {theme || "undefined"}
          </div>
          <div>
            <strong>Resolved Theme:</strong> {resolvedTheme || "undefined"}
          </div>
          <div>
            <strong>System Theme:</strong> {systemTheme || "undefined"}
          </div>
          <div>
            <strong>Available Themes:</strong> {themes?.join(", ") || "undefined"}
          </div>
          <div>
            <strong>Document Class:</strong>{" "}
            {typeof document !== "undefined" ? document.documentElement.className : "SSR"}
          </div>
          <div>
            <strong>Mounted:</strong> {mounted ? "Yes" : "No"}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
