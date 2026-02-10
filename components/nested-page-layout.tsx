import type { ReactNode } from "react"
import { BackNavigation } from "@/components/back-navigation"

interface NestedPageLayoutProps {
  children: ReactNode
  parentPath?: string
  parentLabel?: string
  currentLabel?: string
  showBreadcrumbs?: boolean
}

export function NestedPageLayout({
  children,
  parentPath,
  parentLabel,
  currentLabel,
  showBreadcrumbs = true,
}: NestedPageLayoutProps) {
  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <BackNavigation
        parentPath={parentPath}
        parentLabel={parentLabel}
        currentLabel={currentLabel}
        showBreadcrumbs={showBreadcrumbs}
      />
      {children}
    </div>
  )
}
