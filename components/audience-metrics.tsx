"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export function AudienceMetrics() {
  const data = [
    {
      segment: "New Users",
      recipients: 1250,
      engaged: 950,
      converted: 285,
    },
    {
      segment: "Power Users",
      recipients: 450,
      engaged: 420,
      converted: 189,
    },
    {
      segment: "Developers",
      recipients: 650,
      engaged: 580,
      converted: 203,
    },
    {
      segment: "Inactive Users",
      recipients: 850,
      engaged: 340,
      converted: 68,
    },
  ]

  return (
    <ChartContainer
      config={{
        recipients: {
          label: "Recipients",
          color: "hsl(var(--chart-1))",
        },
        engaged: {
          label: "Engaged",
          color: "hsl(var(--chart-2))",
        },
        converted: {
          label: "Converted",
          color: "hsl(var(--chart-3))",
        },
      }}
      className="h-[350px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="segment" />
          <YAxis />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="recipients" fill="var(--color-recipients)" />
          <Bar dataKey="engaged" fill="var(--color-engaged)" />
          <Bar dataKey="converted" fill="var(--color-converted)" />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
