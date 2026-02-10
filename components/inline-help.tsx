"use client"

import type React from "react"

import { useState } from "react"
import { useAppMode } from "@/hooks/use-app-mode"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, ChevronRight, BookOpen, Lightbulb, AlertTriangle } from "lucide-react"

interface InlineHelpProps {
  title: string
  classicContent: string
  advancedContent: string
  type?: "info" | "tip" | "warning"
  defaultOpen?: boolean
}

export function InlineHelp({
  title,
  classicContent,
  advancedContent,
  type = "info",
  defaultOpen = false,
}: InlineHelpProps) {
  const { mode } = useAppMode()
  const [isOpen, setIsOpen] = useState(defaultOpen)

  const getIcon = () => {
    switch (type) {
      case "tip":
        return <Lightbulb className="h-4 w-4" />
      case "warning":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <BookOpen className="h-4 w-4" />
    }
  }

  const getVariant = () => {
    switch (type) {
      case "tip":
        return "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950"
      case "warning":
        return "border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950"
      default:
        return "border-muted"
    }
  }

  return (
    <Card className={`${getVariant()}`}>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="pb-3 cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {getIcon()}
                <CardTitle className="text-sm">{title}</CardTitle>
                <Badge variant={mode === "advanced" ? "outline" : "secondary"} className="text-xs">
                  {mode === "advanced" ? "Advanced" : "Classic"}
                </Badge>
              </div>
              {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="pt-0">
            <p className="text-sm leading-relaxed text-muted-foreground">
              {mode === "classic" ? classicContent : advancedContent}
            </p>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}

export function HelpSection({ children }: { children: React.ReactNode }) {
  return <div className="space-y-3 border-l-2 border-muted pl-4">{children}</div>
}
