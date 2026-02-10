"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"
import { cn } from "@/lib/utils"

interface BreadcrumbNavigationProps {
  className?: string
  homeLabel?: string
  homePath?: string
  customSegments?: { path: string; label: string }[]
}

export function BreadcrumbNavigation({
  className,
  homeLabel = "Home",
  homePath = "/",
  customSegments,
}: BreadcrumbNavigationProps) {
  const pathname = usePathname()

  // Generate breadcrumb segments
  const generateSegments = () => {
    if (customSegments) return customSegments

    const pathSegments = pathname.split("/").filter(Boolean)
    let currentPath = ""

    return pathSegments.map((segment) => {
      currentPath += `/${segment}`
      return {
        path: currentPath,
        label: segment
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" "),
      }
    })
  }

  const segments = generateSegments()

  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center text-sm", className)}>
      <ol className="flex items-center space-x-2">
        <li>
          <Link
            href={homePath}
            className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
            aria-label={homeLabel}
          >
            <Home className="h-4 w-4" />
            <span className="sr-only">{homeLabel}</span>
          </Link>
        </li>

        {segments.map((segment, index) => (
          <li key={segment.path} className="flex items-center">
            <ChevronRight className="h-4 w-4 text-muted-foreground mx-1" aria-hidden="true" />
            {index === segments.length - 1 ? (
              <span className="font-medium text-foreground" aria-current="page">
                {segment.label}
              </span>
            ) : (
              <Link
                href={segment.path}
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label={`Navigate to ${segment.label}`}
              >
                {segment.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
