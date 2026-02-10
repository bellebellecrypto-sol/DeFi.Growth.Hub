export { RewardsDrawer } from "./rewards-drawer"
export { ConfigBuilder } from "./config-builder"
export { RewardsDrawerDemo } from "./demo"
export type {
  RewardsDrawerConfig,
  ClaimSection,
  ClaimItem,
  LeaderboardEntry,
  UserProfile,
} from "./types"

// Default configurations for different themes
export const defaultConfigs = {
  light: {
    theme: {
      mode: "light" as const,
      colors: {
        primary: "#3b82f6",
        secondary: "#64748b",
        background: "#ffffff",
        surface: "#f8fafc",
        text: "#0f172a",
        textSecondary: "#64748b",
        accent: "#8b5cf6",
        success: "#10b981",
        warning: "#f59e0b",
        error: "#ef4444",
        border: "#e2e8f0",
      },
    },
  },
  dark: {
    theme: {
      mode: "dark" as const,
      colors: {
        primary: "#60a5fa",
        secondary: "#94a3b8",
        background: "#0f172a",
        surface: "#1e293b",
        text: "#f1f5f9",
        textSecondary: "#94a3b8",
        accent: "#a78bfa",
        success: "#34d399",
        warning: "#fbbf24",
        error: "#f87171",
        border: "#334155",
      },
    },
  },
}
