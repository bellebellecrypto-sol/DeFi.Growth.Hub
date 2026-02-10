"use client"

import { useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"

interface KeyboardNavigationOptions {
  backPath?: string
  onBack?: () => void
  enabled?: boolean
}

export function useKeyboardNavigation({ backPath, onBack, enabled = true }: KeyboardNavigationOptions = {}) {
  const router = useRouter()

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Handle Escape key or Alt+Left Arrow for back navigation
      if (enabled && (event.key === "Escape" || (event.altKey && event.key === "ArrowLeft"))) {
        event.preventDefault()

        if (onBack) {
          onBack()
        } else if (backPath) {
          router.push(backPath)
        } else {
          router.back()
        }
      }
    },
    [enabled, onBack, backPath, router],
  )

  useEffect(() => {
    if (enabled) {
      window.addEventListener("keydown", handleKeyDown)
      return () => {
        window.removeEventListener("keydown", handleKeyDown)
      }
    }
  }, [enabled, handleKeyDown])
}
