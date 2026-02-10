"use client"

import { useInterfaceMode } from "@/contexts/interface-mode-context"

export function useAppMode() {
  return useInterfaceMode()
}
