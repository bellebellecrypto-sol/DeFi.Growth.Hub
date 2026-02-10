"use client"

import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export function AnalyticsOverview() {
  const data = [
    {
      date: "Jan",
      recipients: 1200,
      conversions: 240,
      rewards: 12000,
    },
    {
      date: "Feb",
      recipients: 1800,
      conversions: 380,
      rewards: 18500,
    },
    {
      date: "Mar",
      recipients: 2200,
      conversions: 520,
      rewards: 24000,
    },
    {
      date: "Apr",
      recipients: 2800,
      conversions: 680,
      rewards: 32000,
    },
    {
      date: "May",
      recipients: 3200,
      conversions: 780,
      rewards: 38500,
    },
    {
      date: "Jun",
      recipients: 3240,
      conversions: 795,
      rewards: 40000,
    },
  ]

  return (
    <ChartContainer
      config={{
        recipients: {
          label: "Recipients",
          color: "hsl(var(--chart-1))",
        },
        conversions: {
          label: "Conversions",
          color: "hsl(var(--chart-2))",
        },
        rewards: {
          label: "Rewards ($)",
          color: "hsl(var(--chart-3))",
        },
      }}
      className="h-[350px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="date" />
          <YAxis />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Line
            type="monotone"
            dataKey="recipients"
            stroke="var(--color-recipients)"
            strokeWidth={2}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="conversions"
            stroke="var(--color-conversions)"
            strokeWidth={2}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
