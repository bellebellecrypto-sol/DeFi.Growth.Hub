import { useInterfaceMode } from "@/contexts/interface-mode-context"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export function ModeToggle() {
  const { mode, setMode } = useInterfaceMode()

  return (
    <div className="flex items-center justify-between">
      <Label htmlFor="mode-toggle" className="text-sm font-medium">
        Interface Mode
      </Label>
      <div className="flex items-center space-x-2">
        <span className="text-xs text-muted-foreground">{mode === "classic" ? "Classic" : "Advanced"}</span>
        <Switch
          id="mode-toggle"
          checked={mode === "advanced"}
          onCheckedChange={(checked) => setMode(checked ? "advanced" : "classic")}
        />
      </div>
    </div>
  )
}
