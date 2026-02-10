"use client"

import { useAppMode } from "@/hooks/use-app-mode"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { HelpCircle, Info, Code } from "lucide-react"
import type { ReactNode } from "react"

interface ContextualTooltipProps {
  classicContent: string
  advancedContent: string
  children: ReactNode
  side?: "top" | "right" | "bottom" | "left"
}

export function ContextualTooltip({ classicContent, advancedContent, children, side = "top" }: ContextualTooltipProps) {
  const { mode } = useAppMode()

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent side={side} className="max-w-xs">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {mode === "classic" ? <Info className="h-3 w-3" /> : <Code className="h-3 w-3" />}
              <Badge variant={mode === "advanced" ? "outline" : "secondary"} className="text-xs">
                {mode === "advanced" ? "Advanced" : "Classic"}
              </Badge>
            </div>
            <p className="text-xs leading-relaxed">{mode === "classic" ? classicContent : advancedContent}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export function HelpIcon({
  classicContent,
  advancedContent,
  className = "h-4 w-4 text-muted-foreground",
}: {
  classicContent: string
  advancedContent: string
  className?: string
}) {
  return (
    <ContextualTooltip classicContent={classicContent} advancedContent={advancedContent}>
      <HelpCircle className={className} />
    </ContextualTooltip>
  )
}
