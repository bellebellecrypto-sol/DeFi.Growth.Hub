"use client"

import type React from "react"

import { OriginalIconButton } from "@/components/original-icon-button"
import { BackNavigation } from "@/components/back-navigation"

interface PageHeaderProps {
  title: string
  subtitle?: string
  showBackNavigation?: boolean
  parentPath?: string
  parentLabel?: string
  children?: React.ReactNode
  showIconButton?: boolean
  iconButtonVariant?: "settings" | "notifications" | "user" | "menu" | "search" | "filter" | "brightness"
  onIconButtonClick?: () => void
}

export function PageHeader({
  title,
  subtitle,
  showBackNavigation = false,
  parentPath,
  parentLabel,
  children,
  showIconButton = true,
  iconButtonVariant = "brightness",
  onIconButtonClick,
}: PageHeaderProps) {
  return (
    <div className="space-y-6">
      {showBackNavigation && parentPath && parentLabel && (
        <BackNavigation parentPath={parentPath} parentLabel={parentLabel} currentLabel={title} />
      )}

      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          {subtitle && <p className="text-lg text-muted-foreground">{subtitle}</p>}
        </div>

        <div className="flex items-center gap-2">
          {children}
          {showIconButton && <OriginalIconButton variant={iconButtonVariant} onClick={onIconButtonClick} />}
        </div>
      </div>
    </div>
  )
}
