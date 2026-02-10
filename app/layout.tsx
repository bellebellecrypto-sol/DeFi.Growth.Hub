import type React from "react"
import "@/app/globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { InterfaceModeProvider } from "@/contexts/interface-mode-context"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { PlatformSidebar } from "@/components/platform-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Orca - Growth Platform",
  description: "Incentive management platform with dual-mode interface",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <InterfaceModeProvider>
            <SidebarProvider>
              <PlatformSidebar />
              <SidebarInset>
                <DashboardHeader />
                <main className="flex flex-1 flex-col gap-4 p-4">{children}</main>
              </SidebarInset>
            </SidebarProvider>
          </InterfaceModeProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
