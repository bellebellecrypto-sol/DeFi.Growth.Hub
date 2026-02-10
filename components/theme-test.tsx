"use client"

import { useTheme } from "next-themes"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function ThemeTest() {
  const { theme, resolvedTheme } = useTheme()

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Theme Test</CardTitle>
        <CardDescription>Testing light and dark mode functionality</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm">
            <strong>Current Theme:</strong> {theme}
          </p>
          <p className="text-sm">
            <strong>Resolved Theme:</strong> {resolvedTheme}
          </p>
        </div>

        <div className="flex gap-2">
          <Badge variant="default">Primary Badge</Badge>
          <Badge variant="secondary">Secondary Badge</Badge>
          <Badge variant="outline">Outline Badge</Badge>
        </div>

        <div className="space-y-2">
          <Button variant="default" size="sm">
            Default Button
          </Button>
          <Button variant="secondary" size="sm">
            Secondary Button
          </Button>
          <Button variant="outline" size="sm">
            Outline Button
          </Button>
        </div>

        <div className="p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">This is muted background with muted foreground text.</p>
        </div>
      </CardContent>
    </Card>
  )
}
