"use client"

import type React from "react"
import { useInterfaceMode } from "@/contexts/interface-mode-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Info, Code } from "lucide-react"

interface ModeAwareContentProps {
  classicContent: React.ReactNode
  advancedContent: React.ReactNode
  title?: string
  description?: string
}

export function ModeAwareContent({ classicContent, advancedContent, title, description }: ModeAwareContentProps) {
  const { mode } = useInterfaceMode()

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title || "Content Section"}</CardTitle>
            <CardDescription>{description || "This content adapts to your selected mode"}</CardDescription>
          </div>
          <Badge variant={mode === "advanced" ? "outline" : "secondary"}>
            {mode === "advanced" ? "Advanced Mode" : "Classic Mode"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>{mode === "classic" ? classicContent : advancedContent}</CardContent>
    </Card>
  )
}

export function TechnicalFeature({ children }: { children: React.ReactNode }) {
  const { mode } = useInterfaceMode()

  if (mode === "classic") {
    return (
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Advanced Feature</AlertTitle>
        <AlertDescription>This feature is only available in Advanced Mode. Switch modes to access it.</AlertDescription>
      </Alert>
    )
  }

  return <>{children}</>
}

export function SimplifiedView({
  children,
  technicalDetails,
}: { children: React.ReactNode; technicalDetails: React.ReactNode }) {
  const { mode } = useInterfaceMode()

  return (
    <div>
      {children}

      {mode === "advanced" && (
        <div className="mt-4 border-t pt-4">
          <div className="flex items-center gap-2 mb-2 text-sm font-medium">
            <Code className="h-4 w-4" />
            <span>Technical Details</span>
          </div>
          <div className="text-sm">{technicalDetails}</div>
        </div>
      )}
    </div>
  )
}
