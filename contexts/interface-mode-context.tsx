"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type Mode = "classic" | "advanced"

interface InterfaceModeContextType {
  mode: Mode
  setMode: (mode: Mode) => void
  toggleMode: () => void
}

export const InterfaceModeContext = createContext<InterfaceModeContextType | undefined>(undefined)

interface InterfaceModeProviderProps {
  children: ReactNode
  defaultMode?: Mode
}

export function InterfaceModeProvider({ children, defaultMode = "classic" }: InterfaceModeProviderProps) {
  const [mode, setMode] = useState<Mode>(defaultMode)
  const [mounted, setMounted] = useState(false)

  // Load saved mode from localStorage on component mount
  useEffect(() => {
    setMounted(true)
    if (typeof window !== "undefined") {
      const savedMode = localStorage.getItem("interface-mode") as Mode | null
      if (savedMode && (savedMode === "classic" || savedMode === "advanced")) {
        setMode(savedMode)
      }
    }
  }, [])

  // Save mode to localStorage whenever it changes
  useEffect(() => {
    if (mounted && typeof window !== "undefined") {
      localStorage.setItem("interface-mode", mode)
    }
  }, [mode, mounted])

  const toggleMode = () => {
    setMode((prevMode) => (prevMode === "classic" ? "advanced" : "classic"))
  }

  return <InterfaceModeContext.Provider value={{ mode, setMode, toggleMode }}>{children}</InterfaceModeContext.Provider>
}

export function useInterfaceMode() {
  const context = useContext(InterfaceModeContext)

  if (!context) {
    throw new Error("useInterfaceMode must be used within an InterfaceModeProvider")
  }

  return context
}
