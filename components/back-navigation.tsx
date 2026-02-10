"use client"

import { useRouter, usePathname } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useKeyboardNavigation } from "@/hooks/use-keyboard-navigation"

interface BackNavigationProps {
  parentPath?: string
  parentLabel?: string
  currentLabel?: string
  className?: string
  showBreadcrumbs?: boolean
}

export function BackNavigation({
  parentPath,
  parentLabel,
  currentLabel,
  className,
  showBreadcrumbs = true,
}: BackNavigationProps) {
  const router = useRouter()
  const pathname = usePathname()

  // Determine parent path if not explicitly provided
  const derivedParentPath = parentPath || pathname.split("/").slice(0, -1).join("/") || "/"

  // Determine labels if not explicitly provided
  const derivedParentLabel = parentLabel || getDefaultLabel(derivedParentPath)
  const derivedCurrentLabel = currentLabel || getDefaultLabel(pathname)

  const handleBack = () => {
    router.push(derivedParentPath)
  }

  // Enable keyboard navigation
  useKeyboardNavigation({
    backPath: derivedParentPath,
  })

  return (
    <div className={cn("flex items-center space-x-1 mb-6", className)}>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleBack}
        className="gap-1 h-8 px-2"
        aria-label={`Back to ${derivedParentLabel}`}
      >
        <ChevronLeft className="h-4 w-4" />
        <span>Back</span>
      </Button>

      {showBreadcrumbs && (
        <div className="flex items-center text-sm text-muted-foreground">
          <span className="mx-2">/</span>
          <Link
            href={derivedParentPath}
            className="hover:text-foreground transition-colors"
            aria-label={`Navigate to ${derivedParentLabel}`}
          >
            {derivedParentLabel}
          </Link>
          <span className="mx-2">/</span>
          <span className="font-medium text-foreground">{derivedCurrentLabel}</span>
        </div>
      )}
    </div>
  )
}

// Helper function to generate default labels based on path
function getDefaultLabel(path: string): string {
  const segment = path.split("/").pop() || ""

  // Handle special cases
  if (segment === "") return "Home"

  // Convert kebab-case to Title Case
  return segment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}
