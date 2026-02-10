"use client"

import { ThemeDebugPanel } from "@/components/theme-debug-panel"
import { ThemeToggleV2 } from "@/components/theme-toggle-v2"
import { ThemeToggleButton } from "@/components/theme-toggle-button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export default function ThemeDebugPage() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-3xl font-bold">Theme System Debugging</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Theme Toggle Components</CardTitle>
            <CardDescription>Test different theme toggle implementations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Dropdown Toggle (V2):</span>
              <ThemeToggleV2 />
            </div>

            <div className="flex items-center justify-between">
              <span>Simple Button Toggle:</span>
              <ThemeToggleButton />
            </div>

            <div className="flex items-center justify-between">
              <span>Next-Themes Direct:</span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setTheme("light")} disabled={!mounted}>
                  Light
                </Button>
                <Button variant="outline" size="sm" onClick={() => setTheme("dark")} disabled={!mounted}>
                  Dark
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Theme Test Elements</CardTitle>
            <CardDescription>Visual elements to verify theme changes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Tabs defaultValue="buttons">
              <TabsList>
                <TabsTrigger value="buttons">Buttons</TabsTrigger>
                <TabsTrigger value="cards">Cards</TabsTrigger>
              </TabsList>
              <TabsContent value="buttons" className="space-y-2 pt-2">
                <div className="flex flex-wrap gap-2">
                  <Button variant="default">Default</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="destructive">Destructive</Button>
                </div>
              </TabsContent>
              <TabsContent value="cards" className="pt-2">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Nested Card</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>This card should update with the theme.</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="grid grid-cols-2 gap-2">
              <div className="p-4 bg-background border rounded-md">Background</div>
              <div className="p-4 bg-foreground text-background border rounded-md">Foreground</div>
              <div className="p-4 bg-primary text-primary-foreground rounded-md">Primary</div>
              <div className="p-4 bg-secondary text-secondary-foreground rounded-md">Secondary</div>
              <div className="p-4 bg-muted text-muted-foreground rounded-md">Muted</div>
              <div className="p-4 bg-accent text-accent-foreground rounded-md">Accent</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <ThemeDebugPanel />

      <div className="text-xs text-muted-foreground">
        <p>Current theme: {mounted ? theme : "loading..."}</p>
        <p>HTML classes: {mounted ? document.documentElement.className : "loading..."}</p>
      </div>
    </div>
  )
}
