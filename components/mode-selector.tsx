"use client"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Settings } from "lucide-react"
import { useInterfaceMode } from "@/contexts/interface-mode-context"

export function ModeSelector() {
  const { mode, setMode } = useInterfaceMode()

  return (
    <div className="flex items-center space-x-2">
      <div className="flex items-center space-x-2 border rounded-md p-1.5">
        <Button
          variant={mode === "classic" ? "default" : "ghost"}
          size="sm"
          className="gap-1.5"
          onClick={() => setMode("classic")}
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>Classic</span>
        </Button>
        <Button
          variant={mode === "advanced" ? "default" : "ghost"}
          size="sm"
          className="gap-1.5"
          onClick={() => setMode("advanced")}
        >
          <Settings className="h-3.5 w-3.5" />
          <span>Advanced</span>
        </Button>
      </div>
    </div>
  )
}

export function ModeIndicator() {
  const { mode } = useInterfaceMode()

  return (
    <Badge variant={mode === "advanced" ? "outline" : "secondary"} className="ml-2">
      {mode === "advanced" ? "Advanced Mode" : "Classic Mode"}
    </Badge>
  )
}

export function ModeToggle() {
  const { mode, setMode } = useInterfaceMode()

  return (
    <div className="flex items-center space-x-2">
      <Switch
        id="mode-toggle"
        checked={mode === "advanced"}
        onCheckedChange={(checked) => setMode(checked ? "advanced" : "classic")}
      />
      <Label htmlFor="mode-toggle">{mode === "advanced" ? "Advanced Mode" : "Classic Mode"}</Label>
    </div>
  )
}
